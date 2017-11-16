/*
 * Main entry point (init)
 */
function Init() {
    // web3 object
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    }
    else {
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    // Patient contract
    var patientFactoryMetadata = LoadContractMetadata('/contracts/PatientFactory.json');
    var patientFactoryContract = web3.eth.contract(patientFactoryMetadata.abi);
    var patientFactoryAddress = GetContractAddress(patientFactoryMetadata);
    patientFactoryContract.at(patientFactoryAddress, function (error, instance) {
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
    categoryCatalogContract.at(categoryCatalogAddress, function (error, instance) {
        if (error) {
            alert('Unable to load CategoryCatalog@' + categoryCatalogAddress);
        } else {
            window.CategoryCatalog = instance;
        }
    });

    // Hardcoded account addresses (PoC)
    window.Accounts = {
        "accounts": [
            { "address": '0x82372670115c971de24e74e3ddc2bda313035845', "name": 'Admin' },
            { "address": '0xadaa44f921bebafeb1150d1a915f19e2fb871811', "name": 'Patient' },
        ]
    };

    // Title and footer
    $(document).attr("title", GetAccountName() + " Actor");
    $("#accountName").text(GetAccountName());
    $("#accountAddress").text(GetAccountAddress());

    // Consent Data
    InitConsentData();
}

window.addEventListener('load', function () {
    //Init();
});

/*
 * Util functions
 */
function LoadContractMetadata(path) {
    var contract;

    jQuery.ajax({
        url: path,
        success: function (result) {
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
    PatientFactory.GetPatient.call(function (error, result) {
        if (error) {
            alert('GetPatient call failed');
        } else {
            $("#patientAddress").text(result.substring(0, 7) + '...');
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
    PatientFactory.MakePatient(function (error, result) {
        if (error) {
            alert('MakePatient transaction failed');
        } else {
            location.reload();
        }
    });
}

function DestroyPatient() {
    PatientFactory.DeletePatient(function (error, result) {
        if (error) {
            alert('Delete transaction failed');
        } else {
            location.reload();
        }
    });
}
/*
 * Admin functions
 */
function InitConsentData() {
    // TODO add each bit as a Category in the category catalog

    window.Accounts = [
        // [00-03]	Authority to consent | Specific record | reserved | reserved
        { "value": 0x00000001, "name": 'Authority to Consent' },
        { "value": 0x00000002, "name": 'Specific Record' },
        { "value": 0x00000004, "name": 'Reserved' },
        { "value": 0x00000008, "name": 'Reserved' },

        // [04-15]	Access type / Permissions		
        { "value": 0x00000010, "name": 'View' },
        { "value": 0x00000020, "name": 'Modify' },
        { "value": 0x00000040, "name": 'Add Note' },
        { "value": 0x00000080, "name": 'Consult' },
        { "value": 0x00000100, "name": 'Order' },
        { "value": 0x00000200, "name": 'Diagnosis' },
        //{ "value": 0x00000400, "name": 'Reserved' },
        //{ "value": 0x00000800, "name": 'Reserved' },
        //{ "value": 0x00001000, "name": 'Reserved' },
        //{ "value": 0x00002000, "name": 'Reserved' },
        //{ "value": 0x00004000, "name": 'Reserved' },
        //{ "value": 0x00008000, "name": 'Reserved' },

        // [16-23]	Type of record
        { "value": 0x00010000, "name": 'X-Ray' },
        { "value": 0x00020000, "name": 'Lab reports' },
        { "value": 0x00040000, "name": 'Prescription' },
        //{ "value": 0x00080000, "name": 'Reserved' },
        //{ "value": 0x00100000, "name": 'Reserved' },
        //{ "value": 0x00200000, "name": 'Reserved' },
        //{ "value": 0x00400000, "name": 'Reserved' },
        //{ "value": 0x00800000, "name": 'Reserved' },

        // [24-27]	Origin
        { "value": 0x01000000, "name": 'Eastern Health' },
        { "value": 0x02000000, "name": 'Hospital Specific' },
        { "value": 0x04000000, "name": 'Clinic Specific' },
        //{ "value": 0x08000000, "name": 'Reserved' },

        // [28-31]	Why/Rationale for creation
        { "value": 0x10000000, "name": 'Primary Care' },
        { "value": 0x20000000, "name": 'Treatment' },
        { "value": 0x40000000, "name": 'Emergency' },
        { "value": 0x80000000, "name": 'Record Correction' },
    ];

}

function InitAdmin() {
    CategoryCatalog.Owner.call(function (error, result) {
        if (error) {
            alert('Owner call failed');
        } else {
            if (result == GetAccountAddress()) {
                $("#adminDiv").show();
                $("#nonAdminDiv").hide();
            } else {
                $("#adminDiv").hide();
                $("#nonAdminDiv").show();
            }
        }
    });

    CategoryCatalog.GetAll.call(function (error, result) {
        if (error) {
            alert('GetAll call failed');
        } else {
            window.AllCategories = result;

            if (AllCategories.length == 0) {
                $("#noCategoriesDiv").show();
                $("#categoriesDiv").hide();
            } else {
                $("#noCategoriesDiv").hide();
                $("#categoriesDiv").show();
            }
        }
    });
}

function AddSomeCategories() {
    alert("Not implemented");
    //AddCategory("View Records");
    //AddCategory("Edit Records");
}

function AddCategory(name) {
    var metadata = LoadContractMetadata('/contracts/Category.json');
    var Contract = web3.eth.contract(metadata.abi);
    var bytecode = metadata.unlinked_binary;

    web3.eth.estimateGas({ 
        data: bytecode 
    }, function (error, gasEstimate) {
        if (error) {
            alert("Unable to estimate gas");
        } else {
            Contract.new(name, {
                from: GetAccountAddress(),
                data: bytecode,
                gas: gasEstimate
            }, function (error, instance) {
                if (error) {
                    alert("Error deplying new Category");
                } else if (instance.address) {
                    CategoryInstantiatedCallback(instance, name);
                }
            });
        }
    });
}

function CategoryInstantiatedCallback(instance, name) {
    var batch = web3.createBatch();

    /*if (name == "View Records") {

        batch.add(instance.AddConsentData.request(0x0010, function(error, result) { if (error) { alert('error'); }}));
        batch.add(instance.AddConsentData.request(0x0020, function(error, result) { if (error) { alert('error'); }}));
        batch.add(instance.AddConsentData.request(0x0040, function(error, result) { if (error) { alert('error'); }}));
        batch.add(CategoryCatalog.Add.request(instance.address, function(error, result) {
            alert('added2');
        }));
        batch.execute();
    } else if (name == "Edit Records") {
        batch.add(instance.AddConsentData.request(0x0020, function(error, result) { if (error) { alert('error'); }}));
        batch.add(instance.AddConsentData.request(0x0040, function(error, result) { if (error) { alert('error'); }}));
        batch.add(CategoryCatalog.Add.request(instance.address, function(error, result) {
            alert('added3');
        }));
        batch.execute();    
    }*/
}
