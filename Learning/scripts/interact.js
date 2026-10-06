import hre from "hardhat";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {

    const { ethers } = await hre.network.connect();

    const rl = createInterface({
        input,
        output
    });

    try {

        // Get accounts
        const [owner, user, stranger] =
            await ethers.getSigners();

        console.log("\n================================");
        console.log("       OWNER ONLY CONTRACT");
        console.log("================================");

        console.log("\nAvailable Accounts:");
        console.log("Owner    :", owner.address);
        console.log("User     :", user.address);
        console.log("Stranger :", stranger.address);


        // Deploy contract
        console.log("\nDeploying contract...");

        const OwnerOnly =
            await ethers.getContractFactory("OwnerOnly");

        const contract =
            await OwnerOnly.deploy();

        await contract.waitForDeployment();

        const contractAddress =
            await contract.getAddress();

        console.log("Contract Address:", contractAddress);

        console.log(
            "Contract Owner  :",
            await contract.owner()
        );


        while (true) {

            console.log("\n================================");
            console.log("             MENU");
            console.log("================================");

            console.log("1. Add User");
            console.log("2. Remove User");
            console.log("3. Check User");
            console.log("4. Access User");
            console.log("5. Check Owner");
            console.log("6. Show All Accounts");
            console.log("7. Exit");

            const choice =
                await rl.question("\nEnter your choice: ");


            // -------------------------
            // ADD USER
            // -------------------------

            if (choice === "1") {

                console.log("\n--- ADD USER ---");

                const userAddress =
                    await rl.question(
                        "Enter user address: "
                    );

                // Check address
                if (!ethers.isAddress(userAddress)) {

                    console.log(
                        "\n❌ Invalid Ethereum address."
                    );

                    console.log(
                        "Example:",
                        user.address
                    );

                    continue;
                }

                try {

                    const alreadyRegistered =
                        await contract.users(userAddress);

                    if (alreadyRegistered) {

                        console.log(
                            "\n⚠️ User is already registered."
                        );

                        continue;
                    }

                    console.log(
                        "\nAdding user..."
                    );

                    const tx =
                        await contract
                            .connect(owner)
                            .addUser(userAddress);

                    console.log(
                        "Transaction sent:",
                        tx.hash
                    );

                    await tx.wait();

                    console.log(
                        "✅ User added successfully!"
                    );

                    console.log(
                        "User:",
                        userAddress
                    );

                } catch (error) {

                    console.log(
                        "\n❌ Add user failed."
                    );

                    console.log(
                        error.shortMessage ||
                        error.message
                    );
                }
            }


            // -------------------------
            // REMOVE USER
            // -------------------------

            else if (choice === "2") {

                console.log("\n--- REMOVE USER ---");

                const userAddress =
                    await rl.question(
                        "Enter user address: "
                    );

                if (!ethers.isAddress(userAddress)) {

                    console.log(
                        "\n❌ Invalid Ethereum address."
                    );

                    continue;
                }

                try {

                    const registered =
                        await contract.users(userAddress);

                    if (!registered) {

                        console.log(
                            "\n⚠️ This address is not registered."
                        );

                        continue;
                    }

                    console.log(
                        "\nRemoving user..."
                    );

                    const tx =
                        await contract
                            .connect(owner)
                            .removeUser(userAddress);

                    console.log(
                        "Transaction sent:",
                        tx.hash
                    );

                    await tx.wait();

                    console.log(
                        "✅ User removed successfully!"
                    );

                } catch (error) {

                    console.log(
                        "\n❌ Remove user failed."
                    );

                    console.log(
                        error.shortMessage ||
                        error.message
                    );
                }
            }


            // -------------------------
            // CHECK USER
            // -------------------------

            else if (choice === "3") {

                console.log("\n--- CHECK USER ---");

                const userAddress =
                    await rl.question(
                        "Enter user address: "
                    );

                if (!ethers.isAddress(userAddress)) {

                    console.log(
                        "\n❌ Invalid Ethereum address."
                    );

                    continue;
                }

                try {

                    const registered =
                        await contract.users(userAddress);

                    console.log(
                        "\nAddress:",
                        userAddress
                    );

                    if (registered) {

                        console.log(
                            "Status: ✅ Registered"
                        );

                    } else {

                        console.log(
                            "Status: ❌ Not Registered"
                        );
                    }

                } catch (error) {

                    console.log(
                        "\n❌ Check failed."
                    );
                }
            }


            // -------------------------
            // ACCESS USER
            // -------------------------

            else if (choice === "4") {

                console.log("\n--- ACCESS USER ---");

                console.log("\nChoose caller:");

                console.log(
                    "1. User"
                );

                console.log(
                    "2. Stranger"
                );

                console.log(
                    "3. Owner"
                );

                const callerChoice =
                    await rl.question(
                        "\nEnter caller choice: "
                    );

                let caller;

                if (callerChoice === "1") {

                    caller = user;

                }
                else if (callerChoice === "2") {

                    caller = stranger;

                }
                else if (callerChoice === "3") {

                    caller = owner;

                }
                else {

                    console.log(
                        "\n❌ Invalid caller choice."
                    );

                    continue;
                }


                console.log(
                    "\nCaller:",
                    caller.address
                );

                try {

                    const registered =
                        await contract.users(
                            caller.address
                        );

                    if (!registered) {

                        console.log(
                            "Status: ❌ User is not registered."
                        );

                        console.log(
                            "Access denied."
                        );

                        continue;
                    }

                    const result =
                        await contract
                            .connect(caller)
                            .accessUser();

                    console.log(
                        "Status: ✅ Access granted."
                    );

                    console.log(
                        "Contract Response:",
                        result
                    );

                } catch (error) {

                    console.log(
                        "\n❌ Access failed."
                    );

                    console.log(
                        error.shortMessage ||
                        error.message
                    );
                }
            }


            // -------------------------
            // CHECK OWNER
            // -------------------------

            else if (choice === "5") {

                console.log("\n--- CHECK OWNER ---");

                const contractOwner =
                    await contract.owner();

                console.log(
                    "\nContract Owner:",
                    contractOwner
                );

                console.log(
                    "Current Signer :",
                    owner.address
                );
            }


            // -------------------------
            // SHOW ACCOUNTS
            // -------------------------

            else if (choice === "6") {

                console.log(
                    "\n--- AVAILABLE ACCOUNTS ---"
                );

                console.log(
                    "\nOwner:"
                );

                console.log(
                    owner.address
                );

                console.log(
                    "\nUser:"
                );

                console.log(
                    user.address
                );

                console.log(
                    "\nStranger:"
                );

                console.log(
                    stranger.address
                );
            }


            // -------------------------
            // EXIT
            // -------------------------

            else if (choice === "7") {

                console.log(
                    "\nExiting program..."
                );

                break;
            }


            else {

                console.log(
                    "\n❌ Invalid choice."
                );
            }
        }

    } finally {

        rl.close();
    }
}


main().catch((error) => {

    console.error(error);

    process.exitCode = 1;
});