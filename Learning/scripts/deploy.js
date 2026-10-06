import hre from "hardhat";
import fs from "fs";

async function main() {

    console.log("Starting deployment...");

    const { ethers } =
        await hre.network.connect();

    const [deployer] =
        await ethers.getSigners();

    console.log(
        "Deployer address:",
        deployer.address
    );

    const balance =
        await ethers.provider.getBalance(
            deployer.address
        );

    const deployerBalance =
        ethers.formatEther(balance);

    console.log(
        "Deployer balance:",
        deployerBalance,
        "ETH"
    );

    console.log(
        "Deploying OwnerOnly contract..."
    );

    const OwnerOnly =
        await ethers.getContractFactory(
            "OwnerOnly"
        );

    const contract =
        await OwnerOnly.deploy();

    console.log(
        "Waiting for deployment..."
    );

    await contract.waitForDeployment();

    const contractAddress =
        await contract.getAddress();

    const ownerAddress =
        await contract.owner();

    console.log("-----------------------------------");

    console.log(
        "Contract deployed successfully!"
    );

    console.log(
        "Contract Address:",
        contractAddress
    );

    console.log(
        "Owner Address:",
        ownerAddress
    );

    console.log(
        "Network: Sepolia"
    );

    console.log(
        "Chain ID: 11155111"
    );

    console.log("-----------------------------------");


    // ==================================
    // UPDATE version.json AUTOMATICALLY
    // ==================================

    const versionFile =
        "C:\\blockclass\\sol\\version.json";

    // Read existing version.json
    const existingData =
        JSON.parse(
            fs.readFileSync(
                versionFile,
                "utf8"
            )
        );

    // Add DCF Version 2
    existingData.DCF_Version_2 = {

        "ContractAddress":
            contractAddress,

        "Deployer address":
            deployer.address,

        "Deployer balance":
            deployerBalance + " ETH",

        "Contract deployed successfully":
            "",

        "Contract Address":
            contractAddress,

        "Owner Address":
            ownerAddress,

        "Network":
            "Sepolia",

        "Chain ID":
            "11155111"
    };


    // Save updated JSON
    fs.writeFileSync(
        versionFile,
        JSON.stringify(
            existingData,
            null,
            2
        )
    );


    console.log(
        "version.json updated successfully!"
    );

    console.log(
        "DCF Version 2 details added."
    );
}

main().catch((error) => {

    console.error(
        "Deployment failed!"
    );

    console.error(error);

    process.exitCode = 1;
});