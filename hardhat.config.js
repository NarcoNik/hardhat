require('@typechain/hardhat');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-contract-sizer');
require('hardhat-gas-reporter');
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config({ path: __dirname + '/.env' });

/** @type import('hardhat/config').HardhatUserConfig */
const { REPORT_GAS, INFURA_ID, ALCHEMY_ID, BASESCAN_API_KEY, BSCSCAN_API_KEY, MNEMONIC, ETHERSCAN_API_KEY } = process.env;
const DEFAULT_COMPILER_SETTINGS = {
    version: '0.8.16',
    settings: {
        optimizer: {
            enabled: true,
            runs: 10000
        },
        metadata: {
            bytecodeHash: 'none'
        },
        evmVersion: 'istanbul'
    }
};
module.exports = {
    defaultNetwork: 'shibarium',
    contracts_directory: './contracts',
    networks: {
        'base-mainnet': {
            url: 'https://mainnet.base.org',
            accounts: [`${MNEMONIC}`],
            gasPrice: 1000000000
        },
        // for testnet
        'base-goerli': {
            url: 'https://goerli.base.org',
            accounts: [`${MNEMONIC}`],
            gasPrice: 1000000000
        },
        // for local dev environment
        'base-local': {
            url: 'http://localhost:8545',
            accounts: [`${MNEMONIC}`],
            gasPrice: 1000000000
        },
        shibarium: {
            url: 'https://www.shibrpc.com',
            chainId: 109,
            live: true,
            saveDeployments: true,
            accounts: [`${MNEMONIC}`]
        },
        // hardhat: {
        //     chainId: 137,
        //     forking: {
        //         url: `https://polygon-rpc.com`,
        //         blockNumber: 34298636
        //     },
        //     allowUnlimitedContractSize: true,
        //     loggingEnabled: false,
        //     accounts: {
        //         count: 100
        //     }
        // },
        // eth: {
        //     url: `https://mainnet.infura.io/v3/${INFURA_ID}`,
        //     chainId: 1,
        //     accounts: [`${MNEMONIC}`]
        // },
        // goerli: {
        //     url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_ID}`,
        //     url: `https://goerli.infura.io/v3/${INFURA_ID}`,
        //     chainId: 5,
        //     live: false,
        //     saveDeployments: true,
        //     accounts: [`${MNEMONIC}`]
        // },
        bscTest: {
            url: `https://data-seed-prebsc-2-s2.binance.org:8545`,
            chainId: 97,
            accounts: [`${MNEMONIC}`]
        },
        bsc: {
            url: `https://api.ankr.com/bsc`,
            // url: `https://bsc-dataseed.binance.org/`,
            chainId: 56,
            live: true,
            saveDeployments: true,
            accounts: [`${MNEMONIC}`]
        }
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
            mainnet: ETHERSCAN_API_KEY,
            goerli: ETHERSCAN_API_KEY,
            //base
            'base-mainnet': BASESCAN_API_KEY,
            'base-goerli': BASESCAN_API_KEY,
            // shibarium
            // shibarium: '',
            // binance smart chain
            bsc: BSCSCAN_API_KEY,
            bscTestnet: BSCSCAN_API_KEY
            // fantom mainnet
            // opera: FANTOMSCAN_API_KEY,
            // ftmTestnet: FANTOMSCAN_API_KEY,
            // // polygon
            // polygon: POLYGONSCAN_API_KEY,
            // polygonMumbai: POLYGONSCAN_API_KEY,
            // // avalanche
            // avalanche: AVALANCHE_API_KEY,
            // avalancheFujiTestnet: AVALANCHE_API_KEY,
            // // celo
            // celo: CELO_API_KEY,
            // // boba
            // boba: BOBA_API_KEY,
            // // cronos
            // cronos: CRONOS_API_KEY,
            // // aurora
            // aurora: AURORA_API_KEY,
            // // arbitrum
            // arbitrum: ARBITRUM_API_KEY,
            // // optimism
            // optimism: OPTIMISM_API_KEY,
            // // moonbeam
            // moonbeam: MOONBEAM_API_KEY,
            // // moonriver
            // moonriver: MOONRIVER_API_KEY
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
    solidity: DEFAULT_COMPILER_SETTINGS,
    contractSizer: {
        alphaSort: false,
        disambiguatePaths: true,
        runOnCompile: false
    },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5'
    },
    gasReporter: {
        enabled: REPORT_GAS === 'true' ? true : false,
        noColors: true,
        outputFile: 'reports/gas_usage/summary.txt'
    }
};
