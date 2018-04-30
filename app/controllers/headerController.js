(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("HeaderController", ["$scope", "DataService", "SMAAlertFactory", "ProjectConstants", headerController]);

    function headerController($scope, DataService, SMAAlertFactory, ProjectConstants) {
        var headC = this;
        $scope.userName = localStorage.getItem("iAsp.LoginName");
        if ($scope.userName == "") $scope.userName = "Account"
        $scope.Logout = logout;
        $scope.mobileMenuJson = { animationClasses: { classin: 'dl-animate-in-2', classout: 'dl-animate-out-2' } };
        return headC;

        function logout() {
            function confirmCallback(val) {
                if (val === true) {
                    DataService.UserLogout()
                    .success(function (data, status, headers, config) {
                        $scope.AppC.ActiveUser.UserID = null;
                    })
                    .error(function (data, status, headers, config) {
                        // we don't really care if it failed... the user clicked logout
                        $scope.AppC.ActiveUser.UserID = null;
                    });
                }
                //else if (val === false) {

                //} else {

                //}
            }
            SMAAlertFactory.CreateConfirmAlert("Are you sure you want to log out?", null, null, null, confirmCallback);
        }
    }

})();