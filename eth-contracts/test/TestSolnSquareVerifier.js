var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Verifier = artifacts.require("Verifier");
var json = require("../../zokrates/code/square/proof.json");

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    
    describe('Test SolnSquareVerifier', function () {
        beforeEach(async function () {
            const verifier = await Verifier.new({from: account_one});
            this.contract = await SolnSquareVerifier.new(verifier.address, "TestName", "TST",{from: account_one});

        })
		
		// Solution is added when minting
		// Test if a new solution can be added for contract - SolnSquareVerifier
    	// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
		it('Mint ERC721 token', async function () {
			const index = 0;
			try {
				await this.contract.mintNFT(account_two, json.proof.a, json.proof.b, json.proof.c, json.inputs, {from:account_one});
			} catch(error) {
				console.log(error);
			}

			const balance = await this.contract.balanceOf(account_two);
			assert.equal(parseInt(balance), 1, "Incorrect token balance");
		});
  });
    
})
