
(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("SidebarController", ["DataService", "$scope", "$rootScope", "SMAAlertFactory", "ProjectConstants", "$location", SidebarController]);


    function SidebarController(DataService, $scope, $rootScope, SMAAlert, ProjectConstants, $location) {
        loadImage();
        $scope.TESurveyList = [];
        $scope.SESurveyList = [];
        $scope.UserId = '';
        $scope.my = { message: true };
        var sdbr = this;
        return sdbr;

        function loadImage() {
            var url = window.location.href;
            url = url.split("#");
            url = url[0];
            $scope.ImgUrl = url + "images/GradeLogoWhite.png";
        }



    }
})();