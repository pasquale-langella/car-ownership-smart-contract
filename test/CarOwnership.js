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

    await expect(carOwnershipContract.buildCar("EW722YG",15))
    .to.emit(carOwnershipContract, "CarBuilt")
    .withArgs("EW722YG",15);
  });

  it("Checks owner owns car EW722YG after build", async function () {
    const [owner] = await ethers.getSigners();
    const carOwnershipContract = await ethers.deployContract("CarOwnership");
    
    await carOwnershipContract.buildCar("EW722YG",15)
    expect(await carOwnershipContract.getCarOwner("EW722YG")).equal(owner)
  });

  it("Checks car transfer", async function () {
    const [owner, buyer] = await ethers.getSigners();
    const carOwnershipContract = await ethers.deployContract("CarOwnership");

    await carOwnershipContract.buildCar("EW722YG",15);

    const transactionHash = await owner.sendTransaction({
        to: carOwnershipContract.target,
        value: 15,
      });

    await expect(carOwnershipContract.transferCar(buyer,"EW722YG"))
    .to.emit(carOwnershipContract, "CarTransferred")
    .withArgs(owner,buyer,"EW722YG");
  });

});