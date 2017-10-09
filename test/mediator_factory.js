var MediatorFactory = artifacts.require("./MediatorFactory.sol");

contract('MediatorFactory', function(accounts) {

  it("should have no ConsentDirectives for any account", function(done) {
    MediatorFactory.deployed().then(function(factory) {
      for (var i = 0; i < accounts.size; i++)
      {
        factory.GetConsentDirectives({from: accounts[i]}).then(function(address) {
          assert.equal(address, "0x0000000000000000000000000000000000000000", "Instance found");
        });
      }
      done();
    });
  });

  it("should create only one ConsentDirectives instance per account", function(done) {
    var factory;
    var address;
    
    MediatorFactory.deployed().then(function(instance) {
      factory = instance;
      factory.CreateConsentDirectives();
    }).then(function() {
      return factory.GetConsentDirectives();
    }).then(function(result) {
      //console.log("Address - ", result);
      assert(result != "0x0000000000000000000000000000000000000000", "Instance not created");
      address = result;
      return factory.GetConsentDirectives();
    }).then(function(result) {
      //console.log("Address - ", result);
      assert(result == address, "Addresses differ");
      address = result;
      done();
    });
  });


});

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
