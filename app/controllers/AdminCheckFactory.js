


angular
        .module("admincheck", []);
angular
    .module("admincheck")
    .config(config)
    .run(run)    
    .factory("admincheckfactory", [controller]);


//var app = angular.module("admincheckfact",[]);

//app.factory("admincheck", function ($http) {
//    debugger
//function getTESurveyListForUser() {
//    DataService.getTESurveyListForUser()
//    .success(function (data, status, headers, config) {
//        sc.TESurveyList = data;
//        if (sc.TESurveyList.length > 0) {
//            educationrpt();
//        }
//        else {
//            businessrpt();
//        }

//    })
//}

//function getSESurveyListForUser() {
//    DataService.getSESurveyListForUser()
//    .success(function (data, status, headers, config) {
//        sc.SESurveyList = data;
//        if (sc.SESurveyList.length > 0) {
//            educationrpt();
//        }
//        else {
//            businessrpt();
//        }
//    })
//}
//function educationrpt() {
//    if (sc.TESurveyList.length > 0 || sc.SESurveyList.length > 0) {
//        //alert("Education")
//        $scope.eductnrpt = true;
//        $scope.businessrpt = false;
//    }
//}

//function businessrpt() {
//    if ((sc.TESurveyList.length < 0 && sc.SESurveyList.length > 0) || (sc.TESurveyList.length > 0 && sc.SESurveyList.length < 0) || (sc.TESurveyList.length <= 0 && sc.SESurveyList.length <= 0)) {
//        //alert("Business")
//        $scope.businessrpt = true;
//        $scope.eductnrpt = false;
//    }
//}
//})