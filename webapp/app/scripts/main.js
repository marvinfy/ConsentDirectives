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

function GetAccountNameAt(address) {
    for (var i = 0; i < Accounts.accounts.length; i++) {
        if (Accounts.accounts[i].address == address) {
            return Accounts.accounts[i].name;
        }
    }
    return "Unknown";
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
    PatientFactory.GetPatient.call(function (error, address) {
        if (error) {
            alert('GetPatient call failed');
        } else {
            if (Number(address) == 0) {
                $("#patientHeading").text("You're not a patient");
                $("#createButton").attr('class', '');
                $("#destroyButton").attr('class', 'disabled');
                $("#manageConsentDirectivesDiv").attr('style', 'display:none');
            } else {
                $("#patientHeading").text('Patient @ ' + address.substring(0, 7) + '...');
                $("#createButton").attr('class', 'disabled');
                $("#destroyButton").attr('class', '');
                $("#manageConsentDirectivesDiv").attr('style', '');

                var patientMetadata = LoadContractMetadata('/contracts/Patient.json');
                var patientContract = web3.eth.contract(patientMetadata.abi);
                patientContract.at(address, function (error, instance) {
                    if (error) {
                        console.log('Unable to load Patient @ ' + address);
                    } else {
                        console.log('Loaded Patient @ ' + address);

                        window.Patient = instance;
                        LoadDDLActors();
                        InitPermissionsHeaderDiv();
                        LoadActor(Accounts.accounts[0].address)
                    }
                });

            }
        }
    });
}

function LoadDDLActors() {
    for (var i = 0; i < Accounts.accounts.length; i++) {
        var account = Accounts.accounts[i];

        var newItem = $("#actorTemplateDdi").clone();

        newItem.attr('style', '');
        newItem.appendTo("#actorsDdm");

        var link = newItem.children(":first");

        if (GetAccountAddress() == account.address) {
            newItem.attr('class', 'disabled');    
            link.text(account.name + "");
        } else {
            link.text(account.name);
        }

        link.attr('OnClick', 'LoadActor("' + account.address + '");');
    }
}

function LoadActor(pAddress) {
    console.log('Actor address: ' + pAddress);

    window.CurrentActorAddress = pAddress;

    $("#actorNameDDL").text(GetAccountNameAt(pAddress));

    Patient.GetConsentDirectives.call(function (error, directives) {
        if (error) {
            console.error('GetConsentDirectives call failed');
        } else {
            window.ConsentDirectives = directives;
            FindFirstConsentDirectiveFor(pAddress, ContinueLoadingActor);
        }
    });
}

function ContinueLoadingActor() {

    if (ConsentDirective.address == null) {
        console.error('ContinueLoadingActor -- First Consent Directive NOT found');
    } else {
        console.info('ContinueLoadingActor -- continuing with CD@' + window.ConsentDirective.address);

        ConsentDirective.What.call(function(error, flags) {
            if (error) {
                console.error("Error loading bit flags");
            } else {
                /*$('#permissionsContentDiv').each(function() {
                    $(this).find('input:checkbox').prop('checked', true);
                    console.log('a');
                });*/
                console.log(flags.toNumber());
            }
        });

    }
}

function SaveConsentDirective() {

    var what = 0;

    $("#permissionsDiv").find('input:checkbox').each(function () {
        if ($(this).prop("checked")) {
            what += Number($(this).attr("val"));
        }
    });

    var metadata = LoadContractMetadata('/contracts/ConsentDirective.json');
    let bytecode = metadata.bytecode;
    let consentDirectiveContract = web3.eth.contract(metadata.abi);

    if (ConsentDirective != null) {
        console.info('ConsentDirective already exists, updating. Actor: ' + CurrentActorAddress);

        ConsentDirective.SetWhat(what, function(error, result) {
            if (error) {
                console.error('Error updating consent directive'); 
            } else {
                console.info('Consent Directive updated'); 
            }
        });

    } else {
        console.info('Creating empty ConsentDirective for actor ' + CurrentActorAddress);
        web3.eth.estimateGas({
            data: bytecode
        }, function (error, gasEstimate) {
            if (error) {
                alert("Unable to estimate gas");
            } else {
                consentDirectiveContract.new(CurrentActorAddress, what, {
                    from: GetAccountAddress(),
                    data: bytecode,
                    gas: gasEstimate * 2}, function (err, myContract) {
                    if (!err) {
                        if (!myContract.address) {
                            console.log("Tx hash: " + myContract.transactionHash);
                        } else {
                            console.log("Contract address: " + myContract.address);

                            window.ConsentDirective = myContract;

                            Patient.AddConsentDirective(myContract.address, function (error, result) {
                                if (error) {
                                    console.error('Error adding consent directive to patient'); 
                                } else {
                                    console.info('Consent Directive added to patient'); 
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}    

async function FindFirstConsentDirectiveFor(pActor, f) {
    var metadata = LoadContractMetadata('/contracts/ConsentDirective.json');
    let bytecode = metadata.bytecode;
    let consentDirectiveContract = web3.eth.contract(metadata.abi);

    window.ConsentDirective = null;

    for (var i = 0; i < ConsentDirectives.length; i++) {
        let cd = await consentDirectiveContract.at(ConsentDirectives[i], function(error, instance) {
            if (error) {
                console.error('Error loading Consent Directive');
            } else {
                return instance;
            }
        });

        let who = await cd.GetTheWho.call(function(error, who) {
            if (error) {
                console.error('Error Getting Who');
            } else if (pActor == who) {
                window.ConsentDirective = cd;
                console.log('CD@' + window.ConsentDirective.address + ' for actor@' + pActor + ' found');
                f();
            }
        });
    }
}


function CreatePatient() {
    PatientFactory.MakePatient(function (error, result) {
        if (error) {
            console.error('MakePatient transaction failed');
        } else {
            setTimeout(ReloadPage, 2500);
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
            InitPermissionsHeaderDiv();
            LoadCategories();
        }
    });
}

function InitPermissionsHeaderDiv() {
    for (var i = 0; i < window.Permissions.length; i++) {
        var permission = window.Permissions[i];
        var newRow = $("#permissionsHeaderDiv").clone();
        newRow.attr('id', 'permissionsContentDiv');

        var hexTemplate = "0x00000000";
        var val = permission.value.toString(16);
        var res = hexTemplate.substring(0, hexTemplate.length - val.length) + val;

        newRow.children("#permissionsIncludeDiv").html("<input type='checkbox' val='" + permission.value + "'></input>");
        newRow.children("#permissionsNameDiv").text(permission.name);
        newRow.children("#permissionsFlagsDiv").text(res);
        newRow.appendTo("#permissionsDiv");
    }
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
 
    for (var i = 0; i < permissions.length; i++) {
        console.log('Will add consent data -- ' + permissions[i]);
        category.AddConsentData(permissions[i], function(error, result) { 
            if (error) { 
                console.log('Error adding consent data'); 
            }
            else {
                console.log('Consent data added'); 
                LoadCategories();
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