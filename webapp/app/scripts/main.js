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

    // Category contract
    var categoryMetadata = LoadContractMetadata('/contracts/Category.json');
    var categoryContract = web3.eth.contract(categoryMetadata.abi);
    var categoryAddress = GetContractAddress(categoryMetadata);
    categoryContract.at(categoryAddress, function (error, instance) {
        if (error) {
            alert('Unable to load category@' + categoryAddress);
        } else {
            window.Category = instance;
        }
    });

    // Hardcoded account addresses (PoC)
    window.Accounts = {
        "accounts": [
            { "address": '0x82372670115c971de24e74e3ddc2bda313035845', "name": 'Admin' },
            { "address": '0xadaa44f921bebafeb1150d1a915f19e2fb871811', "name": 'P (Patient)' },
            { "address": '0x7069faff133af5180d415a7d12434aade4ea9ce6', "name": 'R (Reception, MD)' },
            { "address": '0xe1c60880d21066ed56c333671055168327bc3327', "name": 'MD' },
            { "address": '0x6cf5c2553dc61467f17df1ef8fa91a56228832cf', "name": 'R2 (Reception 2, blood services)' },
            { "address": '0x81f69cda59270603f2c857a1a87fd4464f05c073', "name": 'BSS (Blood Services Staff)' },
            { "address": '0x7714ca612ac855ef9cbf135b71f3d00673f23fff', "name": 'N (Nurse)' },
            { "address": '0x89b8e3dc2c9bf85712aba5e05dde0c53c09ec314', "name": 'T (Technician)' },
            { "address": '0x15e70fa91eac37e06b095d8fa32071771b3758f4', "name": 'HIC (MD?)' },
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
            if (Number(result) == 0) {
                $("#patientHeading").text("You're not a patient");
                $("#createButton").attr('class', '');
                $("#destroyButton").attr('class', 'disabled');
            } else {
                $("#patientHeading").text('Patient @ ' + result.substring(0, 9) + '...');
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
            setTimeout(ReloadPage, 2000);
        }
    });
}

function DestroyPatient() {
    PatientFactory.DeletePatient(function (error, result) {
        if (error) {
            alert('Delete transaction failed');
        } else {
            setTimeout(ReloadPage, 2000);
        }
    });
}

function ReloadPage() {
    location.reload();
}

/*
 * Admin functions
 */
function InitConsentData() {
    // TODO add each bit as a Category in the category catalog

    window.Permissions = [
        { "value": 0x00000001, "name": 'Authority to Consent' },
        { "value": 0x00000010, "name": 'View' },
        { "value": 0x00000020, "name": 'Modify' },
        { "value": 0x00000040, "name": 'Add Note' },
        { "value": 0x00000080, "name": 'Pull Chart' },
        { "value": 0x00000100, "name": 'Order' },
        { "value": 0x00000200, "name": 'View Order' },
        { "value": 0x00000400, "name": 'Submit Order Report' },
        { "value": 0x00000800, "name": 'Enter Order Codes' },
    ];

}

function GetPermissionName(value) {
    for (var i = 0; i < Permissions.length; i++) {
        if (Permissions[i].value == value) {
            return Permissions[i].name;
        }
    }
    return "Unknown";
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
            InitAdmin2();
        }
    });
}

function InitAdmin2() {
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
            InitAdmin3();
        }
    });
}

function InitAdmin3() {
    for (var i = 0; i < window.Permissions.length; i++) {
        var permission = window.Permissions[i];
        var newRow = $("#permissionsHeaderDiv").clone();

        var hexTemplate = "0x00000000";
        var val = permission.value.toString(16);
        var res = hexTemplate.substring(0, hexTemplate.length - val.length) + val;

        newRow.children("#permissionsIncludeDiv").html("<input type='checkbox' val='" + permission.value + "'></input>");
        newRow.children("#permissionsNameDiv").text(permission.name);
        newRow.children("#permissionsFlagsDiv").text(res);
        newRow.appendTo("#permissionsDiv");
    }

    LoadCategories();
}

function AddCategoryFromUi() {
    var permissions = [];
    $("#permissionsDiv").find('input:checkbox').each(function () {
        if ($(this).prop("checked")) {
            permissions.push(Number($(this).attr("val")));
        }
    });

    var name = $("#categoryNameInput").val();
    AddCategory(name, permissions);
}

function AddCategory(name, permissions) {
    var metadata = LoadContractMetadata('/contracts/Category.json');
    let bytecode = metadata.bytecode;
    let MyContract = web3.eth.contract(metadata.abi);

    web3.eth.estimateGas({
        data: bytecode
    }, function (error, gasEstimate) {
        if (error) {
            alert("Unable to estimate gas");
        } else {
            MyContract.new(name, {
                from: GetAccountAddress(),
                data: bytecode,
                gas: gasEstimate * 2}, function (err, myContract) {
                if (!err) {
                    if (!myContract.address) {
                        console.log("Tx hash: " + myContract.transactionHash);
                    } else {
                        console.log("Contract address: " + myContract.address);

                        CategoryCatalog.Add(myContract.address, function (error, result) {
                            if (error) {
                                console.log('Error adding category to the catalog'); 
                            } else {
                                console.log('Category added to the catalog'); 
                                AddPermissions(myContract, permissions);
                            }
                        });
                    }
                }
            });
        }
    });
}

function AddPermissions(category, permissions) {
    category.Name.call(function(error, name) {
        if (error) {
            console.log(error);
        } else {
            console.log('Category name: ' + name);
            console.log('Permissions to add: ' + permissions);
        }
    });
 
    var count = 0;
    for (var i = 0; i < permissions.length; i++) {
        console.log('Will add consent data -- ' + permissions[i]);
        category.AddConsentData(permissions[i], function(error, result) { 
            if (error) { 
                console.log('Error adding consent data'); 
            }
            else {
                console.log('Consent data added'); 
                count++;

                if (count == permissions.length) {
                    LoadCategories();
                }
            }
        });
    }

}

function LoadCategories() {
    $("#categoriesDisplayContentDiv").text("");

    CategoryCatalog.GetAll.call(function(error, categories) {
        if (error) {
            console.log('Error loading categories'); 
        } else {
            console.log('Categories loaded'); 
            for (var i = 0; i < categories.length; i++) {

                var categoryMetadata = LoadContractMetadata('/contracts/Category.json');
                var categoryContract = web3.eth.contract(categoryMetadata.abi);
                categoryContract.at(categories[i], function (error, instance) {
                    if (error) {
                        console.log('Unable to load Category instance');
                    } else {
                        console.log('Category address -- ' + categories[i]);

                        instance.Name.call(function(error, name) {
                            if (error) {
                                console.log('Unable to load Category name');
                            } else {
                                instance.GetAllConsentData.call(function(error, data) {
                                    if (error) {
                                        console.log('Unable to load Category consent data');
                                    } else {
                                        var newRow = $("#categoriesDisplayHeaderDiv").clone();
                                        newRow.children("#categoriesDisplayNameDiv").text(name);

                                        var description = "";
                                        for (var i = 0; i < data.length; i++) {
                                            description += GetPermissionName(data[i].toNumber()) + "; ";
                                        }
                                        newRow.children("#categoriesDisplayPermissionsDiv").text(description);
                                        
                                        newRow.appendTo("#categoriesDisplayContentDiv");
                                    }

                                });

                            }
                        });


                    }
                });
                
            }
        }
    });
}