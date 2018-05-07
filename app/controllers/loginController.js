(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("LoginController", ["DataService", "$scope", "SMAAlertFactory", "ProjectConstants", "$timeout", "$location", loginController]);

    function loginController(DataService, $scope, SMAAlertFactory, ProjectConstants, $timeout, $location) {
        $scope.AppC.ActivePageName = "";

        //var vid = document.getElementsByClassName("bgvid")[0];
        //vid.muted = true;

        /*jshint validthis:true */
        var loginC = this;

        loginC.AnimationClass = "pageTransitionAnimation";

        loginC.UserLoginUserName = $scope.AppC.userLogin;
        loginC.UserLoginPassword = $scope.AppC.userPassword;
        loginC.ModuleName = ProjectConstants.App.ModuleName;
        loginC.Login = login;

        loginC.keyPressedEmail = keyPressedEmail;
        loginC.keyPressedPassword = keyPressedPassword;

        loginC.userClickedButton = false;

        if (ProjectConstants.App.PleaseUpdate === true) {
            $timeout(function () {
                showUpdateAlert();
            }, 250);
        }

        return loginC;

        // backend

        function login() {
            if (ProjectConstants.App.IsDownForMaintenance === true) { // quick check to see if the app is offline
                SMAAlertFactory.CreateInfoAlert("Oops!", "iAspire is currently down for maintenance.\n" + "Please try again later.");
            } else {
                if (!loginC.UserLoginUserName || loginC.UserLoginUserName === "") {
                    SMAAlertFactory.CreateInfoAlert("Oops!", "Please enter a valid username.");
                } else if (!loginC.UserLoginPassword || loginC.UserLoginPassword === "") {
                    SMAAlertFactory.CreateInfoAlert("Oops!", "Please enter a password.");
                } else {
                    window.spinner = SMAAlertFactory.CreateSpinnerAlert();

                    loginC.userClickedButton = true;

                    if (!loginC.ModuleName || loginC.ModuleName === "") {
                        loginC.ModuleName = "Unspecified";
                    }

                    var userLoginObject = {
                        UserLoginUserName: loginC.UserLoginUserName,
                        UserLoginPassword: loginC.UserLoginPassword,
                        ModuleName: loginC.ModuleName
                    };

                    DataService.validateUserLogin(userLoginObject)
                    .success(function (data, status, headers, config) {
                        window.spinner.resolve();
                        $scope.AppC.ActiveUser = data;
						localStorage.setItem("IBSUserData", JSON.stringify(data));
                        localStorage.setItem("id", data.UserID);
                        $location.path("account");
                    })
                    .error(function (data, status, headers, config) {
                        window.spinner.resolve();
                        if (status === 403) {
                            SMAAlertFactory.CreateInfoAlert(data, "Please contact iAspire for more information!");
                        } else {
                            SMAAlertFactory.CreateInfoAlert("Invalid Login", "Login credentials were incorrect\nPlease try again.");
                        }
                        loginC.userClickedButton = false;
                    });
                }
            }

        }

        function showUpdateAlert() {
            var top = '<div style="padding: 10px;"><div><h3>We have Updated iAspire to make your experience faster and better than ever.</h3><h3>Please visit your App Store and update iAspire</span></h3></div><br>';
            var middleiOS = '<div style="text-align:left;"><label>iPhone/iPad:</label><ul><li>Click on the App Store icon from your home screen</li><li>Tap the small Updates icon in the bottom-right corner of the screen</li><li>Tap "Update All" or "Update" beside iAspire</li></ul></div>';
            var brForBoth = '<br>';
            var middleAndroid = '<div style="text-align:left;"><label>Instructions</label><ul><li>Open the Google Play Store app from your home screen</li><li>Tap the menu button</li><li>Tap "My Apps and Games"</li><li>Tap iAspire</li><li>Tap Update</li></ul></div>';
            var bottom = '<br><div style="text-align:left;"><p>Thank you for choosing iAspire.  If you ever need us, we are here for you!  We are in this together.</p><p>Regards,</p><p>Team iAspire</p></div></div>';
            var message = top + middleiOS + brForBoth + middleAndroid + bottom;
            SMAAlertFactory.CreateCustomAlert(message, "");
        }

        function isEnterKey(keyCode) {
            if (keyCode === 13) return true;
            return false;
        }

        function keyPressedEmail(e) {
            if (isEnterKey(e.keyCode)) {
                $("#PasswordTextboxPosition").focus();
            }
        }

        function keyPressedPassword(e) {
            if (isEnterKey(e.keyCode)) {
                loginC.Login();
            }
        }        
       
    }
})();