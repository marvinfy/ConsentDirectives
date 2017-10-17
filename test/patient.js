var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");
var ConsentDirective = artifacts.require("./ConsentDirective.sol");

var DirectiveType = {
  Consent: 0,
  Delegate: 1
};

contract('Patient', function(accounts) {

  assert(accounts.length >= 4, "Not enough accounts available for testing");

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
      return ConsentDirective.new(doctor_account, true);
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
      return cd2.DelegateAuthority.call();
    }).then(function(delegateAuthority) {
      assert(delegateAuthority == true);
      done();
    });
  });

  it("should only allow owner and delegate to add an instance of ConsentDirective", function(done) {
    var patientFactory;
    var patient;

    var patient_account = accounts[0]; // The patient

    var doctor_account = accounts[1]; // Patient's family doctor (and delegate)
    var doctor_cd;

    var doctor2_account = accounts[2]; // Another doctor (not delegate)
    var doctor2_cd;

    var other_account = accounts[3]; // Another unrelated account

    var event;
    var count = 0;

    PatientFactory.deployed().then(function(instance) {
      patientFactory = instance;
      return patientFactory.GetPatient.call({from: patient_account});
    }).then(function(address) {
      patient = Patient.at(address);
      return patient.DeleteAllConsentDirectives.sendTransaction({from: patient_account});
    }).then(function() {
      return ConsentDirective.new(doctor_account, true);
    }).then(function(cd) {
      doctor_cd = cd;
    }).then(function() {
      return ConsentDirective.new(doctor2_account, false);
    }).then(function(cd) {
      doctor2_cd = cd;
    }).then(function() {

      event = patient.ConsentDirectiveAdded();
      event.watch(function(error, result){
        if (!error) {
          //console.log(result.args);

          count++;
          if (count == 1) {
            patient.AddConsentDirective.sendTransaction(doctor_cd.address, {from: patient_account});
          } else if (count == 2) {
            patient.AddConsentDirective.sendTransaction(doctor2_cd.address, {from: doctor_account});
          } else if (count == 3) {
            event.stopWatching();
            done();
          }
        }
      });

    }).then(function() {
      return patient.AddConsentDirective.sendTransaction(doctor2_cd.address, {from: doctor_account});
    }).then(function() {
      //done();
    });
  });

});
