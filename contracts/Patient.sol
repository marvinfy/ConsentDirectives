pragma solidity ^0.4.4;

import "./ConsentDirective.sol";

contract Patient {
  address private mOwner;
  ConsentDirective[] private mConsentDirectives;

  function Patient(address owner) {
    mOwner = owner;
    mConsentDirectives = new ConsentDirective[](0);
  }

  function GetOwnerAddress() constant returns(address) {
    return mOwner;
  }

  function GetConsentDirectiveCount() constant returns(uint) {
    return mConsentDirectives.length;
  }

  function GetConsentDirectives() constant returns(ConsentDirective[]) {
    return mConsentDirectives;
  }

  function GetIt() constant returns(address) {

    return address(mConsentDirectives[0]);
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
