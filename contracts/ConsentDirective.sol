pragma solidity ^0.4.4;

contract ConsentDirective {

  /*enum DirectiveType {
    Consent,  // Consent
    Delegate  // Delegate authority to consent on his/her behalf
  }*/

/*
  // TODO store as bytes to allow multiple options (bitwise operations)
  enum RecordType {
    Any,
    Specific,
    XRay,
    LabReports,
    Prescription
    // ...
  }

  // TODO store as bytes to allow multiple options (bitwise operations)
  enum AccessType {
    Any,
    ViewRecord,
    ModifyRecord,
    Order,
    Consult,
    AddNote,
    Diagnosis // Why?
  }

  // TODO store as bytes to allow multiple options (bitwise operations)
  enum Why {
    Any,
    PrimaryCare,
    Diagnosis,
    Treatment,
    SpecificProcedures,
    Emergency,
    RecordCorrection,
    CaseManagement
  }*/

  address public Who; // Who the patient is giving consent
  function SetWho(address who) { Who = who; }

  bool public DelegateAuthority; // Whether this delegates authority to consent on the Patient's behalf
  function SetDelegateAuthority(bool value) { DelegateAuthority = value; }

  function ConsentDirective(address who, bool delegateAuthority) {
    Who = who;
    DelegateAuthority = delegateAuthority;
  }

  function Encompasses(ConsentDirective other) returns(bool) {
    bool result = true;
    result = result && (Who == other.Who());


    return result;
  }

  /*
  RecordType private mRecordType;
  address private mSpecificRecord; // Only for RecordType::Specific
  address[] mOrigins; // Empty array represents Any origin
  AccessType private mAccessType;
  Why private mWhy;
  // TODO expiry date
  */
  
}

