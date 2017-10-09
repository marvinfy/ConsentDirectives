var ConsentDirectives = artifacts.require("./ConsentDirectives.sol");
var MediatorFactory = artifacts.require("./MediatorFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ConsentDirectives);
  deployer.link(ConsentDirectives, MediatorFactory);
  deployer.deploy(MediatorFactory);
};
