var Category = artifacts.require("./Category.sol");
var CategoryCatalog = artifacts.require("./CategoryCatalog.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");
var Patient = artifacts.require("./Patient.sol");
var PatientFactory = artifacts.require("./PatientFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Category);

  deployer.link(Category, CategoryCatalog);
  deployer.deploy(CategoryCatalog);
 
  deployer.deploy(ConsentDirective);
 
  deployer.link(Category, Patient);
  deployer.link(ConsentDirective, Patient);
  deployer.deploy(Patient);

  deployer.link(Patient, PatientFactory);
  deployer.deploy(PatientFactory);
};
