//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;


// This is the main building block for smart contracts.
contract CarOwnership {
    address public owner;

    // A mapping is a key/value map with the owned car plates
    mapping(address => mapping(string => bool)) car_plates_map;

    // The Transfer event helps off-chain applications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, string _car_plate);
    event CarBuilt(string _car_plate);

    /**
     * Contract initialization.
     */
    constructor() {
        owner = msg.sender;
    }

     function getOwner() external view returns(address) {
       return owner;
    }

    function buildCar(string calldata _car_plate) external{
        car_plates_map[owner][_car_plate]=true;
        emit CarBuilt(_car_plate);
    }

    /**
     * A function to transfer car plates.
     *
     * The `external` modifier makes a function *only* callable from *outside*
     * the contract.
     */
    function transfer(address _to, string calldata _car_plate) external {
        // Check if the transaction sender is the owner of the car.
        // If `require`'s first argument evaluates to `false`, the
        // transaction will revert.
        bool car_plate_sender = car_plates_map[msg.sender][_car_plate];
        require(car_plate_sender==true, "the message sender is not ne owner of the car");

        // Transfer car ownership.
        car_plates_map[_to][_car_plate]=true;
        car_plates_map[msg.sender][_car_plate]=false;

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, _to, _car_plate);
    }

    /**
     * Read only function to retrieve the owned cars.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function ownsCar(address _account,string calldata _plate) external view returns (bool) {
        return car_plates_map[_account][_plate];
    }
}