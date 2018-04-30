(function () {

    "use strict";

    angular
        .module("SMAClient.SQLite.iAspire", ["SMAClient.SQLite"]);
    angular
        .module("SMAClient.SQLite.iAspire")
        .constant("App_DB_CONST", {
            Name: "iAspireDatabase",
            Version: "1.0",
            Description: "The iAspire database for the iAspire app",
            Size: -1
        })
        .factory("iAspireDatabase", ["App_DB_CONST", "SMASQLInitialization", "SMASQLFunctions", iAspireDatabase]);

    function iAspireDatabase(App_DB_CONST, SMASQLInitialization, SMASQLFunctions) {
        /*jshint validthis:true */
        var iADB = this;

        iADB.db = null;
        
        iADB.init = initialization;

        return iADB;

        function initialization() {
            try {
                var db = SMASQLInitialization.init(App_DB_CONST);
                if (db) {
                    iADB.db = db;
                }
            } catch (ex) {
                console.error(ex);
            }
        }
    }

})();