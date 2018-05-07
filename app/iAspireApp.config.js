(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .factory("timeoutHttpIntercept", [httpIntercept])
        .config(["$httpProvider", configFunc]);

    function configFunc($httpProvider) {
        $httpProvider.interceptors.push('timeoutHttpIntercept');
    }

    function httpIntercept() {
        return {
            "request": function (config) {
                if (!config.timeout || config.timeout === 30 * 1000) {
                    config.timeout = 1000 * 60 * 2; // 60 second timeout
                }
                return config;
            }
        };
    }

})();