pragma solidity ^0.4.4;

contract ConsentDirective {

  enum DirectiveType { Consent, Delegate /* Delegate authority to consent on his/her behalf */ } // Not used ATM
  enum RecordTypeValues { Any, Specific, XRay, LabReports, Prescription }
  enum AccessTypeValues { Any, View, Modify, Order, Consult, AddNote, Diagnosis }
  enum WhyValues { Any, PrimaryCare, Diagnosis, Treatment, SpecificProcedures, Emergency, RecordCorrection, CaseManagement }

  address public Who; // To whom the patient is giving consent
  function SetWho(address who) { Who = who; }

  bool public DelegateAuthority; // Authority to consent on the Patient's behalf (displaces DirectiveType)
  function SetDelegateAuthority(bool value) { DelegateAuthority = value; }

  uint32 public RecordType; // The record type
  function SetRecordType(uint32 recordType) { RecordType = recordType; }

  address public Record; // The record when RecordType is Specific. Null otherwise.
  function SetRecord(address record) { Record = record; }

  uint32 public AccessType; // The access type
  function SetAccessType(uint32 accessType) { AccessType = accessType; }

  function ConsentDirective(address who, bool delegateAuthority) {
    Who = who;
    DelegateAuthority = delegateAuthority;
  }

  function Encompasses(ConsentDirective other) returns(bool) {
    bool result = true;
    result = result && (this.Who() == other.Who());
    result = result && (this.DelegateAuthority() == other.DelegateAuthority());

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

