(function () {
   "use strict";
    angular
        .module("iAspireApp")
        .controller("archiveController", ["$scope", "$rootScope", "DataService", "SMAAlertFactory", "ProjectConstants", "$filter", "$location", archiveController]);
    function archiveController($scope, $rootScope, DataService, SMAAlert, ProjectConstants, $filter, $location) {
        debugger
        CheckGroupAdmin()
        $scope.SurveyTitle = "";
        $scope.SurveyXML = null;
       
        $scope.surveyList = [];
        $scope.merchantList = [];
        //START NILESH-TSK3.0
        $scope.Activated = false;
        //END NILESH-TSK3.0
        $scope.schoolList = [];
        $scope.pssqs = [];
       
        var arcH = this;
        arcH.Archive = Archive;

        arcH.SurveyList = [];
        arcH.TESurveyList = [];
        arcH.SESurveyList = [];
        arcH.SurveyList = [];
        arcH.DynamicSurveyList = [];
        arcH.BSurveyList = [];
        arcH.BDynamicSurveyList = [];
        arcH.EducationLst = [];
        getListByName();
        getTESurveyListForUser();       
        return arcH;

        
        //------------------------------Business-------------------------------

        function getSurveyList() {
            getListByName();
            getTESurveyListForUser();
        }
        function getSurveyListForUser() {
            DataService.getSurveys()
            .success(function (data, status, headers, config) {
                arcH.SurveyList = data;
                // arcH.SurveyListShowSpinner = false;
            })
            .error(function (data, status, headers, config) {
                //arcH.SurveyListShowSpinner = false;
            });
        }

        function getTESurveyListForUser() {
            DataService.UserByParam("Education")
            .success(function (data, status, headers, config) {
                arcH.TESurveyList = data.filter(function (e){
                    return e.Archive == true;
                });
                if (arcH.TESurveyList.length > 0) {
                    arcH.EducationLst = arcH.TESurveyList;
                    $scope.show = true;
                }
                arcH.EducationLst.sort(SortByIDDesc)                
            })
            .error(function (data, status, headers, config) {
            });
        }
        function SortByIDDesc(x, y) {
            return ((x.Title == y.Title) ? 0 : ((x.Title > y.Title) ? 1 : -1));
        }
        function getListByName() {
            DataService.UserByParam("Business").then(
                function (response) {
                    if ($scope.AppC.IsTrialVersion === true) {

                        arcH.BSurveyList = response.data.filter(function (e) {
                            return e.Archive == true;
                        });;
                        if (arcH.BSurveyList.length > 0) {
                            $scope.show = false;
                        }
                        arcH.BSurveyList.sort(SortByIDDesc);
                        // arcH.SurveyListShowSpinner = false;
                    } else {
                        arcH.BDynamicSurveyList[index].IsLoading = false;
                        //START NILESH
                        if (response.data && response.data.length > 0 && response.data[0].SurveyTypeDisplayName != undefined && response.data[0].SurveyTypeDisplayName != "") {
                            arcH.BDynamicSurveyList[index].ListTitle = response.data[0].SurveyTypeDisplayName;
                        }
                        else {
                            arcH.BDynamicSurveyList[index].ListTitle = listTitle;
                        }
                        //END NILESH
                        arcH.BDynamicSurveyList[index].ListName = listName,
                        arcH.BDynamicSurveyList[index].Forms = response.data || []
                    }
                },
                function () {
                    arcH.BDynamicSurveyList[index].IsLoading = false;
                    // arcH.SurveyListShowSpinner = false;
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

        function Archive(SurveyID) {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            var merchantid = localStorage.getItem("merchantid");
            SMAAlert.CreateConfirmAlert("Are you sure you want<br>to Archive this Survey?", null, null, null, confirmCallback);
            function confirmCallback(val) {
                if (val == true) {
                    DataService.ArchiveSurvey(merchantid, SurveyID).success(function (res) {
                        getSurveyList();
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Survey has been successfully Archived!");
                    }).error(function (res) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("" + res);
                    })
                } else {
                    $scope.spinner.resolve();
                }
            }
        }

        function CheckGroupAdmin() {
            var id = localStorage.getItem("id");
            if (id) {
                DataService.RolesGetListForUser(id)
                         .success(function (response3, status, header, config) {
                             var userRoles = response3;
                             let Acntchk = userRoles.some(v=>v["RoleName"] == "AccountAdmin")
                             let Glblchk = userRoles.some(v=>v["RoleName"] == "GlobalAdmin")
                             if (Glblchk == true || Acntchk == true) {
                                 arcH.acntadmin = true
                             }
                             else {
                                 arcH.acntadmin = false
                             }
                         }).error(function (err) {
                             var v = err;
                             arcH.acntadmin = true;
                         })
            }
        }
    }
})();