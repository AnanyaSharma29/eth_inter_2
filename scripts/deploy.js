const { ethers } = require("hardhat");

async function main() {
  const HotelRoomBookingSystem = await ethers.getContractFactory("HotelRoomBookingSystem");
  const hotelRoomBookingSystem = await HotelRoomBookingSystem.deploy();  // Deploy the contract
  await hotelRoomBookingSystem.deployed();  // Wait for the deployment to be mined

  console.log(`HotelRoomBookingSystem deployed to: ${hotelRoomBookingSystem.address}`);  // Output the deployed contract address
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });