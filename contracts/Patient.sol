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

  // In order to add a consent directive, the caller must be
  // the patient or have authority to consent on behalf of the
  // patient.
  //
  function AddConsentDirective(ConsentDirective cd) {
    if (msg.sender == mOwner || this.HasDelegatedAuthority(msg.sender, cd)) {
      mDirectives.push(cd);
    } else {
      revert();
    }
  }

  // Cheks all consent directives and returns true if the patient has a
  // directive that encompasses the one provided as a parameter.
  //
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

  function HasDelegatedAuthority(address delegate, ConsentDirective cd) returns(bool) {
    // Because having consent to do something is different from having
    // authority to consent the same thing, we have to query Encompasses
    // with a modified version of the consent directive.

    // Save original state
    address original_who = cd.Who();
    bool original_auth = cd.DelegateAuthority();

    // Modify state and query
    cd.SetWho(delegate);
    cd.SetDelegateAuthority(true);
    bool hasAuthorityToConsent = ConsentsTo(cd);

    // Restore original state
    cd.SetWho(original_who);
    cd.SetDelegateAuthority(original_auth);

    return hasAuthorityToConsent;
  }



}
