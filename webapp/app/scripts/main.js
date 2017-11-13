/*
 * Main entry point (init)
 */ 
function Init() {
    // web3 object
    if (typeof web3 !== 'undefined')
    {
        window.web3 = new Web3(web3.currentProvider);
    } 
    else 
    {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    // Patient contract
    var patientFactoryMetadata = LoadContractMetadata('/contracts/PatientFactory.json');
    var patientFactoryContract = web3.eth.contract(patientFactoryMetadata.abi);
    var patientFactoryAddress = GetContractAddress(patientFactoryMetadata);
    patientFactoryContract.at(patientFactoryAddress, function(error, instance) {
        if (error) {
            alert('Unable to load PatientFactory@' + patientFactoryAddress);
        } else {
            window.PatientFactory = instance;
        }
    });

    // CategoryCatalog contract
    var categoryCatalogMetadata = LoadContractMetadata('/contracts/CategoryCatalog.json');
    var categoryCatalogContract = web3.eth.contract(categoryCatalogMetadata.abi);
    var categoryCatalogAddress = GetContractAddress(categoryCatalogMetadata);

    categoryCatalogContract.at(categoryCatalogAddress, function(error, instance) {
        if (error) {
            alert('Unable to load CategoryCatalog@' + categoryCatalogAddress);
        } else {
            window.CategoryCatalog = instance;
        }
    });

    window.Accounts = {
        "accounts": [
          { "address": '0x82372670115c971de24e74e3ddc2bda313035845', "name": 'Admin' },
          { "address": '0xadaa44f921bebafeb1150d1a915f19e2fb871811', "name": 'Patient' },
        ]
    };

    $(document).attr("title", GetAccountName() + " Actor");
    $("#accountName").text(GetAccountName());
    $("#accountAddress").text(GetAccountAddress());
}

window.addEventListener('load', function() {
    //Init();
});

/*
 * Util functions
 */
function LoadContractMetadata(path) {
    var contract;

    jQuery.ajax({
        url: path,
        success: function(result) { 
            contract = result; 
        },
        async: false
    });

    return contract;
}

function GetContractAddress(contract) {
    return contract.networks[Object.keys(contract.networks)[0]].address;
}

function GetAccountName() {
    if (web3.eth.accounts.length != 1) {
        return "unknown";
    }

    for (var i = 0; i < Accounts.accounts.length; i++) {
        if (Accounts.accounts[i].address == web3.eth.accounts[0]) {
            return Accounts.accounts[i].name;
        }
    }
}

function GetAccountAddress() {
    if (web3.eth.accounts.length != 1) {
        return "unknown";
    }
    return web3.eth.accounts[0];
}

/*
 * Patient functions
 */
function InitPatient() {
    PatientFactory.GetPatient.call(function(error, result) {
        if (error) {
            alert('GetPatient call failed');
        } else {
            $("#patientAddress").text(result.substring(0,7) + '...');
            if (Number(result) == 0) { 
                $("#createButton").attr('class', '');
                $("#destroyButton").attr('class', 'disabled');
            } else {   
                $("#createButton").attr('class', 'disabled');
                $("#destroyButton").attr('class', '');
            }
        }
    });
}

function CreatePatient() {
    PatientFactory.MakePatient(function(error, result) {
        if (error) {
            alert('MakePatient transaction failed');
        } else {
            location.reload();
        }
    });
}

function DestroyPatient() {
    PatientFactory.DeletePatient(function(error, result) {
        if (error) {
            alert('Delete transaction failed');
        } else {
            location.reload();
        }
    });
}
