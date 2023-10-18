// const fs = require('fs');
const hre = require('hardhat');

async function main() {
    // let Data = JSON.parse(fs.readFileSync(`./data.json`));
    // const data = Data[0];
    //deploy token
    const Token = await hre.ethers.getContractFactory('TokenSwap');
    const token = await Token.deploy();
    await token.deployed();
    console.log('deployed to:', token.address);
    //verify Token
    await new Promise(r => setTimeout(r, 3000));
    await hre.run('verify:verify', {
        address: token.address,
        constructorArguments: []
    });
    // fs.writeFileSync(`./data.json`, JSON.stringify(newData, null, 2));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
