(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .config(["$routeProvider", config]);

    function config($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "app/views/loginView.html",
                controller: "LoginController",
                controllerAs: "loginC"
            })
            .when("/sidebar", {
                templateUrl: "app/views/sideBarView.html",
                controller: "SidebarController",
                //controllerAs: "sdbr"
            })
            .when("/account", {
                templateUrl: "app/views/accountView.html",
                controller: "AccountController",
                controllerAs: "accC"
            })
            .when("/accountAdmin", {
                templateUrl: "app/views/accountAdminView.html",
                controller: "AccountAdminController",
                controllerAs: "aaC"
            })
            .when("/sites", {
                templateUrl: "app/views/siteView.html",
                controller: "SiteController",
                controllerAs: "siteC"
            })
            .when("/roles", {
                templateUrl: "app/views/roleView.html",
                controller: "RoleController",
                controllerAs: "roleC"
            })
            .when("/users", {
                templateUrl: "app/views/userView.html",
                controller: "UserController",
                controllerAs: "userC"
            })
            .when("/departments", {
                templateUrl: "app/views/departmentView.html",
                controller: "DepartmentController",
                controllerAs: "deptC"
            })
            .when("/form", {
                templateUrl: "app/views/formView.html",
                controller: "FormController",
                controllerAs: "formC"
            })
            .when("/formeditor/:SurveyID", {
                templateUrl: "app/views/formEditorView.html",
                controller: "FormEditorController",
                controllerAs: "formEditC"
            })
            .when("/faculty", {
                templateUrl: "app/views/Faculty.html",
                controller: "FacultyController",
                controllerAs: "Facultyf"
            })
            .when("/Grade", {
                templateUrl: "app/views/GradeView.html",
                controller: "GradeController",
                controllerAs: "Grd"
            })
            .when("/archive", {
                templateUrl: "app/views/archiveView.html",
                controller: "archiveController",
                controllerAs: "arcH"
            })
            // fallback
            .otherwise({
                //redirectTo: function () {
                //    return (localStorage.getItem("AccessID") === null) ? "/login" : "/selection";
                //}
                redirectTo: "/login"
            });
    }

})();