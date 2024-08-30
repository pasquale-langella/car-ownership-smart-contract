const { expect } = require("chai");

describe("Car Ownership contract", function () {
  it("Deployment should succeed", async function () {
    const [owner] = await ethers.getSigners();

    const carOwnershipContract = await ethers.deployContract("CarOwnership");

    expect(await carOwnershipContract.getOwner()).to.equal(owner);
  });
});