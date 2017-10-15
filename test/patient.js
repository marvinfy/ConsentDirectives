var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");

contract('Patient', function(accounts) {

  assert(accounts.length >= 2, "Not enough accounts available for testing");

  var factory;
  var patient = accounts[0];
  var doctor = accounts[1];

  it("should allow Patient to create instances of ConsentDirective for their doctor", function(done) {
    PatientFactory.deployed().then(function(instance) {
      factory = instance;
      done();
    });
    

    /*
    PatientFactory.deployed().then(function(instance) {
      factory = instance;
      factory.CreatePatient({from: accounts[0]}).then(function(patient_address) {
        console.log(patient_address);
        
        //var patient = Patient.at(patient_address);
        //patient.GetOwner().then(function(owner_address) {
        //  console.log(owner_address, '---', accounts[0]);
        //  done();
        //});

      });
    });*/
    
    /*.then(function(address) {
//      return factory.GetPatient.call();
//    }).then(function(address) {
      console.log(address);
      return Patient.at(address);

    }).then(function(patient) {
      patient1 = patient;
      return patient1.GetOwner();
    }).then(function(owner) {
      console.log(owner, '---', accounts[0]);
      done();
    });*/
    

    /*
      
      assert(accounts.length >= 2, "Not enough accounts available");



      factory.CreatePatient({from: accounts[0]}).then(function() {
        patient1 = Patient.at(address);
        patient1.GetOwner.call().then(function(account) {
          console.log(account, '---', accounts[0]);
          assert.equal(account, accounts[0], "Addresses do not match");
          done();
        });
      });


      done();


    });*/
  });
});