const { expect } = require("chai");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");

describe("Car Ownership contract", function () {
  it("Checks owner assignment in the contract", async function () {
    const [owner] = await ethers.getSigners();
    const carOwnershipContract = await ethers.deployContract("CarOwnership");

    expect(await carOwnershipContract.getOwner()).equal(owner);
  });

  it("Checks car build", async function () {
    const [owner] = await ethers.getSigners();
    const carOwnershipContract = await ethers.deployContract("CarOwnership");

    await expect(carOwnershipContract.buildCar("EW722YG"))
    .to.emit(carOwnershipContract, "CarBuilt")
    .withArgs("EW722YG");
  });

  it("Checks owner owns car EW722YG after build", async function () {
    const [owner] = await ethers.getSigners();
    const carOwnershipContract = await ethers.deployContract("CarOwnership");
    
    await carOwnershipContract.buildCar("EW722YG")
    expect(await carOwnershipContract.getCarOwner("EW722YG")).equal(owner)
  });

  it("Checks car transfer", async function () {
    const [owner, buyer] = await ethers.getSigners();
    const carOwnershipContract = await ethers.deployContract("CarOwnership");

    //build a car
    await carOwnershipContract.buildCar("EW722YG");

    //buyer transfers some money on the contract
    const amount = 15;
    const transactionHash = await buyer.sendTransaction({
        to: carOwnershipContract.target,
        value: amount,
      });
    
    //owner checks that the requested amount was transferred to the contract
    expect(await carOwnershipContract.getBalance()).equal(amount);
    
    //owner performs the transfer of car property
    await expect(carOwnershipContract.transferCar(buyer,"EW722YG"))
    .to.emit(carOwnershipContract, "CarTransferred")
    .withArgs(owner,buyer,"EW722YG");

    //checks that the car property is transferred
    expect(await carOwnershipContract.getCarOwner("EW722YG")).equal(buyer)
  });

});