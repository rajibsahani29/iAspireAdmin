(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .run(["AppDatabase", "iAspireDatabase", "$rootScope", "DataService", "SMAAlertFactory", "$location", runner]);

    function runner(AppDatabase, iAspireDatabase, $rootScope, DataService, SMAAlert, $location) {
        //AppDatabase.init();
        //iAspireDatabase.init();
        //gChartAPI.init();

        Date.parseDate = function (input, format) {
            return moment(input, format).toDate();
        };
        Date.prototype.dateFormat = function (format) {
            return moment(this).format(format);
        };
        //String.prototype.capitalizeFirstLetter = function () {
        //    return this.charAt(0).toUpperCase() + this.slice(1);
        //}

        $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
            //alert(current.$$route.originalPath.indexOf("/login"));
            if (current.$$route.originalPath.indexOf("/login") < 0)
            {
                checkRights();
            }
        });
         
        function checkRights() {
            // Gets the role rights
            DataService.RolesGetListForCurrentUserWithRights()
            .success(function (response, status, header, config) {
                var roleRights = response;
				let GlobalAminchk = roleRights.some(v=>v["RoleName"] == "GlobalAdmin")
                let AcntAdminchk = roleRights.some(v=>v["RoleName"] == "AccountAdmin")
                if (GlobalAminchk == true || AcntAdminchk) {
                    $rootScope.acntadmin = true
                }
                else {
                    $rootScope.acntadmin = false
                }
                ChecMerchantType()
                for (var i = 0, leni = roleRights.length; i < leni; i++) {
                    for (var j = 0, lenj = roleRights[i].Rights.length; j < lenj; j++) {
                        var rightRank = roleRights[i].Rights[j].RightRank;
                        if (rightRank > 100) {
                            rightRank = rightRank - 100;
                        }

                        if (rightRank == 1) {
                            var cssString = ""
                            for (var k = 2; k < 42; k++) {
                                //sheet.innerHTML.append =
                                cssString +=
                                    ".RightRank" + k + " { display: block !important; }" +
                                    ".verticalalign.RightRank" + k + " {display: table-cell !important; }" +
                                    ".inputRightRank" + k + ", .inputRightRank" + k + " + label, .deleteRightRank" + k + " { pointer-events: initial !important; visibility: initial !important; }" +
                                    ".noRightRank" + k + " { display: none; }";
                                //$(".verticalalign.RightRank" + k).css("display", "table-cell");
                                //$(".inputRightRank" + k).css("pointer-events", "initial");
                                //$(".inputRightRank" + k + " + label").css("pointer-events", "initial");
                                //$(".deleteRightRank" + k).css("visibility", "initial").css("pointer-events", "initial");
                                //$(".noRightRank" + k).hide();
                            }
                            //sheet.innerHTML.append 
                            cssString += ".RightRank1 { display: table !important; }"
                            //$(".RightRank1").css("display", "table");
                            var sheet = document.createElement('style');
                            sheet.innerHTML = cssString;
                            document.body.appendChild(sheet);
                        } else {
                            var cssString =
                                ".RightRank" + rightRank + " { display: block !important; }" +
                                ".verticalalign.RightRank" + rightRank + " {display: table-cell !important; }" +
                                ".inputRightRank" + rightRank + ", .inputRightRank" + rightRank + " + label, .deleteRightRank" + rightRank + " { pointer-events: initial !important; visibility: initial !important; }" +
                                ".noRightRank" + rightRank + " { display: none; }";
                            //$(".RightRank" + rightRank).show();
                            //$(".verticalalign.RightRank" + k).css("display", "table-cell");
                            //$(".inputRightRank" + k).css("pointer-events", "initial");
                            //$(".inputRightRank" + k + " + label").css("pointer-events", "initial");
                            //$(".deleteRightRank" + k).css("visibility", "initial").css("pointer-events", "initial");
                            //$(".noRightRank" + rightRank).hide();
                            var sheet = document.createElement('style');
                            sheet.innerHTML = cssString;
                            document.body.appendChild(sheet);
                        }
                    }
                }
            })
            .error(function (response, status, header, config) {
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Error", "Failed to retrieve role rights:<br><br>" + response, function () {
                        window.location.hash = "#/login";
                    });
                }
            });
        }

        $rootScope.changeRoute = function (path) {
            $location.path(path);
        };

function ChecMerchantType() {
            var merchantData = JSON.parse(localStorage.getItem("iAsp.User"));
            DataService.surveyTypeGetList(merchantData.MerchantID).then(function (res) {
                var SurveyTypeList = res.data;
                if (SurveyTypeList.length > 0) {
                    $.map(SurveyTypeList, function (elem, index) {
                        if (elem.SurveyTypeID.toUpperCase() == "23385B0F-60E2-482C-B8B3-4EC217DF409E" || elem.SurveyTypeID.toUpperCase() == "9BAFFB63-2177-424D-9B8F-C1BAE984B0F0" ||
                            elem.SurveyTypeID.toUpperCase() == "E8F029C9-399C-4137-A66B-E05C5F923CE2") {
                            $rootScope.headrval = "Business";
                            $rootScope.businessrpt = true;
                            $rootScope.eductnrpt = false;
                        }
                        if (elem.SurveyTypeID.toUpperCase() == "55DFE451-6BF3-484B-950D-1384E20EF3B6" || elem.SurveyTypeID.toUpperCase() == "222B448D-E08A-43B6-B70F-7A19867336EA" ||
                            elem.SurveyTypeID.toUpperCase() == "B58916CE-CD62-4036-937D-8308B8568A6D") {
                            $rootScope.headrval = "Education";
                            $rootScope.eductnrpt = true;
                            $rootScope.businessrpt = false;
                        }
                    })
                }
                else {                    
                    if (merchantData.MerchantType == "business") {
                        $rootScope.headrval = "Business";
                        $rootScope.businessrpt = true;
                        $rootScope.eductnrpt = false;
                    }
                    if (merchantData.MerchantType == "education") {
                        $rootScope.headrval = "Education";
                        $rootScope.eductnrpt = true;
                        $rootScope.businessrpt = false;
                    }
                }
            });
        }
    }

})();