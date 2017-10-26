pragma solidity ^0.4.4;

contract Category {

  string public Name;
  function SetName(string name) { Name = name; }

  // TODO use future ConsentData type when that's done
  uint256[] public ConsentData;
  function AddConsentData(uint256 consentData) { ConsentData.push(consentData); }

}

contract CategoryCatalog {

  address Owner;
  Category[] public Categories;
  
  modifier OwnerOnly {
    if (msg.sender == Owner) {
      _;
    } else {
      revert();
    }
  }

  function Categories() {
    Owner = msg.sender;
    Categories = new Category[](0);
  }

  function Add(Category category) OwnerOnly {
    Categories.push(category);
  }

  function Remove(uint i) OwnerOnly {
    delete Categories[i];
  }

  function Update(uint i, Category category) OwnerOnly {
    Categories[i] = category;
  }

}


// These enums are for descriptive reasons only and do not
// represent the actual values to be used in the uint32 member
// variables seen below since they are used as bitfields.
// enum DirectiveType { Consent, Delegate /* Delegate authority to consent on his/her behalf */ } // Not used ATM
// enum RecordTypeValues { Any, Specific, XRay, LabReports, Prescription }
// enum AccessTypeValues { Any, View, Modify, Order, Consult, AddNote, Diagnosis }
// enum WhyValues { Any, PrimaryCare, Diagnosis, Treatment, SpecificProcedures, Emergency, RecordCorrection, CaseManagement }

/*
uint32 public RecordType; // The record type
function SetRecordType(uint32 recordType) { RecordType = recordType; }

address public Record; // The record when RecordType is Specific. Null otherwise.
function SetRecord(address record) { Record = record; }

uint32 public AccessType; // The access type
function SetAccessType(uint32 accessType) { AccessType = accessType; }

uint32 public Why; // The why
function SetWhy(uint32 why) { Why = why; }

address[] public Origin; // Eastern Health, Hospital Specific, Clinic Specific... Empty array represents any
function AddOrigin(address origin) { Origin.push(origin); }
*/


