// Change select to black text
function selectColorBlack(id) {
    $("#" + id).css("color", "black");
}

// Change select to grey text
function selectColorGrey(id) {
    $("#" + id).css("color", "#acacac");
}

// Spinner Functions
function createSpinner() {
    $("#circle_spinner").show();
    $("#FormInputs").hide();
}

function resolveSpinner() {
    $("#circle_spinner").hide();
    $("#FormInputs").show();
}

// dark theme
function loadDarkTheme() {
    $("head").append("<link rel='stylesheet' id='darkThemeCSS' href='css/darkTheme.css' />");
    $("#themeButton").attr("onclick", "unloadDarkTheme()").html("Light Theme");
    localStorage.setItem("theme", "dark");
}
function unloadDarkTheme() {
    $("#darkThemeCSS").remove();
    $("#themeButton").attr("onclick", "loadDarkTheme()").html("Dark Theme");
    localStorage.setItem("theme", "light");
}
function checkTheme() {

}
 

// Document Ready
$(document).ready(function () {
    
    var userName = localStorage.getItem("iAsp.LoginName");
    if (userName !== null) {
        $("#UserNameDisplay").html(userName);
    }

    if ($("#SearchBox").length) {
        searchBox();
    }

    if (localStorage.getItem("theme")) {
        var theme = localStorage.getItem("theme");

        if (theme == "dark") {
            loadDarkTheme();
        }
    } else {
        localStorage.setItem("theme", "light");
    }
});