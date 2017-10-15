var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

contract('PatientFactory', function(accounts) {

  it("should create Patient instances with the right owner address", function(done) {
    var patientFactory;
    var patient;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.Create({from:account});
    }).then(function() {
      // .call() executes locally (no transaction gets created)
      return patientFactory.GetAddress.call({from: account});
    }).then(function(address) {
      patient = Patient.at(address);
      return patient.GetOwnerAddress.call();
    }).then(function(address) {
      assert.equal(address, account);
      done();
    });
  });

  it("should delete Patient instances", function(done) {
    var patientFactory;
    var patient;
    var account = accounts[0];
    var null_address = "0x0000000000000000000000000000000000000000";

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.Delete({from:account});
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
