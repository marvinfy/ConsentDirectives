// https://github.com/acloudfan/Blockchain-Course-Patterns/blob/master/test/contract_factory.js
// https://github.com/acloudfan/Blockchain-Course-Patterns/blob/master/contracts/ContractFactory.sol

pragma solidity ^0.4.4;

import "./Patient.sol";

contract PatientFactory {

  // Maps accounts to its respective Patient instance
  mapping(address => Patient) mMap;

  function PatientFactory() {
  }

  function Create() {
    if (address(mMap[msg.sender]) == 0) {
      mMap[msg.sender] = new Patient(msg.sender);
    }
  }

  function Delete() {
    delete mMap[msg.sender];
  }

  // Gets the address of the Patient instance associated with the caller
  function GetAddress() constant returns (address) {
    return mMap[msg.sender]; // address(mMap[msg.sender]) works as well
  }

}
