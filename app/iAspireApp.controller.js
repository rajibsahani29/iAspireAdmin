(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .controller("AppController", ["$scope", "$rootScope", "$http", "DataService", "ProjectConstants", "SMAAlertFactory", "$location", controller]);

    function controller($scope, $rootScope, $http, DataService, ProjectConstants, SMAAlertFactory, $location) {
        
        // init databases
        //AppDatabase.init();
        //iAspireDatabase.init();

        /*jshint validthis:true */
        var AppC = this;
        $rootScope.eductnrpt = '';
        $rootScope.businessrpt = '';
        $rootScope.headrval = '';
        $rootScope.acntadmin = '';
        AppC.ActivePageName = "Home";
        AppC.ShowMobileHeader = true;
        AppC.ShowSidebar = true;
        AppC.AppVersion = ProjectConstants.App.Version;
        AppC.LegalInformation = ProjectConstants.App.LegalText;

        AppC.isUserAuthorized = false;
        AppC.rememberUser = true;

        AppC.ActiveUser = null;
        AppC.UserID = null;
        AppC.AccessID = null;
        AppC.UserRoles = []; // not currently built in
        AppC.Merchant = null;
        AppC.IsTeacher = false;

        AppC.IsTrialVersion = true;

        AppC.userLogin = "";
        AppC.userPassword = "";
        
        $scope.$on('$routeChangeStart', function(next, current) { 
            ManageControls();
        });

        $scope.$watch('AppC.ActiveUser', function (newActiveUser, oldActiveUser) {
            if (typeof newActiveUser !== "undefined" && newActiveUser !== oldActiveUser) {
                if (newActiveUser.UserID) {
                    var accessID = localStorage.getItem("AccessID");
					var UserData=localStorage.getItem("MainUserData");
                    clearLocalStorage();
                    sessionStorage.clear();
 localStorage.setItem("MainUserData", UserData);
                    localStorage.setItem("iAsp.SessionID", newActiveUser.SessionID);
                    localStorage.setItem("iAsp.LoginName", newActiveUser.FirstName + " " + newActiveUser.LastName);
                    localStorage.setItem("iAsp.User", JSON.stringify(newActiveUser));

                    if (AppC.rememberUser === true) {
                        localStorage.setItem("AccessID", JSON.stringify(newActiveUser.SessionID));
                    }
                    AppC.UserID = newActiveUser.UserID;
                    AppC.AccessID = newActiveUser.SessionID;
                    AppC.isUserAuthorized = true;
                    switch ($location.path()) {
                        case "/login":
                        case "/createAccount":
                        case "/forgotPassword":
                            $location.path("login");                         
                            //ManageControls(true);
                            break;
                        default:
                            // do nothing
                    }
                    //call Other Api Method Here if Required.

                } else {
                    // invalid login
                    //clearLocalStorage();
                    localStorage.removeItem("AccessID");
                    sessionStorage.clear();
                    AppC.isUserAuthorized = false;
                    switch ($location.path()) { // for some reason, using window.location.hash caused issues with IE with an infinite digestloop
                        case "/login":
                        case "/createAccount":
                        case "/forgotPassword":
                            // do nothing
                            return;
                        default:
                            //window.location.hash = "#/login";
                            $location.path("login");
                    }
                    SMAAlertFactory.CreateInfoAlert("You have been logged out!", "Please log in again.");
                }
            }
            //else { // this fires constantly, because "if (newActiveUser)" is only true for one loop on login, and is false because it hasn't changed for every loop after
                //clearLocalStorage();
                //sessionStorage.clear();
                //AppC.isUserAuthorized = false;
                //var hash = window.location.hash
                //switch (hash) {
                //    case "#/login":
                //    case "#/createAccount":
                //    case "#/forgotPassword":
                //        // do nothing
                //        return;
                //    default:
                //        window.location.hash = "#/login";
                //}
            //}
        }, true);

        // execute inits
        initHTTP();
        initUser();

        // return
        return AppC;

        function ManageControls(isVisible) {
            if (isVisible == undefined) {
                AppC.ShowMobileHeader = true;
                AppC.ShowSidebar = true;
                switch ($location.path()) {
                    case "/login":
                        AppC.ShowMobileHeader = false;
                        AppC.ShowSidebar = false;
                        break;
                    default:
                        break;
                }
            }
            else {
                AppC.ShowMobileHeader = isVisible;
                AppC.ShowSidebar = isVisible;
            }
        }
        
        function resetUser() {
            clearLocalStorage();
            sessionStorage.clear();
            AppC.isUserAuthorized = false;
            AppC.ActiveUser = null;
            AppC.UserID = null;
            AppC.AccessID = null;
            AppC.UserRoles = []; // not currently built in
            AppC.Merchant = null;
        }       
        // backend
        function initUser() {
            var accessID = localStorage.getItem("AccessID");
			var UserData = JSON.parse(localStorage.getItem("IBSUserData"));
            accessID = UserData ? UserData.SessionID : accessID;
            if (accessID !== null) {
                // add popup here, only fires if the accessID was saved
                //accessID = JSON.parse(accessID);
                AppC.AccessID = accessID;
                DataService.validateAccessID(accessID)
                .success(function (data, status, headers, config) {
                    AppC.ActiveUser = data;
                   // $rootScope.$broadcast('userid', data.UserID);
                    //ManageControls(true);
                })
                .error(function (data, status, headers, config) {
                    // add alert letting the person know they must log back in 
                    // because their session has ended... only if status === unauthorized
                    if (status === 403) {
                        SMAAlertFactory.CreateInfoAlert(data, "Please contact iAspire for more details");
                    }
                    resetUser();
                    window.location.hash = "#/login";
                    //ManageControls(false);
                });
            } else {
                // user is not remembered, must log in
                resetUser();
                window.location.hash = "#/login";
                //ManageControls(false);
            }
        }

        function initHTTP() {
            $http.defaults.headers.common["X-iA-AccessID"] = function () {
                return AppC.AccessID;
            };
        }

        function clearLocalStorage() {

            var arr = []; // Array to hold the keys
            // Iterate over localStorage and insert the keys that meet the condition into arr
            for (var i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).substring(0, 7) == '') {
                    arr.push(localStorage.key(i));
                }
            }

            // Iterate over arr and remove the items by key
            for (var i = 0; i < arr.length; i++) {
                localStorage.removeItem(arr[i]);
            }
        }
    }
})();