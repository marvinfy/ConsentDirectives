pragma solidity ^0.4.4;

contract ConsentDirective {

  enum DirectiveType {
    Consent,  // Consent
    Delegate  // Delegate authority to consent
  }

  address private mOwner;
  address private mWho;
  DirectiveType private mDirectiveType;

  
}

