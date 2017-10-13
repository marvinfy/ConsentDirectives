pragma solidity ^0.4.4;

import "./ConsentDirective.sol";

contract Patient {
  
  address private mOwner;

  ConsentDirective[] private mConsentDirectives;

  function Patient(address owner) {
    mOwner = owner;
  }

  function GetOwner() returns(address) {
    return mOwner;
  }

}
