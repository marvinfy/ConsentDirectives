pragma solidity ^0.4.4;

contract Category {

  string public Name;
  function SetName(string name) { Name = name; }

  // TODO use future ConsentData type when that's done
  uint256[] public ConsentData;
  function AddConsentData(uint256 consentData) { ConsentData.push(consentData); }

  function Category(string name) {
    Name = name;
  }
  
}
