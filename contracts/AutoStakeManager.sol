// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AutoStakeManager {
    struct StakeInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakeTime;
    }

    mapping(address => StakeInfo) public stakes;

    uint256 public totalStaked;
    uint256 public rewardRatePerSecond;
    address public owner;

    constructor() {
        owner = msg.sender;
        rewardRatePerSecond = (10 * 1e16) / (365 days); // 10% APY
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function stake() external payable {
        require(msg.value > 0, "Stake amount must be > 0");
        _updateReward(msg.sender);
        stakes[msg.sender].amount += msg.value;
        stakes[msg.sender].lastStakeTime = block.timestamp;
        totalStaked += msg.value;
    }

    function unstake() external {
        require(stakes[msg.sender].amount > 0, "Nothing to unstake");
        _updateReward(msg.sender);
        uint256 amount = stakes[msg.sender].amount;
        stakes[msg.sender].amount = 0;
        totalStaked -= amount;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Unstake failed");
    }

    function claimReward() external {
        _updateReward(msg.sender);
        uint256 reward = stakes[msg.sender].rewardDebt;
        require(reward > 0, "No reward to claim");
        stakes[msg.sender].rewardDebt = 0;
        (bool sent, ) = msg.sender.call{value: reward}("");
        require(sent, "Reward claim failed");
    }

    function _updateReward(address _user) internal {
        StakeInfo storage user = stakes[_user];
        if (user.amount > 0) {
            uint256 timeStaked = block.timestamp - user.lastStakeTime;
            uint256 pendingReward = (user.amount * rewardRatePerSecond * timeStaked) / 1e18;
            user.rewardDebt += pendingReward;
            user.lastStakeTime = block.timestamp;
        }
    }

    function setRewardRate(uint256 _apyPercent) external onlyOwner {
        rewardRatePerSecond = (_apyPercent * 1e16) / (365 days);
    }

    function emergencyWithdraw() external onlyOwner {
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Withdraw failed");
    }

    receive() external payable {}
}
