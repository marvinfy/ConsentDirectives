var Category = artifacts.require("./Category.sol");
var CategoryCatalog = artifacts.require("./CategoryCatalog.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");
var Patient = artifacts.require("./Patient.sol");
var PatientFactory = artifacts.require("./PatientFactory.sol");

contract('Patient', function(accounts) {

  assert(accounts.length >= 4, "Not enough accounts available for testing");

  it("should add some categories", function(done) {
    var catalog;
    var catViewRecords;
    var catEditRecords;

    var categories;
    var category;

    var view     = 0x10;
    var modify   = 0x20;
    var add_note = 0x40;

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

      // Doc1 -- 0x0010 16d (view)
      return ConsentDirective.new(accounts[1], 0x10);
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


      // Doc2 -- 0xFFF1 (delegate + all permissions)
      return ConsentDirective.new(accounts[2], 0x71);
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
      return patient.AddConsentDirective.sendTransaction(cd_doc2.address, {from: accounts[2]});
    }).then(function() {
      return patient.GetConsentDirectiveCount.call();
    }).then(function(count) {
      assert(count == 3);

      // Doc3 -- 0x0040 (add note)



      done();
    });
  });
  
});

var ToBinary = function(num){
  return parseInt(num, 10).toString(2);
}







  /*
  it("should only allow owner and delegate to add an instance of ConsentDirective", function(done) {
    var patientFactory;
    var patient;

    var patient_account = accounts[0]; // The patient

    var doctor_account = accounts[1]; // Patient's family doctor (and delegate)
    var doctor_cd;

    var doctor2_account = accounts[2]; // Another doctor (not delegate)
    var doctor2_cd;

    var another_account = accounts[3]; // Another unrelated account
    var another_cd;

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      return patientFactory.GetPatient.call({from: patient_account});
    }).then(function(address) {
      patient = Patient.at(address);
      patient.RemoveAllConsentDirectives.sendTransaction({from: patient_account});

    // Create CD for doctor_account with (true) delegation power
    }).then(function() {
      return ConsentDirective.new(doctor_account, true, 0);
    }).then(function(cd) {
      doctor_cd = cd;

    // Create CD for doctor2_account without (false) delegation power
    }).then(function() {
      return ConsentDirective.new(doctor2_account, false, 0);
    }).then(function(cd) {
      doctor2_cd = cd;

    // Create CD for another_acount without (false) delegation power
    }).then(function() {
      return ConsentDirective.new(another_account, false, 0);
    }).then(function(cd) {
      another_cd = cd;

    // 1)
    // Trying and adding doctor2_cd from doctor_account: should fail
    }).then(function() {
      patient.AddConsentDirective.sendTransaction(doctor2_cd.address, {from: doctor_account});
    }).then(function() {
      return patient.ConsentsTo.call(doctor2_cd.address, {from: another_account});
    }).then(function(result) {
      assert.isFalse(result);

    // 2)
    // Add CD for doctor_account from patient_account: should succeed
    }).then(function() {
      patient.AddConsentDirective.sendTransaction(doctor_cd.address, {from: patient_account});
    }).then(function() {
      return patient.ConsentsTo.call(doctor_cd.address, {from: another_account});
    }).then(function(result) {
      assert.isTrue(result);

    // 3)
    // Retry 1: should succeed
    }).then(function() {
      patient.AddConsentDirective.sendTransaction(doctor2_cd.address, {from: doctor_account});
    }).then(function() {
      return patient.ConsentsTo.call(doctor2_cd.address, {from: another_account});
    }).then(function(result) {
      assert.isTrue(result);

    // 4)
    // Trying and adding another_cd from doctor2_account: should fail since doctor2_account has no delegation power
    }).then(function() {
      patient.AddConsentDirective.sendTransaction(another_cd.address, {from: doctor2_account});
    }).then(function() {
      return patient.ConsentsTo.call(another_cd.address, {from: another_account});
    }).then(function(result) {
      assert.isFalse(result);

    }).then(function(result) {
      done();
    });

  });
  */
  


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

});*/

//patient.AddConsentDirective.sendTransaction(doctor2_cd.address, {from: doctor_account});