//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;


// This is the main building block for smart contracts.
contract CarOwnership {
    address public owner;

    // A mapping is a key/value map with the owned car plates
    mapping (string => address) car_owners_map;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event CarTransferred(address indexed _from, address indexed _to, string _car_plate);
    event CarBuilt(string _car_plate);

    /**
     * Contract initialization.
     */
    constructor() {
        owner = msg.sender;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}
    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function payCar() external payable{}

    //transfers the smart contract balance to the owner
    function transferBalanceToOwner() external payable {
        payable(owner).transfer(getBalance());
    }

    function buildCar(string calldata _car_plate) external{
        car_owners_map[_car_plate]=owner;
        emit CarBuilt(_car_plate);
    }

    /**
     * A function to transfer car plates.
     *
     * The `external` modifier makes a function *only* callable from *outside*
     * the contract.
     */
    function transferCar(address _to, string calldata _car_plate) external {
        // Check if the transaction sender is the owner of the car.
        // If `require`'s first argument evaluates to `false`, the
        // transaction will revert.
        require(car_owners_map[_car_plate]==msg.sender, "the message sender is not ne owner of the car");

        // Transfer car ownership.
        car_owners_map[_car_plate]= _to;

        // Notify off-chain applications of the transfer.
        emit CarTransferred(msg.sender, _to, _car_plate);
    }

    /**
     * Read only function to retrieve the owned cars.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function getCarOwner(string calldata _car_plate) external view returns (address) {
        return car_owners_map[_car_plate];
    }

    function getOwner() external view returns(address) {
       return owner;
    }
}