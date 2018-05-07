/// <reference path="../views/departmentView.html" />
(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("GradeController", ["$scope", "DataService", "SMAAlertFactory", "ProjectConstants", "$filter", "$timeout", GradeController]);

    function GradeController($scope, DataService, SMAAlert, ProjectConstants, $filter, $timeout) {
        page_init()
        $scope.popup = {
            title: 'User - Information',
            showMenu: showMenu,
            closeMenu: closeMenu,
            showBulkMenu: showBulkMenu1,
            closeBulkMenu: closeBulkMenu,
            // showDeptMenu: showDeptMenu,
            closeDeptMenu: closeDeptMenu,
            submitClicked: false,
            showDeleteButton: true,
            showChangePassword: false,
            changePasswordText: "Change password?",
        }
        getMerchants()
        getAllGrade()
        // loadMerchantInfo();
        $scope.MerchantUsers = [];
        $scope.userList = [];
        $scope.merchant = [];
        $scope.userInfo = getUserInfoObject();
        $scope.DeptSchoolList = [];
        $scope.spinnerArr = [];
        $scope.objGradeList = [];
        $scope.filterdata = [];
        $scope.GradeName = null;
        $scope.schoolList = [];
        var Grd = this;


        function page_init() {

            // Sets all session storage variables as empty
            sessionStorage.setItem("us_alreadySaved", "");
            sessionStorage.setItem("us_toBeAdded", "");
            sessionStorage.setItem("us_toBeDeleted", "");

            sessionStorage.setItem("uta_alreadySaved", "");
            sessionStorage.setItem("uta_toBeAdded", "");
            sessionStorage.setItem("uta_toBeDeleted", "");

            sessionStorage.setItem("ur_alreadySaved", "");
            sessionStorage.setItem("ur_toBeAdded", "");
            sessionStorage.setItem("ur_toBeDeleted", "");

            sessionStorage.setItem("mu_alreadySaved", "");
            sessionStorage.setItem("mu_toBeAdded", "");
            sessionStorage.setItem("mu_toBeDeleted", "");

            $("#showBulkMenu").click(function () {
                $scope.userInfo.UserID = -999;
            });

            $("#CancelLabel").click(function () {
                $scope.userInfo.UserID = "";
            });

            // Sets the form validation rules
            $scope.validator = $("#FormInputs").validate({
                rules: {
                    UserEmail: {
                        required: true
                    },
                    UserPassword: {
                        required: {
                            depends: function (element) {
                                return ($scope.userInfo.UserID == -1);
                            }
                        }
                    },
                    UserFirstName: {
                        required: true
                    },
                    UserLastName: {
                        required: true
                    }
                }
            });

            // Sets the form validation rules
            $scope.validator1 = $("#FormInputs").validate({
                rules: {
                    FirstName: {
                        required: true
                    },
                    LastName: {
                        required: true
                    },
                    Email: {
                        required: true
                    },
                    MerchantSelect: {
                        required: true
                    }
                }
            });
            var url = window.location.href;
            url = url.split("#");
            url = url[0];
            $scope.ImgUrl = url + "images/GradeLogoBlue.png";
        }
        function getUserInfoObject() {
            return {
                UserID: '',
                UserName: '',
                Password: '',
                FirstName: '',
                LastName: '',
                Email: '',
                MerchantID: '',
                userTeacher: { TeacherID: '' },
                userState: '',
            };
        }
        function clearUserInfo() {
            $scope.userInfo.UserID = -1;
            $scope.userInfo.UserName = '';
            $scope.userInfo.Password = '';
            $scope.userInfo.FirstName = '';
            $scope.userInfo.LastName = '';
            $scope.userInfo.Email = '';
            $scope.userInfo.MerchantID = ''
        }
        // Populate Users
        function populateUsers() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            //$("#MerchantSelect").html('<option class="FontColor3" disabled selected value="">District</option>');

            // Clears out the window variable for merchant users
            $scope.MerchantUsers = null;

            getMerchants();
        }

        // Get Merchants
        function getMerchants() {

            DataService.MerchantGetListByCurrentUser()
            .success(function (response1, status, header, config) {
                var merchants = response1;

                if (merchants !== "") {

                    if (merchants.length > 0) {
                        merchants.sort(function (a, b) {
                            var nameA = a.Name.toLowerCase();
                            var nameB = b.Name.toLowerCase();
                            if (nameA < nameB) {
                                return -1;
                            } else if (nameA > nameB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    }
                    $scope.userInfo.merchantList = merchants;
                    $scope.merchant.MerchantID = merchants[0].MerchantID;
                    $scope.userInfo.merchantList.forEach(function (obj) { obj.selection = false; });
                    populateUsersLoop(merchants, 0, merchants.length, [], []);
                    loadMerchantInfo(merchants[0].MerchantID)
                } else {
                    $scope.spinner.resolve();
                }
            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve accounts:<br><br>" + response);
                }
            });
        }

        // Populate Users Psuedo Loop
        function populateUsersLoop(merchants, merchants_index, merchants_length, users, forbiddenErrors) {
            if (merchants_index < merchants_length) {

                DataService.UserGetListForMerchant(merchants[merchants_index].MerchantID)
                .success(function (response1, status, header, config) {
                    var new_users = response1;

                    var merchantUsers = [];

                    function addUserIfNotAlreadyExists(userList, newUser) {
                        var wasFound = false;
                        for (var index in userList) {
                            if (userList[index].UserID == newUser.UserID) {
                                wasFound = true;
                                userList[index].MerchantsList.push(newUser.MerchantID);
                                break;
                            }
                        }
                        if (wasFound == false) {
                            newUser.MerchantsList = [newUser.MerchantID];
                            userList.push(newUser);
                        }
                    }

                    for (var i = 0, len = new_users.length; i < len; i++) {
                        new_users[i].MerchantID = merchants[merchants_index].MerchantID;
                        addUserIfNotAlreadyExists(users, new_users[i]);

                        var merchantUser = {
                            UserID: new_users[i].UserID,
                            MerchantID: new_users[i].MerchantID
                        }
                        merchantUsers.push(merchantUser);
                    }

                    //Adds the merhant id to the user object
                    //for (var i = 0, len = new_users.length; i < len; i++) {
                    //    new_users[i].MerchantID = merchants[merchants_index].MerchantID;
                    //    users.push(new_users[i]);
                    //}

                    //if (users.length > 0) {
                    //    $("#UsersContainer").append($("#UserTemplate").render(users));
                    //    $("#Datalist").append($("#DatalistTemplate").render(users));
                    //} else {
                    //    $("#UsersContainer").append("<div class='NoUsersHeader Searchable' data-merchantid='" + merchants[merchants_index].MerchantID + "'>No users are available for this merchant.</div>");
                    //}

                    if ($scope.MerchantUsers == undefined) {
                        $scope.MerchantUsers = merchantUsers;
                    } else {
                        $scope.MerchantUsers = $scope.MerchantUsers.concat(merchantUsers);
                    }

                    merchants_index++;
                    populateUsersLoop(merchants, merchants_index, merchants_length, users, forbiddenErrors);
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve users:<br><br>" + response);
                    } else {
                        forbiddenErrors.push(merchants[merchants_index].MerchantID);
                        merchants_index++;
                        populateUsersLoop(merchants, merchants_index, merchants_length, users, forbiddenErrors);
                    }
                });

            } else {
                if (users !== "") {
                    for (var i = 0, len = users.length; i < len; i++) {
                        if (users[i].userTeacher == undefined) {
                            users[i].userTeacher = {
                                TeacherID: ""
                            }
                        }
                        if (users[i].UserName.substring(0, 9) == "inactive-") {
                            users[i].userState = "inactive";
                        } else {
                            users[i].userState = "active";
                        }
                    }

                    if (users.length > 0) {
                        users.sort(function (a, b) {
                            var nameA = a.LastName.toLowerCase();
                            var nameB = b.LastName.toLowerCase();
                            if (nameA < nameB) {
                                return -1;
                            } else if (nameA > nameB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    }
                    $scope.userList = users;
                }

                // Resolves the spinner once our psuedo loop finishes
                $scope.spinner.resolve();
                if (forbiddenErrors.length > 0) {
                    console.log("Failed to retreive Users for the following Merchants:");
                    for (var i = 0, ii = forbiddenErrors.length; i < ii; i++) {
                        console.log(forbiddenErrors[i]);
                    }
                }
            }
        }
        function showMenu(gradeid) {
            clearUserInfo();
            $scope.GradeID = gradeid;
            sessionStorage.setItem("mu_alreadySaved", "");
            sessionStorage.setItem("mu_toBeAdded", "");
            sessionStorage.setItem("mu_toBeDeleted", "");

            sessionStorage.setItem("us_alreadySaved", "");
            sessionStorage.setItem("us_toBeAdded", "");
            sessionStorage.setItem("us_toBeDeleted", "");

            sessionStorage.setItem("uta_alreadySaved", "");
            sessionStorage.setItem("uta_toBeAdded", "");
            sessionStorage.setItem("uta_toBeDeleted", "");

            sessionStorage.setItem("ur_alreadySaved", "");
            sessionStorage.setItem("ur_toBeAdded", "");
            sessionStorage.setItem("ur_toBeDeleted", "");
            // If a userID is passed, then populate the form
            if (gradeid) {
                //$scope.spinner = SMAAlert.CreateSpinnerAlert();
                // Gets the user object from the data-bindings
                var user = $("#" + gradeid).data();
                $scope.GradeName = user.name;
                $scope.popup.showChangePassword = false;
                $scope.popup.title = "Grade - Information";
                $scope.popup.showDeleteButton = true;
                DataService.getSchoolListByGrade(gradeid).success(function (res) {
                    var classGrades = res;
                    if (classGrades.length <= 0) {
                        $scope.objFilterdGrdList = [];
                    } else {
                        var grdlst = $scope.objGradeList;
                        if (classGrades.length > 0) {
                            // deselectAllGrades();
                            var us_alreadySaved = [];
                            for (var i = 0, len = classGrades.length; i < len; i++) {
                                $("#" + classGrades[i].SchoolID).prop("checked", true);
                                us_alreadySaved.push(classGrades[i].SchoolID);

                            }
                            us_alreadySaved = us_alreadySaved.join(",");
                            sessionStorage.setItem("us_alreadySaved", us_alreadySaved);                            
                        }
                    }
                    $("#EditMenu").css("display", "block");
                })
            } else {
                // Hides the Delete Button
                $scope.popup.showDeleteButton = false;
                $scope.popup.showChangePassword = true;

                // Changes the form's header and sets the userID to -1(this tells the db that it's new)
                $scope.popup.title = "New Grade -  Information";
                $scope.userInfo.userID = -1;
                $("#EditMenu").css("display", "block");
                $("#UserName").focus();
            }
        }
        function showBulkMenu1(gradeid) {
            $scope.popup.showDeleteButton = false;
            $scope.popup.showChangePassword = true;
            // Changes the form's header and sets the userID to -1(this tells the db that it's new)
            $scope.popup.title = "Add Grade Bulk";
            $scope.userInfo.userID = -1;
            $("#BulkMenu").css("display", "block");
        }
        function closeBulkMenu() {
            // Clears all html element values
            clearUserInfo();
            $scope.popup.showChangePassword = true;
            $scope.GradeID = -1;

            // Chages the select back to placeholder grey
            //selectColorGrey('MerchantSelect');

            // Clears all sessionStorage
            sessionStorage.setItem("mu_alreadySaved", "");
            sessionStorage.setItem("mu_toBeAdded", "");
            sessionStorage.setItem("mu_toBeDeleted", "");

            sessionStorage.setItem("us_alreadySaved", "");
            sessionStorage.setItem("us_toBeAdded", "");
            sessionStorage.setItem("us_toBeDeleted", "");

            sessionStorage.setItem("uta_alreadySaved", "");
            sessionStorage.setItem("uta_toBeAdded", "");
            sessionStorage.setItem("uta_toBeDeleted", "");

            sessionStorage.setItem("ur_alreadySaved", "");
            sessionStorage.setItem("ur_toBeAdded", "");
            sessionStorage.setItem("ur_toBeDeleted", "");

            // Resets all validation errors
            $scope.validator.resetForm();

            $("#BulkMenu").css("display", "none");
        }
        function closeMenu() {
            // Clears all html element values
            clearUserInfo();
            $scope.popup.showChangePassword = true;
            $scope.GradeID = -1;

            // Chages the select back to placeholder grey
            //selectColorGrey('MerchantSelect');

            // Clears all sessionStorage
            sessionStorage.setItem("mu_alreadySaved", "");
            sessionStorage.setItem("mu_toBeAdded", "");
            sessionStorage.setItem("mu_toBeDeleted", "");

            sessionStorage.setItem("us_alreadySaved", "");
            sessionStorage.setItem("us_toBeAdded", "");
            sessionStorage.setItem("us_toBeDeleted", "");

            sessionStorage.setItem("uta_alreadySaved", "");
            sessionStorage.setItem("uta_toBeAdded", "");
            sessionStorage.setItem("uta_toBeDeleted", "");

            sessionStorage.setItem("ur_alreadySaved", "");
            sessionStorage.setItem("ur_toBeAdded", "");
            sessionStorage.setItem("ur_toBeDeleted", "");

            // Resets all validation errors
            $scope.validator.resetForm();

            $("#EditMenu").css("display", "none");
        }
        function closeDeptMenu() {

            $("#DeptMenu").css("display", "none");

            // Clears all html element values
            $scope.userInfo.userTeacher.TeacherID = "";
            $scope.userInfo.MerchantID = "";
            $scope.DeptSchoolList = [];

            // Clears session variables for the form
            sessionStorage.setItem("tc_alreadySaved", "");
            sessionStorage.setItem("tc_toBeAdded", "");
            sessionStorage.setItem("tc_toBeDeleted", "");

            // Chages the select back to placeholder grey
            selectColorGrey('DeptMerchantSelect');

            // Resets all validation errors
            $scope.validator1.resetForm()
        }
        $scope.AddGrade = function () {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            if ($scope.GradeName && typeof $scope.GradeID == "undefined") {                
                var newGrade = {
                    Name: $scope.GradeName
                }
                DataService.GradeAddNew(newGrade)
                .success(function (response1, status, header, config) {
                    var grdid = response1;
                    SMAAlert.CreateInfoAlert("Grade Name Added Successfully.!!");
                    $scope.spinner.resolve()
                    AddGradetoSchool(grdid)                    
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to Create Grade:<br><br>" + response);
                    } else {
                        forbiddenErrors.push(merchants[merchants_index].MerchantID);
                        merchants_index++;
                    }
                });
            }
            else {                
                var grade = {
                    GradeID: $scope.GradeID,
                    Name: $scope.GradeName
                }
                DataService.GradeUpdate(grade).success(function (res) {
                    SMAAlert.CreateInfoAlert("Grade Name Updated Successfully.!!");
                    $scope.spinner.resolve()
                    AddGradetoSchool($scope.GradeID)
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve()
                })               
            }
        }

        function getAllGrade() {
            DataService.GradeGetAll()
            .success(function (grades, status, header, config) {
                $scope.objGradeList = grades;
            })
        }
        $scope.selected = function () {
            alert($scope.selectedName)
        }
        $scope.autoCompleteOptions = {
            minimumChars: 1,
            data: function (searchText) {
                searchText = searchText.toUpperCase();

                var colors = _.filter(CSS_COLORS, function (color) {
                    return color.name.startsWith(searchText);
                });

                return _.pluck(colors, 'Name');
            }
        }
        var clearSearchEmployee = $scope.$watch('selectedName', function (newValue, oldValue) {
            if (newValue == '') {
                findEmployeeInData(newValue);
            }
            else {

                searchGradeByName(newValue);
            }

        });
        function searchGradeByName(srchdata) {
            if (srchdata) {
                $scope.objGradeList.some(function (e) {
                    if (e.Name.indexOf(srchdata) > -1) {
                        $scope.filterdata.push({ "Name": e.Name })
                    }
                })
            }
            $scope.fltrdt = $scope.filterdata;
        }
        function populateSchoolsDropdown(schools) {

            schools.sort(function (a, b) {
                var nameA = a.Name.toLowerCase();
                var nameB = b.Name.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                } else if (nameA > nameB) {
                    return 1;
                } else {
                    return 0;
                }
            });
            $scope.ddlSchoolList = $scope.ddlSchoolList.concat(schools);
        }
        function loadMerchantInfo(merchantID) {
            if (merchantID) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();

                var objMerchant = $filter('filter')($scope.userInfo.merchantList, { MerchantID: merchantID }, true)[0];
                if (objMerchant == undefined)
                    return;

                objMerchant.schoolList = [];
                objMerchant.teacherList = [];
                objMerchant.roleList = [];

                DataService.SchoolGetListForMerchant(merchantID)
                .success(function (response1, status, header, config) {
                    var schools = response1;

                    if (schools.length > 0) {
                        schools.sort(function (a, b) {
                            var nameA = a.Name.toLowerCase();
                            var nameB = b.Name.toLowerCase();
                            if (nameA < nameB) {
                                return -1;
                            } else if (nameA > nameB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        $scope.schoolList = schools;
                        objMerchant.schoolList.forEach(function (obj) { obj.selection = false; });
                    }

                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve sites:<br><br>" + response);
                    }
                });

            } else {// If they deselect the merchant
                //deselectAllSchools(merchantID);
                //deselectAllTeachers(merchantID);
                //deselectAllRoles(merchantID);
                $("#SchoolContainerFor" + merchantID).html("");
                $("#TeacherContainerFor" + merchantID).html("");
                $("#RoleContainerFor" + merchantID).html("");
                // checkMerchantUserCheckboxes(merchantID);
                SMAAlert.CreateInfoAlert("<b>Warning!</b><br><br>By removing the merchant connection,<br>this user won't show up for that merchant.");
            }
        }
        $scope.checkUserSchoolCheckboxes = function (schoolID) {
            debugger
            if ($("#" + schoolID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                schoolID = schoolID.replace('bulk', '');
                var us_alreadySaved = sessionStorage.getItem("us_alreadySaved");
                var us_toBeAdded = sessionStorage.getItem("us_toBeAdded");
                var us_toBeDeleted = sessionStorage.getItem("us_toBeDeleted");
                us_alreadySaved = us_alreadySaved.split(",");
                us_toBeAdded = us_toBeAdded.split(",");
                us_toBeDeleted = us_toBeDeleted.split(",");
                var temporary_us_toBeDeleted = us_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = us_alreadySaved.length; i < len; i++) {
                    if (us_alreadySaved[i] == schoolID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = us_toBeDeleted.length; i < len; i++) {
                    if (us_toBeDeleted[i] == schoolID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_us_toBeDeleted.length; i < len; i++) {
                        if (temporary_us_toBeDeleted[i] == schoolID) {
                            us_toBeDeleted.splice(i, 1);
                        }
                    }
                } else if (alreadySaved == true && toBeDeleted == false) {
                    // If it's already saved but not to be deleted
                    // It should already be checked, we should never hit this
                    console.log("alreadySaved == true && toBeDeleted == false ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == true) {
                    // If it's not in the database but it is to be deleted
                    // This shouldn't happen
                    console.log("alreadySaved == false && toBeDeleted == true ... This shouldn't have happened.");
                } else if (alreadySaved == false && toBeDeleted == false) {
                    // If it's not in the database and isn't going to be deleted
                    us_toBeAdded.push(schoolID);
                }


                // Resets the session storage variables
                us_toBeDeleted = us_toBeDeleted.join(",");
                us_toBeAdded = us_toBeAdded.join(",");
                sessionStorage.setItem("us_toBeDeleted", us_toBeDeleted);
                sessionStorage.setItem("us_toBeAdded", us_toBeAdded);

                // Checks to see if this is a new or bulk upload!
                //if ($("#UserIDHidden").val() == -999 || $("#UserIDHidden").val() == -1) {
                var merchantID = $("#" + schoolID).data("merchantid");

                var isObserver = false;

                $(".userRoleCheckbox").each(function (i) {
                    //console.log($(this).data("merchantid") + "   " + $(this).prop("checked") + "   " + $(this).data("rolename"));
                    if ($(this).data("merchantid") == merchantID && $(this).prop("checked") == true && $(this).data("rolename") == "Observer") {
                        isObserver = true;
                    }
                })

                if (isObserver == true) {
                    $scope.spinnerArr[schoolID] = SMAAlert.CreateSpinnerAlert();
                    DataService.TeacherGetListBySchool(schoolID)
                    .success(function (teachers, status, header, config) {
                        if (teachers.length > 0) {
                            for (var i = 0, len = teachers.length; i < len; i++) {
                                if ($("#" + teachers[i].TeacherID).prop("checked") == false) {
                                    $("#" + teachers[i].TeacherID).click();
                                }
                            }
                        }
                        $scope.spinnerArr[schoolID].resolve();
                    }).error(function (response, status, header, config) {
                        $scope.spinnerArr[schoolID].resolve();
                        if (status !== 403) {
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to retrieve employees by site:<br><br>" + response);
                        }
                    });
                }

                //}
            } else {// If it's unchecked

                var us_alreadySaved = sessionStorage.getItem("us_alreadySaved");
                us_alreadySaved = us_alreadySaved.split(",");

                var us_toBeAdded = sessionStorage.getItem("us_toBeAdded");
                us_toBeAdded = us_toBeAdded.split(",");
                var temporary_us_toBeAdded = us_toBeAdded;

                var us_toBeDeleted = sessionStorage.getItem("us_toBeDeleted");
                us_toBeDeleted = us_toBeDeleted.split(",");
                var temporary_us_toBeDeleted = us_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = us_alreadySaved.length; i < len; i++) {
                    if (us_alreadySaved[i] == schoolID) {
                        temporary_us_toBeDeleted.push(schoolID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = us_toBeAdded.length; i < len; i++) {
                    if (us_toBeAdded[i] == schoolID) {
                        temporary_us_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_us_toBeDeleted.join(",");
                temporary_us_toBeAdded.join(",");
                sessionStorage.setItem("us_toBeDeleted", temporary_us_toBeDeleted);
                sessionStorage.setItem("us_toBeAdded", temporary_us_toBeAdded);

            }
        }
        function AddGradetoSchool(id) {
            var SchoolGrades = [];
            var School_tobeDelete = [];
            var cg_toBeAdded = sessionStorage.getItem('us_toBeAdded');
            cg_toBeAdded = cg_toBeAdded.split(',');
            var cg_toBeAdded_length = cg_toBeAdded.length;            
            for (var i = 0; i < cg_toBeAdded_length; i++) {
                if (cg_toBeAdded[i] == "" || cg_toBeAdded[i] == null || cg_toBeAdded[i] == undefined) {
                    cg_toBeAdded.splice(i, 1);
                }
            }
            for (var i = 0, len = cg_toBeAdded.length; i < len; i++) {
                var SchoolGrade = {
                    SchoolID: cg_toBeAdded[i],
                    GradeID: id
                }
                SchoolGrades.push(SchoolGrade);
            }
            if (SchoolGrades.length > 0) {
                DataService.SchoolGradeAddNewBulk(SchoolGrades).success(function (res) {
                    var v = res;
                    $scope.spinner.resolve();                    
                }).error(function (err) {
                    $scope.spinner.resolve();
                })
            }
                var cg_toBeDeleted = sessionStorage.getItem("us_toBeDeleted");
                cg_toBeDeleted = cg_toBeDeleted.split(',');
                var cg_toBeDeleted_length = cg_toBeDeleted.length;
                for (var i = 0; i < cg_toBeDeleted_length; i++) {
                    if (cg_toBeDeleted[i] == "" || cg_toBeDeleted[i] == null || cg_toBeDeleted[i] == undefined) {
                        cg_toBeDeleted.splice(i, 1);
                    }
                }
                for (var i = 0, len = cg_toBeDeleted.length; i < len; i++) {
                    var Schooldelete = {
                        SchoolID: cg_toBeDeleted[i],
                        GradeID: id
                    }
                    School_tobeDelete.push(Schooldelete)                    
                }
                if (School_tobeDelete.length > 0) {
                    DataService.SchoolGradeDeleteBulk(School_tobeDelete).success(function (res) {
                        var v = res;
                        $scope.spinner.resolve();
                       // SMAAlert.CreateInfoAlert("Grade Name Deleted Successfully.!!");
                    })
                }
                getAllGrade();
            }
            function selectColorBlack1(id) {
                selectColorBlack(id);
            }
        //--------------------Bulk Upload Code--------------------------------
            function saveBulkData(tableData) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert(); 
                var index = 0;
                var Tab_length = tableData.length;
                function BulkGradeAdd(index)
                {
                    if (index < Tab_length) {
                        var newGrade = {
                            Name: tableData[index].Name
                        }
                        DataService.GradeAddNew(newGrade)
                    .success(function (response1, status, header, config) {                        
                        var grdid = response1;
                        AddGradetoSchool(grdid)
                        index++;
                        BulkGradeAdd(index);
                    }).error(function (response, status, header, config) {
                        if (status !== 403) {
                            $scope.spinner.resolve();
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to Create Grade:<br><br>" + response);
                        } else {
                            forbiddenErrors.push(merchants[merchants_index].MerchantID);
                            merchants_index++;
                        }
                    });
                    }                    
                }
                BulkGradeAdd(0)
                $scope.spinner.resolve()
                SMAAlert.CreateInfoAlert("Bulk Grade Added Successfully..!!");
            }
            $scope.AddGradeBulk = function () {
                processFile();
            }
            function processFile() {
                //$scope.spinner = SMAAlert.CreateSpinnerAlert();
                var input = $("#BulkFile");
                var files = input[0].files;
                var i, f;
                for (i = 0, f = files[i]; i != files.length; ++i) {
                    var reader = new FileReader();
                    var name = f.name;
                    reader.onload = function (e) {
                        var data = e.target.result;

                        var arr = String.fromCharCode.apply(null, new Uint8Array(data));
                        var wb = XLSX.read(btoa(arr), { type: 'base64' });
                        process_wb(wb);
                    };

                    reader.readAsArrayBuffer(f);
                }
            }

        // Process Workbook
            function process_wb(wb) {
                var output = "";
                output = JSON.stringify(to_json(wb), 2, 2);
                var tableData = JSON.parse(output);

                // THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
                saveBulkData(tableData.Sheet1);// THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
                // THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
            }

        // To JSON
            function to_json(workbook) {
                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if (roa.length > 0) {
                        result[sheetName] = roa;
                    }
                });
                return result;
            }

        //---------------------------------XX---------------------------------
            $scope.searchGrade=function()
            {
                $scope.searchItem = $scope.searchGrdData;
            }
            $scope.deleteGrade = function () {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                var id = $scope.GradeID;
                var us_tobedelete = [];                
                DataService.GradeDelete(id).success(function () {
                    closeMenu();
                    $scope.spinner.resolve();
                    var temporary_us_toBeDeleted = sessionStorage.getItem("us_alreadySaved");
                    temporary_us_toBeDeleted = temporary_us_toBeDeleted.split(',');
                    for (var i = 0, len = temporary_us_toBeDeleted.length; i < len; i++) {
                        us_tobedelete.push(temporary_us_toBeDeleted[i]);
                    }
                    us_tobedelete.join(",");
                    SMAAlert.CreateInfoAlert("grade deleted successfully.!!");
                    AddGradetoSchool(id)
                    getAllGrade();
                })
            }
        // Selects all schools under a merchant
            $scope.selectAllSchools=function(merchantID) {
                $("input.userSchoolCheckbox.merchantID" + merchantID).each(function (i) {
                    if ($(this).prop("checked") == false) {
                        $(this).click();
                    }
                });
            }
        // Deselects all schools under a merchant
            $scope.deselectAllSchools=function(merchantID) {
                $("input.userSchoolCheckbox.merchantID" + merchantID).each(function (i) {
                    if ($(this).prop("checked") == true) {
                        if (i == 0) {
                            $(this).prop("checked", false)
                            var id = $scope.schoolList[0].SchoolID;
                            $scope.checkUserSchoolCheckboxes(id)
                        }
                        else {
                            $(this).click();
                        }
                    }
                });
            }
        }    
})();