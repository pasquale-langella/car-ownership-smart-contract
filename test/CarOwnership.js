const { expect } = require("chai");
const { boolean } = require("hardhat/internal/core/params/argumentTypes");
const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Car Ownership contract", function () {

  async function deployCarOwnershipFixture() {
      // Get the Signers here.
      const [owner, buyer] = await ethers.getSigners();
  
      // To deploy our contract, we just have to call ethers.deployContract and await
      // its waitForDeployment() method, which happens once its transaction has been
      // mined.
      const carOwnershipContract = await ethers.deployContract("CarOwnership");
  
      await carOwnershipContract.waitForDeployment();
  
      // Fixtures can return anything you consider useful for your tests
      return { carOwnershipContract, owner, buyer};
    }

  it("Checks owner assignment in the contract", async function () {

    const { carOwnershipContract, owner } = await loadFixture(deployCarOwnershipFixture);

    expect(await carOwnershipContract.getOwner()).equal(owner);
  });

  it("Checks car build", async function () {
    const { carOwnershipContract} = await loadFixture(deployCarOwnershipFixture);

    await expect(carOwnershipContract.buildCar("EW722YG"))
    .to.emit(carOwnershipContract, "CarBuilt")
    .withArgs("EW722YG");
  });

  it("Checks owner owns car EW722YG after build", async function () {
    const { carOwnershipContract, owner } = await loadFixture(deployCarOwnershipFixture);
    
    await carOwnershipContract.buildCar("EW722YG")
    expect(await carOwnershipContract.getCarOwner("EW722YG")).equal(owner)
  });

  it("Makes an offer for the car EW722YG", async function () {
    const { carOwnershipContract, owner, buyer } = await loadFixture(deployCarOwnershipFixture);
    carPlate = "EW722YG";
    const offerAmount = 15; // 15 Ether

    await expect(
      carOwnershipContract.connect(buyer).makeOffer(carPlate, { value: offerAmount })
    ).to.changeEtherBalances([buyer, carOwnershipContract], [-offerAmount, offerAmount]);

  });


  it("Checks car transfer", async function () {
    const { carOwnershipContract, owner, buyer } = await loadFixture(deployCarOwnershipFixture);

    //build a car
    const car_plate = "EW722YG"
    await carOwnershipContract.buildCar(car_plate);

    //buyer makes an offer
    carOwnershipContract.connect(buyer).makeOffer(car_plate, { value: 15 });

    //owner performs the transfer of car property
    await expect(carOwnershipContract.transferCar(buyer,car_plate))
    .to.emit(carOwnershipContract, "CarTransferred")
    .withArgs(owner,buyer,car_plate);

    //checks that the car property is transferred
    expect(await carOwnershipContract.getCarOwner(car_plate)).equal(buyer)
  });

  it("Checks car transfer failure if there is no offer", async function () {
    const { carOwnershipContract, owner, buyer } = await loadFixture(deployCarOwnershipFixture);

    //build a car
    const car_plate = "EW722YG"
    await carOwnershipContract.buildCar(car_plate);

    //owner performs the transfer of car property
    await expect(carOwnershipContract.transferCar(buyer,car_plate)).to.be.revertedWith("there is no offer for the car for the specified buyer");
  });

});