// // pragma solidity >=0.4.21 <0.6.0;
pragma solidity >=0.5.0;

import "./ERC721Mintable.sol";


// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./verifier.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateERC721Token {

    Verifier private verifier;

    constructor(address verifierAddress, string memory name, string memory symbol)
		RealEstateERC721Token(name, symbol) public {
        verifier = Verifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address addr;
        bool exist;
    }

    // TODO define an array of the above struct
    Solution[] public solutions;
    uint256 private numSolutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) public uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 indexed solutionIndex, address indexed solutionAddr);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(bytes32 solutionKey) public {
        Solution memory solution = Solution(numSolutions, msg.sender, true);

        uniqueSolutions[solutionKey] = solution;
        solutions.push(solution);
        numSolutions += 1;

        emit SolutionAdded(uniqueSolutions[solutionKey].index, uniqueSolutions[solutionKey].addr);
    }


	// TODO Create a function to mint new NFT only after the solution has been verified
	//  - make sure the solution is unique (has not been used before)
	//  - make sure you handle metadata as well as tokenSuplly
    function mintNFT(
        address to,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) public {
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        // Check if solution is unique
        require(!uniqueSolutions[solutionKey].exist, "Solution already exists");
        // Check if proof is valid
        require(verifier.verifyTx(a, b, c, input), "Verification failed");
        // Add solution
        addSolution(solutionKey);
        // Mint Token
        super.mint(to, uniqueSolutions[solutionKey].index);
    }
}

