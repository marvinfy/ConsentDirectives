var ConsentDirectives = artifacts.require("./ConsentDirectives.sol");
var ConsentDirectiveFactory = artifacts.require("./ConsentDirectiveFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ConsentDirectives);
  deployer.link(ConsentDirectives, ConsentDirectiveFactory);
  deployer.deploy(ConsentDirectiveFactory);
};
