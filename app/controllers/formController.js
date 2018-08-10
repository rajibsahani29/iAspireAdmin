(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .directive('fileModel', ['$parse', fileModel])
        .controller("FormController", ["$scope", "$rootScope", "DataService", "SMAAlertFactory", "ProjectConstants", "$filter", "$location", formController]);


    function fileModel($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope);
                    });
                });
            }
        };
    }

    function formController($scope, $rootScope, DataService, SMAAlert, ProjectConstants, $filter, $location) {
        $scope.popup = {
            title: 'Form - Information',
            showMenu: showMenu,
            closeMenu: closeMenu,
            showAddFormMenu: showAddFormMenu,
            closeAddFormMenu: closeAddFormMenu,
            submitClicked: false,
        };
        CheckGroupAdmin();
        getSurveyFormTypeDetail();
        $scope.SurveyTitle = "";
        $scope.SurveyXML = null;
        $scope.surveyTypeList = getSurveyTypeList();
        $scope.checkSurveyTypesRADIO = checkSurveyTypesRADIO;
        $scope.surveyList = [];
        $scope.merchantList = [];
        //START NILESH-TSK3.0
        $scope.Activated = false;
        //END NILESH-TSK3.0
        $scope.schoolList = [];
        $scope.pssqs = [];
        $scope.surveyInfo = {
            SurveyID: -1,
            SurveyTitle: '',
        };

        $scope.pssqInfo = {
            DisplayOrder: null,
            RequestType: '',
            DisplayText: '',
            IsRequired: false,
            ValueVariableName: '',
            PlaceholderVariableName: '',
        };



        var formC = this;
        formC.checkSurveyMerchantCheckboxes = checkSurveyMerchantCheckboxes;
        formC.checkSurveySchoolCheckboxes = checkSurveySchoolCheckboxes;
        formC.deletePSSQ = deletePSSQ;
        formC.deselectAllMerchants = deselectAllMerchants;
        formC.selectAllMerchants = selectAllMerchants;
        formC.deselectAllSchools = deselectAllSchools;
        formC.selectAllSchools = selectAllSchools;
        formC.submitForm = submitForm;
        formC.suggestVariableNames = suggestVariableNames;
        formC.saveFormVariables = saveFormVariables;
        formC.CreateSurveyForm = createSurveyForm;
        formC.ImportXmlSurvey = importXmlSurvey;
        formC.Archive = Archive;
        formC.showArchivedForm = showArchivedForm;
        formC.CloneSurvey = CloneSurvey;
        formC.CreateFixedSurveyForm = CreateFixedSurveyForm;
        formC.showButtonFroEdit = showButtonFroEdit;
        formC.setFormTypeTitle = setFormTypeTitle;
        formC.AddFormSurveyType = AddFormSurveyType;
        formC.showActiveForm = showActiveForm;
        formC.CloseActiveFormPopup = CloseActiveFormPopup;

        formC.SurveyList = [];
        formC.TESurveyList = [];
        formC.TEArchivedSurveyList = [];
        formC.SESurveyList = [];
        formC.SurveyList = [];
        formC.DynamicSurveyList = [];
        formC.BSurveyList = [];
        formC.BArchivedSurveyList = [];
        formC.BDynamicSurveyList = [];
        formC.EducationLst = [];
        formC.SurveyFormTypeList = [];
        formC.ArchivedForm = false;
        formC.ArchivedItem = '';
        formC.showFormTitle = true;
        formC.showFormText = null;
        formC.ShowFormName = null;
        formC.NewFormName = null;
        formC.ActiveFormList = [];
        populateSurveys();
        page_init();
        return formC;

        function getSurveyTypeList() {
            return [
                { SurveyTypeID: 'e8f029c9-399c-4137-a66b-e05c5f923ce2', Name: 'IBS - Employee Evaluation Forms', selection: false },
                { SurveyTypeID: '23385b0f-60e2-482c-b8b3-4ec217df409e', Name: 'IBS - Safety Audits / Walkthroughs', selection: false },
                { SurveyTypeID: '9baffb63-2177-424d-9b8f-c1bae984b0f0', Name: 'IBS - Coaching Forms', selection: false },
            ]
        }

        // Populate Surveys
        function populateSurveys() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            // Placeholder variables
            var errors = [];
            var surveyList_Done = false;
            var schools_Done = false;

            // Request variables
            DataService.GetAllSurveys()
            .success(function (response, status, header, config) {
                surveyList_Done = true;
                var surveys = response;

                surveys.sort(function (a, b) {
                    var nameA = a.Title.toLowerCase();
                    var nameB = b.Title.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    } else if (nameA > nameB) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                $scope.surveyList = response;
                checkDone();
            }).error(function (response, status, header, config) {
                surveyList_Done = true;
                if (status !== 403) {
                    if (response == null) { response = ""; }
                    errors.push("Failed to retrieve surveys: " + response.Message);
                }
                checkDone();
            });


            DataService.MerchantGetListByCurrentUser()
            .success(function (response, status, header, config) {
                var merchants = response;
                localStorage.setItem("merchantid", merchants[0].MerchantID);
                getSurveyList();
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
                $scope.merchantList = merchants;
                $scope.merchantList.forEach(function (obj) { obj.selection = false; });

                getSchoolsLoop(merchants, merchants.length, 0);
            }).error(function (response, status, header, config) {
                schools_Done = true;
                if (status !== 403) {
                    if (response == null) { response = ""; }
                    errors.push("Failed to retrieve Merchants for current user: " + response.Message);
                }
                checkDone();
            });


            // Check to see if all async requests have finished
            function checkDone() {
                if (surveyList_Done == true && schools_Done == true) {
                    $scope.spinner.resolve();

                    if (errors.length > 0) {
                        var errorsList = "";
                        for (var i = 0, len = errors.length; i < len; i++) {
                            errorsList += "<li>" + errors[i] + "<li>";
                        }
                        SMAAlert.CreateInfoAlert("The page is loaded but errors occurred:<br><br><ul>" + errorsList + "<ul><br><br>Try refreshing the page.");
                    }
                }
            }

            function getSchoolsLoop(merchants, merchants_length, merchants_index) {
                if (merchants_index < merchants_length) {
                    $scope.merchantList[merchants_index].schoolList = [];
                    DataService.SchoolGetListForMerchant(merchants[merchants_index].MerchantID)
                    .success(function (response, status, header, config) {
                        var schools = response;

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
                            schools.forEach(function (obj) { obj.selection = false });

                            $scope.merchantList[merchants_index].schoolList = schools;
                            $scope.schoolList = $scope.schoolList.concat(schools);

                        }

                        merchants_index++;
                        getSchoolsLoop(merchants, merchants_length, merchants_index);
                    }).error(function (response, status, header, config) {
                        if (status !== 403) {
                            if (response == null) { response = ""; }
                            errors.push("Failed to retrieve sites for " + merchants[merchants_index].MerchantID + " : " + response.Message);
                        }
                        merchants_index++;
                        getSchoolsLoop(merchants, merchants_length, merchants_index);
                    });

                } else {
                    schools_Done = true;
                    checkDone();
                }
            }
        }

        // Shows the menu form
        function showMenu(surveyID) {
            sessionStorage.setItem("st_alreadySaved", "");
            sessionStorage.setItem("st_toBeDeleted", "");
            sessionStorage.setItem("st_toBeAdded", "");
            sessionStorage.setItem("ss_alreadySaved", "");
            sessionStorage.setItem("ss_toBeDeleted", "");
            sessionStorage.setItem("ss_toBeAdded", "");
            sessionStorage.setItem("sm_alreadySaved", "");
            sessionStorage.setItem("sm_toBeDeleted", "");
            sessionStorage.setItem("sm_toBeAdded", "");

            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            $scope.surveyInfo.SurveyID = surveyID;
            //$("#SurveyIDHidden").val(surveyID);
            //$scope.merchantList.forEach(function (obj) { obj.selection = false; });
            //$scope.schoolList.forEach(function (obj) { obj.selection = false; });

            // When done function
            function check_whenDones() {
                if (surveyType_done == true && pssq_Done == true && surveySchools_done == true && surveyMerchants_done == true) {
                    if (errors.length > 0) {
                        $scope.spinner.resolve();
                        var errorList = "<ul>";
                        for (var i = 0, len = errors.length; i < len; i++) {
                            errorList += "<li>" + errors[i] + "</li>";
                        }
                        errorList += "</ul>";

                        SMAAlert.CreateInfoAlert("The following errors occured while<br>retrieving the form data:<br><br>" + errorList);
                    } else {
                        $scope.spinner.resolve();
                        $scope.surveyInfo.SurveyTitle = $("#" + surveyID).data("title");
                        $("#EditMenu").css("display", "block");
                    }
                }
            }

            // http variables
            var surveyType_done = false;
            var pssq_Done = false;
            var surveySchools_done = false;
            var surveyMerchants_done = false;
            var errors = [];

            //START NILESH-TSK3.0
            var SurveyData = $("#" + surveyID).data();
            if (SurveyData.activated) {
                var Activated = SurveyData.activated;
            }
            else {
                var Activated = false;
            }
            //$("#chkActivated").prop("checked",Activated);
            sessionStorage.setItem("form_ActiveInitialValue", Activated);
            $scope.Activated = Activated;
            //START NILESH-TSK3.0

            DataService.SurveyDetailGetListBySurvey(surveyID)
            .success(function (response, status, header, config) {
                var surveyTypes = response;
                var st_alreadySaved = "";
                for (var i = 0, len = surveyTypes.length; i < len; i++) {
                    //var foundItem = $filter('filter')($scope.surveyType, { SurveyTypeID: surveyTypes[i].SurveyTypeID }, true);
                    //if (foundItem != undefined && foundItem.length > 0) {
                    //    foundItem[0].selection = true;
                    //}
                    $("#" + surveyTypes[i].SurveyTypeID).prop("checked", true);
                    st_alreadySaved += "," + surveyTypes[i].SurveyTypeID;
                }
                sessionStorage.setItem("st_alreadySaved", st_alreadySaved);

                surveyType_done = true;
                check_whenDones();
            }).error(function (response, status, header, config) {
                surveyType_done = true;
                if (status !== 403) {
                    if (response == null) { response = ""; }
                    errors.push("Failed to retrieve survey type for " + surveyID + " : " + response.Message)
                }
                check_whenDones();
            });

            DataService.SurveyVariableGetListForSurvey(surveyID, 'PRESURVEY')//M0014
            .success(function (response, status, header, config) {
                var pssqs = response;
                $scope.pssqs = pssqs;
                pssq_Done = true;
                check_whenDones();
            }).error(function (response, status, header, config) {
                pssq_Done = true;
                if (status !== 403) {
                    if (response == null) { response = ""; }
                    errors.push("Failed to retrieve survey variables for " + surveyID + " : " + response.Message);
                }
                check_whenDones();
            });


            DataService.MerchantSurveyGetListBySurvey(surveyID)
            .success(function (response, status, header, config) {
                var surveyMerchants = response;
                var sm_alreadySaved = "";
                for (var i = 0, len = surveyMerchants.length; i < len; i++) {
                    var foundItem = $filter('filter')($scope.merchantList, { MerchantID: surveyMerchants[i].MerchantID }, true);
                    if (foundItem != undefined && foundItem.length > 0) {
                        foundItem[0].selection = true;
                    }
                    sm_alreadySaved += "," + surveyMerchants[i].MerchantID;
                }
                sessionStorage.setItem("sm_alreadySaved", sm_alreadySaved);

                surveyMerchants_done = true;
                check_whenDones();
            }).error(function (response, status, header, config) {
                surveyMerchants_done = true;
                if (status !== 403) {
                    if (response == null) { response = ""; }
                    errors.push("Failed to retrieve survey merchants for " + surveyID + " : " + response.Message);
                }
                check_whenDones();
            });

            DataService.SchoolSurveyGetListBySurvey(surveyID)
            .success(function (response, status, header, config) {
                var surveySchools = response;
                var ss_alreadySaved = "";
                for (var i = 0, len = surveySchools.length; i < len; i++) {
                    var foundItem = $filter('filter')($scope.schoolList, { SchoolID: surveySchools[i].SchoolID }, true);
                    if (foundItem != undefined && foundItem.length > 0) {
                        foundItem[0].selection = true;
                    }
                    ss_alreadySaved += "," + surveySchools[i].SchoolID;
                }
                sessionStorage.setItem("ss_alreadySaved", ss_alreadySaved);

                surveySchools_done = true;
                check_whenDones();
            }).error(function (response, status, header, config) {
                surveySchools_done = true;
                if (status !== 403) {
                    if (response == null) { response = ""; }
                    errors.push("Failed to retrieve survey schools for " + surveyID + " : " + response.Message);
                }
                check_whenDones();
            });

        }

        // Shows the menu form
        function closeMenu() {
            $scope.schoolList = [];
            sessionStorage.setItem("st_alreadySaved", "");
            sessionStorage.setItem("st_toBeDeleted", "");
            sessionStorage.setItem("st_toBeAdded", "");
            sessionStorage.setItem("ss_alreadySaved", "");
            sessionStorage.setItem("ss_toBeDeleted", "");
            sessionStorage.setItem("ss_toBeAdded", "");
            sessionStorage.setItem("sm_alreadySaved", "");
            sessionStorage.setItem("sm_toBeDeleted", "");
            sessionStorage.setItem("sm_toBeAdded", "");
            selectColorGrey("nPSSQrequestType");
            $("#EditMenu").css("display", "none");
            $scope.pssqs = [];
            $scope.surveyInfo.SurveyTitle = "";
            $scope.surveyTypeList.forEach(function (obj) { obj.selection = false; });
            $scope.merchantList.forEach(function (obj) { obj.selection = false; });
            $scope.schoolList.forEach(function (obj) { obj.selection = false; });

            //START NILESH-TSK3.0
            populateSurveys();
            //END NILESH-TSK3.0

            //$("#FormInputs input[type=checkbox]").each(function (i) {
            //    $(this).removeAttr("checked");
            //})
            //
            //
            //$("#FormInputs input[type=radio]").each(function (i) {
            //    $(this).removeAttr("checked");
            //})
        }

        // Check survey type radio inputs
        function checkSurveyTypesRADIO(surveyTypeID, name) {
            $("input[name=" + name + "]").each(function (i) {
                var idValue = $(this).prop("id");
                checkSurveyTypes(idValue);
            });

            if ($("#222b448d-e08a-43b6-b70f-7a19867336ea").is(":checked")) {
                $("#b58916ce-cd62-4036-937d-8308b8568a6d").removeAttr("disabled");
            } else {
                $("#b58916ce-cd62-4036-937d-8308b8568a6d").prop("disabled", "disabled").removeAttr("checked");
            }
        }


        // Checks all the Survey Types radios/checkboxes
        function checkSurveyTypes(surveyTypeID) {
            if ($("#" + surveyTypeID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                var st_alreadySaved = sessionStorage.getItem("st_alreadySaved");
                var st_toBeAdded = sessionStorage.getItem("st_toBeAdded");
                var st_toBeDeleted = sessionStorage.getItem("st_toBeDeleted");
                st_alreadySaved = st_alreadySaved.split(",");
                st_toBeAdded = st_toBeAdded.split(",");
                st_toBeDeleted = st_toBeDeleted.split(",");
                var temporary_st_toBeDeleted = st_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = st_alreadySaved.length; i < len; i++) {
                    if (st_alreadySaved[i] == surveyTypeID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = st_toBeDeleted.length; i < len; i++) {
                    if (st_toBeDeleted[i] == surveyTypeID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_st_toBeDeleted.length; i < len; i++) {
                        if (temporary_st_toBeDeleted[i] == surveyTypeID) {
                            st_toBeDeleted.splice(i, 1);
                        }
                    }
                } else if (alreadySaved == true && toBeDeleted == false) {
                    // If it's already saved but not to be deleted
                    // It should already be checked, we should never hit this
                    console.log("alreadySaved == true && toBeDeleted == false ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == true) {
                    // If it's not in the database but it is to be deleted
                    // This shouldn't happen
                    console.log("alreadySaved == false && toBeDeleted == true ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == false) {
                    // If it's not in the database and isn't going to be deleted
                    st_toBeAdded.push(surveyTypeID);
                }


                // Resets the session storage variables
                st_toBeDeleted = st_toBeDeleted.join(",");
                st_toBeAdded = st_toBeAdded.join(",");
                sessionStorage.setItem("st_toBeDeleted", st_toBeDeleted);
                sessionStorage.setItem("st_toBeAdded", st_toBeAdded);
            } else {// If it's unchecked

                var st_alreadySaved = sessionStorage.getItem("st_alreadySaved");
                st_alreadySaved = st_alreadySaved.split(",");

                var st_toBeAdded = sessionStorage.getItem("st_toBeAdded");
                st_toBeAdded = st_toBeAdded.split(",");
                var temporary_st_toBeAdded = st_toBeAdded;

                var st_toBeDeleted = sessionStorage.getItem("st_toBeDeleted");
                st_toBeDeleted = st_toBeDeleted.split(",");
                var temporary_st_toBeDeleted = st_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = st_alreadySaved.length; i < len; i++) {
                    if (st_alreadySaved[i] == surveyTypeID) {
                        temporary_st_toBeDeleted.push(surveyTypeID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = st_toBeAdded.length; i < len; i++) {
                    if (st_toBeAdded[i] == surveyTypeID) {
                        temporary_st_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_st_toBeDeleted.join(",");
                temporary_st_toBeAdded.join(",");
                sessionStorage.setItem("st_toBeDeleted", temporary_st_toBeDeleted);
                sessionStorage.setItem("st_toBeAdded", temporary_st_toBeAdded);
            }
        }

        // Checks all the survey merchant checkboxes
        function checkSurveyMerchantCheckboxes(surveyMerchantID) {
            if ($("#" + surveyMerchantID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                var sm_alreadySaved = sessionStorage.getItem("sm_alreadySaved");
                var sm_toBeAdded = sessionStorage.getItem("sm_toBeAdded");
                var sm_toBeDeleted = sessionStorage.getItem("sm_toBeDeleted");
                sm_alreadySaved = sm_alreadySaved.split(",");
                sm_toBeAdded = sm_toBeAdded.split(",");
                sm_toBeDeleted = sm_toBeDeleted.split(",");
                var temporary_sm_toBeDeleted = sm_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = sm_alreadySaved.length; i < len; i++) {
                    if (sm_alreadySaved[i] == surveyMerchantID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = sm_toBeDeleted.length; i < len; i++) {
                    if (sm_toBeDeleted[i] == surveyMerchantID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_sm_toBeDeleted.length; i < len; i++) {
                        if (temporary_sm_toBeDeleted[i] == surveyMerchantID) {
                            sm_toBeDeleted.splice(i, 1);
                        }
                    }
                } else if (alreadySaved == true && toBeDeleted == false) {
                    // If it's already saved but not to be deleted
                    // It should already be checked, we should never hit this
                    console.log("alreadySaved == true && toBeDeleted == false ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == true) {
                    // If it's not in the database but it is to be deleted
                    // This shouldn't happen
                    console.log("alreadySaved == false && toBeDeleted == true ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == false) {
                    // If it's not in the database and isn't going to be deleted
                    sm_toBeAdded.push(surveyMerchantID);
                }


                // Resets the session storage variables
                sm_toBeDeleted = sm_toBeDeleted.join(",");
                sm_toBeAdded = sm_toBeAdded.join(",");
                sessionStorage.setItem("sm_toBeDeleted", sm_toBeDeleted);
                sessionStorage.setItem("sm_toBeAdded", sm_toBeAdded);
            } else {// If it's unchecked

                var sm_alreadySaved = sessionStorage.getItem("sm_alreadySaved");
                sm_alreadySaved = sm_alreadySaved.split(",");

                var sm_toBeAdded = sessionStorage.getItem("sm_toBeAdded");
                sm_toBeAdded = sm_toBeAdded.split(",");
                var temporary_sm_toBeAdded = sm_toBeAdded;

                var sm_toBeDeleted = sessionStorage.getItem("sm_toBeDeleted");
                sm_toBeDeleted = sm_toBeDeleted.split(",");
                var temporary_sm_toBeDeleted = sm_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = sm_alreadySaved.length; i < len; i++) {
                    if (sm_alreadySaved[i] == surveyMerchantID) {
                        temporary_sm_toBeDeleted.push(surveyMerchantID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = sm_toBeAdded.length; i < len; i++) {
                    if (sm_toBeAdded[i] == surveyMerchantID) {
                        temporary_sm_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_sm_toBeDeleted.join(",");
                temporary_sm_toBeAdded.join(",");
                sessionStorage.setItem("sm_toBeDeleted", temporary_sm_toBeDeleted);
                sessionStorage.setItem("sm_toBeAdded", temporary_sm_toBeAdded);
            }
        }

        // Checks all the survey school checkboxes
        function checkSurveySchoolCheckboxes(surveySchoolID) {
            if ($("#" + surveySchoolID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                var ss_alreadySaved = sessionStorage.getItem("ss_alreadySaved");
                var ss_toBeAdded = sessionStorage.getItem("ss_toBeAdded");
                var ss_toBeDeleted = sessionStorage.getItem("ss_toBeDeleted");
                ss_alreadySaved = ss_alreadySaved.split(",");
                ss_toBeAdded = ss_toBeAdded.split(",");
                ss_toBeDeleted = ss_toBeDeleted.split(",");
                var temporary_ss_toBeDeleted = ss_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = ss_alreadySaved.length; i < len; i++) {
                    if (ss_alreadySaved[i] == surveySchoolID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = ss_toBeDeleted.length; i < len; i++) {
                    if (ss_toBeDeleted[i] == surveySchoolID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_ss_toBeDeleted.length; i < len; i++) {
                        if (temporary_ss_toBeDeleted[i] == surveySchoolID) {
                            ss_toBeDeleted.splice(i, 1);
                        }
                    }
                } else if (alreadySaved == true && toBeDeleted == false) {
                    // If it's already saved but not to be deleted
                    // It should already be checked, we should never hit this
                    console.log("alreadySaved == true && toBeDeleted == false ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == true) {
                    // If it's not in the database but it is to be deleted
                    // This shouldn't happen
                    console.log("alreadySaved == false && toBeDeleted == true ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == false) {
                    // If it's not in the database and isn't going to be deleted
                    ss_toBeAdded.push(surveySchoolID);
                }


                // Resets the session storage variables
                ss_toBeDeleted = ss_toBeDeleted.join(",");
                ss_toBeAdded = ss_toBeAdded.join(",");
                sessionStorage.setItem("ss_toBeDeleted", ss_toBeDeleted);
                sessionStorage.setItem("ss_toBeAdded", ss_toBeAdded);
            } else {// If it's unchecked

                var ss_alreadySaved = sessionStorage.getItem("ss_alreadySaved");
                ss_alreadySaved = ss_alreadySaved.split(",");

                var ss_toBeAdded = sessionStorage.getItem("ss_toBeAdded");
                ss_toBeAdded = ss_toBeAdded.split(",");
                var temporary_ss_toBeAdded = ss_toBeAdded;

                var ss_toBeDeleted = sessionStorage.getItem("ss_toBeDeleted");
                ss_toBeDeleted = ss_toBeDeleted.split(",");
                var temporary_ss_toBeDeleted = ss_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = ss_alreadySaved.length; i < len; i++) {
                    if (ss_alreadySaved[i] == surveySchoolID) {
                        temporary_ss_toBeDeleted.push(surveySchoolID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = ss_toBeAdded.length; i < len; i++) {
                    if (ss_toBeAdded[i] == surveySchoolID) {
                        temporary_ss_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_ss_toBeDeleted.join(",");
                temporary_ss_toBeAdded.join(",");
                sessionStorage.setItem("ss_toBeDeleted", temporary_ss_toBeDeleted);
                sessionStorage.setItem("ss_toBeAdded", temporary_ss_toBeAdded);
            }
        }

        // Auto-Fill Variable Name suggestions for Pre-survey Survey Questions
        function suggestVariableNames(type) {
            if (type == "business") {
                selectColorBlack("nPSSQrequestType");
                var keyword = '';
                var requestType = $scope.pssqInfo.RequestType;
                switch (requestType) {
                    case "B062342A-38C1-47B8-A855-689CCD8A62E7":
                        keyword = "merchant";
                        break;
                    case "FF0A0374-FC4E-4D99-9EA4-CBCB4E71E4D7":
                        keyword = "site";
                        break;
                    case "11BFA2AE-D9CB-4084-AEEC-644F775D25D0":
                        keyword = "employee";
                        break;
                    case "1AC11D81-BC04-44D6-8686-55788566D370":
                        keyword = "group";
                        break;
                    case "332DB95C-34ED-4EAF-808C-361115A9A6D9":
                        keyword = "department";
                        break;
                }

                $scope.pssqInfo.DisplayText = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                $scope.pssqInfo.ValueVariableName = keyword + "id"
                $scope.pssqInfo.PlaceholderVariableName = keyword + "name"
            }
            if (type == "education") {
                selectColorBlack("nPSSQrequestType");

                var requestType = $("#nPSSQrequestType").val();
                switch (requestType) {
                    case "8503ede7-ba45-45fb-9db7-b3d2b8332c1b":
                        keyword = "school";
                        break;
                    case "07a8026f-7c0a-4951-8bd3-45b15b29d29e":
                        keyword = "teacher";
                        break;
                    case "625e0804-46bb-4da4-a73f-e7e57386f0e2":
                        keyword = "grade";
                        break;
                    case "2a2a3272-18e5-402b-8d58-7c0d98b12728":
                        keyword = "subject";
                        break;
                }
				$scope.pssqInfo.DisplayText = keyword.charAt(0).toUpperCase() + keyword.slice(1);
                $scope.pssqInfo.ValueVariableName = keyword + "id"
                $scope.pssqInfo.PlaceholderVariableName = keyword + "name"
				
                $("#nPSSQdisplayText").val(keyword.charAt(0).toUpperCase() + keyword.slice(1));
                $("#nPSSQvalueVariableName").val(keyword + "id");
                $("#nPSSQplaceholderVariableName").val(keyword + "name");
            }
        }

        // Add Pre-Survey Survey Question
        function submitForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();


            var displayOrder = $scope.pssqInfo.DisplayOrder;
            var requestType = $scope.pssqInfo.RequestType;
            var displayText = $scope.pssqInfo.DisplayText;
            var isRequired = $scope.pssqInfo.IsRequired;

            var surveyVariable = {
                SurveyID: $scope.surveyInfo.SurveyID,
                DisplayOrder: $scope.pssqInfo.DisplayOrder,
                RequestText: $scope.pssqInfo.DisplayText,
                SurveyVariableTypeID: $scope.pssqInfo.RequestType,
                ValueVariableName: $scope.pssqInfo.ValueVariableName,
                PlaceholderVariableName: $scope.pssqInfo.PlaceholderVariableName,
                IsRequired: $scope.pssqInfo.IsRequired
            }

            DataService.SurveyVariableAddNew(surveyVariable)
            .success(function (response, status, header, config) {
                if ($scope.pssqs == "") {
                    var data = [];
                    data.push(surveyVariable);
                    $scope.pssqs = data;
                }
                else {
                    $scope.pssqs = $scope.pssqs.concat(surveyVariable);
                }
                //$("#PSSQContainer").append($("#PSSQCheckboxTemplate").render(surveyVariable));
                $scope.spinner.resolve();
            }).error(function (response2, status, header, config) {
                $scope.spinner.resolve();
                if (response2 == null) { response2 = ""; }
                SMAAlert.CreateInfoAlert("Failed to create Pre-Survey Survey Question:<br><br>" + response2);
            });

        }

        // Delete a Pre-Survey Survey Question
        function deletePSSQ(id) {
            SMAAlert.CreateConfirmAlert("Are you sure you wish to delete this<br>Pre-Survey Survey Question?", null, null, null, confirmCallBack);
            function confirmCallBack(val) {
                if (val == true) {
                    $scope.spinner = SMAAlert.CreateSpinnerAlert();

                    var splitID = id.split(",");
                    var surveyID = splitID[0];
                    var displayOrder = splitID[1];

                    DataService.SurveyVariableDelete(surveyID, displayOrder)
                    .success(function (response2, status, header, config) {
                        $("#pssq" + surveyID + displayOrder).hide();
                        $scope.spinner.resolve();
                    }).error(function (response2, status, header, config) {
                        $scope.spinner.resolve();
                        if (response2 == null) { response2 = ""; }
                        SMAAlert.CreateInfoAlert("Failed to delete Pre-Survey Survey Question:<br><br>" + response2);
                    });
                }
            }
        }

        // Select all Merchants
        function selectAllMerchants() {
            $(".surveryMerchantCheckbox").each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselect all Merchants
        function deselectAllMerchants() {
            $(".surveryMerchantCheckbox").each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Select all Schools
        function selectAllSchools() {
            $(".surverySchoolCheckbox").each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselect all Schools
        function deselectAllSchools() {
            $(".surverySchoolCheckbox").each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Function save form
        function saveFormVariables() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            var surveyID = $scope.surveyInfo.SurveyID;
            // Gets all the session storage variables and turns them into lists
            var st_toBeAdded = sessionStorage.getItem("st_toBeAdded");
            var st_toBeAdded = st_toBeAdded.split(",");
            var st_toBeAdded_length = st_toBeAdded.length;
            for (var i = 0; i < st_toBeAdded_length; i++) {
                if (st_toBeAdded[i] == "" || st_toBeAdded[i] == null || st_toBeAdded[i] == undefined) {
                    st_toBeAdded.splice(i, 1);
                }
            }
            for (var i = 0, len = st_toBeAdded.length; i < len; i++) {
                st_toBeAdded[i] = {
                    SurveyID: surveyID,
                    SurveyTypeID: st_toBeAdded[i]
                }
            }

            var st_toBeDeleted = sessionStorage.getItem("st_toBeDeleted");
            var st_toBeDeleted = st_toBeDeleted.split(",");
            var st_toBeDeleted_length = st_toBeDeleted.length;
            for (var i = 0; i < st_toBeDeleted_length; i++) {
                if (st_toBeDeleted[i] == "" || st_toBeDeleted[i] == null || st_toBeDeleted[i] == undefined) {
                    st_toBeDeleted.splice(i, 1);
                }
            }
            for (var i = 0, len = st_toBeDeleted.length; i < len; i++) {
                st_toBeDeleted[i] = {
                    SurveyID: surveyID,
                    SurveyTypeID: st_toBeDeleted[i]
                }
            }

            var sm_toBeAdded = sessionStorage.getItem("sm_toBeAdded");
            var sm_toBeAdded = sm_toBeAdded.split(",");
            var sm_toBeAdded_length = sm_toBeAdded.length;
            for (var i = 0; i < sm_toBeAdded_length; i++) {
                if (sm_toBeAdded[i] == "" || sm_toBeAdded[i] == null || sm_toBeAdded[i] == undefined) {
                    sm_toBeAdded.splice(i, 1);
                }
            }
            for (var i = 0, len = sm_toBeAdded.length; i < len; i++) {
                sm_toBeAdded[i] = {
                    SurveyID: surveyID,
                    MerchantID: sm_toBeAdded[i]
                }
            }

            var sm_toBeDeleted = sessionStorage.getItem("sm_toBeDeleted");
            var sm_toBeDeleted = sm_toBeDeleted.split(",");
            var sm_toBeDeleted_length = sm_toBeDeleted.length;
            for (var i = 0; i < sm_toBeDeleted_length; i++) {
                if (sm_toBeDeleted[i] == "" || sm_toBeDeleted[i] == null || sm_toBeDeleted[i] == undefined) {
                    sm_toBeDeleted.splice(i, 1);
                }
            }
            for (var i = 0, len = sm_toBeDeleted.length; i < len; i++) {
                sm_toBeDeleted[i] = {
                    SurveyID: surveyID,
                    MerchantID: sm_toBeDeleted[i]
                }
            }

            var ss_toBeAdded = sessionStorage.getItem("ss_toBeAdded");
            var ss_toBeAdded = ss_toBeAdded.split(",");
            var ss_toBeAdded_length = ss_toBeAdded.length;
            for (var i = 0; i < ss_toBeAdded_length; i++) {
                if (ss_toBeAdded[i] == "" || ss_toBeAdded[i] == null || ss_toBeAdded[i] == undefined) {
                    ss_toBeAdded.splice(i, 1);
                }
            }
            for (var i = 0, len = ss_toBeAdded.length; i < len; i++) {
                ss_toBeAdded[i] = {
                    SurveyID: surveyID,
                    SchoolID: ss_toBeAdded[i]
                }
            }

            var ss_toBeDeleted = sessionStorage.getItem("ss_toBeDeleted");
            var ss_toBeDeleted = ss_toBeDeleted.split(",");
            var ss_toBeDeleted_length = ss_toBeDeleted.length;
            for (var i = 0; i < ss_toBeDeleted_length; i++) {
                if (ss_toBeDeleted[i] == "" || ss_toBeDeleted[i] == null || ss_toBeDeleted[i] == undefined) {
                    ss_toBeDeleted.splice(i, 1);
                }
            }
            for (var i = 0, len = ss_toBeDeleted.length; i < len; i++) {
                ss_toBeDeleted[i] = {
                    SurveyID: surveyID,
                    SchoolID: ss_toBeDeleted[i]
                }
            }

            // When Done check Variables
            var errors = [];
            var st_toBeAdded_Done = false;
            var st_toBeDeleted_Done = false;
            var sm_toBeAdded_Done = false;
            var sm_toBeDeleted_Done = false;
            var ss_toBeAdded_Done = false;
            var ss_toBeDeleted_Done = false;
            //START NILESH-TSK3.0
            var form_Activate_Done = false;
            //END NILESH-TSK3.0

            // Check for when dones
            function updatedObjects() {
                if (st_toBeAdded_Done && st_toBeDeleted_Done && sm_toBeAdded_Done && sm_toBeDeleted_Done && ss_toBeAdded_Done && ss_toBeDeleted_Done) {
                    // When everything is done
                    $scope.spinner.resolve();
                    closeMenu();
                    if (errors.length > 0) {
                        var errorList = "";
                        for (var i = 0, len = errors.length; i < len; i++) {
                            errorList += "<li>" + errors[i] + "<li>";
                        }
                        SMAAlert.CreateInfoAlert("Form has been updated but errors occurred:<br><br><ul>" + errorList + "<ul>");
                    } else {
                        $scope.schoolList = [];
                        SMAAlert.CreateInfoAlert("Form has been successfully updated!");
                    }
                }
            }
            // Psuedo Loop for adding survey details(types)
            function surveyDetailAddNew(surveyDetailList, length, index) {
                if (index < length) {
                    DataService.SurveyDetailAddNew(surveyDetailList[index])
                    .success(function (response1, status, header, config) {
                        index++;
                        surveyDetailAddNew(surveyDetailList, length, index);
                    }).error(function (response, status, header, config) {
                        index++;
                        if (response == null) { response = ""; }
                        errors.push(response + " : " + surveyDetailList[index].SurveyTypeID);
                        surveyDetailAddNew(surveyDetailList, length, index);
                    });
                } else {
                    st_toBeAdded_Done = true;
                    updatedObjects();
                }
            }
            surveyDetailAddNew(st_toBeAdded, st_toBeAdded.length, 0);

            // Psuedo Loop for deleteing survey details(types)
            function surveyDetailDelete(surveyDetailList, length, index) {
                if (index < length) {
                    DataService.SurveyDetailDelete(surveyDetailList[index])
                    .success(function (response1, status, header, config) {
                        index++;
                        surveyDetailDelete(surveyDetailList, length, index);
                    }).error(function (response, status, header, config) {
                        index++;
                        if (response == null) { response = ""; }
                        errors.push(response + " : " + surveyDetailList[index].SurveyTypeID);
                        surveyDetailDelete(surveyDetailList, length, index);
                    });

                } else {
                    st_toBeDeleted_Done = true;
                    updatedObjects();
                }
            }
            surveyDetailDelete(st_toBeDeleted, st_toBeDeleted.length, 0);

            // Psuedo Loop for adding survey merchants
            function surveyMerchantAddNew(surveyMerchantList, length, index) {
                if (index < length) {
                    DataService.MerchantSurveyAddNew(surveyMerchantList[index])
                    .success(function (response1, status, header, config) {
                        index++;
                        surveyMerchantAddNew(surveyMerchantList, length, index);
                    }).error(function (response, status, header, config) {
                        index++;
                        if (response == null) { response = ""; }
                        errors.push(response + " : " + surveyMerchantList[index].SurveyTypeID);
                        surveyMerchantAddNew(surveyMerchantList, length, index);
                    });

                } else {
                    sm_toBeAdded_Done = true;
                    updatedObjects();
                }
            }
            surveyMerchantAddNew(sm_toBeAdded, sm_toBeAdded.length, 0);

            // Psuedo Loop for deleteing survey merchants
            function surveyMerchantDelete(surveyMerchantList, length, index) {
                if (index < length) {
                    DataService.MerchantSurveyDelete(surveyMerchantList[index])
                    .success(function (response1, status, header, config) {
                        index++;
                        surveyMerchantDelete(surveyMerchantList, length, index);
                    }).error(function (response, status, header, config) {
                        index++;
                        if (response == null) { response = ""; }
                        errors.push(response + " : " + surveyMerchantList[index].SurveyTypeID);
                        surveyMerchantDelete(surveyMerchantList, length, index);
                    });

                } else {
                    sm_toBeDeleted_Done = true;
                    updatedObjects();
                }
            }
            surveyMerchantDelete(sm_toBeDeleted, sm_toBeDeleted.length, 0);

            // Psuedo Loop for adding survey schools
            function surveySchoolAddNew(surveySchoolList, length, index) {
                if (index < length) {
                    DataService.SchoolSurveyAddNew(surveySchoolList[index])
                    .success(function (response1, status, header, config) {
                        index++;
                        surveySchoolAddNew(surveySchoolList, length, index);
                    }).error(function (response, status, header, config) {
                        index++;
                        if (response == null) { response = ""; }
                        errors.push(response + " : " + surveySchoolList[index].SurveyTypeID);
                        surveySchoolAddNew(surveySchoolList, length, index);
                    });

                } else {
                    ss_toBeAdded_Done = true;
                    updatedObjects();
                }
            }
            surveySchoolAddNew(ss_toBeAdded, ss_toBeAdded.length, 0);

            // Psuedo Loop for deleteing survey schools
            function surveySchoolDelete(surveySchoolList, length, index) {
                if (index < length) {
                    DataService.SchoolSurveyDelete(surveySchoolList[index])
                    .success(function (response1, status, header, config) {
                        index++;
                        surveySchoolDelete(surveySchoolList, length, index);
                    }).error(function (response, status, header, config) {
                        index++;
                        if (response == null) { response = ""; }
                        errors.push(response + " : " + surveySchoolList[index].SurveyTypeID);
                        surveySchoolDelete(surveySchoolList, length, index);
                    });

                } else {
                    ss_toBeDeleted_Done = true;
                    updatedObjects();
                }
            }
            surveySchoolDelete(ss_toBeDeleted, ss_toBeDeleted.length, 0);
            //START NILESH-TSK3.0
            function surveyChangeActiveStatus(SurveyId, activeStatus) {
                if (JSON.parse(sessionStorage.getItem("form_ActiveInitialValue")) != $scope.Activated) {
                    DataService.SurveyChangeActiveStatus(surveyID, $scope.Activated)
                    .success(function (response1, status, header, config) {
                        form_Activate_Done = true;
                        updatedObjects();
                    })
                    .error(function (response, status, header, config) {
                        if (response == null) { response = ""; }
                        errors.push(response + " : " + "Active status not saved");
                    });
                }
                else {
                    form_Activate_Done = true;
                    updatedObjects();
                }
            }
            surveyChangeActiveStatus();
            //END NILESH-TSK3.0
            getSurveyList();
        }
        //------------------------------Business-------------------------------

        function getSurveyList() {
            getListByName();
            getTESurveyListForUser();
        }
        function getSurveyListForUser() {
            DataService.getSurveys()
            .success(function (data, status, headers, config) {
                formC.SurveyList = data;
                // formC.SurveyListShowSpinner = false;
            })
            .error(function (data, status, headers, config) {
                //formC.SurveyListShowSpinner = false;
            });
        }

        function getTESurveyListForUser() {
            formC.BSurveyList = null;
            var merchantid = localStorage.getItem("merchantid");
            DataService.UserByParam(merchantid, "Education")
            .success(function (data, status, headers, config) {
                formC.TESurveyList = data.filter(function (e) {
                    return e.Archive == false;
                });
                formC.TEArchivedSurveyList = data.filter(function (e) {
                    return e.Archive == true;
                });
                if (formC.TESurveyList.length > 0) {
                    formC.EducationLst = formC.TESurveyList;
                    $scope.show = true;
                }
                formC.EducationLst.sort(SortByIDDesc)
                formC.TEArchivedSurveyList.sort(SortByIDDesc)
                // formC.TESurveyListShowSpinner = false;
            })
            .error(function (data, status, headers, config) {
                //formC.TESurveyListShowSpinner = false;
            });
        }
        function SortByIDDesc(x, y) {
            return ((x.Title == y.Title) ? 0 : ((x.Title > y.Title) ? 1 : -1));
        }
        function getListByName() {
            formC.EducationLst = null;
            var merchantid = localStorage.getItem("merchantid");
            DataService.UserByParam(merchantid, "Business").then(
                function (response) {
                    if ($scope.AppC.IsTrialVersion === true) {

                        formC.BSurveyList = response.data.filter(function (e) {
                            return e.Archive == false;
                        });
                        formC.BArchivedSurveyList = response.data.filter(function (e) {
                            return e.Archive == true;
                        });
                        if (formC.BSurveyList.length > 0) {
                            $scope.show = false;
                        }
                        formC.BSurveyList.sort(SortByIDDesc);
                        formC.BArchivedSurveyList.sort(SortByIDDesc);
                        // formC.SurveyListShowSpinner = false;
                    } else {
                        formC.BDynamicSurveyList[index].IsLoading = false;
                        //START NILESH
                        if (response.data && response.data.length > 0 && response.data[0].SurveyTypeDisplayName != undefined && response.data[0].SurveyTypeDisplayName != "") {
                            formC.BDynamicSurveyList[index].ListTitle = response.data[0].SurveyTypeDisplayName;
                        }
                        else {
                            formC.BDynamicSurveyList[index].ListTitle = listTitle;
                        }
                        //END NILESH
                        formC.BDynamicSurveyList[index].ListName = listName,
                        formC.BDynamicSurveyList[index].Forms = response.data || []
                    }
                },
                function () {
                    formC.BDynamicSurveyList[index].IsLoading = false;
                    // formC.SurveyListShowSpinner = false;
                }
            );
        }
        //---------------------------------XX----------------------------------

        function page_init() {
            // Set session storage items
            sessionStorage.setItem("st_alreadySaved", "");
            sessionStorage.setItem("st_toBeAdded", "");
            sessionStorage.setItem("st_toBeDeleted", "");

            sessionStorage.setItem("sm_alreadySaved", "");
            sessionStorage.setItem("sm_toBeAdded", "");
            sessionStorage.setItem("sm_toBeDeleted", "");

            sessionStorage.setItem("ss_alreadySaved", "");
            sessionStorage.setItem("ss_toBeAdded", "");
            sessionStorage.setItem("ss_toBeDeleted", "");


            // Sets the form validation rules
            $scope.validator = $("#newPSSQ").validate({
                rules: {
                    DisplayNumber: {
                        required: true
                    },
                    RequestType: {
                        required: true
                    },
                    DisplayText: {
                        required: true
                    },
                    ValueVariableName: {
                        required: true
                    },
                    PlaceholderVariableName: {
                        required: true
                    }
                }
            });

            $("#newPSSQ").submit(function (e) {
                e.preventDefault();
            });
        }
        function showAddFormMenu() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            $scope.surveyInfo.SurveyID = -1;

            $scope.spinner.resolve();
            $("#AddFormMenu").css("display", "block");
            // When done function
        }
        function closeAddFormMenu() {
            $("#AddFormMenu").css("display", "none");
        }

        function createSurveyForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            var merchantid = localStorage.getItem("merchantid");
            if ($scope.SurveyTitle != "") {
                if ($rootScope.businessrpt == true) {
                    DataService.CreateSurveyForm($scope.SurveyTitle, merchantid, "business")
                    .success(function (response, status, header, config) {
                        getListByName();
						closeAddFormMenu();
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Form has been successfully created!");
                        if (response) {
                            var str = '' + response;
                            if (!str) str = "";
                            str = (str == "undefined" || str == "null") ? "" : str;
                            try {
                                var key = 146;
                                var pos = 0;
                                var ostr = '';
                                while (pos < str.length) {
                                    ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
                                    pos += 1;
                                }
                                var url = window.location.href.split("#")[0] + "Survey/#/editor/" + ostr;
                                window.open(url, '_blank');
                            } catch (ex) {
                                alert(ex)
                            }
                        }
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (response == null)
                            response == "";
                        SMAAlert.CreateInfoAlert("Failed to create Survey Form : " + response);
                    });
                }
                else {
                    DataService.CreateSurveyForm($scope.SurveyTitle, merchantid, "education")
                    .success(function (response, status, header, config) {
                        getListByName();
						closeAddFormMenu();
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Form has been successfully created!");
                        if (response) {
                            var str = '' + response;
                            if (!str) str = "";
                            str = (str == "undefined" || str == "null") ? "" : str;
                            try {
                                var key = 146;
                                var pos = 0;
                                var ostr = '';
                                while (pos < str.length) {
                                    ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
                                    pos += 1;
                                }
                                var url = window.location.href.split("#")[0] + "Survey/#/editor/" + ostr;
                                window.open(url, '_blank');
                            } catch (ex) {
                                alert(ex)
                            }   
                        }
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (response == null)
                            response == "";
                        SMAAlert.CreateInfoAlert("Failed to create Survey Form : " + response);
                    });
                }
            }
            else {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("Survey Title is Required");
            }
        }

        function CreateFixedSurveyForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            var merchantid = localStorage.getItem("merchantid");
            if ($scope.FixedSurveyTitle != "") {
                if ($rootScope.businessrpt == true) {
                    DataService.CloneSurveyByName(merchantid, formC.SurveyForm, $scope.FixedSurveyTitle, "business")
                    .success(function (response, status, header, config) {
                        getListByName();
						closeAddFormMenu();
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Form has been successfully created!");
                        if (response) {
                            var str = '' + response;
                            if (!str) str = "";
                            str = (str == "undefined" || str == "null") ? "" : str;
                            try {
                                var key = 146;
                                var pos = 0;
                                var ostr = '';
                                while (pos < str.length) {
                                    ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
                                    pos += 1;
                                }
                                var url = window.location.href.split("#")[0] + "Survey/#/editor/" + ostr;
                                window.open(url, '_blank');
                            } catch (ex) {
                                alert(ex)
                            }  
                        }
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (response == null)
                            response == "";
                        SMAAlert.CreateInfoAlert("Failed to create Survey Form : " + response);
                    });
                }
                else {
                    DataService.CloneSurveyByName(merchantid, formC.SurveyForm, $scope.FixedSurveyTitle, "education")
                    .success(function (response, status, header, config) {
                        getListByName();
						closeAddFormMenu();
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Form has been successfully created!");
                        if (response) {
                            var str = '' + response;
                            if (!str) str = "";
                            str = (str == "undefined" || str == "null") ? "" : str;
                            try {
                                var key = 146;
                                var pos = 0;
                                var ostr = '';
                                while (pos < str.length) {
                                    ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
                                    pos += 1;
                                }
                                var url = window.location.href.split("#")[0] + "Survey/#/editor/" + ostr;
                                window.open(url, '_blank');
                            } catch (ex) {
                                alert(ex)
                            } 
                        }
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (response == null)
                            response == "";
                        SMAAlert.CreateInfoAlert("Failed to create Survey Form : " + response);
                    });
                }
            }
            else {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("Survey Title is Required");
            }
        }
        function importXmlSurvey() {
            var merchantid = localStorage.getItem("merchantid");
            var Surveytype = null;
            if ($rootScope.businessrpt == true) {
                Surveytype = "business";
            }
            else {
                Surveytype = "education";
            }
            var file = document.getElementById('xmlSurvey').files[0];
            //$scope.spinner = SMAAlert.CreateSpinnerAlert();
            var fd = new FormData();
            fd.append('file', file);
            if (file == null || file == undefined) {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("No file has been seleted");
                return;
            }

            DataService.UploadXMLSurvey(fd, merchantid, Surveytype)
            .success(function (data, status, headers, config) {
                if (data) {
                    var str = '' + data;
                    if (!str) str = "";
                    str = (str == "undefined" || str == "null") ? "" : str;
                    try {
                        var key = 146;
                        var pos = 0;
                        var ostr = '';
                        while (pos < str.length) {
                            ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
                            pos += 1;
                        }
                        var url = window.location.href.split("#")[0] + "Survey/#/editor/" + ostr;
                        window.open(url, '_blank');
                    } catch (ex) {
                        alert(ex)
                    }
                }
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("xml has been successfully imported!");
                getListByName()
            }).error(function (data, status, headers, config) {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("Failed to create Survey Form : " + response);
            });
            $scope.spinner.resolve();
        }

        function Archive(SurveyID, type) {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            var merchantid = localStorage.getItem("merchantid");
            if (type == "archive") {
                SMAAlert.CreateConfirmAlert("Are you sure you want<br>to Archive this Survey?", null, null, null, confirmCallback);
            } else {
                SMAAlert.CreateConfirmAlert("Are you sure you want<br>to Restore this Survey?", null, null, null, confirmCallback);
            }
            function confirmCallback(val) {
                if (val == true) {
                    DataService.ArchiveSurvey(merchantid, SurveyID).success(function (res) {
                        getSurveyList();
                        $scope.spinner.resolve(); if (type == "archive") {
                            SMAAlert.CreateInfoAlert("Survey has been successfully Archived!");
                        } else {
                            SMAAlert.CreateInfoAlert("Survey has been successfully Restored!");
                        }
                        formC.ArchivedForm = formC.ArchivedForm ? false : true;
                    }).error(function (res) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("" + res);
                    })
                } else {
                    $scope.spinner.resolve();
                }
            }
        }
        function showArchivedForm() {
            formC.ArchivedForm = formC.ArchivedForm ? false : true;
        }
        function CloneSurvey(SurveyID) {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            SMAAlert.CreateConfirmAlert("Are you sure you want<br>to Clone this Survey?", null, null, null, confirmCallback);
            var Surveytype = "";
            if ($rootScope.businessrpt == true) {
                Surveytype = "business";
            }
            else {
                Surveytype = "education";
            }
            var merchantid = localStorage.getItem("merchantid");
            function confirmCallback(val) {
                if (val == true) {
                    DataService.CloneSurvey(merchantid, SurveyID, Surveytype).success(function (res) {
                        getSurveyList();
                        $scope.spinner.resolve();
                    }).error(function (res) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("" + res);
                    })
                }
            }
        }
        function CheckGroupAdmin() {
            var UserData = JSON.parse(localStorage.getItem("IBSUserData"));
            if (UserData.UserID) {
                DataService.RolesGetListForUser(UserData.UserID)
                         .success(function (response3, status, header, config) {
                             var userRoles = response3;
                             let Acntchk = userRoles.some(v=>v["RoleName"] == "AccountAdmin")
                             let Glblchk = userRoles.some(v=>v["RoleName"] == "GlobalAdmin")
                             if (Glblchk == true || Acntchk == true) {
                                 formC.acntadmin = true
                             }
                             else {
                                 formC.acntadmin = false
                             }
                         }).error(function (err) {
                             var v = err;
                             formC.acntadmin = true;

                         })
            }
        }
        function getSurveyFormTypeDetail() {
            var merchantid = localStorage.getItem("merchantid");
            DataService.surveyTypeGetList(merchantid).success(function (res) {
                formC.SurveyFormTypeList = res;
            })
        }
        function showButtonFroEdit(id) {
            formC.SurveyFormTypeList
        }
        function setFormTypeTitle(item) {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            var merchantid = localStorage.getItem("merchantid");
            var Survey = {
                FriendlyName: item.SurveyTypeName,
                Title: item.SurveyTypeTitle
            }
            DataService.setSurveyFormTypeTitle(merchantid, Survey).success(function () {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("You have Successfully Updated you data.");
                getSurveyFormTypeDetail();
                // SMAAlert.RemoveAllAlerts();
                formC.showFormText = null;
            }).error(function (err) {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("" + res);
            })
        }
        function AddFormSurveyType() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            var merchantid = localStorage.getItem("merchantid");
            var FormName = formC.NewFormName;
            var Survey = {
                FriendlyName: formC.NewFormName
            }
            DataService.addSurveyFormType(merchantid, Survey).success(function (res) {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("You have successfully Added your data.");
                getSurveyFormTypeDetail();
                // SMAAlert.RemoveAllAlerts();
                formC.ShowFormName = null;

            }).error(function (err) {
                $scope.spinner.resolve();
                SMAAlert.CreateInfoAlert("" + res);
            })
        }
        function showActiveForm(item) {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            DataService.getSurveyListByListID(item.SurveyTypeID).then(
                function (response) {
                    response.data = response.data.filter(function (e) {
                        return e.Archive == false;
                    })
                    formC.ActiveFormList = response.data;
                    if (formC.ActiveFormList.length == 0) {
                        SMAAlert.CreateConfirmAlert("Are you sure you want<br>to Delete this Item?", null, null, null, confirmCallback);
                        function confirmCallback(val) {
                            if (val == true) {
                                DataService.deleteSurveyType(item.ID).success(function (e) {
                                    getSurveyFormTypeDetail()
                                    SMAAlert.CreateInfoAlert("You have successfully Deleted your data.");
                                })
                            }
                        }
                    } else {
                        $("#EditMenu").css("display", "none");
                        $("#ActiveForms").css("display", "block");
                    }
                    $scope.spinner.resolve();
                }
            );
        }
        function CloseActiveFormPopup() {
            $("#ActiveForms").css("display", "none");
            $("#EditMenu").css("display", "block");
        }
    }
})();