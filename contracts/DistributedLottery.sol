// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./tRIF.sol";


contract DistributedLottery is Ownable {
    mapping (address => bool) participants;
    address[] participantsList;
    tRIF tRifAddress;
    bool lotteryStarted = false;
    uint256 feeToParticipate = 4 ether;

    constructor(tRIF _tRifAddress) {
        tRifAddress = _tRifAddress;
    }

    
    function enter() external {
        require(lotteryStarted, "Not started yet");
        require(!participants[msg.sender], "the participant must enter just once");
        require(tRifAddress.balanceOf(msg.sender) >= feeToParticipate, "Not enough balance");
        // require(tRifAddress.allowance(msg.sender) >= feeToParticipate, "Not enough balance"); // check for allowance
        
        tRifAddress.transferFrom(msg.sender, address(this), feeToParticipate);
        participants[msg.sender] = true;
        participantsList.push(msg.sender);
        

    }

    function startLoterry() onlyOwner external {
        lotteryStarted = true;

    }


    function endLottery() onlyOwner external {
        //random choose randao??
        uint256 winnerIndex = random() % participantsList.length;
        address winner = participantsList[winnerIndex];
        uint256 contractBalance = tRifAddress.balanceOf(address(this));

        tRifAddress.transfer(winner, contractBalance);
        lotteryStarted = false;
        // Reset the list of participants
    }

    function random() private view returns (uint256) {
        // Note: This is not a secure way to generate randomness
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, participantsList)));
    }
}
