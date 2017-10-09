pragma solidity ^0.4.4;

import "./ConsentDirectives.sol";

contract MediatorFactory {

  // Maps accounts to their respective ConsentDirectives instance
  mapping(address => address) m_Map;

  function GetCurrentAccount() constant returns (address) {
    return msg.sender;
  }

  function GetConsentDirectives() constant returns (address) {
    return m_Map[msg.sender];
  }




}
