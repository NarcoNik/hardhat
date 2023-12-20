import 'hardhat-deploy';
import 'hardhat-abi-exporter';
import 'hardhat-gas-reporter';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'solidity-coverage';
import './tasks';

import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config({ path: __dirname + '/.env' });

/**
 * @type import('hardhat/config').HardhatUserConfig
 * */
const { REPORT_GAS, TOKEN, GAS_PRICE_API, INFURA_API_KEY, FORKING_BLOCKNUMBER, ETHERSCAN_API_KEY, COINMARKETCAP_API_KEY, MNEMONIC } = process.env;

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.8.22',
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    metadata: {
      bytecodeHash: 'none'
    },
    evmVersion: 'shanghai'
  }
};
const config: HardhatUserConfig = {
  defaultNetwork: 'localhost',
  solidity: DEFAULT_COMPILER_SETTINGS,
  paths: {
    tests: './tests',
    artifacts: './build/artifacts',
    cache: './build/cache',
    deployments: './build/deployments'
  },
  typechain: {
    outDir: './build/typechain',
    target: 'ethers-v5'
  },
  gasReporter: {
    enabled: REPORT_GAS === ('true' || true) ? true : false,
    noColors: true,
    outputFile: 'reports/gas_usage/summary.txt',
    currency: 'USD',
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: TOKEN,
    gasPriceApi: GAS_PRICE_API,
    maxMethodDiff: 10
  },
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        blockNumber: Number(FORKING_BLOCKNUMBER)
      },
      allowUnlimitedContractSize: true,
      loggingEnabled: false,
      accounts: {
        mnemonic: MNEMONIC
      }
    },
    localhost: {
      chainId: 1,
      url: 'http://0.0.0.0:8545',
      // TODO example how paste mnemonic for privateKey
      // accounts: [`${MNEMONIC}`],
      accounts: {
        mnemonic: MNEMONIC
      }
    },
    ethereum: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      chainId: 1,
      accounts: {
        mnemonic: MNEMONIC
      }
    }
  },
  namedAccounts: {
    deployer: 0,
    admin: 1
  },
  etherscan: {
    apiKey: {
      ethereum: ETHERSCAN_API_KEY || 'API_KEY_WEB',
      localhost: ETHERSCAN_API_KEY || 'API_KEY_WEB',
      hardhat: ETHERSCAN_API_KEY || 'API_KEY_WEB',
      goerli: ETHERSCAN_API_KEY || 'API_KEY_WEB'
    }
  },
  abiExporter: {
    path: './build/abis',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true
  },
  mocha: {
    timeout: 100000
  }
};

export default config;
