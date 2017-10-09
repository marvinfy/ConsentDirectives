// https://github.com/acloudfan/Blockchain-Course-Patterns/blob/master/test/contract_factory.js
// https://github.com/acloudfan/Blockchain-Course-Patterns/blob/master/contracts/ContractFactory.sol

pragma solidity ^0.4.4;

import "./Patient.sol";

contract PatientFactory {

  // Maps accounts to its respective Patient instance
  mapping(address => address) mMap;

  // Gets the Patient instance associated with the sender
  function GetPatient() constant returns (address) {
    return address(mMap[msg.sender]);
  }

  // Gets the Patient instance associated with the address parameter
  function GetPatientFor(address account) constant returns (address) {
    return address(mMap[account]);
  }

  function CreatePatient() {
    if (mMap[msg.sender] != 0) {
      return;
    }

    mMap[msg.sender] = new Patient();
  }

  function DeletePatient() {
    delete mMap[msg.sender];
  }

}
