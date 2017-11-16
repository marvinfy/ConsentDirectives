var PatientFactory = artifacts.require("./PatientFactory.sol");
var Patient = artifacts.require("./Patient.sol");

var Actors = [
    { "address": '0x82372670115c971de24e74e3ddc2bda313035845', "name": 'Admin' },
    { "address": '0xadaa44f921bebafeb1150d1a915f19e2fb871811', "name": 'P' },
    { "address": '0x7069faff133af5180d415a7d12434aade4ea9ce6', "name": 'R' },
    { "address": '0xe1c60880d21066ed56c333671055168327bc3327', "name": 'MD' },
    { "address": '0x6cf5c2553dc61467f17df1ef8fa91a56228832cf', "name": 'R2' },
    { "address": '0x81f69cda59270603f2c857a1a87fd4464f05c073', "name": 'BSS' },
    { "address": '0x7714ca612ac855ef9cbf135b71f3d00673f23fff', "name": 'N' },
    { "address": '0x89b8e3dc2c9bf85712aba5e05dde0c53c09ec314', "name": 'T' },
    { "address": '0x15e70fa91eac37e06b095d8fa32071771b3758f4', "name": 'HIC' },
    { "address": '0x0000000000000000000000000000000000000000', "name": '__unknown__' },
];

function GetAccountAddress(actor) {
  var length = Actors.length;

  for (var i = 0; i < length - 1; i++) {
    if (Actors[i].name == actor) {
      return Actors[i].address;
    }
  }

  return Actors[length - 1].address;
}


contract('All (User Story)', function(accounts) {
  it("should return correct account addresses", function(done) {
    var address;
    
    address = GetAccountAddress("Admin");
    assert(address == Actors[0].address);

    address = GetAccountAddress("P");
    assert(address == Actors[1].address);

    address = GetAccountAddress("HIC");
    assert(address == Actors[8].address);

    address = GetAccountAddress("BlaBlaBla");
    assert(address == Actors[9].address);

    done();
  });
});
