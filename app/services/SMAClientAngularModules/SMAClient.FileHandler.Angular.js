(function () {

    "use strict";

    angular
        .module("SMAFileHandler", []);
    angular
        .module("SMAFileHandler")
        .config(config)
        .run(runner)
        .factory("SMAFileHandlerValues", values)
        .factory("SMAFileHandlerInterface", ["SMAFileHandlerValues", SMAFHInterface]);

    function config() {
        /*jshint validthis:true */
        var conf = this;
        return conf;
    }

    function runner() {
        /*jshint validthis:true */
        var ru = this;
        return ru;
    }

    function values() {
        /*jshint validthis:true */
        var val = this;
        val.RequestedDirectorySize = (1024 * 1024 * 200); // 200 MB
        val.Directories = directories;
        val.FileTypes = fileTypes;

        var directories = {
            "Temp": null, // temporary directory, where it doesn't matter if the file is deleted or not (can be regenerated)
            "PersDirectory": null, // the directory for user-generated content that should be backed up 
            "PersNoCloud": null, // the directory for user-generated content that should not be backed up
            "LibDirectory": null, // the directory for application files/data that should be backed up
            "LibNoCloud": null // the directory for application files/data that should not be backed up
        };

        var fileTypes = {
            "Text": {
                get FileExtension() { return ".txt"; },
                get Encoding() { return "text/plain"; }
            },
            "JSON": {
                get FileExtension() { return ".json"; },
                get Encoding() { return "data:text/json;charset=utf8"; }
            },
            "XML": {
                get FileExtension() { return ".xml"; },
                get Encoding() { return "text/xml"; }
            },
            "Image": {
                get FileExtension() { return ".jpg.SMANoMedia"; },
                get Encoding() { return "data:image/jpeg;base64"; }
            },
            "Video": {
                get FileExtension() { return ".mp4.SMANoMedia"; },
                get Encoding() { return "data:video/mp4;base64"; }
            }
        };
		
        return val;
    }

    function SMAFHInterface(SMAFileHandlerValues) {

    }

})();