var MediatorFactory = artifacts.require("./MediatorFactory.sol");

contract('MediatorFactory', function(accounts) {

  it("should have matching accounts", function(done) {
    var factory;
    MediatorFactory.deployed().then(function(instance) {
      factory = instance;
      return factory.GetCurrentAccount.call();
    }).then(function(result) {
      assert.equal(result, accounts[0], "Account address doesn't match");
      done();
    });
  });

  it("should have no ConsentDirectives instance", function(done) {
    var factory;
    MediatorFactory.deployed().then(function(instance) {
      factory = instance;
      return factory.GetConsentDirectives.call();
    }).then(function(result) {
      assert.equal(result, "0x0000000000000000000000000000000000000000", "Instance found");
      done();
    });
  });



});
