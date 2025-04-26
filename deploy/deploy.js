async function main() {
    const AutoStakeManager = await ethers.getContractFactory("AutoStakeManager");
    const autoStakeManager = await AutoStakeManager.deploy();
    await autoStakeManager.deployed();
    console.log("AutoStakeManager deployed to:", autoStakeManager.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
