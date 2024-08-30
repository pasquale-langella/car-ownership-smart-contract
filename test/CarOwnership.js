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
    
    expect(await carOwnershipContract.ownsCar(owner,"EW722YG"))
  });

});