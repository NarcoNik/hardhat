import 'hardhat-deploy';
import 'hardhat-abi-exporter';
import 'hardhat-gas-reporter';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'solidity-coverage';

import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config({ path: __dirname + '/.env' });
/** @type import('hardhat/config').HardhatUserConfig */
const {
  REPORT_GAS,
  INFURA_API_KEY,
  POLYGONSCAN_API_KEY,
  MNEMONIC,
  TOKEN,
  GAS_PRICE_API,
  NODE_HOST,
  BLOCKNUMBER,
  BSCSCAN_API_KEY,
  PORT,
  ETHERSCAN_API_KEY,
  NETWORK_ID,
  COINMARKETCAP_API_KEY
} = process.env;
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
  defaultNetwork: 'hardhat',
  solidity: { compilers: [DEFAULT_COMPILER_SETTINGS] },
  paths: {
    tests: './test',
    artifacts: './build/artifacts',
    cache: './build/cache',
    deployments: './build/deployments'
  },
  typechain: {
    outDir: './build/typechain',
    target: 'ethers-v5'
  },
  networks: {
    hardhat: {
      // chainId: 137,
      // forking: {
      //   url: 'https://polygon-rpc.com',
      //   blockNumber: 34298636
      // },
      chainId: Number(NETWORK_ID),
      forking: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        blockNumber: Number(BLOCKNUMBER)
      },
      allowUnlimitedContractSize: true,
      loggingEnabled: false,
      accounts: {
        mnemonic: MNEMONIC
      }
    },
    localhost: {
      chainId: Number(NETWORK_ID),
      url: `http://${NODE_HOST}:${PORT}`,
      // accounts: [`${PRIVATE_KEY1}`, `${PRIVATE_KEY2}`, `${PRIVATE_KEY3}`],
      accounts: {
        mnemonic: MNEMONIC
      }
    }
    // eth: {
    //     url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
    //     chainId: 1,
    //     accounts: [`${MNEMONIC}`]
    // },
    // 'base-mainnet': {
    //   url: 'https://mainnet.base.org',
    //   accounts: [`${MNEMONIC}`],
    //   gasPrice: 1000000000
    // },
    // // for testnet
    // 'base-goerli': {
    //   url: 'https://goerli.base.org',
    //   accounts: [`${MNEMONIC}`],
    //   gasPrice: 1000000000
    // },
    // // for local dev environment
    // 'base-local': {
    //   url: 'http://localhost:8545',
    //   accounts: [`${MNEMONIC}`],
    //   gasPrice: 1000000000
    // },
    // shibarium: {
    //   url: 'https://www.shibrpc.com',
    //   chainId: 109,
    //   live: true,
    //   saveDeployments: true,
    //   accounts: [`${MNEMONIC}`]
    // },
    // goerli: {
    //     url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_ID}`,
    //     url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
    //     chainId: 5,
    //     live: false,
    //     saveDeployments: true,
    //     accounts: [`${MNEMONIC}`]
    // },
    // bscTest: {
    //   url: 'https://data-seed-prebsc-2-s2.binance.org:8545',
    //   chainId: 97,
    //   accounts: [`${MNEMONIC}`]
    // },
    // bsc: {
    //   url: 'https://api.ankr.com/bsc',
    //   // url: `https://bsc-dataseed.binance.org/`,
    //   chainId: 56,
    //   live: true,
    //   saveDeployments: true,
    //   accounts: [`${MNEMONIC}`]
    // }
    // polygonMumbai: {
    //     url: `https://rpc-mumbai.maticvigil.com`,
    //     chainId: 80001,
    //     live: false,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // polygon: {
    //     url: `https://polygon-rpc.com`,
    //     chainId: 137,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // avalanche: {
    //     url: `https://api.avax.network/ext/bc/C/rpc`,
    //     chainId: 43114,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // fantom: {
    //     // url: `https://rpc.testnet.fantom.network/`,https://rpc.ftm.tools/
    //     url: `https://rpc.ftm.tools/`,
    //     chainId: 250,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`${MNEMONIC}`]
    // },
    // moonriver: {
    //     url: `https://rpc.api.moonriver.moonbeam.network`,
    //     chainId: 1285,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // arbitrum: {
    //     url: `https://arb1.arbitrum.io/rpc`,
    //     chainId: 42161,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // aurora: {
    //     url: `https://mainnet.aurora.dev`,
    //     chainId: 1313161554,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // optimism: {
    //     url: `https://mainnet.optimism.io`,
    //     chainId: 10,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // moonbeam: {
    //     url: `https://rpc.api.moonbeam.network`,
    //     chainId: 1284,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // gnosis: {
    //     url: `https://rpc.gnosischain.com/`,
    //     chainId: 100,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // cronos: {
    //     url: `https://evm-cronos.crypto.org`,
    //     chainId: 25,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // fuse: {
    //     url: `https://rpc.fuse.io`,
    //     chainId: 122,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // okx: {
    //     url: `https://exchainrpc.okex.org`,
    //     chainId: 66,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // celo: {
    //     url: `https://celo.quickestnode.com`,
    //     chainId: 42220,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // boba: {
    //     url: `https://mainnet.boba.network`,
    //     chainId: 288,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // telos: {
    //     url: `https://mainnet.telos.net/evm`,
    //     chainId: 40,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // kava: {
    //     url: 'https://evm.kava.io',
    //     chainId: 2222,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // bitgert: {
    //     url: 'https://rpc.icecreamswap.com',
    //     chainId: 32520,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // metis: {
    //     url: 'https://andromeda.metis.io/?owner=1088',
    //     chainId: 1088,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // },
    // oasis: {
    //     url: 'https://emerald.oasis.dev',
    //     chainId: 42262,
    //     live: true,
    //     saveDeployments: true,
    //     accounts: [`0x${DEFAULT_PRIVATE_KEY}`]
    // }
  },
  etherscan: {
    apiKey: {
      hardhat: ETHERSCAN_API_KEY || 'API_KEY_WEB',
      localhost: ETHERSCAN_API_KEY || 'API_KEY_WEB',
      mainnet: ETHERSCAN_API_KEY || 'API_KEY_WEB',
      goerli: ETHERSCAN_API_KEY || 'API_KEY_WEB',
      //base
      // 'base-mainnet': BASESCAN_API_KEY || 'API_KEY_WEB',
      // 'base-goerli': BASESCAN_API_KEY || 'API_KEY_WEB',
      // shibarium
      // shibarium: '',
      // binance smart chain
      bsc: BSCSCAN_API_KEY || 'API_KEY_WEB',
      bscTestnet: BSCSCAN_API_KEY || 'API_KEY_WEB',
      // // fantom mainnet
      // opera: FANTOMSCAN_API_KEY|| 'API_KEY_WEB',
      // ftmTestnet: FANTOMSCAN_API_KEY|| 'API_KEY_WEB',
      // // polygon
      polygon: POLYGONSCAN_API_KEY || 'API_KEY_WEB'
      // polygonMumbai: POLYGONSCAN_API_KEY|| 'API_KEY_WEB',
      // // avalanche
      // avalanche: AVALANCHE_API_KEY|| 'API_KEY_WEB',
      // avalancheFujiTestnet: AVALANCHE_API_KEY|| 'API_KEY_WEB',
      // // celo
      // celo: CELO_API_KEY|| 'API_KEY_WEB',
      // // boba
      // boba: BOBA_API_KEY|| 'API_KEY_WEB',
      // // cronos
      // cronos: CRONOS_API_KEY|| 'API_KEY_WEB',
      // // aurora
      // aurora: AURORA_API_KEY|| 'API_KEY_WEB',
      // // arbitrum
      // arbitrum: ARBITRUM_API_KEY|| 'API_KEY_WEB',
      // // optimism
      // optimism: OPTIMISM_API_KEY|| 'API_KEY_WEB',
      // // moonbeam
      // moonbeam: MOONBEAM_API_KEY|| 'API_KEY_WEB',
      // // moonriver
      // moonriver: MOONRIVER_API_KEY|| 'API_KEY_WEB'
    },
    customChains: [
      {
        // for mainnet
        network: 'base-mainnet',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org'
        }
        // urls: {
        //     apiURL: 'https://base-mainnet.blockscout.com/api',
        //     browserURL: 'https://base-mainnet.blockscout.com'
        // }
      },
      {
        // for mainnet
        network: 'shibarium',
        chainId: 109,
        urls: {
          apiURL: 'https://api.shibariumscan.io/api',
          browserURL: 'https://shibariumscan.io/'
        }
      },
      {
        // for testnet
        network: 'base-goerli',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org'
        }
        // urls: {
        //     apiURL: 'https://base-goerli.blockscout.com/api',
        //     browserURL: 'https://base-goerli.blockscout.com'
        // }
      }
      //     {
      //         network: 'celo',
      //         chainId: 42220,
      //         urls: {
      //             apiURL: 'https://api.celoscan.io/api',
      //             browserURL: 'https://celoscan.io'
      //         }
      //     },
      //     {
      //         network: 'arbitrum',
      //         chainId: 42161,
      //         urls: {
      //             apiURL: 'https://api.arbiscan.io/api',
      //             browserURL: 'https://arbiscan.io/'
      //         }
      //     },
      //     {
      //         network: 'optimism',
      //         chainId: 10,
      //         urls: {
      //             apiURL: 'https://api-optimistic.etherscan.io',
      //             browserURL: 'https://optimistic.etherscan.io/'
      //         }
      //     },
      //     {
      //         network: 'aurora',
      //         chainId: 1313161554,
      //         urls: {
      //             apiURL: 'https://api.aurorascan.dev/api',
      //             browserURL: 'https://aurorascan.dev/'
      //         }
      //     },
      //     {
      //         network: 'kava',
      //         chainId: 2222,
      //         urls: {
      //             apiURL: 'https://explorer.kava.io/api',
      //             browserURL: 'https://explorer.kava.io'
      //         }
      //     },
      //     {
      //         network: 'moonbeam',
      //         chainId: 1313161554,
      //         urls: {
      //             apiURL: 'https://api.aurorascan.dev/api',
      //             browserURL: 'https://moonbeam.moonscan.io/'
      //         }
      //     },
      //     {
      //         network: 'boba',
      //         chainId: 288,
      //         urls: {
      //             apiURL: 'https://api.bobascan.com/api',
      //             browserURL: 'https://bobascan.com/'
      //         }
      //     }
    ]
  },
  namedAccounts: {
    deployer: 0,
    admin: 1
  },
  //   contractSizer: {
  //     alphaSort: false,
  //     disambiguatePaths: true,
  //     runOnCompile: false
  //   },
  abiExporter: {
    path: './build/abis',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true
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
  mocha: {
    timeout: 100000
  }
};
export default config;
