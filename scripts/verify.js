const fs = require('fs');
const hre = require('hardhat');

async function main() {
  let Data = require(`./data.json`);
  let data = Data[0];
  //verify Token
  await new Promise(r => setTimeout(r, 3000));
  await hre.run('verify:verify', {
    address: data.token,
    constructorArguments: []
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
