
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

function Init() {
    if (typeof web3 !== 'undefined')
    {
        window.web3 = new Web3(web3.currentProvider);
    } 
    else 
    {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
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
}

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

window.addEventListener('load', function() {
    //Init();
})
