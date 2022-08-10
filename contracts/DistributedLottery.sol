// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract DistributedLottery {
    address payable[] public players;
    address public manager;

    constructor() {
        manager = msg.sender;
    }

    receive() external payable {
        // Each player must send 0.1 ether to the contract.
        require(msg.value == 0.1 ether, "A player must send exactly 0.1 ether");

        // Converts the senders plain address to a payable one
        // then proceeds to add the address the the players 
        // dynamic array.
        players.push(payable(msg.sender));
    }

    function getBalance() public view returns (uint) {
        // Only the contract owner can see the balance of the
        // contract
        require(msg.sender == manager, "You do not have the permission to perform this operation");

        return address(this).balance;
    }

    function random() public view returns(uint) {
        // An attempt to generate a random number corresponding to an index of the players array
        // TODO: Use an off chain solution as this one has inherent security flaws like a block miner
        // rejecting a winning block that won't favour them...
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
    }

    function pickWinner() public {
        // Only contract owner can pick winner
        require(msg.sender == manager, "You do not have the permission to perform this operation");

        // contract must have at least 3 players before a winner can be picked
        require(players.length >= 3);

        uint r = random();
        address payable winner;

        // Pick Winner
        uint index = r % players.length;
        winner = players[index];

        // Transfer funds to winner
        winner.transfer(getBalance());


    }
}
