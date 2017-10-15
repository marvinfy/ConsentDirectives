pragma solidity ^0.4.4;

import "./ConsentDirective.sol";

contract Patient {
  
  address private mOwner;

  ConsentDirective[] private mConsentDirectives;

  function Patient(address owner) {
    mOwner = owner;
  }

  function GetOwnerAddress() returns(address) {
    return mOwner;
  }

  function AddConsentDirective(ConsentDirective cd) returns(bool) {
    if (msg.sender == mOwner) {
      mConsentDirectives.push(cd);
      return true;
    }
    else {
      // Verify if msg.sender has authority to consent
      return false;
    }
  }



}
