(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("AccountAdminController", ["$scope", "$rootScope", "DataService", "SMAAlertFactory", "ProjectConstants", accountAdminController]);

    function accountAdminController($scope, $rootScope, DataService, SMAAlert, ProjectConstants) {
        $scope.AccountAdminInfo = getAccountAdminInfo();

        var aaC = this;
        aaC.showMenu = showMenu;
        aaC.closeMenu = closeMenu;
        aaC.submitForm = submitForm;

        initValidation();
        return aaC;

        function getAccountAdminInfo() {
            return {
                AccountName: "",
                StateSelect: "",
                County: "",
                ContactName: "",
                ContactEmail: "",
                IsTrialAccount: null,
                CustomerID: null
            };
        }
        // Show Menu
        function showMenu(merchantID) {
            //var spinner = SMAAlert.CreateSpinnerAlert();
            //if (merchantID) {
            //    var result = Merchant.MerchantGetDetails(merchantID);
            //    $.when(result).done(function (response) {
            //        var merchantDetails = response;

            //        // Inserts object values into html elements
            //        $("#MerchantIDHidden").val(merchantDetails.MerchantID);
            //        $("#AccountName").val(merchantDetails.Name);
            //        $("#StateSelect").val(merchantDetails.State);
            //        $("#County").val(merchantDetails.County);
            //        $("#ContactName").val(merchantDetails.ContactName);
            //        $("#ContactEmail").val(merchantDetails.ContactEmail);
            //        $("#IsTrialAccount").val(merchantDetails.IsTrialAccount);
            //        //$("#ExpirationDate").val(merchantDetails.ExpirationDate);

            //        // If a State is on the account, change the color
            //        if (merchantDetails.State) {
            //            selectColorBlack('StateSelect');
            //        }

            //        // If an Expiration Date is on the account, change the color
            //        //if (merchantDetails.ExpirationDate) {
            //        //    selectColorBlack('ExpirationDate');
            //        //}

            //        $("#EditMenu").css("display", "block");
            //        spinner.resolve();
            //    }).fail(function (statusText, status, response) {
            //        spinner.resolve();
            //        SMAAlert.CreateInfoAlert("Error", "Account information failed to load:<br><br>" + response);
            //    });
            //} else {
            $("#PopUpWindowHeading").html("New Account Information");
            $("#EditMenu").css("display", "block");
            //    spinner.resolve();
            //}
        }


        // Close Menu
        function closeMenu() {
            $("#EditMenu").css("display", "none");

            // Clears all html element values
            $("#PopUpWindowHeading").html("Update District Information");
            $("#MerchantIDHidden").val("");
            $("#AccountName").val("");
            $("#StateSelect").val("");
            $("#County").val("");
            $("#ContactName").val("");
            $("#ContactEmail").val("");
            //$("#ExpirationDate").val("");

            selectColorGrey('StateSelect');
            //selectColorGrey('ExpirationDate');

            $scope.validator1.resetForm();
        }
        function initValidation() {
            $scope.validator1 = $("#FormInputs").validate({
                rules: {
                    AccountName: {
                        required: true
                    },
                    StateSelect: {
                        required: true
                    },
                    County: {
                        required: true
                    },
                    ContactName: {
                        required: true
                    },
                    ContactEmail: {
                        required: true
                    }//,
                    //ExpirationDate: {
                    //    required: true
                    //}
                }
            });
        }


        // Save Form
        function submitForm() {
            var spinner = SMAAlert.CreateSpinnerAlert();
            if ($rootScope.businessrpt)
                var merchantype = "business";
            if ($rootScope.eductnrpt)
                merchantype = "education";
            var merchant = {
                MerchantID: -1,
                Name: $scope.AccountAdminInfo.AccountName,
                State: $scope.AccountAdminInfo.StateSelect,
                County: $scope.AccountAdminInfo.County,
                ContactName: $scope.AccountAdminInfo.ContactName,
                ContactEmail: $scope.AccountAdminInfo.ContactEmail,
                IsTrialAccount: $scope.AccountAdminInfo.IsTrialAccount,
                CustomerID: $scope.AccountAdminInfo.CustomerID,
                MerchantType: merchantype
                //ExpirationDate: $("#ExpirationDate").val()
            }

            //if (merchant.MerchantID == -1) { // If it's a new merchant

            //Add the new Merchant
            DataService.MerchantCreateNewFullAccountWithAdminLogin(merchant)
            .success(function (response, status, header, config) {
                //Gets the user object from local storage
                //var user = JSON.parse(localStorage.getItem("iAsp.User"));

                // Connects the new Merchant with the current user
                //var result = Users.UserMerchantAddNew(user.UserID, merchantID)
                //$.when(result).done(function (response2) {
                closeMenu();
                SMAAlert.CreateInfoAlert("New admin account is now available:<br><br>" + "iAspireAdmin-" + merchant.CustomerID);
                spinner.resolve();
                //}).fail(function (statusText, status, response) {
                //    spinner.resolve();
                //    SMAAlert.CreateInfoAlert("Error", "New account failed to save:<br><br>" + response);
                //});
            })
            .error(function (response, status, header, config) {
                spinner.resolve();
                if (response == null)
                    response = "";
                SMAAlert.CreateInfoAlert("Error", "New account failed to save:<br><br>" + response);
            });

            //} else {

            //    var result = Merchant.MerchantUpdate(merchant);
            //    $.when(result).done(function (response) {
            //        closeMenu();
            //        SMAAlert.CreateInfoAlert("District has been updated.");
            //        spinner.resolve();
            //    }).fail(function (statusText, status, response) {
            //        spinner.resolve();
            //        SMAAlert.CreateInfoAlert("Error", "Account failed to update:<br><br>" + response);
            //    });

            //}
        }






    }
})();