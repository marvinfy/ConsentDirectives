var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

contract('PatientFactory', function(accounts) {

  it("should create with the right account address", function(done) {
    var patientFactory;
    var patient;

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.Create({from:accounts[0]});
    }).then(function() {
      // .call() executes locally (no transaction gets created)
      return patientFactory.GetAddress.call({from: accounts[0]});
    }).then(function(address) {
      patient = Patient.at(address);
      return patient.GetOwner.call();
    }).then(function(address) {
      assert.equal(address, accounts[0]);
      done();
    });
  });

  it("should delete and leave no traces", function(done) {
    var patientFactory;
    var patient;
    var null_address = "0x0000000000000000000000000000000000000000";

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.Delete({from:accounts[0]});
    }).then(function() {
      return patientFactory.GetAddress.call({from: accounts[0]});
    }).then(function(address) {
      assert.equal(address, null_address);
      done();
    });
  });

});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
