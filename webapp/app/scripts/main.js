

function loadContracts() {
    //categoryCatalog = loadContract('/contracts/CategoryCatalog.json');
    //patientFactoryAddress = GetContractAddress('/contracts/PatientFactory.json');
}

function LoadContract(path) {
    var contract;

    jQuery.ajax({
        url: path,
        success: function(result) { 
            contract = result; 
        },
        async: false
    });

    //return response.networks[Object.keys(response.networks)[0]].address;
    return contract;

    /*
    $.ajax({
        url: path
    }).done(function(response) {
         return response.networks[Object.keys(response.networks)[0]].address;*/

    //var contract = web3.eth.contract(response.abi);
    //var instance = contract.at(address);

    //alert(response.contract_name);

    //return instance;
    //});
}

function GetContractAddress(contract) {
    return contract.networks[Object.keys(contract.networks)[0]].address;
}

window.addEventListener('load', function() {

    // Load web3
    if (typeof web3 !== 'undefined')
    {
        window.web3 = new Web3(web3.currentProvider);
    } 
    else 
    {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    
    window.Contract = LoadContract('/contracts/PatientFactory.json');
    window.PatientFactory = web3.eth.contract(Contract.abi);

    var contractAddress = GetContractAddress(Contract);
    window.PatientFactoryInstance = PatientFactory.at(contractAddress, function(error, instance) {
        if (!error) {
            window.PatientInstance = instance;
            window.PatientInstance.MakePatient(function(error, result) {
                if (!error) {
                    PatientFactoryInstance.GetPatient.call(function(error, result) {
                        if (!error) {
                            alert(result);
                        } else { 
                            alert('couldnt get patient'); 
                        }
                    });
            
                } else {
                    alert('couldnt make patient');
                }
            });
        } else {
            alert('failed');
        }


    });
/*
*/



    /*PatientFactoryInstance.MakePatient(function(error, result) {
        if (!error) {
            PatientFactoryInstance.GetPatient.call(function(error, result) {
                alert('done1');
                if (!error) {
                    window.Result = result;
                    alert('done2');
                } else { 
                    alert('couldnt get patient'); 
                }
            });
        } else { 
            alert('couldnt make patient'); 
        }
    });*/

    /*Category.at(GetContractAddress(Contract), function(error, result) {
        if(!error)
            window.Result = result;
        else
            console.error(error);
    });*/





    // Load contracts
    /*window.Category = web3.eth.contract(GetContractAddress('/contracts/Category.json'));
    window.CategoryCatalog = web3.eth.contract(GetContractAddress('/contracts/CategoryCatalog.json'));
    window.ConsentDirective = web3.eth.contract(GetContractAddress('/contracts/ConsentDirective.json'));
    window.Patient = web3.eth.contract(GetContractAddress('/contracts/Patient.json'));
    window.PatientFactory = web3.eth.contract(GetContractAddress('/contracts/PatientFactory.json'));*/

    



    //window.patientFactoryContract.new(function(error, ))


    //var instance = contract.at(address);;
    



    /*
    web3.net.getPeerCount(  function(  error,  result ) {
        if(error){
            setData('get_peer_count',error,true);
        } else {
            setData('get_peer_count','Peer Count: '+result,(result == 0));
        }*/

        /*
    var patientFactory = web3.eth.contract(patientFactoryAddress);
    var patient = patientFactory.GetPatient.call();*/

})

