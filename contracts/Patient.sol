pragma solidity ^0.4.4;

import "./ConsentDirective.sol";

contract Patient {
  
  address private mOwner;
  ConsentDirective[] private mConsentDirectives;
  uint private mNum;


  function Patient(address owner) {
    mOwner = owner;
    mConsentDirectives = new ConsentDirective[](1);
    mNum = 10;
  }

  function GetOwnerAddress() constant returns(address) {
    return mOwner;
  }

  function GetNum() constant returns(uint ret) {
    ret = 5;
  }

  function GetNum2() constant returns(uint ret) {
    ret = 51;
  }

 /*
  function HasAuthorityToConsent(address cd) constant returns(bool) {
    if (msg.sender == mOwner) {
      return true;
    }

    // TODO: Loop through mConsentDirectives and see if msg.sender...
    return false;
  }

  function AddConsentDirective(address cd) returns(bool) {
    if (HasAuthorityToConsent(cd)) {
      mConsentDirectives.push(cd);
      return true;
    }

    return false;
  }*/



}
