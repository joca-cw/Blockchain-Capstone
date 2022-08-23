// migrating the appropriate contracts
var verifier = artifacts.require("./verifier.sol");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = async(deployer) => {
  await deployer.deploy(verifier);
  await deployer.deploy(SolnSquareVerifier, verifier.address, "RealEstateToken", "RET721");
};