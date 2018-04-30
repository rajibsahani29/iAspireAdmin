(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("AccountController", ["$scope", "$http", "upload", "$location", "$rootScope", "DataService", "SMAAlertFactory", "ProjectConstants", accountController])
    .directive('uploadFile', ['$parse', function ($parse) {
           return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var file, img;
                var file_uploaded = $parse(attrs.uploadFile);               
                element.bind('change', function () {
                    scope.$apply(function () {
                        file_uploaded.assign(scope, element[0].files[0]);                        
                    });
                });
            }
        };
    } ]);
    function accountController($scope, $http, upload, $location, $rootScope, DataService, SMAAlert, ProjectConstants) {
        var accC = this;
        $scope.MerchantInfo = getMerchantObject();
        accC.MerchantList = null;

        accC.showMenu = showMenu;
        accC.PtdClear = ptdClear;
        accC.ptdMonth_change = ptdMonth_change;
        accC.ptdDay_change = ptdDay_change;
        accC.ptdYear_change = ptdYear_change;
        accC.closeMenu = closeMenu;
        accC.customerIDEditEnable = customerIDEditEnable;
        accC.submitForm = submitForm;
        accC.getnum = getnum;
        accC.SchoolList = [];
        accC.TechrCnt = [];
        getMerchantList();
        $scope.totalCount = 0;
        accC.shwmnucnt = 0;
        accC.imgpath = '';
        $scope.merchntupdtdata = [];
        var cnt = 0;
        accC.clsempcnt = [];
        initValidation();
        accC.doUpload = doUpload;        
        return accC;        
        function getMerchantList() {
            var spinner = SMAAlert.CreateSpinnerAlert();
            DataService.MerchantGetListByCurrentUser()
            .success(function (data, status, header, config) {
                var merchants = data;
                localStorage.setItem("merchantid", data[0].MerchantID);
                merchants.sort(function (a, b) {
                    var nameA = a.Name.toLowerCase();
                    var nameB = b.Name.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                accC.MerchantList = merchants;
                getHeaderImage();
                spinner.resolve();
            })
            .error(function (data, status, header, config) {
                spinner.resolve();
                console.log("Error1", data)

                SMAAlert.CreateInfoAlert("Error", "Accounts failed to populate:<br><br>" + data.Message);
            });
        }

        function ptdClear() {
            $scope.MerchantInfo.ptdMonth = "0";
            $scope.MerchantInfo.ptdDay = "0";
            $scope.MerchantInfo.ptdYear = "0";
            $("#ptdMonth").css("color", "grey");
            $("#ptdDay").css("color", "grey");
            $("#ptdYear").css("color", "grey");

            $scope.validator1.element("#ptdMonth");
            $scope.validator1.element("#ptdDay");
            $scope.validator1.element("#ptdYear");
            //$scope.$apply();
        }

        // Show Menu
        function showMenu(merchantID) {
            var spinner = SMAAlert.CreateSpinnerAlert();
            if (merchantID) {
                $("#empdata").show();
                $scope.totalCount = 0;
                accC.shwmnucnt = accC.shwmnucnt+1;
                DataService.MerchantGetDetails(merchantID)
                .success(function (response, status, header, config) {
                    var merchantDetails = response;
                    var MerchantInfo = getMerchantObject();
                    // Inserts object values into html elements
                    MerchantInfo.MerchantIDHidden = merchantDetails.MerchantID;
                    MerchantInfo.AccountName = merchantDetails.Name;
                    MerchantInfo.StateSelect = merchantDetails.State;
                    MerchantInfo.County = merchantDetails.County;
                    MerchantInfo.ContactName = merchantDetails.ContactName;
                    MerchantInfo.ContactEmail = merchantDetails.ContactEmail;
                    MerchantInfo.IsTrialAccount = merchantDetails.IsTrialAccount;
                    MerchantInfo.CustomerID = merchantDetails.CustomerID;

                    if (merchantDetails.PaidThroughDate !== null) {
                        MerchantInfo.hiddenPTD = merchantDetails.PaidThroughDate;

                        var ptd = moment(merchantDetails.PaidThroughDate);

                        console.log("month = " + (ptd.month() + 1));
                        console.log("day = " + ptd.date());
                        console.log("year = " + ptd.year());

                        $("#ptdMonth").css("color", "initial");
                        $("#ptdDay").css("color", "initial");
                        $("#ptdYear").css("color", "initial");

                        MerchantInfo.ptdMonth = ptd.month() + 1 + "";
                        MerchantInfo.ptdDay = ptd.date() + "";
                        MerchantInfo.ptdYear = ptd.year() + "";

                        //$("#ptdMonth option").each(function (i) {
                        //    if ($(this).val() == ptd.month() + 1) {
                        //        $(this).prop("selected", true);
                        //        $("#ptdMonth").css("color", "initial");
                        //    }
                        //});

                        //$("#ptdDay option").each(function (i) {
                        //    if ($(this).val() == ptd.date()) {
                        //        $(this).prop("selected", true);
                        //        $("#ptdDay").css("color", "initial");
                        //    }
                        //});

                        //$("#ptdYear option").each(function (i) {
                        //    if ($(this).val() == ptd.year()) {
                        //        $(this).prop("selected", true);
                        //        $("#ptdYear").css("color", "initial");
                        //    }
                        //});
                    }

                    // If a State is on the account, change the color
                    if (merchantDetails.State) {
                        selectColorBlack('StateSelect');
                    }
                    $scope.MerchantInfo = MerchantInfo;
                    DataService.SchoolGetListForMerchant(merchantID)
                    .success(function (response, status, header, config) {
                        $scope.MerchantInfo.schools = response;
                        var schools = response;
                        accC.SchoolList = schools;
                        accC.TeacherBySchool = [];
                        // Get Teachers by School function - psuedo-loop
                        function getTeachersBySchools(schools, schools_length, schools_index, errors) {
                            if (schools_index < schools_length) {
                                DataService.TeacherGetListBySchool(schools[schools_index].SchoolID)
                                .success(function (response, status, header, config) {
                                    //$scope.MerchantInfo.schools[schools_index].TeacherCount = response.length;
                                    accC.TeacherBySchool.push({ "Name": $scope.MerchantInfo.schools[schools_index].Name, "TeacherCount": response.length })
                                    $scope.totalCount = $scope.totalCount + response.length;
                                    schools_index++;
                                    cnt = cnt + 1;
                                    getTeachersBySchools(schools, schools_length, schools_index, errors);
                                    if (accC.shwmnucnt == 1) {
                                        getClasses($scope.MerchantInfo.schools[schools_index-1].SchoolID, $scope.MerchantInfo.schools[schools_index-1].Name, cnt);
                                    }
                                })
                                .error(function (response, status, header, config) {
                                    errors.push(response);
                                    if(response == null ) { response = "" }
                                    getTeachersBySchools(schools, schools_length, schools_index, errors);
                                });
                            } else {
                               // getTeacherByClassName()
                                if (errors.length > 0) {
                                    var errorList = "<ul>";

                                    for (var i = 0, len = errors.length; i < len; i++) {
                                        errorList += "<li>" + errors[i] + "</li>";
                                    }
                                    errorList += "</ul>"

                                    spinner.resolve();
                                    SMAAlert.CreateInfoAlert("Error", "<div>Account information failed to load</div>" + errorList);
                                } else {
                                    //$("#TeacherCountsContainer").append($("#TeacherCountTemplate").render(schools));

                                    // Get Merchant Settings
                                    getMerchantSettings(spinner);
                                }
                            }
                        }

                        getTeachersBySchools(schools, schools.length, 0, []);

                    })
                    .error(function (response, status, header, config) {
                        spinner.resolve();
                        if(response == null ) { response = "" }
                        SMAAlert.CreateInfoAlert("Error", "Account information failed to load:<br><br>" + response);
                    });
                })
                .error(function (response, status, header, config) {
                    spinner.resolve();
                    if(response == null ) { response = "" }
                    SMAAlert.CreateInfoAlert("Error", "Account information failed to load:<br><br>" + response);
                });
            } else {
                $("#PopUpWindowHeading").html("New District Information");
                $scope.MerchantInfo.MerchantIDHidden = -1;
                $("#EditMenu").css("display", "block");
                $("#empdata").hide();
                spinner.resolve();
            }
        }

        // Get Merchant Settings
        function getMerchantSettings(spinner) {
            // Get Merchant Settings List
            DataService.GetMerchantSettings($scope.MerchantInfo.MerchantIDHidden)
            .success(function (response, status, header, config) {
                // Success
                var merchantSettings = response;
                $scope.merchntupdtdata = response;
                //if (merchantSettings.length !== 0) {
                //    for (var i = 0, len = merchantSettings.length; i < len; i++) {
                //        if (merchantSettings[i].KeyName === "/Email/FormCompletion/Defaults") {
                //            $("#" + merchantSettings[i].ValueName).val(merchantSettings[i].Value);
                //        }
                //    }
                //} else {
                //}

                $(".MerchantSettings").each(function (e) {
                    var alreadyCreated = false;
                    for (var i = 0, len = merchantSettings.length; i < len; i++) {
                        if ($(this).attr("id") === merchantSettings[i].ValueName) {
                            $(this).val(merchantSettings[i].Value);
                            $(this).attr('data-id',merchantSettings[i].Id);
                            alreadyCreated = true;
                            break;
                        }
                    }
                    $(this).data("already-created", alreadyCreated);
                    if(e==1)
                    {
                        $('#div1').empty();
                        CreateNewMrchntSting()
                    }
                });
                function CreateNewMrchntSting()
                {
                    if(merchantSettings.length>2)
                    {
                        var alreadyCreated = false;
                        for (var i = 2, len = merchantSettings.length; i < len; i++) {
                            if ("BCCDefaults" === merchantSettings[i].ValueName) {
                                var row = $("</div><div class='SmallSettingContainer' style='float:right;'><input type='text' name='BCCDefaults' id='BCCDefaults" + i + "' placeholder='BCC Default' class='SettingsBox inputRightRank23 MerchantSettings' data-id='" + merchantSettings[i].Id + "' data-keyname='/Email/FormCompletion/Defaults' /><input type='button' value='Remove' id='" + i + "' onclick='removeRow(this)'></div></div>");
                                $('#div1').append(row);
                                $('#BCCDefaults' + i).val(merchantSettings[i].Value);
                                alreadyCreated = true;
                                $(".MerchantSettings").data("already-created", alreadyCreated);
                            }
                            if ("CCDefaults" === merchantSettings[i].ValueName) {
                                var row = $("<div id='chldiv" + i + "'><div class='SmallSettingContainer'><input type='text' name='CCDefaults' id='CCDefaults" + i + "' placeholder='CC Default' class='SettingsBox inputRightRank23 MerchantSettings' data-id='" + merchantSettings[i].Id + "' data-keyname='/Email/FormCompletion/Defaults' />");
                                $('#div1').append(row);
                                $('#CCDefaults' + i).val(merchantSettings[i].Value);
                                alreadyCreated = true;
                                $(".MerchantSettings").data("already-created", alreadyCreated);
                            }
                        }
                    }
                }
                // Done
                $("#EditMenu").css("display", "block");
                spinner.resolve();
            })
            .error(function (responce, status, header, config) {
                // Error
                spinner.resolve();
                SMAAlert.CreateInfoAlert("Error", "Account information failed to load:<br><br>" + response);
            });
        }

        function initValidation() {
            $scope.validator1 = $("#FormInputs").validate({
                rules: {
                    AccountName: {
                        required: true
                    },
                    StateSelect: {
                        required: true
                    },
                    County: {
                        required: true
                    },
                    ContactName: {
                        required: true
                    },
                    ContactEmail: {
                        required: true
                    },
                    ptdMonth: {
                        required: {
                            depends: function (element) {
                                return ($scope.MerchantInfo.ptdMonth > 0 || $scope.MerchantInfo.ptdDay > 0 || $scope.MerchantInfo.ptdYear > 0);
                            }
                        },
                        min: {
                            depends: function (element) {
                                if ($scope.MerchantInfo.ptdMonth > 0 || $scope.MerchantInfo.ptdDay > 0 || $scope.MerchantInfo.ptdYear > 0) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        }
                    },
                    ptdDay: {
                        required: {
                            depends: function (element) {
                                return ($scope.MerchantInfo.ptdMonth > 0 || $scope.MerchantInfo.ptdDay > 0 || $scope.MerchantInfo.ptdYear > 0);
                            }
                        },
                        min: {
                            depends: function (element) {
                                if ($scope.MerchantInfo.ptdMonth > 0 || $scope.MerchantInfo.ptdDay > 0 || $scope.MerchantInfo.ptdYear > 0) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        }
                    },
                    ptdYear: {
                        required: {
                            depends: function (element) {
                                return ($scope.MerchantInfo.ptdMonth > 0 || $scope.MerchantInfo.ptdDay > 0 || $scope.MerchantInfo.ptdYear > 0);
                            }
                        },
                        min: {
                            depends: function (element) {
                                if ($scope.MerchantInfo.ptdMonth > 0 || $scope.MerchantInfo.ptdDay > 0 || $scope.MerchantInfo.ptdYear > 0) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        }
                    }
                }
            });
        }

        function getMerchantObject() {
            return {
                MerchantIDHidden: null, AccountName: null, StateSelect: null, County: null, ContactName: null,
                ContactEmail: null, IsTrialAccount: null, CustomerID: null, hiddenPTD: null,
                ptdMonth: "0", ptdDay: "0", ptdYear: "0", schools: [],
            }
        }

        function ptdMonth_change() {
            $scope.validator1.element("#ptdMonth");
            $scope.validator1.element("#ptdDay");
            $scope.validator1.element("#ptdYear");

            if ($scope.MerchantInfo.ptdMonth !== "0") {
                $("#ptdMonth").css("color", "black");
                ptdMonthChange($scope.MerchantInfo.ptdMonth);
            } else if ($scope.MerchantInfo.ptdMonth == "0") {
                $("#ptdMonth").css("color", "grey");
            }
        }

        function ptdDay_change() {
            $scope.validator1.element("#ptdMonth");
            $scope.validator1.element("#ptdDay");
            $scope.validator1.element("#ptdYear");

            if ($scope.MerchantInfo.ptdDay !== "0") {
                $("#ptdDay").css("color", "black");
            } else if ($scope.MerchantInfo.ptdDay == "0") {
                $("#ptdDay").css("color", "grey");
            }
        }

        function ptdYear_change() {
            $scope.validator1.element("#ptdMonth");
            $scope.validator1.element("#ptdDay");
            $scope.validator1.element("#ptdYear");

            if ($scope.MerchantInfo.ptdYear !== "0") {
                $("#ptdYear").css("color", "black");
            } else if ($scope.MerchantInfo.ptdYear == "0") {
                $("#ptdYear").css("color", "grey");
            }
        }

        // On month change, changes the options in the Day dropdown
        function ptdMonthChange(month) {
            if (month == 2) {
                if ($scope.MerchantInfo.ptdDay == 29 || $scope.MerchantInfo.ptdDay == 30 || $scope.MerchantInfo.ptdDay == 31) {
                    $scope.MerchantInfo.ptdDay = "0";
                    $("#ptdDay").css("color", "grey");
                }
                $("#ptdDay29").prop("disabled", "disabled").css("color", "grey");
                $("#ptdDay30").prop("disabled", "disabled").css("color", "grey");
                $("#ptdDay31").prop("disabled", "disabled").css("color", "grey");
            } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                $("#ptdDay29").removeAttr('disabled').css("color", "initial");
                $("#ptdDay30").removeAttr('disabled').css("color", "initial");
                $("#ptdDay31").removeAttr('disabled').css("color", "initial");
            } else if (month == 4 || month == 6 || month == 9 || month == 11) {
                $("#ptdDay29").removeAttr('disabled').css("color", "initial");
                $("#ptdDay30").removeAttr('disabled').css("color", "initial");
                $("#ptdDay31").prop("disabled", "disabled").css("color", "grey");
                if ($scope.MerchantInfo.ptdDay == 31) {
                    $scope.MerchantInfo.ptdDay = "0";
                    $("#ptdDay").css("color", "grey");
                }
            }
        }

        function closeMenu() {
            $("#EditMenu").css("display", "none");

            // Clears all html element values
            $("#PopUpWindowHeading").html("Update District Information");
            $scope.MerchantInfo = getMerchantObject();

            $("#ptdMonth").css("color", "grey");
            $("#ptdDay").css("color", "grey");
            $("#ptdYear").css("color", "grey");

            customerIDEditDisable();

            selectColorGrey('StateSelect');

            $scope.validator1.resetForm();
        }
        function customerIDEditEnable() {
            $('#CustomerIDEditButton').hide();
            $('#CustomerID').attr('disabled', false).css('background-color', 'white').focus();
        }

        function customerIDEditDisable() {
            $('#CustomerIDEditButton').show();
            $('#CustomerID').attr('disabled', true).css('background-color', '#e2e2e2').val('');
        }

        function submitForm() {
            var spinner = SMAAlert.CreateSpinnerAlert();
            var oldPTD = $scope.MerchantInfo.hiddenPTD;

            // Checks for the previous PaidThroughDate
            if ($scope.MerchantInfo.hiddenPTD == "") {// If there wasn't one
                if ($scope.MerchantInfo.ptdMonth !== "0" && $scope.MerchantInfo.ptdDay !== "0" && $scope.MerchantInfo.ptdYear !== "0") {// Checks for the new values (requires all 3 to not be 0)
                    var newPTD = $scope.MerchantInfo.ptdYear + "-" + leadingZero($scope.MerchantInfo.ptdMonth) + "-" + leadingZero($scope.MerchantInfo.ptdDay) + "T00:00:00";
                    newPTD = moment(newPTD, "YYYY-MM-DD HH:mm:ss.SSS").format();
                } else if ($scope.MerchantInfo.ptdMonth == "0" || $scope.MerchantInfo.ptdDay == "0" || $scope.MerchantInfo.ptdYear == "0") {// If any of the fields are 0
                    var newPTD = null;
                }
            } else {// If their was a previous PaidThroughDate
                if ($scope.MerchantInfo.ptdMonth !== "0" && $scope.MerchantInfo.ptdDay !== "0" && $scope.MerchantInfo.ptdYear !== "0") {// Checks for the new values (requires all 3 to not be 0)
                    var newPTD = $scope.MerchantInfo.ptdYear + "-" + leadingZero($scope.MerchantInfo.ptdMonth) + "-" + leadingZero($scope.MerchantInfo.ptdDay) + "T00:00:00";
                    newPTD = moment(newPTD, "YYYY-MM-DD HH:mm:ss.SSS").format();
                } else if ($scope.MerchantInfo.ptdMonth == "0" || $scope.MerchantInfo.ptdDay == "0" || $scope.MerchantInfo.ptdYear == "0") {// If any of the fields are 0
                    var newPTD = null;
                }
            }

            var merchant = {
                MerchantID: $scope.MerchantInfo.MerchantIDHidden,
                Name: $scope.MerchantInfo.AccountName,
                State: $scope.MerchantInfo.StateSelect,
                County: $scope.MerchantInfo.County,
                ContactName: $scope.MerchantInfo.ContactName,
                ContactEmail: $scope.MerchantInfo.ContactEmail,
                IsTrialAccount: $scope.MerchantInfo.IsTrialAccount,
                CustomerID: $scope.MerchantInfo.CustomerID,
                PaidThroughDate: newPTD
            }

            if (merchant.MerchantID == -1) { // If it's a new merchant
                //Add the new Merchant
                DataService.MerchantAddNew(merchant)
                .success(function (response1, status, header, config) {
                    var merchantID = response1;

                    //Gets the user object from local storage
                    var user = JSON.parse(localStorage.getItem("iAsp.User"));

                    // Connects the new Merchant with the current user
                    DataService.UserMerchantAddNew(user.UserID, merchantID)
                    .success(function (response2, status, header, config) {
                        //populateMerchants();
                        getMerchantList();

                        // Loop through Merchant Settings and push to notCreated array
                        var notCreated = [];
                        $(".MerchantSettings").each(function (e) {
                            // Check for not created
                            if ($(this).data("already-created") === false) {
                                // Create merchant setting objeect
                                var merchantSetting = {
                                    KeyName: $(this).data("keyname"),
                                    MerchantID:  $scope.MerchantInfo.MerchantIDHidden,
                                    ValueName: $(this).attr("name"),
                                    Value: $(this).val(),
                                    //Id:$(this).val(),
                                }
                                notCreated.push(merchantSetting);
                            }
                        });

                        // Go to the Save New Merchant Settings function
                        saveNewMerchantSettings(spinner, [], notCreated);
                    })
                    .error(function (response2, status, header, config) {
                        spinner.resolve();
                        SMAAlert.CreateInfoAlert("Error", "New account failed to save:<br><br>" + response2.Message);
                    });
                })
                .error(function (response, status, header, config) {
                    spinner.resolve();
                    if(response == null ) { response = "" }
                    SMAAlert.CreateInfoAlert("Error", "New account failed to save:<br><br>" + response.Message);
                });                 
            } else {
                // Updates the Merchant
                DataService.MerchantUpdate(merchant)
                .success(function (response, status, header, config) {

                    // Loop through merchant settings and assign to proper arrays
                    var alreadyCreated = [];
                    var notCreated = [];
                    $(".MerchantSettings").each(function (e) {
                        // Create Merchant Setting object
                        var merchantSetting = {
                            KeyName: $(this).data("keyname"),
                            MerchantID: $scope.MerchantInfo.MerchantIDHidden,
                            ValueName: $(this).attr("name"),
                            Value: $(this).val(),
                            Id:$(this).data("id")
                        }
                        // Check if already created, then push to propper array
                        if ($(this).data("already-created") === true) {
                            alreadyCreated.push(merchantSetting);
                        } else {
                            notCreated.push(merchantSetting);
                        }
                    });

                    // Go to the Save New Merchant Settings function
                    saveNewMerchantSettings(spinner, alreadyCreated, notCreated);
                })
                .error(function (response, status, header, config) {
                    spinner.resolve();
                    if(response == null ) { response = "" }
                    SMAAlert.CreateInfoAlert("Error", "Account failed to update:<br><br>" + response);
                });
            }
        }        
        // Save New Merchant Settings
        function saveNewMerchantSettings(spinner, alreadyCreated, notCreated) {
            if (notCreated.length === 0) {
                updateOldMerchantSettings(spinner, alreadyCreated);
            } else {
                var index = 0;
                var length = notCreated.length;
                var doneCounter = 0;
                createNewMerchantSettingsLoop(index, length, notCreated);

                // Loops through the array and does an api hit per
                function createNewMerchantSettingsLoop(index, length, merchantSettings) {
                    if (index < length) {
                        DataService.CreateMerchantSetting(merchantSettings[index])
                        .success(function (response, status,header, config) {
                            doneCounter++;
                            whenDoneCheck(doneCounter, length);
                        })
                        .error(function (response, status, header, config) {
                            spinner.resolve();
                            if(response == null ) { response = "" }
                            SMAAlert.CreateInfoAlert("Error", "Account failed to update:<br><br>" + response);
                        })
                        // Reiterate through the loop
                        index++;
                        createNewMerchantSettingsLoop(index, length, merchantSettings);
                    }
                }

                // Checks if all api hits are done
                function whenDoneCheck(doneCounter, length) {
                    spinner.resolve();
                    if (doneCounter >= length) {
                        //updateOldMerchantSettings(spinner, alreadyCreated);
                    }
                }

            }
        }

        // Save Old Merchant Settings
        function updateOldMerchantSettings(spinner, alreadyCreated) {
            if (alreadyCreated.length === 0) {
                closeMenu();
                spinner.resolve();
                SMAAlert.CreateInfoAlert("District has been saved.");
            } else {
                var index = 0;
                var length = alreadyCreated.length;
                var doneCounter = 0;
                updateOldMerchantSettingsLoop(index, length, alreadyCreated);

                // Loops through the array and does an api hit per
                function updateOldMerchantSettingsLoop(index, length, merchantSettings) {
                    if (index < length) {
                        DataService.UpdateMerchantSetting(merchantSettings[index])
                        .success(function (response, status, header, config) {
                            doneCounter++;
                            whenDoneCheck(doneCounter, length);
                        })
                        .error(function (response, status, header, config) {
                            spinner.resolve();
                            if(response == null ) { response = "" }
                            SMAAlert.CreateInfoAlert("Error", "Account failed to update:<br><br>" + response);
                        });
                        // Reiterate through the loop
                        index++;
                        updateOldMerchantSettingsLoop(index, length, merchantSettings);
                    }
                }

                // Checks if all api hits are done
                function whenDoneCheck(doneCounter, length) {
                    if (doneCounter >= length) {
                        closeMenu();
                        spinner.resolve();
                        SMAAlert.CreateInfoAlert("District has been saved.");
                    }
                }
            }
        }
        function getnum()
        {
            alert("Hi....!")
        }
        // Adds a leading zero
        function leadingZero(n) {
            if (n < 10) {
                n = "0" + n;
            }
            return n;
        }
        
        //-------------------------------------Employee List By Class Name----------------------
        function getClasses(id,name,cnt)
        {
            var nm=name
            //if (cnt == 0)
            //{
            //    clsempcnt = [];
            //    accC.TechrCnt=[];
            //}
            //clsempcnt.push({ "school": name });
            DataService.teacherGetListByClass(id)
                    .success(function (response, status, header, config) {
                        //clsempcnt[clsempcnt.length-1].empcnt = [];
                        var v = response;
                        for (var i = 0; i < v.length; i++) {
                            accC.clsempcnt.push({ "ClassName": nm + " - " + v[i].ClassName, "NoOfTeacher": v[i].NoOfTeacher });
                        }
                    })
           // accC.TechrCnt = clsempcnt;
        }
               
        //-----------------------------------------------XX-------------------------------------
        //-----------------------------------------------File Upload-------------------------------//
        function doUpload(files)
        {
            var file = $scope.myFile;
            var filename = file.name;
            var extnsn = file.name.split(".");
            if (extnsn[1] == "jpg" || extnsn[1] == "jpeg" || extnsn[1] == "png") {
                var fileUpload = $scope.myFile;
                var reader = new FileReader();
                reader.readAsDataURL(fileUpload);
                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function () {
                        var height = this.height;
                        var width = this.width;
                        if ((height > 200 || width > 200) || (height < 50 || width < 50)) {
                            if (height < 50 || width < 50) {
                                alert("Height and Width should be greater than 50px.");
                            }
                            else {
                                alert("Height and Width must not exceed 200px.");
                            }
                            e.preventDefault();
                        }
                        else {
                            var spinner = SMAAlert.CreateSpinnerAlert();
                            var merchantid = localStorage.getItem("merchantid");
                            var path = DataService.getIP() + DataService.getPath() + "Home/Upload";
                            upload({
                                url: path,
                                method: 'POST',
                                data: {
                                    aFile: file,
                                    id: merchantid
                                }
                            }).then(
                              function (response) {
                                  spinner.resolve();
                                  getHeaderImage()
                                  SMAAlert.CreateInfoAlert("File Uploaded Successfully");
                                  console.log(response.data);
                              },
                              function (err) {
                                  spinner.resolve();
                                  SMAAlert.CreateInfoAlert("Something went wrong..!!");
                                  console.error(err);
                              }
                            );
                        }
                        return true;
                    };
                }
            }
            else {
                alert("File not support.!!")
            }
        }
        function getHeaderImage() {
            accC.imgpath = null;
            var merchantid = localStorage.getItem("merchantid");
            DataService.getImage(merchantid).then(
              function (response) {
                  if (response.data.indexOf("?")>-1) {                      
                      accC.imgpath = response.data.split("?");
                      accC.imgpath = accC.imgpath[0];
                      var num = Math.random();
                      var imgSrc = accC.imgpath+"?v=" + num;
                      var html = "<img src='" + imgSrc + "' alt='Header Image' style='border: 2px solid #ddd;border-radius: 4px;padding: 5px;width: 200px;margin-left: 100px;'>";
                      $('#refresh').html(html);                     
                  }
                  else {
                      if (response.data == "Image Not Found..!!") {
                          accC.imgpath = "Image Not Found..!!"
                          var url = window.location.href;
                          url = url.split("#");
                          url = url[0];
                          var imgSrc = url + "images/iAspireLogo.png";
                          var html = "<img src='" + imgSrc + "' alt='Logo Image' style='border: 2px solid #ddd;border-radius: 4px;padding: 5px;width: 200px;height:100px;margin-left: 100px;'>";
                          $('#refresh').html(html);
                      }
                      else {
                          accC.imgpath = response.data;
                          var num = Math.random();
                          var imgSrc = accC.imgpath + "?v=" + num;
                          var html = "<img src='" + imgSrc + "' alt='Logo Image' style='border: 2px solid #ddd;border-radius: 4px;padding: 5px;width: 200px;margin-left: 100px;'>";
                          $('#refresh').html(html);
                      }
                  }
                  console.log(response.data);
              },
              function (response) {
                  console.error(response);
              }
            );
        }
    }
   
})();
