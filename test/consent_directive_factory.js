var ConsentDirectiveFactory = artifacts.require("./ConsentDirectiveFactory.sol");

contract('ConsentDirectiveFactory', function(accounts) {

  it("should have number initialized to 0", function(done) {
    var factory;
    ConsentDirectiveFactory.deployed().then(function(instance) {
      factory = instance;
      return factory.Get.call();
    }).then(function(result) {
      assert.equal(result.valueOf(), 0, "Number not initialized to 0!");
      done();
    });
  });

  it("should have number = 10 after adding 10", function(done) {
    var factory;
    ConsentDirectiveFactory.deployed().then(function(instance) {
      factory = instance;
      factory.Add(10);
      return factory.Get.call();
    }).then(function(result) {
      assert.equal(result.valueOf(), 10, "Return is not 10!");
      done();
    });
  });



});
