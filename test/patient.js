var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");

var DirectiveType = {
  Consent: 0,
  Delegate: 1
};

contract('Patient', function(accounts) {

  assert(accounts.length >= 4, "Not enough accounts available for testing");

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
      return patient.GetOwnerAddress.call();
    }).then(function(address) {
      assert(address == patient_account);
      return patient.GetNum2.call();
    }).then(function(num) {
      console.log(num.toNumber());
      done();
    });
  });
});