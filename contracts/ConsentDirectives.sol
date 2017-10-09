pragma solidity ^0.4.4;

contract ConsentDirectives {

/*
  enum DirectiveType {
    Delegate, // Delegate authority to consent
    Consent   // Consent
  }

  enum What {
    DirectiveType directiveType;
  }

  struct ConsentDirective {
    address who;
    What what;
  };

  address owner;
  ConsentDirective[] directives;
*/

  address private mOwner;

  function ConsentDirectives() {
    mOwner = msg.sender;
  }

  function GetOwner() constant returns (address owner) {
    owner = mOwner;
  }
}
