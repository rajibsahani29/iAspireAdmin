(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("UserController", ["$scope", "DataService", "SMAAlertFactory", "ProjectConstants", "$filter", "$window", "$rootScope", "$timeout", userController]);

    function userController($scope, DataService, SMAAlert, ProjectConstants, $filter, $window, $rootScope, $timeout) {
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
			//START NILESH-TSK79
            showSendPasswordResetMail: true,
			//END NILESH-TSK79
        }


        $scope.SchoolIDCheck = null;
        $scope.MerchantUsers = [];
        $scope.userList = [];
        $scope.ArchivedUsers = [];
        $scope.userInfo = getUserInfoObject();
        $scope.DeptSchoolList = [];
        $scope.spinnerArr = [];

        //$scope.schoolList = [];
        //$scope.teacherList = [];
        //$scope.roleList = [];



        var userC = this;
        userC.RoleNames = [];
        userC.ArchivedUser = false;
        userC.deactivateUser = deactivateUser;
        userC.loadMerchantInfo = loadMerchantInfo;
        userC.loadBulkMerchantInfo = loadBulkMerchantInfo;
        userC.togglePasswordInput = togglePasswordInput;
        userC.toggleTeacherSelect = toggleTeacherSelect;
        userC.toggleAllContainers = toggleAllContainers;
        userC.selectAll_selectAll = selectAll_selectAll;
        userC.selectAll_deselectAll = selectAll_deselectAll;
        userC.collapseSchools = collapseSchools;
        userC.selectAllSchools = selectAllSchools;
        userC.deselectAllSchools = deselectAllSchools;
        userC.collapseTeachers = collapseTeachers;
        userC.selectAllTeachers = selectAllTeachers;
        userC.deselectAllTeachers = deselectAllTeachers;
        userC.collapseRoles = collapseRoles;
        userC.selectAllRoles = selectAllRoles;
        userC.deselectAllRoles = deselectAllRoles;
        userC.submitForm = submitForm;
        userC.checkUserSchoolCheckboxes = checkUserSchoolCheckboxes;
        userC.checkUserTeacherAccessCheckboxes = checkUserTeacherAccessCheckboxes;
        userC.checkUserRoleCheckboxes = checkUserRoleCheckboxes;
        userC.submitBulkForm = submitBulkForm;
        userC.setDepartmentMerchant = setDepartmentMerchant;
        userC.selectAllDeptSchool = selectAllDeptSchool;
        userC.deselectAllDeptSchool = deselectAllDeptSchool;
        userC.checkTeacherClassCheckboxes = checkTeacherClassCheckboxes;
        userC.AddClassByCheckboxes = AddClassByCheckboxes;
        userC.submitDepartmentForm = submitDepartmentForm;
        userC.selectColorBlack = selectColorBlack1;
        userC.ActivateUser = ActivateUser;
        populateUsers();
        page_init();
        return userC;



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
				//START NILESH-TSK79
                SendPasswordResetMail: true
				//END NILESH-TSK79
            };
        }
        function clearUserInfo() {
            $scope.userInfo.UserID = -1;
            $scope.userInfo.UserName = '';
            $scope.userInfo.Password = '';
            $scope.userInfo.FirstName = '';
            $scope.userInfo.LastName = '';
            $scope.userInfo.Email = '';
            $scope.userInfo.MerchantID = '';
			//START NILESH-TSK79
            $scope.userInfo.SendPasswordResetMail = false;
			//END NILESH-TSK79
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
                    $scope.userInfo.merchantList.forEach(function (obj) { obj.selection = false; });
                    populateUsersLoop(merchants, 0, merchants.length, [], []);
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
                    $scope.userList = users.filter(function (e) {
                        return e.Email.substring(0, 9) == "INACTIVE-" == false;
                    });

                    $scope.ArchivedUsers = users.filter(function (e) {
                        return e.Email.substring(0, 9) == "INACTIVE-" == true;
                    });
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


        // Show Menu
        function showMenu(userID) {
            clearUserInfo();
            $scope.DeptList = [];
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

            sessionStorage.setItem("tc_alreadySaved", "");
            sessionStorage.setItem("tc_toBeAdded", "");
            sessionStorage.setItem("tc_toBeDeleted", "");
            // If a userID is passed, then populate the form
            if (userID) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                // Gets the user object from the data-bindings
                var user = $("#" + userID).data();
                $scope.userInfo.UserID = userID;
                $scope.userInfo.UserName = user.usernamel;
                $scope.userInfo.FirstName = user.firstname;
                $scope.userInfo.LastName = user.lastname;
                $scope.userInfo.Email = user.email;
                $scope.userInfo.MerchantID = user.merchantid;
                $scope.userInfo.userTeacher.TeacherID = user.teacherid;
                $scope.popup.showChangePassword = false;
                $scope.popup.changePasswordText = "Change Password?";
				//START NILESH-TSK79
                $scope.popup.showSendPasswordResetMail = false;
				//END NILESH-TSK79
                $scope.popup.title = "User - Information";

                //$("#UserName").val(user.username);

                // Shows or hides the Delete Button
                if (user.username != undefined && user.username.toString().substring(0, 9) == "inactive-") {
                    $("#DeleteButton").hide();
                } else {
                    $("#DeleteButton").show();
                }


                // Change the color so it's not placeholder grey
                selectColorBlack('MerchantSelect');

                var merchant_list = [];

                for (var i = 0, len = $scope.MerchantUsers.length; i < len; i++) {
                    if ($scope.MerchantUsers[i].UserID == userID) {
                        var foundItem = $filter('filter')($scope.userInfo.merchantList, { MerchantID: $scope.MerchantUsers[i].MerchantID }, true)[0];
                        if (foundItem != undefined) {
                            foundItem.selection = true;
                        }
                        merchant_list.push($scope.MerchantUsers[i].MerchantID);
                    }
                }

                var mu_alreadySaved = merchant_list.join(",");
                sessionStorage.setItem("mu_alreadySaved", mu_alreadySaved);

                var merchant_index = 0;
                var merchant_length = merchant_list.length;

                // Enters the psuedo loop for populating schools per merchant

                populateSchoolsByMerchant(merchant_list, merchant_index, merchant_length, userID);
                populateClassesByMerchant(user.merchantid);

            } else {
				//START NILESH-TSK79
                $scope.popup.showSendPasswordResetMail = true;
                $scope.userInfo.SendPasswordResetMail = true;
				//END NILESH-TSK79
                // Hides the Delete Button
                $scope.popup.showDeleteButton = false;
                $scope.popup.showChangePassword = true;

                // Changes the form's header and sets the userID to -1(this tells the db that it's new)
                $scope.popup.title = "New User -  Information";
                $scope.userInfo.userID = -1;
                $("#EditMenu").css("display", "block");
                $("#UserName").focus();
                $("#" + $scope.userInfo.merchantList[0].MerchantID).trigger("click");
                populateClassesByMerchant($scope.userInfo.merchantList[0].MerchantID);
                //loadMerchantInfo($scope.userInfo.merchantList[0].MerchantID)
            }
        }

        function getUserObjects() {
            var userID = $scope.userInfo.UserID;

            if (userID !== -1) {
                DataService.UserSchoolgetListForUser(userID)
                .success(function (response1, status, header, config) {
                    var userSchools = response1;

                    var us_alreadySaved = sessionStorage.getItem("us_alreadySaved");
                    us_alreadySaved = us_alreadySaved.split(",");

                    for (var i = 0, len = userSchools.length; i < len; i++) {
                        var objSchools = undefined;
                        for (var j = 0; j < $scope.userInfo.merchantList.length; j++) {
                            objSchools = $filter('filter')($scope.userInfo.merchantList[j].schoolList, { SchoolID: userSchools[i].SchoolID }, true);
                            if (objSchools != undefined && objSchools.length > 0) {
                                objSchools[0].selection = true;
                                break;
                            }
                        }
                        us_alreadySaved.push(userSchools[i].SchoolID);
                    }

                    us_alreadySaved.join(",");
                    sessionStorage.setItem("us_alreadySaved", us_alreadySaved);

                    DataService.UserTeacherAccessGetListByUserID(userID)
                    .success(function (response2, status, header, config) {
                        var userTeacherAccess = response2;

                        var uta_alreadySaved = sessionStorage.getItem("uta_alreadySaved");
                        uta_alreadySaved = uta_alreadySaved.split(",");

                        for (var i = 0, len = userTeacherAccess.length; i < len; i++) {
                            var objTeacher = undefined;
                            for (var j = 0; j < $scope.userInfo.merchantList.length; j++) {
                                objTeacher = $filter('filter')($scope.userInfo.merchantList[j].teacherList, { TeacherID: userTeacherAccess[i].TeacherID }, true);
                                if (objTeacher != undefined && objTeacher.length > 0) {
                                    objTeacher[0].selection = true;
                                    break;
                                }
                            }
                            uta_alreadySaved.push(userTeacherAccess[i].TeacherID);
                        }

                        uta_alreadySaved.join(",");
                        sessionStorage.setItem("uta_alreadySaved", uta_alreadySaved);

                        DataService.RolesGetListForUser(userID)
                        .success(function (response3, status, header, config) {
                            var userRoles = response3;

                            var ur_alreadySaved = sessionStorage.getItem("ur_alreadySaved");
                            ur_alreadySaved = ur_alreadySaved.split(",");

                            for (var i = 0, len = userRoles.length; i < len; i++) {

                                var objRole = undefined;
                                for (var j = 0; j < $scope.userInfo.merchantList.length; j++) {
                                    objRole = $filter('filter')($scope.userInfo.merchantList[j].roleList, { RoleID: userRoles[i].RoleID }, true);
                                    if (objRole != undefined && objRole.length > 0) {
                                        objRole[0].selection = true;
                                        break;
                                    }
                                }
                                ur_alreadySaved.push(userRoles[i].RoleID);
                            }

                            ur_alreadySaved.join(",");
                            sessionStorage.setItem("ur_alreadySaved", ur_alreadySaved);

                            //var teacherID = $("#TeaherIDHidden").val();
                            //if (teacherID !== "") {
                            //    $("#TeacherSelect option[value='" + teacherID + "']").attr('selected', 'selected');
                            //}

                            // $scope.spinner.resolve();
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (status !== 403) {
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to retrieve saved roles:<br><br>" + response);
                            }
                        });
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (status !== 403) {
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to retrieve saved employees:<br><br>" + response);
                        }
                    });

                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve saved sites:<br><br>" + response);
                    }
                });
            }
        }

        // Populates schools by Merchant
        function populateSchoolsByMerchant(merchant_list, merchant_index, merchant_length, userID) {
            merchant_length = $scope.userInfo.merchantList.length;//M0055 
            if (merchant_index < merchant_length) {
                $scope.userInfo.merchantList[merchant_index].schoolList = [];

                DataService.SchoolGetListForMerchant(merchant_list[merchant_index])
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
                        $scope.userInfo.merchantList[merchant_index].schoolList = schools;
                        $scope.userInfo.merchantList[merchant_index].schoolList.forEach(function (obj) { obj.selection = false; });
                    }

                    $scope.userInfo.merchantList[merchant_index].teacherList = [];
                    DataService.TeacherGetListByMerchant(merchant_list[merchant_index])
                    .success(function (response2, status, header, config) {
                        if (response2 == "") { response2 = []; }
                        var teachers = response2.filter(function (e) {
                            return e.Email.substring(0, 9) == "INACTIVE-" == false;
                        });;
                        if (teachers.length > 0) {
                            teachers.sort(function (a, b) {
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
                            $scope.userInfo.merchantList[merchant_index].teacherList = teachers;
                            $scope.userInfo.merchantList[merchant_index].teacherList.forEach(function (obj) { obj.selection = false; });

                        }

                        $scope.userInfo.merchantList[merchant_index].roleList = [];
                        DataService.RolesGetListForMerchant(merchant_list[merchant_index])
                        .success(function (response3, status, header, config) {
                            var roles = [];
                            if (response3.length > 0) {
                                roles = response3.filter(function (e) {
                                    return e.RoleName != "Auditor" && e.RoleName != "Audit-Viewer"
                                });
                                roles.sort(function (a, b) {
                                    var nameA = a.RoleName.toLowerCase();
                                    var nameB = b.RoleName.toLowerCase();
                                    if (nameA < nameB) {
                                        return -1;
                                    } else if (nameA > nameB) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                });

                                $scope.userInfo.merchantList[merchant_index].roleList = roles;
                                $scope.userInfo.merchantList[merchant_index].roleList.forEach(function (obj) { obj.selection = false; });
                            }

                            merchant_index++;
                            populateSchoolsByMerchant(merchant_list, merchant_index, merchant_length, userID);
                        }).error(function (response, status, header, config) {
                            if (status !== 403) {
                                if (response == null) { response = "" }
                                $scope.spinner.resolve();
                                SMAAlert.CreateInfoAlert("Failed to retrieve roles:<br><br>" + response);
                            } else {
                                console.log("Forbidden: Roles.RolesGetListForMerchant(" + merchant_list[merchant_index] + ")");
                                merchant_index++;
                                populateSchoolsByMerchant(merchant_list, merchant_index, merchant_length, userID);
                            }
                        })

                    }).error(function (response, status, header, config) {
                        if (status !== 403) {
                            if (response == null) { response = "" }
                            $scope.spinner.resolve();
                            SMAAlert.CreateInfoAlert("Failed to retrieve Employee:<br><br>" + response);
                        } else {
                            console.log("Forbidden: Teachers.TeacherGetListByMerchant(" + merchant_list[merchant_index] + ")");
                            merchant_index++;
                            populateSchoolsByMerchant(merchant_list, merchant_index, merchant_length, userID);
                        }
                    });
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Failed to retrieve schools:<br><br>" + response);
                    } else {
                        console.log("Forbidden: Schools.SchoolGetListForMerchant(" + merchant_list[merchant_index] + ")");
                        merchant_index++;
                        populateSchoolsByMerchant(merchant_list, merchant_index, merchant_length, userID);
                    }
                });

            } else {
                populateTeacherSelect();

                var teacherID = $scope.userInfo.userTeacher.TeacherID;

                $("#TeacherSelectContainer option").each(function (i) {
                    if ($(this).val() == teacherID) {
                        $(this).attr("selected", "selected");
                        $("#TeacherSelectContainer").show();
                        $("#changeTeacher").html("Remove attached employee?").attr("onclick", "toggleTeacherSelect('shown')");
                    }
                });

                $("#EditMenu").css("display", "block");
                getUserObjects();
            }
        }

        // Populates the teacher user select
        function populateTeacherSelect() {
            /*
                        var teachers = [];
                        $(".userTeacherCheckbox").each(function (i) {
                            var teacher = {
                                TeacherID: $(this).data("teacherid"),
                                TeacherName: $(this).data("teachername")
                            };
                            teachers.push(teacher);
                        });
            
                        if (teachers.length > 0) {
                            teachers.sort(function (a, b) {
                                var nameA = a.TeacherName.toLowerCase();
                                var nameB = b.TeacherName.toLowerCase();
                                if (nameA > nameB) {
                                    return 1;
                                } else if (nameA < nameB) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            });
                        }
            
                        $("#TeacherSelectContainer").append($("#TeacherOptionTemplate").render(teachers));
            */
        }



        // Close Menu
        function closeMenu() {
            // Clears all html element values

            clearUserInfo();
            $scope.DeptList = [];
            userC.RoleNames = [];
            $scope.popup.showChangePassword = true;

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

            populateUsers();
        }

        function checkMerchantUserCheckboxes(merchantID) {
            if ($("#" + merchantID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                var mu_alreadySaved = sessionStorage.getItem("mu_alreadySaved");
                var mu_toBeAdded = sessionStorage.getItem("mu_toBeAdded");
                var mu_toBeDeleted = sessionStorage.getItem("mu_toBeDeleted");
                mu_alreadySaved = mu_alreadySaved.split(",");
                mu_toBeAdded = mu_toBeAdded.split(",");
                mu_toBeDeleted = mu_toBeDeleted.split(",");
                var temporary_mu_toBeDeleted = mu_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = mu_alreadySaved.length; i < len; i++) {
                    if (mu_alreadySaved[i] == merchantID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = mu_toBeDeleted.length; i < len; i++) {
                    if (mu_toBeDeleted[i] == merchantID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_mu_toBeDeleted.length; i < len; i++) {
                        if (temporary_mu_toBeDeleted[i] == merchantID) {
                            mu_toBeDeleted.splice(i, 1);
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
                    mu_toBeAdded.push(merchantID);
                }


                // Resets the session storage variables
                mu_toBeDeleted = mu_toBeDeleted.join(",");
                mu_toBeAdded = mu_toBeAdded.join(",");
                sessionStorage.setItem("mu_toBeDeleted", mu_toBeDeleted);
                sessionStorage.setItem("mu_toBeAdded", mu_toBeAdded);
            } else {// If it's unchecked

                var mu_alreadySaved = sessionStorage.getItem("mu_alreadySaved");
                mu_alreadySaved = mu_alreadySaved.split(",");

                var mu_toBeAdded = sessionStorage.getItem("mu_toBeAdded");
                mu_toBeAdded = mu_toBeAdded.split(",");
                var temporary_mu_toBeAdded = mu_toBeAdded;

                var mu_toBeDeleted = sessionStorage.getItem("mu_toBeDeleted");
                mu_toBeDeleted = mu_toBeDeleted.split(",");
                var temporary_mu_toBeDeleted = mu_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = mu_alreadySaved.length; i < len; i++) {
                    if (mu_alreadySaved[i] == merchantID) {
                        temporary_mu_toBeDeleted.push(merchantID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = mu_toBeAdded.length; i < len; i++) {
                    if (mu_toBeAdded[i] == merchantID) {
                        temporary_mu_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_mu_toBeDeleted.join(",");
                temporary_mu_toBeAdded.join(",");
                sessionStorage.setItem("mu_toBeDeleted", temporary_mu_toBeDeleted);
                sessionStorage.setItem("mu_toBeAdded", temporary_mu_toBeAdded);
            }
        }

        function checkBulkMerchantUserCheckboxes(merchantID) {
            if ($("#bulk" + merchantID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                var mu_alreadySaved = sessionStorage.getItem("mu_alreadySaved");
                var mu_toBeAdded = sessionStorage.getItem("mu_toBeAdded");
                var mu_toBeDeleted = sessionStorage.getItem("mu_toBeDeleted");
                mu_alreadySaved = mu_alreadySaved.split(",");
                mu_toBeAdded = mu_toBeAdded.split(",");
                mu_toBeDeleted = mu_toBeDeleted.split(",");
                var temporary_mu_toBeDeleted = mu_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = mu_alreadySaved.length; i < len; i++) {
                    if (mu_alreadySaved[i] == merchantID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = mu_toBeDeleted.length; i < len; i++) {
                    if (mu_toBeDeleted[i] == merchantID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_mu_toBeDeleted.length; i < len; i++) {
                        if (temporary_mu_toBeDeleted[i] == merchantID) {
                            mu_toBeDeleted.splice(i, 1);
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
                    mu_toBeAdded.push(merchantID);
                }


                // Resets the session storage variables
                mu_toBeDeleted = mu_toBeDeleted.join(",");
                mu_toBeAdded = mu_toBeAdded.join(",");
                sessionStorage.setItem("mu_toBeDeleted", mu_toBeDeleted);
                sessionStorage.setItem("mu_toBeAdded", mu_toBeAdded);
            } else {// If it's unchecked

                var mu_alreadySaved = sessionStorage.getItem("mu_alreadySaved");
                mu_alreadySaved = mu_alreadySaved.split(",");

                var mu_toBeAdded = sessionStorage.getItem("mu_toBeAdded");
                mu_toBeAdded = mu_toBeAdded.split(",");
                var temporary_mu_toBeAdded = mu_toBeAdded;

                var mu_toBeDeleted = sessionStorage.getItem("mu_toBeDeleted");
                mu_toBeDeleted = mu_toBeDeleted.split(",");
                var temporary_mu_toBeDeleted = mu_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = mu_alreadySaved.length; i < len; i++) {
                    if (mu_alreadySaved[i] == merchantID) {
                        temporary_mu_toBeDeleted.push(merchantID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = mu_toBeAdded.length; i < len; i++) {
                    if (mu_toBeAdded[i] == merchantID) {
                        temporary_mu_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_mu_toBeDeleted.join(",");
                temporary_mu_toBeAdded.join(",");
                sessionStorage.setItem("mu_toBeDeleted", temporary_mu_toBeDeleted);
                sessionStorage.setItem("mu_toBeAdded", temporary_mu_toBeAdded);
            }
        }

        // When a user school checkbox is selected
        function checkUserSchoolCheckboxes(schoolID) {

            if ($("#" + schoolID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                if (schoolID.indexOf('bulk') == 0) {
                    schoolID = schoolID.replace('bulk', '');
                    $('#bulkcls' + schoolID).show();
                } else {
                    $('#cls' + schoolID).show();
                }
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
                var isEvaluator = false;

                $(".userRoleCheckbox").each(function (i) {
                    //console.log($(this).data("merchantid") + "   " + $(this).prop("checked") + "   " + $(this).data("rolename"));
                    if ($(this).data("merchantid") == merchantID && $(this).prop("checked") == true && ($(this).data("rolename") == "Observer" || $(this).data("rolename") == "Peer Evaluator")) {
                        isObserver = true;
                        isEvaluator = true;
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
            } else {// If it's unchecked
                $('#cls' + schoolID).hide();
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
        function populateClassesBySchool() {
            DataService.ClassGetListForSchool(schoolID)
            .success(function (classes) {
                $scope.userInfo.merchantList[0].Classlist = classes;
            })
        }

        function checkUserTeacherAccessCheckboxes(teacherID) {
            if ($("#" + teacherID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                teacherID = teacherID.replace('bulk', '');
                var uta_alreadySaved = sessionStorage.getItem("uta_alreadySaved");
                var uta_toBeAdded = sessionStorage.getItem("uta_toBeAdded");
                var uta_toBeDeleted = sessionStorage.getItem("uta_toBeDeleted");
                uta_alreadySaved = uta_alreadySaved.split(",");
                uta_toBeAdded = uta_toBeAdded.split(",");
                uta_toBeDeleted = uta_toBeDeleted.split(",");
                var temporary_uta_toBeDeleted = uta_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = uta_alreadySaved.length; i < len; i++) {
                    if (uta_alreadySaved[i] == teacherID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = uta_toBeDeleted.length; i < len; i++) {
                    if (uta_toBeDeleted[i] == teacherID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_uta_toBeDeleted.length; i < len; i++) {
                        if (temporary_uta_toBeDeleted[i] == teacherID) {
                            uta_toBeDeleted.splice(i, 1);
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
                    uta_toBeAdded.push(teacherID);
                }


                // Resets the session storage variables
                uta_toBeDeleted = uta_toBeDeleted.join(",");
                uta_toBeAdded = uta_toBeAdded.join(",");
                sessionStorage.setItem("uta_toBeDeleted", uta_toBeDeleted);
                sessionStorage.setItem("uta_toBeAdded", uta_toBeAdded);
            } else {// If it's unchecked

                var uta_alreadySaved = sessionStorage.getItem("uta_alreadySaved");
                uta_alreadySaved = uta_alreadySaved.split(",");

                var uta_toBeAdded = sessionStorage.getItem("uta_toBeAdded");
                uta_toBeAdded = uta_toBeAdded.split(",");
                var temporary_uta_toBeAdded = uta_toBeAdded;

                var uta_toBeDeleted = sessionStorage.getItem("uta_toBeDeleted");
                uta_toBeDeleted = uta_toBeDeleted.split(",");
                var temporary_uta_toBeDeleted = uta_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = uta_alreadySaved.length; i < len; i++) {
                    if (uta_alreadySaved[i] == teacherID) {
                        temporary_uta_toBeDeleted.push(teacherID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = uta_toBeAdded.length; i < len; i++) {
                    if (uta_toBeAdded[i] == teacherID) {
                        temporary_uta_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_uta_toBeDeleted.join(",");
                temporary_uta_toBeAdded.join(",");
                sessionStorage.setItem("uta_toBeDeleted", temporary_uta_toBeDeleted);
                sessionStorage.setItem("uta_toBeAdded", temporary_uta_toBeAdded);
            }
        }

        function checkUserRoleCheckboxes(roleID) {
            if ($("#" + roleID).is(":checked")) {// If it's checked
                // Gets the session variables and splits them into arrays
                roleID = roleID.replace('bulk', '')
                var ur_alreadySaved = sessionStorage.getItem("ur_alreadySaved");
                var ur_toBeAdded = sessionStorage.getItem("ur_toBeAdded");
                var ur_toBeDeleted = sessionStorage.getItem("ur_toBeDeleted");
                ur_alreadySaved = ur_alreadySaved.split(",");
                ur_toBeAdded = ur_toBeAdded.split(",");
                ur_toBeDeleted = ur_toBeDeleted.split(",");
                var temporary_ur_toBeDeleted = ur_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = ur_alreadySaved.length; i < len; i++) {
                    if (ur_alreadySaved[i] == roleID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = ur_toBeDeleted.length; i < len; i++) {
                    if (ur_toBeDeleted[i] == roleID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_ur_toBeDeleted.length; i < len; i++) {
                        if (temporary_ur_toBeDeleted[i] == roleID) {
                            ur_toBeDeleted.splice(i, 1);
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
                    ur_toBeAdded.push(roleID);
                }


                // Resets the session storage variables
                ur_toBeDeleted = ur_toBeDeleted.join(",");
                ur_toBeAdded = ur_toBeAdded.join(",");
                sessionStorage.setItem("ur_toBeDeleted", ur_toBeDeleted);
                sessionStorage.setItem("ur_toBeAdded", ur_toBeAdded);

                var RoleData = $("#" + roleID).data();
                $('#RoleContainerFor' + RoleData.merchantid + ' input:checked').each(function () {
                    userC.RoleNames.push($(this).data('rolename'));
                });
                if (userC.RoleNames.length == 0)
                    $('#BulkRoleContainerFor' + RoleData.merchantid + ' input:checked').each(function () {
                        userC.RoleNames.push($(this).data('rolename'));
                    });
                if (userC.RoleNames.length == 1 && userC.RoleNames.includes("Viewer") == true) {
                    deselectAllTeachers(RoleData.merchantid)
                    $('#TeacherContainerFor' + RoleData.merchantid).hide();
                    $('#BulkTeacherContainerFor' + RoleData.merchantid).hide();
                    $('#classdivhide').show();
                    $('#bulkclassdivhide').show();
                }
                else {
                    $('#classdivhide').hide();
                    $('#bulkclassdivhide').hide();
                }
                if ((userC.RoleNames.includes("Observer") == true || userC.RoleNames.includes("Peer Evaluator")) && userC.RoleNames.length == 1) {
                    $('#classdivhide').hide();
                    $('#bulkclassdivhide').hide();
                    var us_alreadySaved = sessionStorage.getItem("us_alreadySaved");
                    us_alreadySaved = us_alreadySaved.split(",");
                    if (us_alreadySaved.length > 0) {
                        us_alreadySaved.splice(0, 1);
                    }
                    for (var i in us_alreadySaved) {
                        deselectAllDeptSchool(us_alreadySaved[i]);
                    }
                }
                if (userC.RoleNames.length >= 2 && userC.RoleNames.includes("Observer") == true && userC.RoleNames.includes("Viewer") == true) {
                    if ($("#classdivhide").is(':hidden') || $('#bulkclassdivhide').is(':hidden')) {
                        $('#classdivhide').show();
                        $('#bulkclassdivhide').show();
                    }
                    if ($('#TeacherContainerFor' + RoleData.merchantid).is(':hidden') || $('#BulkTeacherContainerFor' + RoleData.merchantid).is(':hidden')) {
                        $('#TeacherContainerFor' + RoleData.merchantid).show();
                        $('#BulkTeacherContainerFor' + RoleData.merchantid).show();
                    }
                }
                if (userC.RoleNames.includes("Observer") == true || userC.RoleNames.includes("Peer Evaluator") || userC.RoleNames.includes("AccountAdmin") == true || userC.RoleNames.includes("GlobalAdmin") == true || userC.RoleNames.includes("AccountManager") == true) {
                    $('#TeacherContainerFor' + RoleData.merchantid).show();
                    $('#BulkTeacherContainerFor' + RoleData.merchantid).show();
                }
                else {
                    $('#TeacherContainerFor' + RoleData.merchantid).hide();
                    $('#BulkTeacherContainerFor' + RoleData.merchantid).hide();
                }
            } else {// If it's unchecked

                userC.RoleNames = userC.RoleNames.filter(function (item, pos, self) {
                    return self.indexOf(item) == pos;
                })
                var RoleName = $("#" + roleID).data("rolename");
                var MerchantID = $("#" + roleID).data("merchantid");
                var index = userC.RoleNames.indexOf(RoleName);
                if (index > -1) {
                    userC.RoleNames.splice(index, 1);
                }
                if (RoleName == "Viewer") {                    
                    $('#TeacherContainerFor' + MerchantID).show();
                    $('#BulkTeacherContainerFor' + MerchantID).show();
                }
                if (RoleName == "Observer" || RoleName == "Peer Evaluator") {
                    $('#classdivhide').show();
                    $('#bulkclassdivhide').show();
                    deselectAllTeachers(MerchantID)
                }
                if (userC.RoleNames.length == 0)
                    $('#TeacherContainerFor' + $scope.userInfo.merchantList[0].MerchantID).hide();
                $('#BulkTeacherContainerFor' + $scope.userInfo.merchantList[0].MerchantID).hide();
                $('#classdivhide').hide();
                $('#bulkclassdivhide').hide();

                var ur_alreadySaved = sessionStorage.getItem("ur_alreadySaved");
                ur_alreadySaved = ur_alreadySaved.split(",");

                var ur_toBeAdded = sessionStorage.getItem("ur_toBeAdded");
                ur_toBeAdded = ur_toBeAdded.split(",");
                var temporary_ur_toBeAdded = ur_toBeAdded;

                var ur_toBeDeleted = sessionStorage.getItem("ur_toBeDeleted");
                ur_toBeDeleted = ur_toBeDeleted.split(",");
                var temporary_ur_toBeDeleted = ur_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = ur_alreadySaved.length; i < len; i++) {
                    if (ur_alreadySaved[i] == roleID) {
                        temporary_ur_toBeDeleted.push(roleID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = ur_toBeAdded.length; i < len; i++) {
                    if (ur_toBeAdded[i] == roleID) {
                        temporary_ur_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_ur_toBeDeleted.join(",");
                temporary_ur_toBeAdded.join(",");
                sessionStorage.setItem("ur_toBeDeleted", temporary_ur_toBeDeleted);
                sessionStorage.setItem("ur_toBeAdded", temporary_ur_toBeAdded);
            }
        }

        // Selects all schools under a merchant
        function selectAllSchools(merchantID) {
            $("input.userSchoolCheckbox.merchantID" + merchantID).each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all schools under a merchant
        function deselectAllSchools(merchantID) {
            $("input.userSchoolCheckbox.merchantID" + merchantID).each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }
        function selectAllDeptSchool(schoolID) {
            $("input.schoolID" + schoolID).each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all checkboxes
        function deselectAllDeptSchool(schoolID) {
            $("input.schoolID" + schoolID).each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).prop("checked", false)
                    checkTeacherClassCheckboxes(this.value)
                }
            });
        }
        // Selects all schools under a merchant
        function selectAllTeachers(merchantID) {
            $("input.userTeacherCheckbox.merchantID" + merchantID).each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all schools under a merchant
        function deselectAllTeachers(merchantID) {
            $("input.userTeacherCheckbox.merchantID" + merchantID).each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Selects all schools under a merchant
        function selectAllRoles(merchantID) {
            $("input.userRoleCheckbox.merchantID" + merchantID).each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all schools under a merchant
        function deselectAllRoles(merchantID) {
            $("input.userRoleCheckbox.merchantID" + merchantID).each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Load/Deload Merchant Info
        function loadMerchantInfo(merchantID) {
            //if ($("#" + merchantID).prop("checked") == true) {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            var objMerchant = $filter('filter')($scope.userInfo.merchantList, { MerchantID: merchantID }, true)[0];
            if (objMerchant == undefined)
                return;
            $scope.userInfo.MerchantID = merchantID;
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
                    objMerchant.schoolList = schools;
                    objMerchant.schoolList.forEach(function (obj) { obj.selection = false; });
                }

                DataService.TeacherGetListByMerchant(merchantID)
                .success(function (response2, status, header, config) {
                    //if (response2 != '') {
                        if (response2 == "") { response2 = []; }
                        var teachers = response2.filter(function (e) {
                            return e.Email.substring(0, 9) == "INACTIVE-" == false;
                        });
                        if (teachers.length > 0) {
                            teachers.sort(function (a, b) {
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
                            $('#TeacherContainerFor' + $scope.userInfo.merchantList[0].MerchantID).hide();
                            $('#BulkTeacherContainerFor' + $scope.userInfo.merchantList[0].MerchantID).hide();
                            objMerchant.teacherList = teachers;
                            objMerchant.teacherList.forEach(function (obj) { obj.selection = false; });
                        }
                        DataService.RolesGetListForMerchant(merchantID)
                        .success(function (response3, status, header, config) {
                            var roles = [];
                            roles = response3;
                            if (roles.length > 0) {
                                roles.sort(function (a, b) {
                                    var nameA = a.RoleName.toLowerCase();
                                    var nameB = b.RoleName.toLowerCase();
                                    if (nameA < nameB) {
                                        return -1;
                                    } else if (nameA > nameB) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                });
                                objMerchant.roleList = roles;
                                objMerchant.roleList.forEach(function (obj) { obj.selection = false; });
                            }


                            //$scope.spinner.resolve();
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (status !== 403) {
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to retrieve roles:<br><br>" + response);
                            }
                        });


                        checkMerchantUserCheckboxes(merchantID);
                    //}
                    // $scope.spinner.resolve();
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve employees:<br><br>" + response);
                    }
                });

            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve sites:<br><br>" + response);
                }
            });

            //} else {// If they deselect the merchant
            //    deselectAllSchools(merchantID);
            //    deselectAllTeachers(merchantID);
            //    deselectAllRoles(merchantID);
            //    $("#SchoolContainerFor" + merchantID).html("");
            //    $("#TeacherContainerFor" + merchantID).html("");
            //    $("#RoleContainerFor" + merchantID).html("");
            //    checkMerchantUserCheckboxes(merchantID);
            //    SMAAlert.CreateInfoAlert("<b>Warning!</b><br><br>By removing the merchant connection,<br>this user won't show up for that merchant.");
            //}
        }

        // Load/Deload Merchant Info for Bulk Upload
        function loadBulkMerchantInfo(merchantID) {
            var objMerchant = $filter('filter')($scope.userInfo.merchantList, { MerchantID: merchantID }, true);
            if (objMerchant == undefined || objMerchant.length == 0) {
                return;
            }
            else {
                objMerchant = objMerchant[0];
            }

            objMerchant.schoolList = [];
            objMerchant.teacherList = [];
            objMerchant.roleList = [];

            if ($("#bulk" + merchantID).prop("checked") == true) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();

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

                        objMerchant.schoolList = schools;
                        objMerchant.schoolList.forEach(function (obj) { obj.selection = false; });
                    }


                    DataService.TeacherGetListByMerchant(merchantID)
                    .success(function (response2, status, header, config) {
                        var teachers = response2;

                        if (teachers.length > 0) {
                            teachers.sort(function (a, b) {
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

                            objMerchant.teacherList = teachers;
                            objMerchant.teacherList.forEach(function (obj) { obj.selection = false; });
                        }

                        DataService.RolesGetListForMerchant(merchantID)
                        .success(function (response3, status, header, config) {
                            var roles = response3;

                            if (roles.length > 0) {
                                roles.sort(function (a, b) {
                                    var nameA = a.RoleName.toLowerCase();
                                    var nameB = b.RoleName.toLowerCase();
                                    if (nameA < nameB) {
                                        return -1;
                                    } else if (nameA > nameB) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                });
                                objMerchant.roleList = roles;
                                objMerchant.roleList.forEach(function (obj) { obj.selection = false; });
                            }

                            checkBulkMerchantUserCheckboxes(merchantID);
                            // $scope.spinner.resolve();
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (status !== 403) {
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to retrieve roles:<br><br>" + response);
                            }
                        });
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (status !== 403) {
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to retrieve employees:<br><br>" + response);
                        }
                    });
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve sites:<br><br>" + response);
                    }
                });

            } else {// If they deselect the merchant
                deselectAllSchools(merchantID);
                deselectAllTeachers(merchantID);
                deselectAllRoles(merchantID);

                checkMerchantUserCheckboxes(merchantID);
                SMAAlert.CreateInfoAlert("<b>Warning!</b><br><br>By removing the merchant connection,<br>this user won't show up for that merchant.");
            }
        }

        // Submit bulk upload form
        function submitBulkForm() {
            processFile();
            return false;
        }

        // Save Bulk Data   
        function saveBulkData(table) {
            // Data Validations
            var tableData = [];
            for (var i in table) {
                var tbdata = {
                    Email: table[i].Email,
                    //START NILESH-TSK94
                    Password: table[i].Password,
                    //END NILESH-TSK94
                    FirstName: table[i].FirstName,
                    LastName: table[i].LastName,
                    //START NILESH-TSK94
                    InviteUser: table[i].InviteUser
                    //END NILESH-TSK94
                }
                tableData.push(tbdata);
            }
            var error = "";
            for (var i = 0, len = tableData.length; i < len; i++) {
                if (tableData[i].Email == undefined || tableData[i].Email == "" || tableData[i].Email == null) {
                    error = "Email is missing on row " + i + ".";
                    break;
                }
                //START NILESH-TSK94
                else if (tableData[i].InviteUser != undefined && tableData[i].InviteUser != null && tableData[i].InviteUser != "") {
                    if (tableData[i].InviteUser.toLowerCase() == "yes") {
                        if (tableData[i].Password == undefined || tableData[i].Password == "" || tableData[i].Password == null) {
                            error = "Password is missing on row " + i + ".";
                            break;
                        }
                        else if (tableData[i].Password.length < 5) {
                            error = "Password on row " + i + " is less than 6 characters.";
                            break;
                        }
                        else {
                            tableData[i].SendPasswordResetMail = true;
                        }
                    }
                    else {
                        tableData[i].Password = undefined;
                    }
                    
                }
                //END NILESH-TSK94
                else if (tableData[i].FirstName == undefined || tableData[i].FirstName == "" || tableData[i].FirstName == null) {
                    error = "FirstName is missing on row " + i + ".";
                    break;
                } else if (tableData[i].LastName == undefined || tableData[i].LastName == "" || tableData[i].LastName == null) {
                    error = "LastName is missing on row " + i + ".";
                    break;
                }
                //tableData[i].InviteUser = undefined;
            }

            if (error !== "") {
                SMAAlert.CreateInfoAlert("There was an error with your data:<br><br>" + error);
            } else {
                var mu_toBeAdded = sessionStorage.getItem("mu_toBeAdded");
                var merchants = mu_toBeAdded.split(",");
                var merchants_length = merchants.length;
                for (var i = 0; i < merchants_length; i++) {
                    if (merchants[i] == "" || merchants[i] == null || merchants[i] == undefined) {
                        merchants.splice(i, 1);
                    }
                }
                var us_toBeAdded = sessionStorage.getItem("us_toBeAdded");
                var schools = us_toBeAdded.split(",");
                var schools_length = schools.length;
                for (var i = 0; i < schools_length; i++) {
                    if (schools[i] == "" || schools[i] == null || schools[i] == undefined) {
                        schools.splice(i, 1);
                    }
                }
                var userTeacherAccess = sessionStorage.getItem("uta_toBeAdded");
                var teachers = userTeacherAccess.split(",");
                var teacher_length = teachers.length;
                for (var i = 0; i < teacher_length; i++) {
                    if (teachers[i] == "" || teachers[i] == null || teachers[i] == undefined) {
                        teachers.splice(i, 1);
                    }
                }

                var ur_toBeAdded = sessionStorage.getItem("ur_toBeAdded");
                var roles = ur_toBeAdded.split(",");
                var roles_length = roles.length;
                for (var i = 0; i < roles_length; i++) {
                    if (roles[i] == "" || roles[i] == null || roles[i] == undefined) {
                        roles.splice(i, 1);
                    }
                }

                var userclases = sessionStorage.getItem("tc_toBeAdded");
                userclases = userclases.split(",");
                var class_length = roles.length;
                for (var i = 0; i < class_length; i++) {
                    if (userclases[i] == "" || userclases[i] == null || userclases[i] == undefined) {
                        userclases.splice(i, 1);
                    }
                }


                for (var i = 0, len = tableData.length; i < len; i++) {
                    if (merchants.length > 0) {
                        tableData[i].Merchants = merchants;
                    } else {
                        tableData[i].Merchants = [];
                    }
                    if (schools.length > 0) {
                        tableData[i].Schools = schools;
                    } else {
                        tableData[i].Schools = [];
                    }
                    if (teachers.length > 0) {
                        tableData[i].Teachers = teachers;
                    }
                    else {
                        tableData[i].Teachers = [];
                    }
                    if (roles.length > 0) {
                        tableData[i].Roles = roles;
                    } else {
                        tableData[i].Roles = [];
                    }
                    if (userclases.length > 0) {
                        tableData[i].Classes = userclases;
                    } else {
                        tableData[i].Classes = [];
                    }
                    tableData[i].UserName = tableData[i].Email;
                }

                if ($("#AreTeachers").prop("checked") == true) {

                    DataService.MerchantGetListByCurrentUser()
                    .success(function (response, status, header, config) {
                        var usersErrors = [];
                        var merchants = response;

                        // Fuunction to save the users
                        function saveUsers(users) {
                            var usersLength = users.length;
                            var usersDone = 0;
                            var listOfNewUserFunctions = [];

                            // Check for when users are done
                            function whenUsersDone() {
                                if (usersDone == usersLength) {
                                    $scope.spinner.resolve();
                                    if (usersErrors.length > 0) {
                                        var errorsList = "<ul>";
                                        for (var i = 0, len = usersErrors.length; i < len; i++) {
                                            errorsList += "<li>" + usersErrors[i] + "</li>";
                                        }
                                        errorsList += "</ul>";

                                        SMAAlert.CreateInfoAlert("While creating users the following errors occurred:<br><br>" + errorsList);
                                    } else {
                                        SMAAlert.CreateInfoAlert("Users were successfully saved.");
                                    }
                                }
                            }

                            // function for creating a new user
                            function getCreateUserFunction(user) {
                                return function () {
                                    DataService.CreateiAspireUserAccount(user)
                                    .success(function (response, status, header, config) {
                                        usersDone++;
                                        whenUsersDone();
                                    }).error(function (response, status, header, config) {
                                        usersErrors.push(response + " : " + user.UserID);
                                        usersDone++;
                                        whenUsersDone();
                                    });

                                }
                            }

                            for (var i = 0, len = users.length; i < len; i++) {
                                listOfNewUserFunctions.push(getCreateUserFunction(users[i]));
                            }

                            for (var i in listOfNewUserFunctions) {
                                listOfNewUserFunctions[i]();
                            }
                        }

                        // Compares emails for teacher, if they match, adds the teacher ID to the user object
                        function compareUserTeachers(users, teachers) {
                            for (var i = 0, leni = users.length; i < leni; i++) {
                                users[i].IsTeacher = false;
                                users[i].Teachers = [];
                                for (var j = 0, lenj = teachers.length; j < lenj; j++) {
                                    for (var k = 0, lenk = teachers[j].length; k < lenk; k++) {
                                        if (users[i].Email === teachers[j][k].Email) {
                                            users[i].IsTeacher = true;
                                            users[i].TeacherID = teachers[j][k].TeacherID;
                                            users[i].Teachers.push(teachers[j][k].TeacherID);
                                            k = lenk;
                                            j = lenj;
                                        }
                                    }
                                }
                            }

                            saveUsers(users);
                        }

                        // Gets the teachers per merchants available to the current user
                        function getTeachers(merchants, merchants_length, merchants_index, teachers) {
                            if (merchants_index < merchants_length) {
                                DataService.TeacherGetListByMerchant(merchants[merchants_index].MerchantID)
                                .success(function (response, status, header, config) {
                                    teachers.push(response);
                                    merchants_index++;
                                    getTeachers(merchants, merchants_length, merchants_index, teachers);
                                }).error(function (response, status, header, config) {
                                    usersErrors.push("Failed to retrieve employees for " + merchants[merchants_index].MerchantID + " : " + response);
                                });
                            } else {
                                compareUserTeachers(tableData, teachers);
                            }
                        }

                        // Calls the get Teachers psuedo loop
                        getTeachers(merchants, merchants.length, 0, []);

                    }).error(function (response, status, header, config) {

                    });

                } else {
                    // Fuunction to save the users
                    function saveUsers(users) {
                        var usersLength = users.length;
                        var usersDone = 0;
                        var listOfNewUserFunctions = [];
                        var usersErrors = [];

                        // Check for when users are done
                        function whenUsersDone() {
                            if (usersDone == usersLength) {
                                $scope.spinner.resolve();
                                if (usersErrors.length > 0) {
                                    var errorsList = "<ul>";
                                    for (var i = 0, len = usersErrors.length; i < len; i++) {
                                        errorsList += "<li>" + usersErrors[i] + "</li>";
                                    }
                                    //errorsList.append += "</ul><br><br>";
                                    SMAAlert.CreateInfoAlert("While creating users the following errors occurred:<br><br>" + errorsList);
                                } else {
                                    SMAAlert.CreateInfoAlert("Users were successfully saved.");
                                    closeMenu();
                                }
                            }
                        }
                        // function for creating a new user
                        function getCreateUserFunction(user) {
                            return function () {
                                DataService.CreateiAspireUserAccount(user)
                                .success(function (response, status, header, config) {
                                    usersDone++;
                                    whenUsersDone();
                                }).error(function (response, status, header, config) {
                                    usersErrors.push(response + " : " + user.UserName);
                                    usersDone++;
                                    whenUsersDone();
                                });
                            }
                        }
                        for (var i = 0, len = users.length; i < len; i++) {
                            listOfNewUserFunctions.push(getCreateUserFunction(users[i]));
                        }
                        for (var i in listOfNewUserFunctions) {
                            listOfNewUserFunctions[i]();
                        }
                    }
                    saveUsers(tableData);
                }
            }
        }
        function setDepartmentMerchant() {
            selectColorBlack("DeptMerchantSelect");
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            var merchantID = $scope.userInfo.MerchantID;

            populateClasses(merchantID);
        }
        // Collapse school list per merchant
        function collapseSchools(merchantID) {
            if ($("#collapseSchools" + merchantID + " .symbol").html() == " - ") {
                $("#collapseSchools" + merchantID + " .symbol").html(" + ");
                $(".collapsibleSchool").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).hide();
                    }
                });
            }
            else {
                $("#collapseSchools" + merchantID + " .symbol").html(" - ");
                $(".collapsibleSchool").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).show();
                    }
                });
            }
        }

        // Collapse teacher list per merchant
        function collapseTeachers(merchantID) {
            if ($("#collapseTeachers" + merchantID + " .symbol").html() == " - ") {
                $("#collapseTeachers" + merchantID + " .symbol").html(" + ");
                //$("#collapseTeachers" + merchantID + " .symbol").attr("onclick", "expandTeachers('" + merchantID + "')");

                $(".collapsibleTeacher").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).hide();
                    }
                });
            }
            else {
                $("#collapseTeachers" + merchantID + " .symbol").html(" - ");
                $(".collapsibleTeacher").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).show();
                    }
                });
            }

        }


        // Collapse school list per merchant
        function collapseRoles(merchantID) {
            if ($("#collapseRoles" + merchantID + " .symbol").html() == " - ") {
                $("#collapseRoles" + merchantID + " .symbol").html(" + ");
                $(".collapsibleRole").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).hide();
                    }
                });
            }
            else {
                $("#collapseRoles" + merchantID + " .symbol").html(" - ");
                $(".collapsibleRole").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).show();
                    }
                });
            }

        }

        // Collapses all Teachers and Schools
        function toggleAllContainers() {
            $timeout(function () {
                //angular.element('.symbol').triggerHandler('click');
                angular.element('#MerchantsContainer .symbol').each(function (i) {
                    $(this).triggerHandler('click');
                });
            }, 0);
        }

        // Saves the form
        function submitForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            var user = {
                UserID: $scope.userInfo.UserID,
                UserName: $scope.userInfo.Email,
                FirstName: $scope.userInfo.FirstName,
                LastName: $scope.userInfo.LastName,
                MerchantID: $scope.userInfo.MerchantID,
				//START NILESH-TSK79
                SendPasswordResetMail: $scope.userInfo.SendPasswordResetMail,
				//END NILESH-TSK79
            }

            var oldTeacherID = $scope.userInfo.userTeacher.TeacherID;//$("#TeacherIDHidden").val();
            var teacherID = $scope.userInfo.userTeacher.TeacherID; //$("#TeacherSelectContainer").val();
            if (teacherID != undefined && teacherID != "" && teacherID != -1) {
                user.TeacherID = teacherID;
                user.IsTeacher = true;
            }

            var password = $("#UserPassword").val();
            if (password !== undefined && password !== "" && password !== null) {
                user.Password = password;
            }

            if (user.UserID == -1) {// If it's a new user

                // This gets all the guid arrays from session storage and adds it to our user object
                var merchantUsers = sessionStorage.getItem("mu_toBeAdded");
                merchantUsers = merchantUsers.split(",");
                user.Merchants = merchantUsers;

                var userSchools = sessionStorage.getItem("us_toBeAdded");
                userSchools = userSchools.split(",");
                user.Schools = userSchools;

                var userTeacherAccess = sessionStorage.getItem("uta_toBeAdded");
                userTeacherAccess = userTeacherAccess.split(",");
                user.Teachers = userTeacherAccess;

                var userRoles = sessionStorage.getItem("ur_toBeAdded");
                userRoles = userRoles.split(",");
                user.Roles = userRoles;

                var userclases = sessionStorage.getItem("tc_toBeAdded");
                userclases = userclases.split(",");
                user.Classes = userclases;

                if (teacherID !== 0 && teacherID !== "" && teacherID !== null) {
                    user.IsTeacher = true;
                    user.TeacherID = teacherID;
                }
                user.DomainName = document.location.origin;
                DataService.CreateiAspireUserAccount(user)
                .success(function (response1, status, header, config) {
                    $scope.spinner.resolve();
                    closeMenu();
                    SMAAlert.CreateInfoAlert("User was successfully created!");
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    SMAAlert.CreateInfoAlert("Failed to create user:<br><br>" + response);
                });

            } else {// If it's already a user
                var error = [];

                // Boolean values for when dones
                var userUpdate_Done = false;
                var userTeacher_Done = false;
                var mu_toBeAdded_Done = false;
                var mu_toBeDeleted_Done = false;
                var us_toBeAdded_Done = false;
                var us_toBeDeleted_Done = false;
                var uta_toBeAdded_Done = false;
                var uta_toBeDeleted_Done = false;
                var ur_toBeAdded_Done = false;
                var ur_toBeDeleted_Done = false;

                // Once all the when dones are done
                function updatedObjects() {
                    if (userTeacher_Done == true && userUpdate_Done == true && mu_toBeAdded_Done == true && mu_toBeDeleted_Done == true && us_toBeAdded_Done == true && us_toBeDeleted_Done == true && uta_toBeAdded_Done == true && uta_toBeDeleted_Done == true && ur_toBeAdded_Done == true && ur_toBeDeleted_Done == true) {
                        // All the toBeAddeds are done
                        $scope.spinner.resolve();
                        closeMenu();
                        if (error.length > 0) {
                            var errors = "";
                            for (var i = 0, len = error.length; i < len; i++) {
                                errors += "<li>" + error[i] + "<li>";
                            }
                            SMAAlert.CreateInfoAlert("User has been updated but errors occurred:<br><br><ul>" + errors + "<ul>");
                        } else {
                            SMAAlert.CreateInfoAlert("User has been successfully updated!");

                        }
                    }
                }

                // Psuedo Loop for deleting user teacher access
                function userTeacherAccessDelete(userTeacherAccessList, length, index) {
                    if (index < length) {
                        DataService.UserTeacherAccessDelete(userTeacherAccessList[index])
                        .success(function (response1, status, header, config) {
                            index++;
                            userTeacherAccessDelete(userTeacherAccessList, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            error.push(response + " : " + userTeacherAccessList[index].TeacherID);
                            userTeacherAccessDelete(userTeacherAccessList, length, index);
                        });

                    } else {
                        uta_toBeDeleted_Done = true;
                        updatedObjects();
                    }
                }

                // Psuedo Loop for adding user roles
                function userRolesAddNew(userRoles, length, index) {
                    if (index < length) {
                        DataService.UserRoleAddNew(userRoles[index])
                        .success(function (response1, status, header, config) {
                            index++;
                            userRolesAddNew(userRoles, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            error.push(response + " : " + userRoles[index].RoleID);
                            userRolesAddNew(userRoles, length, index);
                        });

                    } else {
                        ur_toBeAdded_Done = true;
                        updatedObjects();
                    }
                }

                // Psuedo Loop for adding user roles
                function userRolesDelete(userRoles, length, index) {
                    if (index < length) {
                        DataService.UserRoleDelete(userRoles[index])
                        .success(function (response1, status, header, config) {
                            index++;
                            userRolesDelete(userRoles, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            error.push(response + " : " + userRoles[index].RoleID);
                            userRolesDelete(userRoles, length, index);
                        });

                    } else {
                        ur_toBeDeleted_Done = true;
                        updatedObjects();
                    }
                }

                // Psuedo Loop for adding new merchant users
                function merchantUsersAddNew(merchantUsers, length, index) {
                    if (index < length) {
                        DataService.MerchantUserAddNew(merchantUsers[index])
                        .success(function (response1, status, header, config) {
                            index++;
                            merchantUsersAddNew(merchantUsers, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            error.push(response + " : " + merchantUsers[index].MerchantID);
                            merchantUsersAddNew(merchantUsers, length, index);
                        });

                    } else {
                        mu_toBeAdded_Done = true;
                        updatedObjects();
                    }
                }

                // Psuedo Loop for deleting merchant users
                function merchantUsersDelete(merchantUsers, length, index) {
                    if (index < length) {
                        DataService.MerchantUserDelete(merchantUsers[index])
                        .success(function (response1, status, header, config) {
                            index++;
                            merchantUsersDelete(merchantUsers, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            error.push(response + " : " + merchantUsers[index].MerchantID);
                            merchantUsersDelete(merchantUsers, length, index);
                        });

                    } else {
                        mu_toBeDeleted_Done = true;
                        updatedObjects();
                    }
                }

                // Psuedo Loop for deleting user schools
                function userSchoolsAddNew(userSchools, length, index) {
                    if (index < length) {
                        DataService.UserSchoolAddNew(userSchools[index])
                        .success(function (response1, status, header, config) {
                            index++;
                            userSchoolsAddNew(userSchools, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            error.push(response + " : " + userSchools[index].SchoolID);
                            userSchoolsAddNew(userSchools, length, index);
                        });

                    } else {
                        us_toBeAdded_Done = true;
                        updatedObjects();
                    }
                }

                // Psuedo Loop for deleting user schools
                function userSchoolsDelete(userSchools, length, index) {
                    if (index < length) {
                        DataService.UserSchoolDelete(userSchools[index])
                        .success(function (response1, status, header, config) {
                            index++;
                            userSchoolsDelete(userSchools, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            error.push(response + " : " + userSchools[index].SchoolID);
                            userSchoolsDelete(userSchools, length, index);
                        });
                    } else {
                        us_toBeDeleted_Done = true;
                        updatedObjects();
                    }
                }

                //function to delete user Classes
                function userClaseesDelete() {
                    var tc_toBeAdded = sessionStorage.getItem('tc_toBeAdded');
                    if (tc_toBeAdded) {
                        tc_toBeAdded = tc_toBeAdded.split(',');
                        var tc_toBeAdded_length = tc_toBeAdded.length;
                        for (var i = 0; i < tc_toBeAdded_length; i++) {
                            if (tc_toBeAdded[i] == "" || tc_toBeAdded[i] == null || tc_toBeAdded[i] == undefined) {
                                tc_toBeAdded.splice(i, 1);
                            }
                        }

                        var teacherClasses = [];

                        // Builds the teacher Object and pushes it to the teacherClasses array
                        for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                            var teacherClass = {
                                TeacherID: $scope.userInfo.userTeacher.TeacherID,
                                ClassID: tc_toBeAdded[i]
                            }
                            teacherClasses.push(teacherClass);
                        }
                        DataService.TeacherClassAddNewBulk(teacherClasses)
                            .success(function (response3, status, header, config) {
                                // Checks for teacherClasses to be deleted
                                check_tc_toBeDeleted(teacher.TeacherID);
                            }).error(function (response, status, header, config) {
                                $scope.spinner.resolve();
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to save new employee departments!<br><br>" + response);
                            });
                    }
                    else {
                        check_tc_toBeDeleted($scope.userInfo.userTeacher.TeacherID);
                    }
                }

                DataService.UpdateUserAccount(user)
                .success(function (response1, status, header, config) {
                    userUpdate_Done = true;
                    updatedObjects();
                }).error(function (response, status, header, config) {
                    userUpdate_Done = true;
                    updatedObjects();
                    error.push(response + " : " + user.UserID);
                });
                if (teacherID !== oldTeacherID && teacherID !== null) {
                    var userTeacher = {
                        UserID: user.UserID,
                        TeacherID: oldTeacherID
                    }
                    if (userTeacher.TeacherID !== 0 && userTeacher.TeacherID !== "") {
                        DataService.UserTeacherDelete(userTeacher)
                        .success(function (response1, status, header, config) {
                            if (teacherID !== null) {
                                userTeacher.TeacherID = teacherID;
                                DataService.UserTeacherAddNew(userTeacher)
                                .success(function (response2, status, header, config) {
                                    userTeacher_Done = true;
                                    updatedObjects();
                                }).error(function (response, status, header, config) {
                                    user_Teacher_Done = true;
                                    updatedObjects();
                                    error.push(response + " : " + userTeacher.TeacherID);
                                });
                            } else {
                                userTeacher_Done = true;
                                updatedObjects();
                            }
                        }).error(function (response, status, header, config) {
                            userTeacher_Done = true;
                            updatedObjects();
                            error.push(response + " : " + userTeacher.TeacherID);
                        });
                    }
                    else {
                        if (teacherID !== null) {
                            userTeacher.TeacherID = teacherID;
                            DataService.UserTeacherAddNew(userTeacher)
                            .success(function (response2, status, header, config) {
                                userTeacher_Done = true;
                                updatedObjects();
                            }).error(function (response, status, header, config) {
                                user_Teacher_Done = true;
                                updatedObjects();
                                error.push(response + " : " + userTeacher.TeacherID);
                            });
                        } else {
                            userTeacher_Done = true;
                            updatedObjects();
                        }
                    }

                } else if (teacherID == null && oldTeacherID !== "") {
                    var userTeacher = {
                        UserID: user.UserID,
                        TeacherID: oldTeacherID
                    }
                    DataService.UserTeacherDelete(userTeacher)
                    .success(function (response, status, header, config) {
                        userTeacher_Done = true;
                        updatedObjects();
                    }).error(function (response, status, header, config) {
                        userTeacher_Done = true;
                        updatedObjects();
                        error.push(response + " : " + userTeacher.TeacherID);
                    });
                } else {
                    userTeacher_Done = true;
                    updatedObjects();
                }

                // Merchant users to be added
                var mu_toBeAdded = sessionStorage.getItem("mu_toBeAdded");
                mu_toBeAdded = mu_toBeAdded.split(",");
                var mu_toBeAdded_length = mu_toBeAdded.length;
                for (var i = 0; i < mu_toBeAdded_length; i++) {
                    if (mu_toBeAdded[i] == "" || mu_toBeAdded[i] == null || mu_toBeAdded[i] == undefined) {
                        mu_toBeAdded.splice(i, 1);
                    }
                }
                var merchantUsersTBA = [];
                for (var i = 0, len = mu_toBeAdded.length; i < len; i++) {
                    var merchantUser = {
                        UserID: user.UserID,
                        MerchantID: mu_toBeAdded[i]
                    }
                    merchantUsersTBA.push(merchantUser);
                }

                // Merchant users to be deleted
                var mu_toBeDeleted = sessionStorage.getItem("mu_toBeDeleted");
                mu_toBeDeleted = mu_toBeDeleted.split(",");
                var mu_toBeDeleted_length = mu_toBeDeleted.length;
                for (var i = 0; i < mu_toBeDeleted_length; i++) {
                    if (mu_toBeDeleted[i] == "" || mu_toBeDeleted[i] == null || mu_toBeDeleted[i] == undefined) {
                        mu_toBeDeleted.splice(i, 1);
                    }
                }
                var merchantUsersTBD = [];
                for (var i = 0, len = mu_toBeDeleted.length; i < len; i++) {
                    var merchantUser = {
                        UserID: user.UserID,
                        MerchantID: mu_toBeDeleted[i]
                    }
                    merchantUsersTBD.push(merchantUser);
                }

                // User Schools to be added
                var us_toBeAdded = sessionStorage.getItem("us_toBeAdded");
                us_toBeAdded = us_toBeAdded.split(",");
                var us_toBeAdded_length = us_toBeAdded.length;
                for (var i = 0; i < us_toBeAdded_length; i++) {
                    if (us_toBeAdded[i] == "" || us_toBeAdded[i] == null || us_toBeAdded[i] == undefined) {
                        us_toBeAdded.splice(i, 1);
                    }
                }
                var userSchoolsTBA = [];
                for (var i = 0, len = us_toBeAdded.length; i < len; i++) {
                    var userSchool = {
                        UserID: user.UserID,
                        SchoolID: us_toBeAdded[i]
                    }
                    userSchoolsTBA.push(userSchool);
                }

                // User Schools to be deleted
                var us_toBeDeleted = sessionStorage.getItem("us_toBeDeleted");
                us_toBeDeleted = us_toBeDeleted.split(",");
                var us_toBeDeleted_length = us_toBeDeleted.length;
                for (var i = 0; i < us_toBeDeleted_length; i++) {
                    if (us_toBeDeleted[i] == "" || us_toBeDeleted[i] == null || us_toBeDeleted[i] == undefined) {
                        us_toBeDeleted.splice(i, 1);
                    }
                }
                var userSchoolsTBD = [];
                for (var i = 0, len = us_toBeDeleted.length; i < len; i++) {
                    var userSchool = {
                        UserID: user.UserID,
                        SchoolID: us_toBeDeleted[i]
                    }
                    userSchoolsTBD.push(userSchool);
                }

                // User Teacher Access to be added
                var uta_toBeAdded = sessionStorage.getItem("uta_toBeAdded");
                uta_toBeAdded = uta_toBeAdded.split(",");
                var uta_toBeAdded_length = uta_toBeAdded.length;
                for (var i = 0; i < uta_toBeAdded_length; i++) {
                    if (uta_toBeAdded[i] == "" || uta_toBeAdded[i] == null || uta_toBeAdded[i] == undefined) {
                        uta_toBeAdded.splice(i, 1);
                    }
                }
                var userTeacherAccessListTBA = [];
                for (var i = 0, len = uta_toBeAdded.length; i < len; i++) {
                    var userTeacherAccess = {
                        UserID: user.UserID,
                        TeacherID: uta_toBeAdded[i]
                    }
                    userTeacherAccessListTBA.push(userTeacherAccess);
                }

                // User Teacher Access to be deleted
                var uta_toBeDeleted = sessionStorage.getItem("uta_toBeDeleted");
                uta_toBeDeleted = uta_toBeDeleted.split(",");
                var uta_toBeDeleted_length = uta_toBeDeleted.length;
                for (var i = 0; i < uta_toBeDeleted_length; i++) {
                    if (uta_toBeDeleted[i] == "" || uta_toBeDeleted[i] == null || uta_toBeDeleted[i] == undefined) {
                        uta_toBeDeleted.splice(i, 1);
                    }
                }
                var userTeacherAccessListTBD = [];
                for (var i = 0, len = uta_toBeDeleted.length; i < len; i++) {
                    var userTeacherAccess = {
                        UserID: user.UserID,
                        TeacherID: uta_toBeDeleted[i]
                    }
                    userTeacherAccessListTBD.push(userTeacherAccess);
                }

                // User Roles to be deleted
                var ur_toBeAdded = sessionStorage.getItem("ur_toBeAdded");
                ur_toBeAdded = ur_toBeAdded.split(",");
                var ur_toBeAdded_length = ur_toBeAdded.length;
                for (var i = 0; i < ur_toBeAdded_length; i++) {
                    if (ur_toBeAdded[i] == "" || ur_toBeAdded[i] == null || ur_toBeAdded[i] == undefined) {
                        ur_toBeAdded.splice(i, 1);
                    }
                }
                var userRolesTBA = [];
                for (var i = 0, len = ur_toBeAdded.length; i < len; i++) {
                    var userRole = {
                        UserID: user.UserID,
                        RoleID: ur_toBeAdded[i]
                    }
                    userRolesTBA.push(userRole);
                }

                // User Roles to be deleted
                var ur_toBeDeleted = sessionStorage.getItem("ur_toBeDeleted");
                ur_toBeDeleted = ur_toBeDeleted.split(",");
                var ur_toBeDeleted_length = ur_toBeDeleted.length;
                for (var i = 0; i < ur_toBeDeleted_length; i++) {
                    if (ur_toBeDeleted[i] == "" || ur_toBeDeleted[i] == null || ur_toBeDeleted[i] == undefined) {
                        ur_toBeDeleted.splice(i, 1);
                    }
                }
                var userRolesTBD = [];
                for (var i = 0, len = ur_toBeDeleted.length; i < len; i++) {
                    var userRole = {
                        UserID: user.UserID,
                        RoleID: ur_toBeDeleted[i]
                    }
                    userRolesTBD.push(userRole);
                }

                // If merchant users needs to be added
                if (merchantUsersTBA.length > 0) {
                    var mu_toBeAdded_Result = merchantUsersAddNew(merchantUsersTBA, merchantUsersTBA.length, 0);
                } else {
                    mu_toBeAdded_Done = true;
                }

                // If merchant users needs to be deleted
                if (merchantUsersTBD.length > 0) {
                    var mu_toBeDeleted_Result = merchantUsersDelete(merchantUsersTBD, merchantUsersTBD.length, 0);
                } else {
                    mu_toBeDeleted_Done = true;
                }

                // If user schools needs to be added
                if (userSchoolsTBA.length > 0) {
                    var us_toBeAdded_Result = userSchoolsAddNew(userSchoolsTBA, userSchoolsTBA.length, 0);
                } else {
                    us_toBeAdded_Done = true;
                }

                // If user schools needs to be deleted
                if (userSchoolsTBD.length > 0) {
                    var us_toBeDeleted_Result = userSchoolsDelete(userSchoolsTBD, userSchoolsTBD.length, 0);
                } else {
                    us_toBeDeleted_Done = true;
                    userClaseesDelete();
                }

                // If user teacher access needs to be added
                if (userTeacherAccessListTBA.length > 0) {
                    var uta_toBeAdded_Result = DataService.UserTeacherAccessAddNewBulk(userTeacherAccessListTBA);
                } else {
                    uta_toBeAdded_Done = true;
                }

                // If user teacher access needs to be deleted
                if (userTeacherAccessListTBD.length > 0) {
                    var uta_toBeAdded_Result = userTeacherAccessDelete(userTeacherAccessListTBD, userTeacherAccessListTBD.length, 0);
                } else {
                    uta_toBeDeleted_Done = true;
                }

                // If user roles needs to be added
                if (userRolesTBA.length > 0) {
                    var ur_toBeAdded_Result = userRolesAddNew(userRolesTBA, userRolesTBA.length, 0);
                } else {
                    ur_toBeAdded_Done = true;
                }

                // If user roles needs to be deleted
                if (userRolesTBD.length > 0) {
                    var ur_toBeAdded_Result = userRolesDelete(userRolesTBD, userRolesTBD.length, 0);
                } else {
                    ur_toBeDeleted_Done = true;
                }

                // Updated objects check, in case nothing is changed
                updatedObjects();

                // Updated objects check, in case nothing is changed
                updatedObjects();
                if (uta_toBeAdded_Result == true || uta_toBeAdded_Result == undefined) {
                    uta_toBeAdded_Done = true;
                    updatedObjects();
                }
                else {
                    uta_toBeAdded_Result
                    .success(function (response, status, header, config) {
                        uta_toBeAdded_Done = true;
                        updatedObjects();
                    }).error(function (response, status, header, config) {
                        uta_toBeAdded_Done = true;
                        error.push(response);
                        updatedObjects();
                    });
                }
            }
        }


        // Toggles the password field
        function togglePasswordInput() {
            if ($scope.popup.showChangePassword == true) {
                $scope.popup.showChangePassword = false;
                $scope.popup.changePasswordText = "Change Password?";
                //$("#changePassword").html("").attr("onclick", "togglePasswordInput('hidden')");
                $("#UserPassword").val("");
            }
            else {
                $scope.popup.showChangePassword = true;
                $scope.popup.changePasswordText = "Don't change password";
                //$("#changePassword").html("").attr("onclick", "togglePasswordInput('shown')");
                $("#UserPassword").val("");
            }
        }

        // Toggles the teacher field
        function toggleTeacherSelect(status) {
            if (status == "shown") {
                //$("#TeacherSelectContainer option:selected").removeAttr("selected");
                $("#changeTeacher").html("User is employee?").attr("onclick", "toggleTeacherSelect('hidden')");
                $("#TeacherSelectContainer").hide().val("");
            } else if (status == "hidden") {
                $("#changeTeacher").html("Don't attach employee").attr("onclick", "toggleTeacherSelect('shown')");
                $("#TeacherSelectContainer").show().val("");
            }
        }

        // Doesn't delete a user, simply deactivates them by changing the password and appending the user name
        function deactivateUser(userInfo) {
            var userID = userInfo.UserID;
            SMAAlert.CreateConfirmAlert("Are you sure you want<br>to archive this user?", null, null, null, confirmCallback);
            function confirmCallback(val) {
                if (val == true) {
                    $scope.spinner = SMAAlert.CreateSpinnerAlert();

                    var randomPassword = generateRanomString(10);

                    var user = {
                        UserID: userInfo.UserID,
                        UserName: "INACTIVE-" + userInfo.Email,
                        UserEmail: "INACTIVE-" + userInfo.Email,
                        Password: randomPassword,
                        FirstName: userInfo.FirstName,
                        LastName: userInfo.LastName,
                        merchantID: userInfo.MerchantID,
                        TeacherID: userInfo.userTeacher.TeacherID
                    }

                    DataService.UpdateUserAccount(user)
                    .success(function (response, status, header, config) {
                        $scope.spinner.resolve();

                        SMAAlert.CreateInfoAlert("User was successfully archived.");
                        // userC.ArchivedUser = true;
                        closeMenu();
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Failed to deactivate user:<br />" + response);
                    });
                }
            }

        }

        // Generates a random password (pass in a number(the length of the string to be made))
        function generateRanomString(stringLength) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < stringLength; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }

        // Clicks on each select all button
        function selectAll_selectAll() {
            $(".selectAllButton").each(function (i) {
                $(this).click();
            });
        }

        // Clicks on each deselect all button
        function selectAll_deselectAll() {
            $(".deselectAllButton").each(function (i) {
                $(this).click();
            });
        }
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

        }
        function showBulkMenu1() {
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

            sessionStorage.setItem("tc_alreadySaved", "");
            sessionStorage.setItem("tc_toBeAdded", "");
            sessionStorage.setItem("tc_toBeDeleted", "");
            $("#bulk" + $scope.userInfo.merchantList[0].MerchantID).trigger("click");
            showBulkMenu();
            populateClassesByMerchant($scope.userInfo.merchantList[0].MerchantID);
        }




        // Show Menu
        //function showDeptMenu(teacherID) {
        //    sessionStorage.setItem("tc_alreadySaved", "");
        //    sessionStorage.setItem("tc_toBeAdded", "");
        //    sessionStorage.setItem("tc_toBeDeleted", "");
        //    $scope.DeptSchoolList = [];

        //    // If a teacherID is passed, then populate the form
        //    if (teacherID) {
        //       // $scope.spinner = SMAAlert.CreateSpinnerAlert();
        //        // Gets the teacher object from the data-bindings
        //        var teacher = $("#teacher_" + teacherID).data();
        //        $scope.userInfo.UserID = teacher.userid;
        //        $scope.userInfo.UserName = teacher.usernamel;
        //        $scope.userInfo.FirstName = teacher.firstname;
        //        $scope.userInfo.LastName = teacher.lastname;
        //        $scope.userInfo.Email = teacher.email;
        //        $scope.userInfo.MerchantID = teacher.merchantid;
        //        $scope.userInfo.userTeacher.TeacherID = teacherID;
        //        $scope.popup.title = "User - Information";
        //        console.log(teacher);

        //        // Change the color so it's not placeholder grey
        //        selectColorBlack('DeptMerchantSelect');

        //        // Populates the classes checkboxes
        //        populateClasses(teacher.merchantid);

        //    } else {
        //        // Hides the Delete Button
        //        $("#DeleteButton").hide();

        //        // Changes the form's header and sets the teacherID to -1(this tells the db that it's new)
        //        $scope.userInfo.userTeacher.TeacherID = -1;
        //        $("#TeacherIDHidden").val(-1);
        //        $("#DeptMenu").css("display", "block");
        //    }
        //}
        // Close Dept Menu
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

        function populateClasses(merchantID) {
            // Clears the checkboxes
            $scope.DeptSchoolList = [];

            if (merchantID) {
                DataService.SchoolGetListForMerchant(merchantID)
                .success(function (response1, status, header, config) {
                    var schools = response1;
                    var index = 0;
                    var length = schools.length;

                    if (schools !== "") {
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
                        $scope.DeptSchoolList = schools;
                        $scope.DeptSchoolList.forEach(function (obj) { obj.selection = false; });

                        populateClassesLoop(schools, index, length, []);
                    } else {
                        $scope.spinner.resolve();
                    }

                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    SMAAlert.CreateInfoAlert("Failed to retrieve sites!<br><br>" + response);
                });
            }
        }

        // The populateClasses psuedo loop
        function populateClassesLoop(schools, index, length, schoolHeaders) {
            if (index < length) {
                $scope.DeptSchoolList[index].classList = [];
                DataService.ClassGetListForSchool(schools[index].SchoolID)
                .success(function (response1, status, header, config) {
                    var classes = response1;
                    if (classes != "" && classes.length > 0) {
                        classes.sort(function (a, b) {
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

                        for (var i = 0, len = classes.length; i < len; i++) {
                            classes[i].SchoolName = schools[index].Name;
                        }
                        $scope.DeptSchoolList[index].classList = classes;
                        $scope.DeptSchoolList[index].classList.forEach(function (obj) { obj.selection = false; });
                    }
                    schoolHeaders.push(schools[index].SchoolID);
                    index++;
                    populateClassesLoop(schools, index, length, schoolHeaders);
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Failed to retrieve Departments!<br><br>" + response);
                    } else {
                        console.log("Forbidden: Classes.ClassGetListForSchool(" + schools[index].SchoolID + ")");
                        index++;
                        populateClassesLoop(schools, index, length, schoolHeaders);
                    }
                });
            } else {
                for (var i = 0, len = schoolHeaders.length; i < len; i++) {
                    $("." + schoolHeaders[i]).hide();
                    $("." + schoolHeaders[i]).first().show();
                }

                var teacherID = $scope.userInfo.userTeacher.TeacherID;

                // If it's not a new teacher
                if (teacherID !== "-1") {
                    // Get the TeacherClasses by the teacher
                    DataService.TeacherClassGetListByTeacher(teacherID)
                    .success(function (response2, status, header, config) {
                        var teacherClasses = response2;

                        var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                        tc_alreadySaved = tc_alreadySaved.split(",");

                        for (var j = 0, lenj = teacherClasses.length; j < lenj; j++) {
                            //$("#" + teacherClasses[j].ClassID).prop('checked', true);

                            for (var k = 0; k < $scope.DeptSchoolList.length; k++) {
                                var foundItem = $filter('filter')($scope.DeptSchoolList[k].classList, { ClassID: teacherClasses[j].ClassID }, true);
                                if (foundItem != undefined && foundItem.length > 0) {
                                    foundItem[0].selection = true;
                                }
                            }
                            tc_alreadySaved.push(teacherClasses[j].ClassID);
                        }

                        tc_alreadySaved = tc_alreadySaved.join(",");
                        sessionStorage.setItem("tc_alreadySaved", tc_alreadySaved);

                        // $scope.spinner.resolve();
                        $("#DeptMenu").css("display", "block");
                    }).error(function (response, status, header, config) {
                        //$scope.spinner.resolve();
                        if (status !== 403) {
                            SMAAlert.CreateInfoAlert("Failed to retrieve employee departments!<br><br>" + response);
                        } else {
                            console.log("Forbidden: Teachers.TeacherClassGetListByTeacher(" + teacherID + ")");
                        }
                    });
                } else {
                    $scope.spinner.resolve();
                    $("#DeptMenu").css("display", "block");
                }
            }
        }

        function populateClassesByMerchant(merchantID) {
            //$scope.spinner = SMAAlert.CreateSpinnerAlert();
            //setTimeout(function () {
            //    $scope.spinner.resolve();
            //}, 50000);
            // Clears the checkboxes           
            $('#classdivhide').hide();
            $('#bulkclassdivhide').hide();
            $scope.DeptList = [];
            if (merchantID) {
                DataService.SchoolGetListForMerchant(merchantID)
                .success(function (response1, status, header, config) {
                    var schools = response1;
                    var index = 0;
                    var length = schools.length;

                    if (schools !== "") {
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
                        $scope.DeptList = schools;
                        $scope.DeptList.forEach(function (obj) { obj.selection = false; });

                        populateClassesLoopByMerchant(schools, index, length, []);
                    } else {
                        $scope.spinner.resolve();
                    }

                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    SMAAlert.CreateInfoAlert("Failed to retrieve sites!<br><br>" + response);
                });
            }
        }
        function populateClassesLoopByMerchant(schools, index, length, schoolHeaders) {
            if (index < length) {
                $scope.DeptList[index].classList = [];
                DataService.ClassGetListForSchool(schools[index].SchoolID)
                .success(function (response1, status, header, config) {
                    var classes = response1;
                    if (classes != "" && classes.length > 0) {
                        classes.sort(function (a, b) {
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

                        for (var i = 0, len = classes.length; i < len; i++) {
                            classes[i].SchoolName = schools[index].Name;
                        }
                        $scope.DeptList[index].classList = classes;
                        $scope.DeptList[index].classList.forEach(function (obj) { obj.selection = false; });
                    }
                    schoolHeaders.push(schools[index].SchoolID);
                    index++;
                    populateClassesLoopByMerchant(schools, index, length, schoolHeaders);
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Failed to retrieve Departments!<br><br>" + response);
                    } else {
                        console.log("Forbidden: Classes.ClassGetListForSchool(" + schools[index].SchoolID + ")");
                        index++;
                        populateClassesLoopByMerchant(schools, index, length, schoolHeaders);
                    }
                });
            }
            else {

                $('.allclasshide').hide();
                $('#classdivhide').show();
                $('#bulkclassdivhide').show();

                if ($scope.userInfo.userTeacher.TeacherID) {
                    DataService.TeacherClassGetListByTeacher($scope.userInfo.userTeacher.TeacherID)
                        .success(function (response2, status, header, config) {
                            var teacherClasses = response2;
                            var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                            tc_alreadySaved = tc_alreadySaved.split(",");
                            if ($scope.userInfo.UserID != -1) {
                                for (var j = 0, lenj = teacherClasses.length; j < lenj; j++) {
                                    //$("#" + teacherClasses[j].ClassID).prop('checked', true);

                                    for (var k = 0; k < $scope.DeptList.length; k++) {
                                        var foundItem = $filter('filter')($scope.DeptList[k].classList, { ClassID: teacherClasses[j].ClassID }, true);
                                        if (foundItem != undefined && foundItem.length > 0) {
                                            foundItem[0].selection = true;
                                            $('#cls' + $scope.DeptList[k].SchoolID).show();
                                            $('#bulk' + $scope.DeptList[k].SchoolID).show();
                                        }
                                    }
                                    tc_alreadySaved.push(teacherClasses[j].ClassID);
                                }
                            }
                            tc_alreadySaved = tc_alreadySaved.join(",");
                            sessionStorage.setItem("tc_alreadySaved", tc_alreadySaved);
                            $scope.spinner.resolve();
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (status !== 403) {
                                SMAAlert.CreateInfoAlert("Failed to retrieve employee departments!<br><br>" + response);
                            } else {
                                console.log("Forbidden: Teachers.TeacherClassGetListByTeacher(" + teacherID + ")");
                            }
                        });
                } else {
                    $scope.spinner.resolve();
                }
                // $scope.spinner.resolve();
            }
        }

        function checkTeacherClassCheckboxes(classID) {
            if ($("#" + classID).is(':checked')) {// If it's checked

                var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                tc_alreadySaved = tc_alreadySaved.split(",");

                var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                tc_toBeAdded = tc_toBeAdded.split(",");

                var tc_toBeDeleted = sessionStorage.getItem("tc_toBeDeleted");
                tc_toBeDeleted = tc_toBeDeleted.split(",");
                var temporary_tc_toBeDeleted = tc_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = tc_alreadySaved.length; i < len; i++) {
                    if (tc_alreadySaved[i] == classID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = tc_toBeDeleted.length; i < len; i++) {
                    if (tc_toBeDeleted[i] == classID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_tc_toBeDeleted.length; i < len; i++) {
                        if (temporary_tc_toBeDeleted[i] == classID) {
                            tc_toBeDeleted.splice(i, 1);
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
                    tc_toBeAdded.push(classID);
                }


                // Resets the session storage variables
                tc_toBeDeleted = tc_toBeDeleted.join(",");
                tc_toBeAdded = tc_toBeAdded.join(",");
                sessionStorage.setItem("tc_toBeDeleted", tc_toBeDeleted);
                sessionStorage.setItem("tc_toBeAdded", tc_toBeAdded);

            } else {// If it's unchecked

                var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                tc_alreadySaved = tc_alreadySaved.split(",");

                var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                tc_toBeAdded = tc_toBeAdded.split(",");
                var temporary_tc_toBeAdded = tc_toBeAdded;

                var tc_toBeDeleted = sessionStorage.getItem("tc_toBeDeleted");
                tc_toBeDeleted = tc_toBeDeleted.split(",");
                var temporary_tc_toBeDeleted = tc_toBeDeleted;
                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = tc_alreadySaved.length; i < len; i++) {
                    if (tc_alreadySaved[i] == classID) {
                        temporary_tc_toBeDeleted.push(classID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                    if (tc_toBeAdded[i] == classID) {
                        temporary_tc_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_tc_toBeDeleted.join(",");
                temporary_tc_toBeAdded.join(",");
                sessionStorage.setItem("tc_toBeDeleted", temporary_tc_toBeDeleted)
                sessionStorage.setItem("tc_toBeAdded", temporary_tc_toBeAdded);

            }
        }

        function AddClassByCheckboxes(classID) {
            if ($("#" + classID).is(':checked')) {


                var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                if (tc_toBeAdded)
                    tc_toBeAdded = tc_toBeAdded.split(",");
                else
                    tc_toBeAdded = [];
                tc_toBeAdded.push(classID);
                tc_toBeAdded = tc_toBeAdded.join(",");
                sessionStorage.setItem("tc_toBeAdded", tc_toBeAdded);

            } else {// If it's unchecked

                var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                tc_alreadySaved = tc_alreadySaved.split(",");

                var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                tc_toBeAdded = tc_toBeAdded.split(",");
                var temporary_tc_toBeAdded = tc_toBeAdded;

                var tc_toBeDeleted = sessionStorage.getItem("tc_toBeDeleted");
                tc_toBeDeleted = tc_toBeDeleted.split(",");
                var temporary_tc_toBeDeleted = tc_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = tc_alreadySaved.length; i < len; i++) {
                    if (tc_alreadySaved[i] == classID) {
                        temporary_tc_toBeDeleted.push(classID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                    if (tc_toBeAdded[i] == classID) {
                        temporary_tc_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_tc_toBeDeleted.join(",");
                temporary_tc_toBeAdded.join(",");
                sessionStorage.setItem("tc_toBeDeleted", temporary_tc_toBeDeleted)
                sessionStorage.setItem("tc_toBeAdded", temporary_tc_toBeAdded);

            }
        }

        // Save Form
        function submitDepartmentForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            // Creates the teacher object from the inputs
            var teacher = {
                TeacherID: $scope.userInfo.userTeacher.TeacherID,
                FirstName: $scope.userInfo.FirstName,
                LastName: $scope.userInfo.LastName,
                Email: $scope.userInfo.Email,
                MerchantID: $scope.userInfo.MerchantID
            }

            // Grabs the session variables(i.e. Teacher Classes), splits them into arrays, and removes any null or empty values
            var tc_toBeAdded = sessionStorage.getItem('tc_toBeAdded');
            tc_toBeAdded = tc_toBeAdded.split(',');
            var tc_toBeAdded_length = tc_toBeAdded.length;
            for (var i = 0; i < tc_toBeAdded_length; i++) {
                if (tc_toBeAdded[i] == "" || tc_toBeAdded[i] == null || tc_toBeAdded[i] == undefined) {
                    tc_toBeAdded.splice(i, 1);
                }
            }

            // If it's a new teacher
            if (teacher.TeacherID == -1) {
                //Add the new teacher
                DataService.TeacherAddNew(teacher)
                .success(function (response1, status, header, config) {
                    var teacherID = response1;

                    // If their are TeacherClasses to be added
                    if (tc_toBeAdded.length > 0) {

                        var teacherClasses = [];

                        // Builds the teacher Object and pushes it to the teacherClasses array
                        for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                            var teacherClass = {
                                TeacherID: teacherID,
                                ClassID: tc_toBeAdded[i]
                            }
                            teacherClasses.push(teacherClass);
                        }

                        DataService.TeacherClassAddNewBulk(teacherClasses)
                        .success(function (response3, status, header, config) {
                            // After the teacherClasses are posted, recall the populate function
                            $scope.spinner.resolve();
                            populateUsers();
                            closeDeptMenu();
                            SMAAlert.CreateInfoAlert("Department info has been saved.");
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to save departments!<br><br>" + response);
                        });
                    } else {
                        // After the teacher is posted, recall the populate function
                        $scope.spinner.resolve();
                        populateUsers();
                        closeDeptMenu();
                        SMAAlert.CreateInfoAlert("Department info has been saved.");
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to save department info!<br><br>" + response);
                });
            } else {
                // Updates the Teacher
                DataService.TeacherUpdate(teacher)
                .success(function (response1, status, header, config) {
                    // If their are TeacherClasses to be added
                    if (tc_toBeAdded.length > 0) {
                        var teacherClasses = [];

                        // Builds the teacher Object and pushes it to the teacherClasses array
                        for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                            var teacherClass = {
                                TeacherID: teacher.TeacherID,
                                ClassID: tc_toBeAdded[i]
                            }
                            teacherClasses.push(teacherClass);
                        }

                        DataService.TeacherClassAddNewBulk(teacherClasses)
                        .success(function (response3, status, header, config) {
                            // Checks for teacherClasses to be deleted
                            check_tc_toBeDeleted(teacher.TeacherID);
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to save new employee departments!<br><br>" + response);
                        });
                    } else {
                        // Checks for teacherClasses to be deleted
                        check_tc_toBeDeleted(teacher.TeacherID);
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to update employees!<br><br>" + response);
                });
            }
        }


        // Checks for teacher classes to be deleted
        function check_tc_toBeDeleted(teacherID) {
            // Grabs the session variables(i.e. Teacher Classes), splits them into arrays, and removes any null or empty values
            var tc_toBeDeleted = sessionStorage.getItem('tc_toBeDeleted');
            tc_toBeDeleted = tc_toBeDeleted.split(',');
            var tc_toBeDeleted_length = tc_toBeDeleted.length;
            for (var i = 0; i < tc_toBeDeleted_length; i++) {
                if (tc_toBeDeleted[i] == "" || tc_toBeDeleted[i] == null || tc_toBeDeleted[i] == undefined) {
                    tc_toBeDeleted.splice(i, 1);
                }
            }

            // If their are teacher classes to be deleted
            if (tc_toBeDeleted.length > 0) {
                //deleteTeacherClassesLoop(0, tc_toBeDeleted.length, tc_toBeDeleted, teacherID, []);
                var teacherClassesDelete = [];

                // Builds the teacher Object and pushes it to the teacherClasses array
                for (var i = 0, len = tc_toBeDeleted.length; i < len; i++) {
                    var teacherClass = {
                        TeacherID: $scope.userInfo.userTeacher.TeacherID,
                        ClassID: tc_toBeDeleted[i]
                    }
                    teacherClassesDelete.push(teacherClass);
                }
                DataService.TeacherClassDelete(teacherClassesDelete)
               .success(function (response1, status, header, config) {
                   var v = response1;
               }).error(function (response, status, header, config) {
                   if (status !== 403) {
                       $scope.spinner.resolve();
                       if (response == null) { response = "" }
                       SMAAlert.CreateInfoAlert("Failed to delete employee department!<br><br>" + response);
                   } else {
                       forbiddenErrors.push(classes[index]);
                       // Recalls the psuedo loop
                       index++;
                       deleteTeacherClassesLoop(index, length, classes, teacherID, forbiddenErrors);
                   }
               });

            } else {
                // Repopulates the teacher list, closes the menu, and shows a success pop-up
                $scope.spinner.resolve();
                populateUsers();
                closeDeptMenu();
                SMAAlert.CreateInfoAlert("Employee has been updated.");
            }
        }


        // Psuedo loop for deleting teacher classes
        function deleteTeacherClassesLoop(index, length, classes, teacherID, forbiddenErrors) {
            if (index < length) {
                // Deletes the teacher class
                DataService.TeacherClassDelete(teacherID, classes[index])
                .success(function (response1, status, header, config) {
                    // Recalls the psuedo loop
                    index++;
                    deleteTeacherClassesLoop(index, length, classes, teacherID, forbiddenErrors);
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to delete employee department!<br><br>" + response);
                    } else {
                        forbiddenErrors.push(classes[index]);
                        // Recalls the psuedo loop
                        index++;
                        deleteTeacherClassesLoop(index, length, classes, teacherID, forbiddenErrors);
                    }
                });

            } else {
                // Repopulates the teacher list, closes the menu, and shows a success pop-up
                $scope.spinner.resolve();
                populateUsers();
                closeDeptMenu();
                SMAAlert.CreateInfoAlert("Department has been updated.");
                // If they were forbidden to delete anything
                if (forbiddenErrors > 0) {
                    var html = "<b>Forbidden<b><br>Unable to delete the following department connections for " + teacherID + ":<br><br><ul>";
                    for (var i = 0, ii = forbiddenErrors.length; i < ii; i++) {
                        html += "<li>" + forbiddenErrors[i] + "</li>";
                    }
                    html += "</ul>";
                    SMAAlert.CreateInfoAlert(html);
                }
            }
        }

        function selectColorBlack1(id) {
            selectColorBlack(id);
        }

        //-----------------------------Bulk Upload-----------------------------
        function submitBulkForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            processFile();
            return false;
        }
        function loadBulkForm() {

            showBulkMenu();
        }
        function deloadBulkForm() {
            // Clears the container
            closeBulkMenu();
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
            //saveBulkData(tableData.Sheet1);// THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
            // THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
            saveBulkData(tableData.Sheet1)
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
        //----------------------------------XX---------------------------------

        function saveMassBulkData(table) {
            var tableData = [];
            for (var i in table) {
                var tbdata = {
                    Email: table[i].Email,
                    Password: table[i].Password,
                    FirstName: table[i].FirstName,
                    LastName: table[i].LastName
                }
                tableData.push(tbdata);
            }
        }


        function ActivateUser(TeacherID, UserID) {
            SMAAlert.CreateConfirmAlert("Are you sure you want<br>to activate this user?", null, null, null, confirmCallback);
            function confirmCallback(val) {
                TeacherID = "";
                if (val == true && UserID) {
                    $scope.spinner = SMAAlert.CreateSpinnerAlert();
                    var user = $scope.ArchivedUsers.filter(function (e) {
                        return e.UserID == UserID;
                    })
                    var user = {
                        UserID: user[0].UserID,
                        UserName: user[0].Email.replace('INACTIVE-', ''),
                        UserEmail: user[0].Email.replace('INACTIVE-', ''),
                        FirstName: user[0].FirstName,
                        LastName: user[0].LastName,
                        merchantID: user[0].MerchantID,
                        TeacherID: user[0].userTeacher.TeacherID
                    }

                    DataService.UpdateUserAccount(user)
                    .success(function (response, status, header, config) {
                        $scope.spinner.resolve();

                        SMAAlert.CreateInfoAlert("User was successfully activated.");
                        //userC.ArchivedUser = false;
                        closeMenu();
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        SMAAlert.CreateInfoAlert("Failed to deactivate user:<br />" + response);
                    });
                }
            }
        }
    }
})();