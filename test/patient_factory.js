var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

contract('PatientFactory', function(accounts) {

  it("should create a Patient instance with the right owner address", function(done) {
    var patientFactory;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.Create({from: account});
    }).then(function() {
      // .call() executes locally (no transaction gets created)
      return patientFactory.GetAddress.call({from: account});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(patient) {
      return patient.GetOwnerAddress.call();
    }).then(function(address) {
      assert.equal(address, account);
      done();
    });
  });

  it("should not create two instances upon calling Create twice", function(done) {
    var patientFactory;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      done();
    });
  });

  it("should correctly delete the previously created Patient instance", function(done) {
    var patientFactory;
    var patient;
    var account = accounts[0];
    var null_address = "0x0000000000000000000000000000000000000000";

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      return patientFactory.GetAddress.call({from: account});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(patient) {
      return patient.GetOwnerAddress.call();
    }).then(function(address) {
      assert.equal(address, account);
      patientFactory.Delete({from: account});
    }).then(function() {
      return patientFactory.GetAddress.call({from: account});
    }).then(function(address) {
      assert.equal(address, null_address);
      done();
    });
  });

});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
