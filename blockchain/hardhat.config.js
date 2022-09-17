require('@nomiclabs/hardhat-ethers');
// require('@nomiclabs/hardhat-etherscan');
// require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');
// require('hardhat-dependency-compiler');
// require('hardhat-deploy');
require('hardhat-gas-reporter');
require('hardhat-contract-sizer');
require("@nomicfoundation/hardhat-chai-matchers")


module.exports = {
    solidity: {
        compilers: [
            {
                version: '0.8.15',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1000,
                    },
                },
            },
        ]
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
        },
        ganache: {
            url: "http://127.0.0.1:8545",
            gasLimit: 600000000,
            defaultBalanceEther: 10
        },
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: false,
        disambiguatePaths: false,
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
    },
    mocha: {
        timeout: 90000,
    },
};
