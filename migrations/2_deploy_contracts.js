var ConsentDirective = artifacts.require("./ConsentDirective.sol");
var Patient = artifacts.require("./Patient.sol");
var PatientFactory = artifacts.require("./PatientFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ConsentDirective);

  deployer.link(ConsentDirective, Patient);
  deployer.deploy(Patient);

  deployer.link(Patient, PatientFactory);
  deployer.deploy(PatientFactory);
};
