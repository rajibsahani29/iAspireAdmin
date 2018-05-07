(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .directive("formSearchBox", ["$timeout",FormSearchBox])
        .directive("mobileheader", MobileHeaderView)
        .directive("header", HeaderView)
        .directive("sidebar", sideBarView)
        .directive("dlmenu", dlMenu)
        .directive('onclickRoute', ['$location', OnClickRoute])
        .directive("iaspemailvalidation", emailValidation)
        .directive("passwordvalidation", passwordValidation)
        .directive("removengemailvalidation", removeNgEmailValidation)
        .directive("removengdatevalidation", removeNgDateValidation)
        .directive("datepicker", datepicker)
        .directive("datetimepicker", datetimepicker)
		
    function FormSearchBox($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                $timeout(function () {
                    angular.element("#SearchBox").bind("input", function () {
                        processSearchBox();
                    });
                    angular.element("#SearchBox").change(function () {
                        processSearchBox();
                    });
                }, 0);
                //$("#SearchBox")[0].addEventListener("input", function () {
                //    processSearchBox();
                //});
                //$("#SearchConstraint").change(function () {
                //        processSearchBox();
                //});

                function processSearchBox()
                {
                    var search = $("#SearchBox").val().toLowerCase();
                    var searchConstraint = $("#SearchConstraint").val();
                    if (search !== "") {
                        $(".Searchable").each(function (index) {
                            // Gets the data on the searchable element
                            var data = $(this).data();

                            // If the search value matches anywhere in the data-bind(based off the constraint)
                            if (data[searchConstraint].toLowerCase().indexOf(search) > -1) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        });
                    }
                    else {
                        // Loops through each searchable element and show it
                        $(".Searchable").each(function (index) {
                            $(this).show();
                        });
                    }
                }
                
            }
        };
    }
    function OnClickRoute($location) {
        return {
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    scope.$apply(function () {
                        //alert(attrs.onclickRoute)
                        console.log(attrs.onclickRoute);
                        $location.path(attrs.onclickRoute);
                    });
                });
            }
        }
    };
    function dlMenu() {
        return {
            restrict: 'A',
            scope: {
                'model': '='
            },
            link: function (scope, elem, attrs) {
                $(elem).dlmenu(scope.model);
            }
        };
    }

    function MobileHeaderView() {
        return {
            restrict: 'E',
            replace: true,
            transclude:true,
            scope: true,
            templateUrl: 'app/views/mobileHeaderView.html'
        }
    }
    function HeaderView() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            templateUrl: 'app/views/headerView.html'
        }
    }

    function sideBarView() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            templateUrl: 'app/views/sideBarView.html'
        }
    }

    function emailValidation() {
        var emailRegEx = /([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elm, attrs, ctrl) {
                var validator = function (value) {
                    ctrl.$setValidity('iaspemailvalidation', emailRegEx.test(value));
                    return value;
                };
                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.unshift(validator);
            }
        };
    }

    function passwordValidation() {
        //var passwordRegEx = /(?=^.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
        //var passwordRegEx = /(?=^.{8,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^*()_+}{":;'?/<.>,])(?!.*\s).*$/;
        var passwordRegEx = /(?=^.{6,}$)(?!.*\s).*$/; // 6 or more characters and no spaces
        return {
            require: 'ngModel',
            restrict: '',
            link: function (scope, elm, attrs, ctrl) {
                var validator = function (value) {
                    ctrl.$setValidity('passwordvalidation', passwordRegEx.test(value));
                    return value;
                };
                ctrl.$parsers.unshift(validator);
                ctrl.$formatters.unshift(validator);
            }
        };
    }

    function removeNgEmailValidation() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$validators.email = function () {
                    return true;
                };
            }
        };
    }

    function removeNgDateValidation() {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$validators.date = function () {
                    return true;
                };
            }
        };
    }

    function datepicker() {
        return {
            restrict: 'A',
            require: 'ngModel',
            transclude: true,
            link: function (scope, element, attrs, ngModelCtrl) {
                setTimeout(function () {
                    element.datepicker({
                        dateFormat: 'MM dd, yy',
                        onSelect: function (date) {
                            scope.$parent.$parent.q.SelectedOption = date;
                            scope.$apply();
                        }
                    });
                });
            }
        };
    }

    function datetimepicker() {
        return {
            restrict: 'A',
            require: 'ngModel',
            transclude: true,
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!Modernizr.inputtypes["datetime-local"]) {
                    setTimeout(function () {
                        //var momentFormatDate = 'MM/DD/YYYY';
                        var momentFormatDate = 'YYYY-MM-DD';
                        //var momentFormatTime = 'h:mm a';
                        element.datetimepicker({
                            //format: momentFormatDate + ' ' + momentFormatTime,
                            format: momentFormatDate,
                            formatDate: momentFormatDate,
                            //formatTime: momentFormatTime,
                            timepicker: false,
                            onChangeDateTime: function (currentTime, selectedTime) {
                                //scope.value = selectedTime;
                                scope.value = moment(selectedTime, momentFormatDate).format(momentFormatDate);
                                scope.$apply();
                            }
                        });
                        scope.$apply();
                    });
                } else {
                    $(element).attr("type", "date");
                }
            }
        };
    }




    


})();