var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");

var DirectiveType = {
  Consent: 0,
  Delegate: 1
};

contract('Patient', function(accounts) {

  assert(accounts.length >= 4, "Not enough accounts available for testing");

  it("should have no consent directives after instantiation", function(done) {
    var patientFactory;
    var patient;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.DeletePatient.sendTransaction({from: account});
    }).then(function() {
      patientFactory.MakePatient.sendTransaction({from: account});
    }).then(function() {
      return patientFactory.GetPatientAddress.call({from: account});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(instance) {
      patient = instance;
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count.toNumber() == 0);
      done();
    });
  });


  it("should allow Patient to add an instance of ConsentDirective", function(done) {
    var patientFactory;
    var patient_account = accounts[1];
    var patient;

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.MakePatient.sendTransaction({from: patient_account});
    }).then(function() {
      return patientFactory.GetPatientAddress.call({from: patient_account});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(instance) {
      patient = instance;
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count.toNumber() == 0);
      done();
    });
  });
});