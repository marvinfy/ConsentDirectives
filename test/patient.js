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
      return patientFactory.GetPatient.call({from: account});
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
    var patient;
    var directive1, directive2;
    var patient_account = accounts[0];
    var doctor_account = accounts[1];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.MakePatient.sendTransaction({from: patient_account});
    }).then(function() {
      return patientFactory.GetPatient.call({from: patient_account});
    }).then(function(address) {
      patient = Patient.at(address);
      return ConsentDirective.new(doctor_account, 0);
    }).then(function(instance) {
      directive1 = instance;
      return patient.AddConsentDirective.sendTransaction(directive1.address, {from: patient_account});
    }).then(function() {
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count >= 1);
      return patient.GetConsentDirectiveAt.call(0);
    }).then(function(address) {
      directive2 = ConsentDirective.at(address);
      assert(directive1.address == directive2.address);
      return directive2.GetWho.call();
    }).then(function(address) {
      assert(address == doctor_account);
      done();
    });
  });
});