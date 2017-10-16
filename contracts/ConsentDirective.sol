pragma solidity ^0.4.4;

contract ConsentDirective {

  enum DirectiveType {
    Consent,  // Consent
    Delegate  // Delegate authority to consent on his/her behalf
  }

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

  address public Who; // Who the patient is consenting or delegating authority to consent on his behalf
  DirectiveType public Type; // Consent or Delegate

  function ConsentDirective(address who, DirectiveType directiveType) {
    Who = who;
    Type = directiveType;
  }

  function Encompasses(ConsentDirective other) returns(bool) {
    return false;
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

