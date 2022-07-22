const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const compile = require('../compile')

const { abi, evm } = compile

describe('Inbox contract', () => {

    const web3 = new Web3(ganache.provider())

    let accounts;

    let inbox;

    let contractInitializeList = ['Hi there!']

    let contractGas = '1000000'

    beforeEach(async () => {
        accounts = await web3.eth.getAccounts()

        const Contract = web3.eth.Contract

        inbox = await new Contract(abi)
            .deploy({ data: evm.bytecode.object, arguments: contractInitializeList })
            .send({
                from: accounts[0],
                gas: contractGas
            })
    })

    it('Expect to deploy a contract', () => {
        assert.ok(inbox.options.address)
    })

    it('Expect to match contract initialization message', async () => {
        const message = await inbox.methods.message().call();

        assert.strictEqual(message, 'Hi there!')
    })

    it('Expect to set new message for inbox contract', async () => {
        await inbox.methods.setMessage('New york').send({
            from: accounts[0]
        })

        const newMessage = await inbox.methods.message().call();

        assert.strictEqual(newMessage, 'New york')
    })

})
