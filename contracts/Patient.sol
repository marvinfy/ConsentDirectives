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

  function GetConsentDirectives() constant returns(ConsentDirective[] consentDirectives) {
    consentDirectives = mConsentDirectives;
  }

  function HasAuthorityToConsent(ConsentDirective cd) constant returns(bool) {
    if (msg.sender == mOwner) {
      return true;
    }

    // TODO: Loop through mConsentDirectives and see if msg.sender...
    return false;
  }

  function AddConsentDirective(ConsentDirective cd) returns(bool) {
    if (HasAuthorityToConsent(cd)) {
      mConsentDirectives.push(cd);
      return true;
    }

    return false;
  }



}
