import { expect } from "chai";
import hre from "hardhat";

describe("OwnerOnly - Complete Access Test", function () {

    let ethers;
    let owner;
    let user;
    let stranger;
    let contract;


    // ==========================================
    // DEPLOY CONTRACT BEFORE EVERY TEST
    // ==========================================

    beforeEach(async function () {

        const connection =
            await hre.network.connect();

        ethers = connection.ethers;

        // Get three different test wallets
        [owner, user, stranger] =
            await ethers.getSigners();

        console.log("\n==========================================");
        console.log("TEST ACCOUNTS");
        console.log("==========================================");

        console.log("Owner    :", owner.address);
        console.log("User     :", user.address);
        console.log("Stranger :", stranger.address);

        // Deploy contract
        const OwnerOnly =
            await ethers.getContractFactory("OwnerOnly");

        contract =
            await OwnerOnly.deploy();

        await contract.waitForDeployment();

        console.log("------------------------------------------");
        console.log("Contract :", await contract.getAddress());
        console.log("Owner in Contract :", await contract.owner());
        console.log("==========================================");
    });


    // ==========================================
    // TEST 1 - CHECK OWNER
    // ==========================================

    it("1. Check who the owner is", async function () {

        console.log("\n========== TEST 1: OWNER CHECK ==========");

        console.log("Expected Owner :", owner.address);

        const contractOwner =
            await contract.owner();

        console.log(
            "Contract Owner :",
            contractOwner
        );

        expect(contractOwner)
            .to.equal(owner.address);

        console.log("RESULT: Owner is correct ✅");
    });


    // ==========================================
    // TEST 2 - OWNER ADDS USER
    // ==========================================

    it("2. Owner adds the user", async function () {

        console.log("\n========== TEST 2: ADD USER ==========");

        console.log(
            "Caller (Owner) :",
            owner.address
        );

        console.log(
            "User to add    :",
            user.address
        );

        await contract
            .connect(owner)
            .addUser(user.address);

        const status =
            await contract.users(user.address);

        console.log(
            "User registered status :",
            status
        );

        expect(status)
            .to.equal(true);

        console.log("RESULT: User added successfully ✅");
    });


    // ==========================================
    // TEST 3 - USER ACCESS
    // ==========================================

    it("3. Added user tries to access", async function () {

        console.log("\n========== TEST 3: USER ACCESS ==========");

        // Owner adds user first
        await contract
            .connect(owner)
            .addUser(user.address);

        console.log(
            "Caller (User) :",
            user.address
        );

        console.log(
            "Registered? :",
            await contract.users(user.address)
        );

        const result =
            await contract
                .connect(user)
                .accessUser();

        console.log(
            "Contract Response :",
            result
        );

        expect(result)
            .to.equal(
                "User accessed successfully"
            );

        console.log("RESULT: User access SUCCESS ✅");
    });


    // ==========================================
    // TEST 4 - STRANGER ACCESS
    // ==========================================

    it("4. Stranger tries to access", async function () {

        console.log("\n========== TEST 4: STRANGER ACCESS ==========");

        console.log(
            "Caller (Stranger) :",
            stranger.address
        );

        console.log(
            "Registered? :",
            await contract.users(stranger.address)
        );

        try {

            await contract
                .connect(stranger)
                .accessUser();

            console.log(
                "ERROR: Stranger was allowed ❌"
            );

        } catch (error) {

            console.log(
                "Access Error :",
                error.shortMessage || error.message
            );

            expect(error.message)
                .to.include(
                    "User is not registered"
                );

            console.log(
                "RESULT: Stranger correctly rejected ✅"
            );
        }
    });


    // ==========================================
    // TEST 5 - USER TRIES TO ADD STRANGER
    // ==========================================

    it("5. Normal user tries to add stranger", async function () {

        console.log(
            "\n========== TEST 5: USER ADD USER =========="
        );

        // Owner adds user
        await contract
            .connect(owner)
            .addUser(user.address);

        console.log(
            "Caller (User) :",
            user.address
        );

        console.log(
            "Trying to add :",
            stranger.address
        );

        try {

            await contract
                .connect(user)
                .addUser(stranger.address);

            console.log(
                "ERROR: User was allowed to add another user ❌"
            );

        } catch (error) {

            console.log(
                "Access Error :",
                error.shortMessage || error.message
            );

            expect(error.message)
                .to.include(
                    "Only owner can access"
                );

            console.log(
                "RESULT: Normal user correctly rejected ✅"
            );
        }
    });


    // ==========================================
    // TEST 6 - USER TRIES TO REMOVE
    // ==========================================

    it("6. Normal user tries to remove user", async function () {

        console.log(
            "\n========== TEST 6: USER REMOVE USER =========="
        );

        // Owner adds user
        await contract
            .connect(owner)
            .addUser(user.address);

        console.log(
            "Caller (User) :",
            user.address
        );

        console.log(
            "Trying to remove :",
            user.address
        );

        try {

            await contract
                .connect(user)
                .removeUser(user.address);

            console.log(
                "ERROR: User was allowed to remove user ❌"
            );

        } catch (error) {

            console.log(
                "Access Error :",
                error.shortMessage || error.message
            );

            expect(error.message)
                .to.include(
                    "Only owner can access"
                );

            console.log(
                "RESULT: Normal user correctly rejected ✅"
            );
        }
    });


    // ==========================================
    // TEST 7 - OWNER REMOVES USER
    // ==========================================

    it("7. Owner removes the user", async function () {

        console.log(
            "\n========== TEST 7: REMOVE USER =========="
        );

        // First add user
        await contract
            .connect(owner)
            .addUser(user.address);

        console.log(
            "User before removal :",
            await contract.users(user.address)
        );

        console.log(
            "Owner removing :",
            user.address
        );

        // Owner removes user
        await contract
            .connect(owner)
            .removeUser(user.address);

        const status =
            await contract.users(user.address);

        console.log(
            "User after removal :",
            status
        );

        expect(status)
            .to.equal(false);

        console.log(
            "RESULT: User removed successfully ✅"
        );
    });


    // ==========================================
    // TEST 8 - REMOVED USER TRIES ACCESS
    // ==========================================

    it("8. Removed user tries to access", async function () {

        console.log(
            "\n========== TEST 8: REMOVED USER ACCESS =========="
        );

        // Owner adds user
        await contract
            .connect(owner)
            .addUser(user.address);

        console.log(
            "User added :",
            user.address
        );

        // Owner removes user
        await contract
            .connect(owner)
            .removeUser(user.address);

        console.log(
            "User removed :",
            user.address
        );

        console.log(
            "Registered? :",
            await contract.users(user.address)
        );

        try {

            await contract
                .connect(user)
                .accessUser();

            console.log(
                "ERROR: Removed user was allowed ❌"
            );

        } catch (error) {

            console.log(
                "Access Error :",
                error.shortMessage || error.message
            );

            expect(error.message)
                .to.include(
                    "User is not registered"
                );

            console.log(
                "RESULT: Removed user correctly rejected ✅"
            );
        }
    });


    // ==========================================
    // TEST 9 - OWNER CAN ADD STRANGER
    // ==========================================

    it("9. Owner adds stranger as a new user", async function () {

        console.log(
            "\n========== TEST 9: OWNER ADD STRANGER =========="
        );

        console.log(
            "Caller (Owner) :",
            owner.address
        );

        console.log(
            "Adding address :",
            stranger.address
        );

        await contract
            .connect(owner)
            .addUser(stranger.address);

        const status =
            await contract.users(stranger.address);

        console.log(
            "Stranger registered status :",
            status
        );

        expect(status)
            .to.equal(true);

        console.log(
            "RESULT: Owner successfully added stranger ✅"
        );
    });


    // ==========================================
    // FINAL SUMMARY
    // ==========================================

    after(async function () {

        console.log("\n");
        console.log("==========================================");
        console.log("          TESTING COMPLETED");
        console.log("==========================================");
        console.log("Owner Address    :", owner.address);
        console.log("User Address     :", user.address);
        console.log("Stranger Address :", stranger.address);
        console.log("==========================================");
    });

});

