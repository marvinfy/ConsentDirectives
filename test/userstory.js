var Category = artifacts.require("./Category.sol");
var CategoryCatalog = artifacts.require("./CategoryCatalog.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");
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
      { "value": 0x00000080, "name": 'pull chart' },
      { "value": 0x00000100, "name": 'order' },
      { "value": 0x00000200, "name": 'view order' },
      { "value": 0x00000400, "name": 'submit order report' },
      { "value": 0x00000800, "name": 'diagnosis' },
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
      Categories.push({"instance": instance, "name": "View"});
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
      Categories.push({"instance": instance, "name": "Pull"});
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
      Categories.push({"instance": instance, "name": "Edit"});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("modify"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("add note"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return TheCatalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

    // Create a View Order category and add some consent data to it
    }).then(function() {
      return Category.new("View Order", {from: GetAccountAddress("Admin")});
    }).then(function(instance) {
      category = instance;
      Categories.push({"instance": instance, "name": "View Order"});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("view order"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("submit order report"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return TheCatalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

    // Create a Submit Order Report category and add some consent data to it
    }).then(function() {
      return Category.new("Submit Order Report", {from: GetAccountAddress("Admin")});
    }).then(function(instance) {
      category = instance;
      Categories.push({"instance": instance, "name": "Submit Order Report"});
    }).then(function() {
      return category.AddConsentData.sendTransaction(GetPermission("submit order report"), {from: GetAccountAddress("Admin")});
    }).then(function() {
      return TheCatalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});

    }).then(function() {
      return Category.new("Dummy", {from: GetAccountAddress("Admin")});
    }).then(function(category) {
      Categories.push({"instance": category, "name": "Dummy"});
      return TheCatalog.Add.sendTransaction(category.address, {from: GetAccountAddress("Admin")});


    // Retrive and store all categories
    }).then(function() {
      return TheCatalog.GetAll.call();
    }).then(function(instances) {
      assert.isTrue(instances.length == 6);

    // Validate the 'View Records' category
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
    var r = GetAccountAddress("R");

    // Initially R doesn't have consent, so ConsentsTo should fail
    ThePatient.ConsentsTo.call(r, GetCategoryAddress("Pull")).then(function(consents) {
      assert.isFalse(consents);

    // So ThePatient adds a consent directive to allow R to pull charts
    }).then(function() {
      return ConsentDirective.new(r, GetPermission("pull chart"));
    }).then(function(instance) {
      return ThePatient.AddConsentDirective.sendTransaction(instance.address, {from: GetAccountAddress("P")});

    // Request to Blockchain
    // Consent for user R to pull chart id?
    }).then(function() {
      return ThePatient.ConsentsTo.call(r, GetCategoryAddress("Pull"));
    }).then(function(consents) {
      assert.isTrue(consents);

    // But R should not be allowed to, for instance, View
    }).then(function() {
      return ThePatient.ConsentsTo.call(r, GetCategoryAddress("View"));
    }).then(function(consents) {
      assert.isFalse(consents);
      done();
    });
  });

  it("Scenario 2", function(done) {
    //
    // Consent for MD to access records?
    //
    var md = GetAccountAddress("MD");

    // MD will have permission to do anything, including 
    // consent on behalf of the patient...
    var permissions = 0;
    for (var i = 0; i < Permissions.length; i++) {
      permissions += Permissions[i].value;
    }

    // Add permissions...
    ConsentDirective.new(md, permissions).then(function(instance) {
      return ThePatient.AddConsentDirective.sendTransaction(instance.address, {from: GetAccountAddress("P")});

    // Request to Blockchain
    // Consent for MD to access records?
    }).then(function() {
      return ThePatient.ConsentsTo.call(md, GetCategoryAddress("View"));
    }).then(function(consents) {
      assert.isTrue(consents);
      done();
    });
  });

  it("Scenario 3", function(done) {
    //
    // Consent for MD to modify records?
    //
    var md = GetAccountAddress("MD");

    // Request to Blockchain
    // Consent for MD to access records?
    ThePatient.ConsentsTo.call(md, GetCategoryAddress("Edit")).then(function(consents) {
      assert.isTrue(consents);
      done();
    });
  });

  it("Scenario 4", function(done) {
    //
    // 1. Consent for MD to modify Electronic Health Record?
    // 2. Add consent for Technician to view req and submit report
    // 
    var md = GetAccountAddress("MD");
    var t = GetAccountAddress("T");

    // Request to Blockchain
    // Consent for MD to add to modify Electronic Health Record?
    ThePatient.ConsentsTo.call(md, GetCategoryAddress("Edit")).then(function(consents) {
      assert.isTrue(consents);

    // Add consent for Technician to view req and submit report?
    }).then(function() {
      var permissions = 
        GetPermission("view order") +
        GetPermission("submit order report");

      return ConsentDirective.new(t, permissions);
    }).then(function(instance) {
      return ThePatient.AddConsentDirective.sendTransaction(instance.address, {from: md});

    // Now we check if t has the required permissions
    }).then(function() {
      return ThePatient.ConsentsTo.call(t, GetCategoryAddress("View Order"));
    }).then(function(consents) {
      assert.isTrue(consents);
    }).then(function() {
      return ThePatient.ConsentsTo.call(t, GetCategoryAddress("Submit Order Report"));
    }).then(function(consents) {
      assert.isTrue(consents);

      done();
    });
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

  function GetCategoryAddress(name) {
    var instance = GetCategoryInstance(name);
    if (instance == 0) {
      return 0;
    }
    return instance.address;
  }

});
