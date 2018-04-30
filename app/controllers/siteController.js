(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .directive('stringToNumber', stringToNumber)
        .controller("SiteController", ["$scope", "$rootScope", "DataService", "SMAAlertFactory", "ProjectConstants", siteController]);

    function stringToNumber() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value);
                });
            }
        };
    }
    function siteController($scope, $rootScope, DataService, SMAAlert, ProjectConstants) {
       
        $scope.schoolInfo = getSchoolObject();
        if ($rootScope.businessrpt == true) {           
            $scope.popup = {
                title: 'Site - Information',
                showMenu: showMenu,
                closeMenu: closeMenu,
                submitClicked: false,
            }
        }
        if ($rootScope.eductnrpt == true) {
            $scope.popup = {
                title: 'School - Information',
                showMenu: showMenu,
                closeMenu: closeMenu,
                submitClicked: false,
            }
        }
        $scope.merchantsList = {
            schoolList: [],
        };

        var siteC = this;
        //siteC.showMenu = showMenu;
        //siteC.closeMenu = closeMenu;
        siteC.collapse = collapse;
        siteC.collapseAll = collapseAll;
        siteC.expandAll = expandAll;
        siteC.submitForm = submitForm;
        siteC.submitBulkForm = submitBulkForm;
        siteC.loadBulkForm = loadBulkForm;
        siteC.deloadBulkForm = deloadBulkForm;
        siteC.MerchantList = [];
        $scope.Merchntid
        populateSchools();
        initValidation();
        return siteC;

        function getSchoolObject() {
            return {
                SchoolID: '', Name: '', Contact: '', AddressLine1: '', AddressLine2: '',
                City: '', State: '', ZipCode: '', MerchantID: ''
            }
        }

        function initValidation() {
            // Form Validation Rules
            $scope.validator = $("#FormInputs").validate({
                rules: {
                    SchoolName: {
                        required: true
                    },
                    //Contact: {
                    //    required: true
                    //},
                    //AddressLine1: {
                    //    required: true
                    //},
                    //AddressLine2: {
                    //    required: true
                    //},
                    //City: {
                    //    required: true
                    //},
                    //StateSelect: {
                    //    required: true
                    //},
                    //ZipCode: {
                    //    required: true
                    //},
                    MerchantSelect: {
                        required: true
                    }
                }
            });
        }

        // Populate Schools
        function populateSchools() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            // Clears out HTML elements
            //$("#SchoolContainer").html("");
            //$("#Datalist").html("");
            //$("#MerchantSelect").html('<option class="FontColor3" disabled selected value="">Merchant</option>');

            getMerchants();            
        }


        // Gets the Merchants
        function getMerchants() {
            $scope.merchantsList = {
                schoolList: [],
            };
            DataService.MerchantGetListByCurrentUser()
            .success(function (response1, status, heaedr, config) {
                var merchants = response1;
                siteC.MerchantList = response1;
                // Sets the loop variables
                var merchants_length = merchants.length;
                var merchants_index = 0;

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
                $scope.merchantsList = merchants;

                if (merchants_length > 0) {
                    // Calls Psuedo loop function
                    getSchools($scope.merchantsList, merchants_length, merchants_index);
                } else {
                    $scope.spinner.resolve();
                }
            })
            .error(function (response, status, heaedr, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    SMAAlert.CreateInfoAlert("Error", "Failed to retrieve merchants!<br><br>" + response);
                }
            });

        }


        // Psuedo loop for getting the schools and appending to the container
        function getSchools(merchants, merchants_length, merchants_index) {
            if (merchants_index < merchants_length) {
                //$("#SchoolContainer").append("<div class='MerchantNameHeader'><span class='collapsible' id='" + merchants[merchants_index].MerchantID + "' onclick='collapse(\"" + merchants[merchants_index].MerchantID + "\")'> - </span>" + merchants[merchants_index].Name + "</div>");
                $scope.merchantsList[merchants_index].schoolList = [];
                DataService.SchoolGetListForMerchant(merchants[merchants_index].MerchantID)
                .success(function (response1, status, heaedr, config) {
                    var schools = response1;

                    for (var i = 0, len = schools.length; i < len; i++) {
                        schools[i].MerchantID = merchants[merchants_index].MerchantID
                    }
                    if (schools.length > 0) {

                        schools.sort(function (a, b) {
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
                        $scope.merchantsList[merchants_index].schoolList = schools;
                    } else {
                        //$("#SchoolContainer").append("<div class='NoSchoolsHeader Searchable' data-merchantid='" + merchants[merchants_index].MerchantID + "'>No sites are available for this account.</div>");
                    }

                    // Increments index and recalls the psuedo loop
                    merchants_index++;
                    getSchools(merchants, merchants_length, merchants_index);
                })
                .error(function (response, status, heaedr, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Error", "Failed to retrieve sites!<br><br>" + response);
                    } else {
                        console.log("Forbidden: Schools.SchoolGetListForMerchant(" + merchants[merchants_index].MerchantID + ")");
                        merchants_index++;
                        getSchools(merchants, merchants_length, merchants_index);
                    }
                });
            } else {
                $scope.spinner.resolve();
            }
        }



        // Show Menu
        function showMenu(schoolID) {
            if (schoolID) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                DataService.SchoolGetDetails(schoolID)
                .success(function (response, status, header, config) {
                    if (response.State && response.State.length > 0) {
                        response.State = response.State.trim();
                    }
                    $scope.schoolInfo = response;
                    // If a State is on the school, change the color(so it's not placeholder grey)
                    if (response.State) {
                        selectColorBlack('StateSelect');
                    }

                    // If a Merchant is on the school, change the color(so it's not placeholder grey)
                    if (response.MerchantID) {
                        selectColorBlack('MerchantSelect');
                    }

                    $scope.spinner.resolve();
                    $("#EditMenu").css("display", "block");

                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Error", "Failed to retrieve site information!<br><br>" + response);
                    }
                });
            } else {
                if ($rootScope.businessrpt == true) {
                    $scope.popup.title = "New Site Information";
                }
                if ($rootScope.eductnrpt == true) {
                    $scope.popup.title = "New School Information";
                }                   
                $scope.schoolInfo.SchoolID = "-1";
                $("#EditMenu").css("display", "block");
            }
        }

        // Close Menu
        function closeMenu() {
            if ($rootScope.businessrpt == true) {
                $scope.popup.title = "Update Site Information";
            }
            if ($rootScope.eductnrpt == true) {
                $scope.popup.title = "Update School Information";
            }
            $("#EditMenu").css("display", "none");
            $scope.schoolInfo = getSchoolObject();
            selectColorGrey('StateSelect');

            // Resets all validation errors
            $scope.validator.resetForm()
        }

        // Save Form
        function submitForm() {
            var school = $scope.schoolInfo;

            if (school.AddressLine1 == "" || school.AddressLine1 == null || school.AddressLine1 == undefined) {
                school.AddressLine1 = " ";
            }
            if (school.AddressLine2 == "" || school.AddressLine2 == null || school.AddressLine2 == undefined) {
                school.AddressLine2 = " ";
            }
            if (school.City == "" || school.City == null || school.City == undefined) {
                school.City = " ";
            }
            if (school.State == "" || school.State == null || school.State == undefined) {
                school.State = " ";
            }
            if (school.ZipCode == "" || school.ZipCode == null || school.ZipCode == undefined) {
                school.ZipCode = " ";
            }
            if (school.Contact == "" || school.Contact == null || school.Contact == undefined) {
                school.Contact = " ";
            }
            $scope.popup.submitClicked = true;
            if (school.SchoolID == -1) { // If it's a new School

                //Add the new School
                DataService.SchoolAddNew(school)
                .success(function (response1, status, header, config) {
                    //Gets the user object from local storage
                    var user = JSON.parse(localStorage.getItem("iAsp.User"));

                    var userSchool = {
                        SchoolID: response1,
                        UserID: user.UserID
                    }

                    // Connects the new School with the current user
                    DataService.UserSchoolAddNew(userSchool)
                    .success(function (response2, status, header, config) {
                        populateSchools();
                        closeMenu();
                        SMAAlert.CreateInfoAlert("New Site has been saved.");
                        $scope.popup.submitClicked = false;
                    }).error(function (response, status, header, config) {
                        $scope.popup.submitClicked = false;
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Error", "Failed to save new site!<br><br>" + response);

                    });
                }).error(function (response, status, header, config) {
                    $scope.popup.submitClicked = false;
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Error", "Failed to save new site!<br><br>" + response);
                });
            } else {
                // Updates the School
                DataService.SchoolUpdate(school)
                .success(function (response, status, header, config) {
                    $scope.popup.submitClicked = false;
                    populateSchools();
                    closeMenu();
                    SMAAlert.CreateInfoAlert("Site has been updated.");
                }).error(function (response, status, header, config) {
                    $scope.popup.submitClicked = false;
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Error", "Failed to update site!<br><br>" + response);
                });
            }
        }

        // Save Bulk Data
        function saveBulkData(tableData) {           
            var id = $scope.Merchntid;
                // Gets the merchantID from the select
                var schoolID = $("#SchoolBulkSelect").val();

                // For each row, set the id to -1(so the DB knows it's a new teacher), and set the merchantID
                for (var i = 0, len = tableData.length; i < len; i++) {                    
                    tableData[i].MerchantID = id;                   
                    tableData[i].AddressLine1 = " ";
                    tableData[i].AddressLine2 = " ";
                    tableData[i].City = " ";
                    tableData[i].State = " ";
                    tableData[i].ZipCode = " ";
                    tableData[i].Contact = " ";
                    }
            DataService.SchoolAddNewBulk(tableData)
                .success(function (response1, status, header, config) {
                    var v = response1;
                    getMerchants();
                   // $scope.spinner.resolve();
                    closeMenu();
                    SMAAlert.CreateInfoAlert("New sites has been saved.!!");
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to upload departments:<br><br>" + response);
                });
        }

        // Collapse 
        function collapse(merchantID) {
            if ($("#" + merchantID).data("act") != "expand") {
                $("#" + merchantID).html(" + ");
                $("#" + merchantID).data("act", "expand");
                $(".Searchable").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).hide();
                    }
                });
            }
            else {
                $("#" + merchantID).html(" - ");
                $("#" + merchantID).data("act", "collapse");
                $(".Searchable").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).show();
                    }
                });
            }
        }


        // Collapse All
        function collapseAll() {
            $(".collapsible").each(function (i) {
                $(this).html(' + ');
            });
            $(".Searchable").each(function (i) {
                $(this).hide();
            });
        }

        // Expand All
        function expandAll() {
            $(".collapsible").each(function () {
                $(this).html(' - ');
            });
            $(".Searchable").each(function (i) {
                $(this).show();
            });
        }
        //-----------------------------Bulk Upload-----------------------------
        function submitBulkForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            processFile();
            return false;
        }
        function loadBulkForm() {           

                            showBulkMenu();                        
        }
        function deloadBulkForm() {
            // Clears the container
            closeBulkMenu();
        }
        function processFile() {
            //$scope.spinner = SMAAlert.CreateSpinnerAlert();
            var input = $("#BulkFile");
            var files = input[0].files;
            var i, f;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;

                    var arr = String.fromCharCode.apply(null, new Uint8Array(data));
                    var wb = XLSX.read(btoa(arr), { type: 'base64' });
                    process_wb(wb);
                };

                reader.readAsArrayBuffer(f);
            }
        }

        // Process Workbook
        function process_wb(wb) {
            var output = "";
            output = JSON.stringify(to_json(wb), 2, 2);
            var tableData = JSON.parse(output);

            // THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
            saveBulkData(tableData.Sheet1);// THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
            // THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
        }

        // To JSON
        function to_json(workbook) {
            var result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
            });
            return result;
        }
        //----------------------------------XX---------------------------------


    }
})();