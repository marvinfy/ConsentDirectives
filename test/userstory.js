var Category = artifacts.require("./Category.sol");
var CategoryCatalog = artifacts.require("./CategoryCatalog.sol");
var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

contract('User Story', function(accounts) {
  var Actors;
  var Permissions;
  var Categories;

  var TheCatalog;
  var ThePatient;

  it("Static setup", function(done) {
    Actors = [
      { "address": accounts[0], "name": 'Admin' },
      { "address": accounts[1], "name": 'P' },
      { "address": accounts[2], "name": 'R' },
      { "address": accounts[3], "name": 'MD' },
      { "address": accounts[4], "name": 'R2' },
      { "address": accounts[5], "name": 'BSS' },
      { "address": accounts[6], "name": 'N' },
      { "address": accounts[7], "name": 'T' },
      { "address": accounts[8], "name": 'HIC' },
    ];

    Permissions = [
      { "value": 0x00000001, "name": 'delegate' },
      { "value": 0x00000010, "name": 'view' },
      { "value": 0x00000020, "name": 'modify' },
      { "value": 0x00000040, "name": 'add note' },
      { "value": 0x00000080, "name": 'pull chart' }
    ];

    Categories = [];

    done();
  });

  it("Category setup", function(done) {
    var category;

    // Get the CategoryCatalog instance
    CategoryCatalog.deployed().then(function(instance) {
      TheCatalog = instance;

    // Create a View Records category and add some consent data to it
    }).then(function() {
      return Category.new("View Records", {from: GetAccountAddress("Admin")});
    }).then(function(instance) {
      category = instance;      
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("view"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("modify"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("add note"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return TheCatalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

    // Create a Pull Charts category and add some consent data to it
    }).then(function() {
      return Category.new("Pull Charts", {from: GetAccountAddress("Admin")});
    }).then(function(instance) {
      category = instance;      
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("view"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("modify"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("add note"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("pull chart"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return TheCatalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

    // Create an Edit Records category and add some consent data to it
    }).then(function() {
      return Category.new("Edit Records", {from: GetAccountAddress("Admin")});
    }).then(function(instance) {
      category = instance;
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("modify"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("add note"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return TheCatalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

    // Retrive all categories
    }).then(function() {
      return TheCatalog.GetAll.call();
    }).then(function(instances) {
      assert.isTrue(instances.length == 3);
      Categories.push({"instance": Category.at(instances[0]), "name": "View"});
      Categories.push({"instance": Category.at(instances[1]), "name": "Pull"});
      Categories.push({"instance": Category.at(instances[2]), "name": "Edit"});

    }).then(function() {
      category = GetCategoryInstance("View");
      return category.Name.call();
    }).then(function(name) {
      assert(name == "View Records");
      return category.GetConsentDataCount.call();
    }).then(function(count) {
      assert.isTrue(count == 3);
      category.GetConsentData.call(0).then(function(data) {
        assert(data.toNumber() == GetPermission("view"));
        category.GetConsentData.call(1).then(function(data) {
          assert(data.toNumber() == GetPermission("modify"));
          category.GetConsentData.call(2).then(function(data) {
            assert.isTrue(data.toNumber() == GetPermission("add note"));
            done();
          });
        });
      });
    });
  });

  it("Patient setup", function(done) {
    var patientFactory;
    var patientAccount = GetAccountAddress("P");

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.MakePatient.sendTransaction({from: patientAccount});
    }).then(function() {
      return patientFactory.GetPatient.call({from: patientAccount});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(instance) {
      ThePatient = instance;
      return ThePatient.GetOwner.call();
    }).then(function(address) {
      assert.equal(address, patientAccount);
      done();
    });
  });

  it("Scenario 1", function(done) {
    //
    // Consent for user R to pull chart id?
    //

    var rAccount = GetAccountAddress("R");

    //patient.ConsentsTo.call(accounts[1], catView.address);

    

    // Pre-requisites
    // 1. MD can delegate consent (P)
    // 2. R can view clinical records (MD)
    
    /*
      var catalog;
      var catViewRecords;
      var catEditRecords;
  
      var categories;
       var category;*/
  
    done();
  }); 

  //
  // Util functions
  //
  function GetAccountAddress(actor) {
    for (var i = 0; i < Actors.length - 1; i++) {
      if (Actors[i].name == actor) {
        return Actors[i].address;
      }
    }
    return "0x0000000000000000000000000000000000000000";
  }

  function GetPermission(name) {
    for (var i = 0; i < Permissions.length - 1; i++) {
      if (Permissions[i].name == name) {
        return Permissions[i].value;
      }
    }
    return 0;
  }

  function GetCategoryInstance(name) {
    for (var i = 0; i < Categories.length - 1; i++) {
      if (Categories[i].name == name) {
        return Categories[i].instance;
      }
    }
    return 0;
  }

});
