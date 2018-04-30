(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .factory("ProjectConstants", projectConstants);

    function projectConstants() {

        /*jshint validthis:true */
        var pC = this;

        pC.App = function () { };
        pC.App.Version = "2.0.10";
        pC.App.LegalText = "© 2015 iAspire. All rights reserved.";
        pC.App.ModuleName = "iAspire_AdminPages";
        pC.App.AreReportsReady = true;
        pC.App.IsDownForMaintenance = false;
        pC.App.PleaseUpdate = false;

        // query string parameters for survey stuff
        pC.QWRYSTR = function () { };

        // integer constants
        pC.Integers = function () { };
        pC.Integers.LoadDelayTime = 400; // milliseconds


        return pC;

        function getCurrentDateTimeValue() {
            return moment().format("MM-DD-YYYY");
        }

        function getCurrentTimeValue() {
            return moment().format("hh:mm A");
        }
    }

})();