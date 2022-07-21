const { Mnemonic, InfuraApiKey } = require('./config/config')

const HDWalletProvider = require('@truffle/hdwallet-provider');

const Web3 = require('web3');

const { interface, bytecode } = require('./compile')

const mnemonic = Mnemonic

const networkEndpoint = `https://rinkeby.infura.io/v3/${InfuraApiKey}`;

const provider = new HDWalletProvider(mnemonic, networkEndpoint)

const web3 = new Web3(provider)

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()

    console.log(`Account used to deploy is ${accounts[0]}`)

    const Contract = web3.eth.Contract

    const contract = await new Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hey there'] })
        .send({ from: accounts[0], gas: '1000000' })

    console.log(`Contract is deployed at ${contract.options.address}`)

    provider.engine.stop();
}

deploy()
