var ERC721MintableComplete = artifacts.require('RealEstateERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const symbol = "TestERC721";
    const name = "TestToken";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name, symbol, {from: account_one});

            // TODO: mint multiple tokens
            for (let i = 0; i < 5; i++) {
                await this.contract.mint(account_two, i, {from: account_one});
            }
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply({from: account_one});
            assert.equal(totalSupply, 5, "Total supply is not correct");
        })

        it('should get token balance', async function () { 
            const balance = await this.contract.balanceOf(account_two);
            assert.equal(balance, 5, "Balance is not correct");            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenURI = await this.contract.tokenURI(1);
            assert.equal(tokenURI, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "Token URI is not correct");                        
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(account_two, account_three, 1, {from: account_two});
            const newOwner = await this.contract.ownerOf(1);
            assert.equal(newOwner, account_three, "New owner is not correct");                        
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(name, symbol, {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let result = true;
            try {
                await this.contract.mint(account_three, 5, {from: account_two});
            }
            catch (error) {
                result = false;
            }
            assert.equal(result, false, "Minting should fail when address is not contract owner");
        })

        it('should return contract owner', async function () { 
            const owner = await this.contract.getOwner();
            assert.equal(owner, account_one, "Contract owner is not correct");
        })

    });
})