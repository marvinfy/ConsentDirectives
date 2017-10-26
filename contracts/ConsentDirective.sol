pragma solidity ^0.4.4;

contract ConsentDirective {
  address public Who; // To whom the patient is giving consent
  function SetWho(address value) { Who = value; }

  bool public DelegateAuthority; // Authority to consent on the Patient's behalf
  function SetDelegateAuthority(bool value) { DelegateAuthority = value; }

  uint256 public ConsentData; // The semantics of ConsentData is defined externally in conjunction with CategoryCollection
  function SetConsentData(uint256 value) { ConsentData = value; }

  function ConsentDirective(address who, bool delegateAuthority, uint256 consentData) {
    Who = who;
    DelegateAuthority = delegateAuthority;
    ConsentData = consentData;
  }
}
