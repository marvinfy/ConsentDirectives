var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

var null_address = "0x0000000000000000000000000000000000000000";

contract('PatientFactory', function(accounts) {

  it("should create a Patient instance with the right owner address", function(done) {
    var patientFactory;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.MakePatient({from: account});
    }).then(function() {
      // .call() executes locally (no transaction gets created)
      return patientFactory.GetPatientAddress.call({from: account});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(patient) {
      return patient.GetOwnerAddress.call();
    }).then(function(address) {
      assert.equal(address, account);
      done();
    });
  });

  it("should not create two Patient instances upon calling MakeInstance twice", function(done) {
    var patientFactory;
    var patientAddress1;
    var patientAddress2;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      return patientFactory.GetPatientAddress.call({from: account});
    }).then(function(address) {
      patientAddress1 = address;
      patientFactory.MakePatient({from: account});
    }).then(function() {
      return patientFactory.GetPatientAddress.call({from: account});
    }).then(function(address) {
      patientAddress2 = address;
      return Patient.at(address);
    }).then(function(patient) {
      return patient.GetOwnerAddress.call();
    }).then(function(address) {
      assert(address == account);
      assert(patientAddress1 != null_address);
      assert(patientAddress1 == patientAddress2);
      done();
    });
  });

  it("should correctly delete the previously created Patient instance", function(done) {
    var patientFactory;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      return patientFactory.GetPatientAddress.call({from: account});
    }).then(function(address) {
      assert(address != null_address);
      return Patient.at(address);
    }).then(function(patient) {
      return patient.GetOwnerAddress.call();
    }).then(function(address) {
      assert.equal(address, account);
      patientFactory.DeletePatient({from: account});
    }).then(function() {
      return patientFactory.GetPatientAddress.call({from: account});
    }).then(function(address) {
      assert.equal(address, null_address);
      done();
    });
  });

});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
