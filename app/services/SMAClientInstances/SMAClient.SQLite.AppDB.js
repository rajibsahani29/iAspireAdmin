(function () {

    "use strict";

    angular
        .module("SMAClient.SQLite.App", ["SMAClient.SQLite"]);
    angular
        .module("SMAClient.SQLite.App")
        .constant("iA_DB_CONST", {
            Name: "AppDatabase",
            Version: "1.0",
            Description: "The local database for app-specific uses",
            Size: -1
        })
        .factory("AppDatabase", ["iA_DB_CONST", "SMASQLInitialization", appDatabase]);

    function appDatabase(iA_DB_CONST, SMASQLInitialization) {
        /*jshint validthis:true */
        var appDB = this;

        appDB.db = null;

        appDB.init = initialization;

        return appDB;

        function initialization() {
            try {
                var db = SMASQLInitialization.init(iA_DB_CONST);
                if (db) {
                    appDB.db = db;
                }
            } catch (ex) {
                console.error(ex);
            }
        }
    }

})();