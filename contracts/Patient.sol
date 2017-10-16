pragma solidity ^0.4.4;

import "./ConsentDirective.sol";

contract Patient {
  address private mOwner;
  ConsentDirective[] private mDirectives;

  function Patient(address owner) {
    mOwner = owner;
    mDirectives = new ConsentDirective[](0);
  }

  function GetOwner() constant returns(address) {
    return mOwner;
  }

  function GetConsentDirectives() constant returns(ConsentDirective[]) {
    return mDirectives;
  }

  function AddConsentDirective(ConsentDirective cd) {

    if (ConsentsTo(cd)) {
      mDirectives.push(cd);
    }
    else {
      revert();
    }
  } 

  function ConsentsTo(ConsentDirective cd) constant returns(bool) {
    
    if (msg.sender == mOwner) {
      return true;
    }

    for (uint i = 0; i < mDirectives.length; i++) {
      if (mDirectives[i].Encompasses(cd)) {
        return true;
      }
    }

    return false;
  }

}
