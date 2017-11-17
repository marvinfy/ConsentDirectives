var Category = artifacts.require("./Category.sol");
var CategoryCatalog = artifacts.require("./CategoryCatalog.sol");
var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

contract('User Story', function(accounts) {
  var Actors;
  var Permissions;

  var Catalog;

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

  it("Setup", function(done) {
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

    // Catalog
    var category;

    CategoryCatalog.deployed().then(function(instance) {
      Catalog = instance;

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
      return Catalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

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
      return Catalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

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
      return Catalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

    // Retrive all categories
    }).then(function() {
      return Catalog.GetAll.call();
    }).then(function(instances) {
      categories = instances;
      assert.isTrue(categories.length == 3);

    // Check View Records category
    }).then(function() {
      return Category.at(categories[0]);
    }).then(function(instance) {
      category = instance;
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

  it("Scenario 1", function(done) {
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
    
});
