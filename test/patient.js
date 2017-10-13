var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

var no_address = "0x0000000000000000000000000000000000000000";

contract('PatientFactory', function(accounts) {
  var factory;
  var patient1; // associated with account[0]
  var patient2; // associated with account[1]
  var dr1 = accounts[2];
  var dr2 = accounts[3];

  it("should create account for patient 1", function(done) {

    assert(accounts.length >= 2, "Not enough accounts available");

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
    done();
  });
});