import hre from "hardhat";

async function main() {

    console.log("Starting deployment...");

    const { ethers } = await hre.network.connect();

    const [deployer] = await ethers.getSigners();

    console.log("Deployer address:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);

    console.log(
        "Deployer balance:",
        ethers.formatEther(balance),
        "ETH"
    );

    console.log("Deploying OwnerOnly contract...");

    const OwnerOnly = await ethers.getContractFactory("OwnerOnly");

    const contract = await OwnerOnly.deploy();

    console.log("Waiting for deployment...");

    await contract.waitForDeployment();

    const contractAddress = await contract.getAddress();

    console.log("-----------------------------------");
    console.log("Contract deployed successfully!");
    console.log("Contract Address:", contractAddress);
    console.log("Owner Address:", await contract.owner());
    console.log("Network: Sepolia");
    console.log("Chain ID: 11155111");
    console.log("-----------------------------------");
}

main().catch((error) => {
    console.error("Deployment failed!");
    console.error(error);
    process.exitCode = 1;
});