var ConsentDirective = artifacts.require("./ConsentDirective.sol");
var Patient = artifacts.require("./Patient.sol");
var PatientFactory = artifacts.require("./PatientFactory.sol");
var Category = artifacts.require("./Category.sol");
var CategoryCatalog = artifacts.require("./CategoryCatalog.sol");

module.exports = function(deployer) {
  deployer.deploy(Category);
  
  deployer.deploy(ConsentDirective);
 
  deployer.link(ConsentDirective, Patient);
  deployer.link(Category, Patient);
  deployer.deploy(Patient);

  deployer.link(Patient, PatientFactory);
  deployer.deploy(PatientFactory);

  deployer.link(Category, CategoryCatalog);
  deployer.deploy(CategoryCatalog);
};
