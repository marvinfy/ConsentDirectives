// https://github.com/acloudfan/Blockchain-Course-Patterns/blob/master/test/contract_factory.js
// https://github.com/acloudfan/Blockchain-Course-Patterns/blob/master/contracts/ContractFactory.sol

pragma solidity ^0.4.4;

import "./ConsentDirectives.sol";

contract MediatorFactory {

  // Maps accounts to their respective ConsentDirectives instance
  mapping(address => address) mMap;

  function GetConsentDirectives() constant returns (address) {
    return address(mMap[msg.sender]);
  }

  function GetConsentDirectivesFrom(address account) constant returns (address) {
    return address(mMap[account]);
  }

  function CreateConsentDirectives() {
    if (mMap[msg.sender] != 0) {
      return;
    }

    mMap[msg.sender] = new ConsentDirectives();
  }

  function DeleteConsentDirectives() {
    delete mMap[msg.sender];
  }

  function HasConsent() constant returns (address) {
    return 0;
  }

}
