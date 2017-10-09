var PatientFactory = artifacts.require("./PatientFactory.sol");
var no_address = "0x0000000000000000000000000000000000000000";

contract('PatientFactory', function(accounts) {

  it("should have no Patient instances for any account", function(done) {
    PatientFactory.deployed().then(function(factory) {
      for (var i = 0; i < accounts.size; i++)
      {
        factory.GetPatient({from: accounts[i]}).then(function(address) {
          assert.equal(address, no_address, "Instance found");
        });
      }
      done();
    });
  });

  it("should create only one Patient instance per account", function(done) {
    var factory;
    var address;
    
    PatientFactory.deployed().then(function(instance) {
      factory = instance;
      factory.CreatePatient();
    }).then(function() {
      return factory.GetPatient();
    }).then(function(result) {
      //console.log("Address - ", result);
      assert(result != no_address, "Instance not created");
      address = result;
      return factory.GetPatient();
    }).then(function(result) {
      //console.log("Address - ", result);
      assert(result == address, "Addresses differ");
      address = result;
      done();
    });
  });

  it("should have no Patient after deletion", function(done) {
    var factory;

    PatientFactory.deployed().then(function(instance) {
      factory = instance;
      factory.DeletePatient();
    }).then(function() {
      return factory.GetPatient();
    }).then(function(result) {
      assert.equal(result, no_address, "Instance is not null");
      done();
    })
  });

});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
