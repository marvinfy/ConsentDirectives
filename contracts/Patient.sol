pragma solidity ^0.4.4;

import "./ConsentDirective.sol";

contract Patient {
  address private mOwner;
  ConsentDirective[] private mConsentDirectives;

  function Patient(address owner) {
    mOwner = owner;
    mConsentDirectives = new ConsentDirective[](0);
  }

  function GetOwner() constant returns(address) {
    return mOwner;
  }

  function GetConsentDirectives() constant returns(ConsentDirective[]) {
    return mConsentDirectives;
  }

  function HasAuthorityToConsent(ConsentDirective cd) constant returns(bool) {
    if (msg.sender == mOwner) {
      return true;
    }

    // TODO: Loop through mConsentDirectives and see if msg.sender...
    return false;
  }

  function AddConsentDirective(ConsentDirective cd) {
    if (HasAuthorityToConsent(cd)) {
      mConsentDirectives.push(cd);
    }
    else {
      revert();
    }
  } 

}
