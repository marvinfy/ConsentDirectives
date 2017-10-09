pragma solidity ^0.4.4;

import "./ConsentDirectives.sol";

// TODO refactor to ConsentDirectiveFactoryMediator?
contract ConsentDirectiveFactory {

  uint number;

  function ConsentDirectiveFactory() {
    number = 0;
  }

  function Add(uint num) {
    number += num;
  }

  function Sub(uint num) {
    number += num;
  }

  function Get() returns (uint) {
     return number;
  }
}
