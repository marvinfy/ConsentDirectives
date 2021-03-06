var Category = artifacts.require("./Category.sol");
var CategoryCatalog = artifacts.require("./CategoryCatalog.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");
var Patient = artifacts.require("./Patient.sol");
var PatientFactory = artifacts.require("./PatientFactory.sol");

var ToBinary = function(num){
  return parseInt(num, 10).toString(2);
}

contract('Patient', function(accounts) {

  assert(accounts.length >= 4, "Not enough accounts available for testing");

  it("should add some categories", function(done) {
    var catalog;
    var catViewRecords;
    var catEditRecords;

    var categories;
    var category;

    var view     = 0xFFFF0010;
    var modify   = 0xFFFF0020;
    var add_note = 0xFFFF0040;

    CategoryCatalog.deployed().then(function(instance) {
      catalog = instance;

    }).then(function() {
      // Create a View Records category and add some consent data to it
      return Category.new("View Records", {from: accounts[0]});
    }).then(function(instance) {
      catViewRecords = instance;      
    }).then(function() {
      return catViewRecords.AddConsentData.sendTransaction(view, {from: accounts[0]});
    }).then(function() {
      return catViewRecords.AddConsentData.sendTransaction(modify, {from: accounts[0]});
    }).then(function() {
      return catViewRecords.AddConsentData.sendTransaction(add_note, {from: accounts[0]});
    }).then(function() {
      return catalog.Add.sendTransaction(catViewRecords.address, {from: accounts[0]});

    }).then(function() {
      // Create an Edit Records category and add some consent data to it
      return Category.new("Edit Records", {from: accounts[0]});
    }).then(function(instance) {
      catEditRecords = instance;
    }).then(function() {
      return catEditRecords.AddConsentData.sendTransaction(modify, {from: accounts[0]});
    }).then(function() {
      return catEditRecords.AddConsentData.sendTransaction(add_note, {from: accounts[0]});
    }).then(function() {
      return catalog.Add.sendTransaction(catEditRecords.address, {from: accounts[0]});

    }).then(function() {
      // Retrive all (2) categories
      return catalog.GetAll.call();
    }).then(function(instances) {
      categories = instances;
      assert.isTrue(categories.length == 2);

    }).then(function() {
      // Check View Records category
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
        assert(data.toNumber() == view);
        category.GetConsentData.call(1).then(function(data) {
          assert(data.toNumber() == modify);
          category.GetConsentData.call(2).then(function(data) {
            assert.isTrue(data.toNumber() == add_note);
            done();
          });
        });
      });
    });
  });

  it("should have no consent directives after instantiation", function(done) {
    var patientFactory;
    var patient;
    var account = accounts[0];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      patientFactory.DeletePatient.sendTransaction({from: account});
    }).then(function() {
      patientFactory.MakePatient.sendTransaction({from: account});
    }).then(function() {
      return patientFactory.GetPatient.call({from: account});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(instance) {
      patient = instance;
      return patient.GetConsentDirectives.call();
    }).then(function(addresses) {
      assert(addresses.length == 0);
      done();
    });
  });

  it("should allow owner to add an instance of ConsentDirective", function(done) {
    var patientFactory;
    var patient;
    var cd1, cd2;
    var patient_account = accounts[0];
    var doctor_account = accounts[1];

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      return patientFactory.GetPatient.call({from: patient_account});
    }).then(function(address) {
      patient = Patient.at(address);
      return ConsentDirective.new(doctor_account, 0x1);
    }).then(function(instance) {
      cd1 = instance;
      return patient.AddConsentDirective.sendTransaction(cd1.address, {from: patient_account});
    }).then(function() {
      return patient.GetConsentDirectives.call();
    }).then(function(addresses) {
      assert(addresses.length == 1);
      cd2 = ConsentDirective.at(addresses[0]);
      assert(cd1.address == cd2.address);
      return cd2.Who.call();
    }).then(function(address) {
      assert(address == doctor_account);
      return cd2.HasDelegateAuthority.call();
    }).then(function(hasDelegateAuthority) {
      assert(hasDelegateAuthority);
      done();
    });
  });

  it("should respect the existing categories", function(done) {
    var catalog;
    var cats;
    var catView;
    var catEdit;

    var patientFactory;
    var patient; // accounts[0]
    var cd_doc1; // accounts[1]
    var cd_doc2; // accounts[2]
    var cd_doc3; // accounts[3]
  
    CategoryCatalog.deployed().then(function(instance) {
      catalog = instance;
      return catalog.GetAll.call();
    }).then(function(instances) {
      cats = instances;
      assert.isTrue(cats.length == 2);
    }).then(function() {
      return Category.at(cats[0]);
    }).then(function(instance) {
      catView = instance;
    }).then(function() {
      return Category.at(cats[1]);
    }).then(function(instance) {
      catEdit = instance;
    });

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      return patientFactory.GetPatient.call({from: accounts[0]});
    }).then(function(address) {
      return Patient.at(address);
    }).then(function(instance) {
      patient = instance;
      return patient.RemoveAllConsentDirectives.sendTransaction();
    }).then(function() {
      return patient.GetConsentDirectives.call();
    }).then(function(addresses) {
      assert(addresses.length == 0);

      // Doc1 -- 0xFFFF00010 (view)
      return ConsentDirective.new(accounts[1], 0xFFFF0010);
    }).then(function(instance) {
      cd_doc1 = instance;
      return cd_doc1.HasDelegateAuthority.call();
    }).then(function(delegateAuthority) {
      assert.isFalse(delegateAuthority);
      return patient.AddConsentDirective.sendTransaction(cd_doc1.address, {from: accounts[0]});
    }).then(function() {
      return patient.ConsentsTo.call(accounts[1], catView.address);
    }).then(function(consents) {
      assert.isTrue(consents);
    }).then(function() {
      return patient.ConsentsTo.call(accounts[1], catEdit.address);
    }).then(function(consents) {
      assert.isFalse(consents);
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count == 1);
      return patient.AddConsentDirective.sendTransaction(cd_doc1.address, {from: accounts[1]});
    }).then(function() {
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count == 1);

      // Doc2 -- 0xFFFF0071 (delegate + all permissions)
      return ConsentDirective.new(accounts[2], 0xFFFF0071);
    }).then(function(instance) {
      cd_doc2 = instance;
      return cd_doc2.HasDelegateAuthority.call();
    }).then(function(delegateAuthority) {
      assert.isTrue(delegateAuthority);
      return patient.AddConsentDirective.sendTransaction(cd_doc2.address, {from: accounts[0]});
    }).then(function() {
      return patient.ConsentsTo.call(accounts[2], catView.address);
    }).then(function(consents) {
      assert.isTrue(consents);
    }).then(function() {
      return patient.ConsentsTo.call(accounts[2], catEdit.address);
    }).then(function(consents) {
      assert.isTrue(consents);
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count == 2);

      // Doc3 -- 0xFFFF0040 (add note)
      return ConsentDirective.new(accounts[3], 0xFFFF0040);
    }).then(function(instance) {
      cd_doc3 = instance;
      return cd_doc3.HasDelegateAuthority.call();
    }).then(function(delegateAuthority) {
      assert.isFalse(delegateAuthority);
      
      // Add from Doc2 since they have delegation powers
      return patient.AddConsentDirective.sendTransaction(cd_doc3.address, {from: accounts[2]});
    }).then(function() {
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count == 3);
      return patient.ConsentsTo.call(accounts[3], catView.address);
    }).then(function(consents) {
      assert.isTrue(consents);
    }).then(function() {
      return patient.ConsentsTo.call(accounts[3], catEdit.address);
    }).then(function(consents) {
      assert.isTrue(consents);

      done();
    });
  });
  
});


/*
var event;
var count = 0;

event = patient.ConsentDirectiveAdded();
event.watch(function(error, result){
  if (error) {
    return;
  }

  count++;
  if (count == 1) {
    console.log(result.args);
    patient.AddConsentDirective.sendTransaction(doctor_cd.address, {from: patient_account});
  } else if (count == 2) {
    console.log(result.args);
    patient.AddConsentDirective.sendTransaction(doctor2_cd.address, {from: doctor_account});
  } else if (count == 3) {
    console.log(result.args);
    event.stopWatching();
    done();
  }

});
*/
