const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // --- Deploy User Registry ---
  const Userregistry = await hre.ethers.getContractFactory("Userregistry");
  const adminAddress = process.env.ADMIN_ADDRESS || "0x490B2BD4214a215eEf0C4A92aFDeA4535FDD2775";
  const user = await Userregistry.deploy(adminAddress);
  await user.waitForDeployment();
  const userAddr = await user.getAddress();

  // --- Deploy unified escrow ---
  const validator = process.env.VALIDATOR_ADDRESS || deployer.address;
  const feeReceiver = process.env.FEE_RECEIVER || deployer.address;
  const feeBps = BigInt(process.env.FEE_BPS || "200"); // 2% default

  const EVChargingEscrow = await hre.ethers.getContractFactory("EVChargingEscrow");
  const escrow = await EVChargingEscrow.deploy(userAddr, validator, feeReceiver, feeBps);
  await escrow.waitForDeployment();
  const escrowAddr = await escrow.getAddress();
  console.log("EVChargingEscrow:", escrowAddr);

  const addresses = {
    UserRegistry: userAddr,
    EVChargingEscrow: escrowAddr,
    Validator: validator,
    FeeReceiver: feeReceiver,
  };

  // root Addresses.json (existing file is tracked)
  const rootAddressesPath = path.join(__dirname, "..", "Addresses.json");
  fs.writeFileSync(rootAddressesPath, JSON.stringify(addresses, null, 2));

  // frontend Addresses.json
  const feAddressesPath = path.join(__dirname, "..", "frontend", "Addresses.json");
  fs.writeFileSync(feAddressesPath, JSON.stringify(addresses, null, 2));

  console.log("Wrote addresses to:", rootAddressesPath);
  console.log("Wrote addresses to:", feAddressesPath);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

