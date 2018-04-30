(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("RoleController", ["$scope", "DataService", "SMAAlertFactory", "ProjectConstants", "$filter", roleController]);

    function roleController($scope, DataService, SMAAlert, ProjectConstants, $filter) {
        $scope.roleInfo = getRoleObject();
        $scope.popup = {
            title: 'Role - Information',
            showMenu: showMenu,
            closeMenu: closeMenu,
            submitClicked: false,
        }
        $scope.merchantsList = {
            roleList: [],
        };

        var roleC = this;
        roleC.collapse = collapse;
        roleC.collapseAll = collapseAll;
        roleC.expandAll = expandAll;
        roleC.submitForm = submitForm;
        roleC.saveForm = saveForm;
        roleC.deleteRole = deleteRole;
        roleC.selectAllUserRoles = selectAllUserRoles;
        roleC.deselectAllUserRoles = deselectAllUserRoles;
        roleC.checkRoleRightsCheckboxes = checkRoleRightsCheckboxes;
        roleC.checkUserRoleCheckboxes = checkUserRoleCheckboxes;
        roleC.selectColorBlack = selectColorBlack1;        
        populateRoles();
        page_init();
        return roleC;

        function getRoleObject() {
            return {
                RoleID: "",
                RoleName: "",
                Description: "",
                MerchantID: "",
                RightList: [],
                UserList: []
            };
        }

        function getRightObject() {
            return {
                RightID: "",
                RightRank: '',
                RightName: '',
                Description: '',
            };
        }

        function getUserObject() {
            return {
                UserID: '',
                LastName: '',
                FirstName: '',
            };
        }

        function page_init() {
            sessionStorage.setItem("rr_alreadySaved", "");
            sessionStorage.setItem("rr_toBeAdded", "");
            sessionStorage.setItem("rr_toBeDeleted", "");
            sessionStorage.setItem("ur_alreadySaved", "");
            sessionStorage.setItem("ur_toBeAdded", "");
            sessionStorage.setItem("ur_toBeDeleted", "");

            $scope.validator = $("#FormInputs").validate({
                rules: {
                    RoleName: {
                        required: true
                    },
                    RoleDescription: {
                        required: true
                    },
                    MerchantSelect: {
                        required: true
                    }
                }
            });
        }

        // Populate Roles
        function populateRoles() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            // Clears out HTML elements
            getMerchants();
        }
        

        // Gets the merchants
        function getMerchants() {
            DataService.MerchantGetListByCurrentUser()
            .success(function (response1, status, header, config) {
                var merchants = response1;
                // Sets the loop variables
                var merchants_length = merchants.length;
                var merchants_index = 0;

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

                // Populates the merchant dropdown
                $scope.merchantsList = merchants;
                if (merchants_length > 0) {
                    // Calls Psuedo loop function
                    getRoles(merchants, merchants_length, merchants_index);
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


        // Psuedo loop for getting roles per merchant
        function getRoles(merchants, merchants_length, merchants_index) {
            if (merchants_index < merchants_length) {
                $scope.merchantsList[merchants_index].roleList = [];
                DataService.RolesGetListForMerchant(merchants[merchants_index].MerchantID)
                .success(function (response1, status, header, config) {
                    var roles = response1;

                    for (var i = 0, len = roles.length; i < len; i++) {
                        roles[i].MerchantID = merchants[merchants_index].MerchantID;
                    }

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
                        $scope.merchantsList[merchants_index].roleList = roles;
                    }

                    // Increments index and recalls the psuedo loop
                    merchants_index++;
                    getRoles(merchants, merchants_length, merchants_index);
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve roles:<br><br>" + response);
                    } else {
                        console.log("Forbidden: Roles.RolesGetListForMerchant(" + merchants[merchants_index].MerchantID + ")");
                        merchants_index++;
                        getRoles(merchants, merchants_length, merchants_index);
                    }
                });
            } else {
                $scope.spinner.resolve();
            }
        }


        // Save Form
        function submitForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            // Creates the role object from the inputs
            var role = {
                RoleID: $scope.roleInfo.RoleID,
                RoleName: $scope.roleInfo.RoleName,
                Description: $scope.roleInfo.Description,
                MerchantID: $scope.roleInfo.MerchantID
            }

            // Grabs the session variables(i.e. Role Rights), splits them into arrays, and removes any null or empty values
            var rr_toBeAdded = sessionStorage.getItem('rr_toBeAdded');
            rr_toBeAdded = rr_toBeAdded.split(',');
            var rr_toBeAdded_length = rr_toBeAdded.length;
            for (var i = 0; i < rr_toBeAdded_length; i++) {
                if (rr_toBeAdded[i] == "" || rr_toBeAdded[i] == null || rr_toBeAdded[i] == undefined) {
                    rr_toBeAdded.splice(i, 1);
                }
            }

            // If it's a new role
            if (role.RoleID == -1) {
                DataService.RolesAddNew(role)
                .success(function (response1, status, header, config) {
                    var roleID = response1;
                    if (rr_toBeAdded > 0) {
                        var roleRights = [];

                        // Builds the RoleRights objects and pushes it to the array
                        for (var i = 0, len = rr_toBeAdded.length; i < len; i++) {
                            var roleRight = {
                                RoleID: role.RoleID,
                                RightID: rr_toBeAdded[i]
                            }
                            roleRights.push(roleRight);
                        }
                        DataService.RoleRightsAddNewBulk(roleRights)
                        .success(function (response3, status, header, config) {
                            // After the role is posted, recall the populate function
                            $scope.spinner.resolve();
                            populateRoles();
                            closeMenu();
                            SMAAlert.CreateInfoAlert("New Role has been saved.");
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to save role rights:<br><br>" + response);
                        });
                        
                    } else {
                        // After the class is posted, recall the populate function
                        $scope.spinner.resolve();
                        populateRoles();
                        closeMenu();
                        SMAAlert.CreateInfoAlert("New Role has been saved.");
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to save role:<br><br>" + response);
                });
                
            } else {
                // If it's not a new role
                DataService.RolesUpdate(role)
                .success(function (response1, status, header, config) {
                    if (rr_toBeAdded.length > 0) {
                        var roleRights = [];
                        // Builds the RoleRight objects and pushes it to the array
                        for (var i = 0, len = rr_toBeAdded.length; i < len; i++) {
                            var roleRight = {
                                RoleID: role.RoleID,
                                RightID: rr_toBeAdded[i]
                            }
                            roleRights.push(roleRight);
                        }

                        DataService.RoleRightsAddNewBulk(roleRights)
                        .success(function (response, status, header, config) {
                            check_rr_toBeDeleted(role.RoleID);
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to update role rights:<br><br>" + response);
                        });
                    } else {
                        check_rr_toBeDeleted(role.RoleID);
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to update role:<br><br>" + response);
                });
            }
        }


        // Checks for RoleRights to be deleted, and then deletes them
        function check_rr_toBeDeleted(roleID) {
            // Grabs the session variables(i.e. Role Rights), splits them into an array, and removes any null or empty values
            var rr_toBeDeleted = sessionStorage.getItem('rr_toBeDeleted');
            rr_toBeDeleted = rr_toBeDeleted.split(',');
            var rr_toBeDeleted_length = rr_toBeDeleted.length;
            for (var i = 0; i < rr_toBeDeleted_length; i++) {
                if (rr_toBeDeleted[i] == "" || rr_toBeDeleted[i] == null || rr_toBeDeleted[i] == undefined) {
                    rr_toBeDeleted.splice(i, 1);
                }
            }

            // If their are teacher classes to be deleted
            if (rr_toBeDeleted.length > 0) {
                deleteRoleRightsLoop(0, rr_toBeDeleted.length, rr_toBeDeleted, roleID);
            } else {
                // After the class is posted, recall the populate function
                $scope.spinner.resolve();
                populateRoles();
                closeMenu();
                SMAAlert.CreateInfoAlert("Role has been updated.");
            }
        }


        // NEW SAVE FORM FUNCTION
        function saveForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            // Creates the role object from the inputs
            var role = {
                RoleID: $scope.roleInfo.RoleID,
                RoleName: $scope.roleInfo.RoleName,
                Description: $scope.roleInfo.Description,
                MerchantID: $scope.roleInfo.MerchantID
            }

            // Grabs the session variables(i.e. Role Rights), splits them into arrays, and removes any null or empty values
            var rr_toBeAdded = sessionStorage.getItem('rr_toBeAdded');
            rr_toBeAdded = rr_toBeAdded.split(',');
            var rr_toBeAdded_length = rr_toBeAdded.length;
            for (var i = 0; i < rr_toBeAdded_length; i++) {
                if (rr_toBeAdded[i] == "" || rr_toBeAdded[i] == null || rr_toBeAdded[i] == undefined) {
                    rr_toBeAdded.splice(i, 1);
                }
            }

            var rr_toBeDeleted = sessionStorage.getItem('rr_toBeDeleted');
            rr_toBeDeleted = rr_toBeDeleted.split(',');
            var rr_toBeDeleted_length = rr_toBeDeleted.length;
            for (var i = 0; i < rr_toBeDeleted_length; i++) {
                if (rr_toBeDeleted[i] == "" || rr_toBeDeleted[i] == null || rr_toBeDeleted[i] == undefined) {
                    rr_toBeDeleted.splice(i, 1);
                }
            }

            var ur_toBeAdded = sessionStorage.getItem('ur_toBeAdded');
            ur_toBeAdded = ur_toBeAdded.split(',');
            var ur_toBeAdded_length = ur_toBeAdded.length;
            for (var i = 0; i < ur_toBeAdded_length; i++) {
                if (ur_toBeAdded[i] == "" || ur_toBeAdded[i] == null || ur_toBeAdded[i] == undefined) {
                    ur_toBeAdded.splice(i, 1);
                }
            }

            var ur_toBeDeleted = sessionStorage.getItem('ur_toBeDeleted');
            ur_toBeDeleted = ur_toBeDeleted.split(',');
            var ur_toBeDeleted_length = ur_toBeDeleted.length;
            for (var i = 0; i < ur_toBeDeleted_length; i++) {
                if (ur_toBeDeleted[i] == "" || ur_toBeDeleted[i] == null || ur_toBeDeleted[i] == undefined) {
                    ur_toBeDeleted.splice(i, 1);
                }
            }

            var errors = [];
            var msg = '';
            var role_Done = false;
            var rr_toBeAdded_Done = false;
            var rr_toBeDeleted_Done = false;
            var ur_toBeAdded_Done = false;
            var ur_toBeDeleted_Done = false;

            // Checks when dones
            function checkWhenDones() {
                console.log("role_Done = " + role_Done);
                console.log("rr_toBeAdded_Done = " + rr_toBeAdded_Done);
                console.log("rr_toBeDeleted_Done = " + rr_toBeDeleted_Done);
                console.log("ur_toBeAdded_Done = " + ur_toBeAdded_Done);
                console.log("ur_toBeDeleted_Done = " + ur_toBeDeleted_Done);
                if (role_Done == true && rr_toBeAdded_Done == true && rr_toBeDeleted_Done == true && ur_toBeAdded_Done == true && ur_toBeDeleted_Done == true) {
                    // After the class is posted, recall the populate function
                    $scope.spinner.resolve();
                    populateRoles();
                    closeMenu();
                    if (errors.length > 0) {
                        var errorList = "<ul>";
                        for (var i = 0, len = errors.length; i < len; i++) {
                            errorList += "<li>" + errors[i] + "</li>";
                        }
                        errorList += "</ul>";
                        SMAAlert.CreateInfoAlert("The following errors occured while saving the role:<br><br>" + errorList);
                    } else {
                        SMAAlert.CreateInfoAlert(msg);
                    }
                }
            }

            // Updates or saves a new Role
            if (role.RoleID == -1) {
                DataService.RolesAddNew(role)
                .success(function (response, status, header, config) {
                    role_Done = true;
                    msg = 'Role has been Added successfully.';
                    role.RoleID=response;                    
                    rrtobeadded();
                    checkWhenDones();
                }).error(function (response, status, header, config) {
                    errors.push("Failed to update role:" + response);
                    role_Done = true;
                    checkWhenDones();
                });
            } else {
                DataService.RolesUpdate(role)
                .success(function (response, status, header, config) {
                    role_Done = true;
                    msg = 'Role has been Updated successfully.';
                    rrtobeadded();
                    checkWhenDones();
                }).error(function (response, status, header, config) {
                    errors.push("Failed to update role:" + response);
                    role_Done = true;
                    checkWhenDones();
                });
            }

            // If role rights need to be added
            function rrtobeadded() {
                if (role_Done == true) {
                    if (rr_toBeAdded.length > 0) {
                        var roleRightsTBA = [];
                        for (var i = 0, len = rr_toBeAdded.length; i < len; i++) {
                            var roleRightTBA = {
                                RoleID: role.RoleID,
                                RightID: rr_toBeAdded[i]
                            }
                            roleRightsTBA.push(roleRightTBA);
                        }

                        DataService.RoleRightsAddNewBulk(roleRightsTBA)
                        .success(function (response, status, header, config) {
                            rr_toBeAdded_Done = true;
                            checkWhenDones();
                        }).error(function (response, status, header, config) {
                            errors.push("Failed to add role rights:" + response);
                            rr_toBeAdded_Done = true;
                            checkWhenDones();
                        });
                    } else {
                        rr_toBeAdded_Done = true;
                        checkWhenDones();
                    }
                }
            }
            // If role rights need to be deleted
            if (rr_toBeDeleted.length > 0) {
                var roleRightsTBD = [];
                for (var i = 0, len = rr_toBeDeleted.length; i < len; i++) {
                    var roleRightTBD = {
                        RoleID: role.RoleID,
                        RightID: rr_toBeDeleted[i]
                    }
                    roleRightsTBD.push(roleRightTBD);
                }

                function deleteRoleRights(roleRights, length, index) {
                    if (index < length) {
                        
                        DataService.RoleRightsDelete(roleRights[index].RoleID, roleRights[index].RightID)
                       .success(function (response, status, header, config) {
                           index++;
                           deleteRoleRights(roleRights, length, index);
                       }).error(function (response, status, header, config) {
                           index++;
                           errors.push("Failed to delete role rights:" + response);
                           deleteRoleRights(roleRights, length, index);
                       });
                    } else {
                        rr_toBeDeleted_Done = true;
                        checkWhenDones();
                    }
                }
                deleteRoleRights(roleRightsTBD, roleRightsTBD.length, 0);
            } else {
                rr_toBeDeleted_Done = true;
                checkWhenDones();
            }

            // If user roles need to be added
            if (ur_toBeAdded.length > 0) {
                var userRolesTBA = [];
                for (var i = 0, len = ur_toBeAdded.length; i < len; i++) {
                    var userRoleTBA = {
                        UserID: ur_toBeAdded[i],
                        RoleID: role.RoleID
                    }
                    userRolesTBA.push(userRoleTBA);
                }

                function addUserRoles(userRoles, length, index) {
                    if (index < length) {
                        DataService.UserRoleAddNew(userRoles[index])
                        .success(function (response, status, header, config) {
                            index++;
                            addUserRoles(userRoles, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            errors.push("Failed to add user roles:" + response);
                            addUserRoles(userRoles, length, index);
                        });
                    } else {
                        ur_toBeAdded_Done = true;
                        checkWhenDones();
                    }
                }
                addUserRoles(userRolesTBA, userRolesTBA.length, 0);
            } else {
                ur_toBeAdded_Done = true;
                checkWhenDones();
            }

            // If user roles need to be deleted
            if (ur_toBeDeleted.length > 0) {
                var userRolesTBD = [];
                for (var i = 0, len = ur_toBeDeleted.length; i < len; i++) {
                    var userRoleTBD = {
                        UserID: ur_toBeDeleted[i],
                        RoleID: role.RoleID
                    }
                    userRolesTBD.push(userRoleTBD);
                }

                function deleteUserRoles(userRoles, length, index) {
                    if (index < length) {
                        DataService.UserRoleDelete(userRoles[index])
                        .success(function (response, status, header, config) {
                            index++;
                            deleteUserRoles(userRoles, length, index);
                        }).error(function (response, status, header, config) {
                            index++;
                            errors.push("Failed to delete user roles:" + response);
                            deleteUserRoles(userRoles, length, index);
                        });

                    } else {
                        ur_toBeDeleted_Done = true;
                        checkWhenDones();
                    }
                }

                deleteUserRoles(userRolesTBD, userRolesTBD.length, 0);
            } else {
                ur_toBeDeleted_Done = true;
                checkWhenDones();
            }
        }

        // Psuedo Loop for deleting RoleRights
        function deleteRoleRightsLoop(index, length, rights, roleID) {
            if (index < length) {
                // Deletes the RoleRight
                DataService.RoleRightsDelete(roleID, rights[index]) ///////////////////////////////////////////////// JONATHON SAYS THIS IS BROKE!?!?!?!
                .success(function (response, status, header, config) {
                    index++;
                    // Recalls the loop
                    deleteRoleRightsLoop(index, length, rights, roleID);
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to delete role rights:<br><br>" + response);
                });
            } else {
                // After the class is posted, recall the populate function
                $scope.spinner.resolve();
                populateRoles();
                closeMenu();
                SMAAlert.CreateInfoAlert("Role has been updated.");
            }
        }

        // Populates the right checkboxes
        function populateRights(roleID) {
            //$("#RightsCheckboxContainer").html("");
            $scope.roleInfo.RightList = [];
            DataService.RightsGetFullList()
            .success(function (response1, status, header, config) {
                var rights = response1;

                function sortRightsByRightRank(a, b) {
                    if (a.RightRank < b.RightRank)
                        return -1;
                    if (a.RightRank > b.RightRank)
                        return 1;
                    return 0;
                }

                rights.sort(sortRightsByRightRank);
                $scope.roleInfo.RightList = rights;
                // If it's not a new role
                if (roleID) {
                    DataService.RolesGetDetailsWithRights(roleID)
                    .success(function (response2, status, header, config) {
                        var roleRights = response2;

                        // If their are roleRIghts for this class
                        if (roleRights.Rights.length > 0) {
                            var rr_alreadySaved = [];

                            for (var i = 0, len = roleRights.Rights.length; i < len; i++) {
                                $("#" + roleRights.Rights[i].RightID).prop("checked", true);
                                rr_alreadySaved.push(roleRights.Rights[i].RightID);
                            }

                            // Joins the array into a string and pushes it to the session variables
                            rr_alreadySaved = rr_alreadySaved.join(",");
                            sessionStorage.setItem("rr_alreadySaved", rr_alreadySaved);
                        }

                        checkPrivileges(rights);
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (status !== 403) {
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to retrieve role rights:<br><br>" + response);
                        }
                    });
                } else {
                    checkPrivileges(rights);
                }

            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve role rights:" + response);
                }
            });

        }

        function checkPrivileges(rights) {
            DataService.RolesGetListForCurrentUserWithRights()
            .success(function (response1, status, header, config) {
                var currentRoles = response1;

                var isAdmin = false;
                // Loops through all the roles for the user and the right ranks, checks if they have the rights
                for (var i = 0, leni = currentRoles.length; i < leni; i++) {
                    for (var j = 0, lenj = currentRoles[i].Rights.length; j < lenj; j++) {
                        if (currentRoles[i].Rights[j].RightRank < 100) {
                            isAdmin = true;
                        }
                    }
                }

                if (isAdmin = false) {
                    for (var i = 0, len = rights.length; i < len; i++) {
                        if (rights[i].RightRank < 101) {
                            $("#RightRank" + rights[i].RightID).hide();
                        }
                    }
                }

                populateUserRoles();
            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (stauts !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve role permissions:<br><br>" + response);
                }
            });

        }

        // Gets the user roles and creates the user checkboxes
        function populateUserRoles() {
            DataService.MerchantGetListByCurrentUser()
            .success(function (response, status, header, config) {
                var merchants = response;
                var errors = [];

                function getUserRoles() {
                    var roleID = $scope.roleInfo.RoleID;
                    if (roleID !== "-1") {
                        DataService.UserRolesGetListbyRole(roleID)
                        .success(function (response, status, header, config) {
                            var userRoles = response;
                            var ur_alreadySaved = [];

                            for (var i = 0, len = userRoles.length; i < len; i++) {
                                $("#" + userRoles[i].UserID).prop("checked", true);
                                ur_alreadySaved.push(userRoles[i].UserID);
                            }

                            sessionStorage.setItem("ur_alreadySaved", ur_alreadySaved.join(","));
                            $scope.spinner.resolve();
                            $("#UserRolesContainer").show();
                            $("#EditMenu").css("display", "block");

                            if (errors.length > 0) {
                                var errorList = "<ul>";
                                for (var i = 0, len = errors.length; i < len; i++) {
                                    errorList += errors[i];
                                }
                                errorList += ("</ul>");
                                SMAAlert.CreateInfoAlert("The following errors occured:" + errorList);
                            }
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (status !== 403) {
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to retrieve user roles:<br><br>" + response);
                            }
                        });
                    } else {
                        $scope.spinner.resolve();
                        $("#UserRolesContainer").hide();
                        $("#EditMenu").css("display", "block");
                    }
                }

                function getUsersByMerchant(merchants, length, index, users) {
                    if (index < length) {
                        DataService.UserGetListForMerchant(merchants[index].MerchantID)
                        .success(function (response, status, header, config) {
                            index++;
                            users = users.concat(response);
                            getUsersByMerchant(merchants, length, index, users);
                        }).error(function (response, status, header, config) {
                            index++;
                            if (status !== 403) {
                                if (response == null) { response = "" }
                                errors.push("<li>Failed to retrieve users:" + response + "</li>");
                            }
                            getUsersByMerchant(merchants, length, index, users);
                        });
                    } else {
                        $scope.roleInfo.UserList = users;
                        getUserRoles();
                    }
                }

                getUsersByMerchant(merchants, merchants.length, 0, []);
            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve merchants:<br><br>" + response);
                }
            });
        }

        // Checks for RoleRight checkboxes
        function checkRoleRightsCheckboxes(rightID) {
            if ($("#" + rightID).is(':checked')) {// If it's checked

                var rr_alreadySaved = sessionStorage.getItem("rr_alreadySaved");
                rr_alreadySaved = rr_alreadySaved.split(",");

                var rr_toBeAdded = sessionStorage.getItem("rr_toBeAdded");
                rr_toBeAdded = rr_toBeAdded.split(",");

                var rr_toBeDeleted = sessionStorage.getItem("rr_toBeDeleted");
                rr_toBeDeleted = rr_toBeDeleted.split(",");
                var temporary_rr_toBeDeleted = rr_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = rr_alreadySaved.length; i < len; i++) {
                    if (rr_alreadySaved[i] == rightID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = rr_toBeDeleted.length; i < len; i++) {
                    if (rr_toBeDeleted[i] == rightID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_rr_toBeDeleted.length; i < len; i++) {
                        if (temporary_rr_toBeDeleted[i] == rightID) {
                            rr_toBeDeleted.splice(i, 1);
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
                    rr_toBeAdded.push(rightID);
                }


                // Resets the session storage variables
                rr_toBeDeleted = rr_toBeDeleted.join(",");
                rr_toBeAdded = rr_toBeAdded.join(",");
                sessionStorage.setItem("rr_toBeDeleted", rr_toBeDeleted);
                sessionStorage.setItem("rr_toBeAdded", rr_toBeAdded);

            } else {// If it's unchecked

                var rr_alreadySaved = sessionStorage.getItem("rr_alreadySaved");
                rr_alreadySaved = rr_alreadySaved.split(",");

                var rr_toBeAdded = sessionStorage.getItem("rr_toBeAdded");
                rr_toBeAdded = rr_toBeAdded.split(",");
                var temporary_rr_toBeAdded = rr_toBeAdded;

                var rr_toBeDeleted = sessionStorage.getItem("rr_toBeDeleted");
                rr_toBeDeleted = rr_toBeDeleted.split(",");
                var temporary_rr_toBeDeleted = rr_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = rr_alreadySaved.length; i < len; i++) {
                    if (rr_alreadySaved[i] == rightID) {
                        temporary_rr_toBeDeleted.push(rightID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = rr_toBeAdded.length; i < len; i++) {
                    if (rr_toBeAdded[i] == rightID) {
                        temporary_rr_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_rr_toBeDeleted.join(",");
                temporary_rr_toBeAdded.join(",");
                sessionStorage.setItem("rr_toBeDeleted", temporary_rr_toBeDeleted);
                sessionStorage.setItem("rr_toBeAdded", temporary_rr_toBeAdded);

            }
        }

        // Checks for UserRoles checkboxes
        function checkUserRoleCheckboxes(userID) {
            if ($("#" + userID).is(':checked')) {// If it's checked

                var ur_alreadySaved = sessionStorage.getItem("ur_alreadySaved");
                ur_alreadySaved = ur_alreadySaved.split(",");

                var ur_toBeAdded = sessionStorage.getItem("ur_toBeAdded");
                ur_toBeAdded = ur_toBeAdded.split(",");

                var ur_toBeDeleted = sessionStorage.getItem("ur_toBeDeleted");
                ur_toBeDeleted = ur_toBeDeleted.split(",");
                var temporary_ur_toBeDeleted = ur_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = ur_alreadySaved.length; i < len; i++) {
                    if (ur_alreadySaved[i] == userID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = ur_toBeDeleted.length; i < len; i++) {
                    if (ur_toBeDeleted[i] == userID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_ur_toBeDeleted.length; i < len; i++) {
                        if (temporary_ur_toBeDeleted[i] == userID) {
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
                    ur_toBeAdded.push(userID);
                }


                // Resets the session storage variables
                ur_toBeDeleted = ur_toBeDeleted.join(",");
                ur_toBeAdded = ur_toBeAdded.join(",");
                sessionStorage.setItem("ur_toBeDeleted", ur_toBeDeleted);
                sessionStorage.setItem("ur_toBeAdded", ur_toBeAdded);

            } else {// If it's unchecked

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
                    if (ur_alreadySaved[i] == userID) {
                        temporary_ur_toBeDeleted.push(userID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = ur_toBeAdded.length; i < len; i++) {
                    if (ur_toBeAdded[i] == userID) {
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

        // Shows the information menu/form
        function showMenu(roleID) {
            // Clears session variables for the form
            sessionStorage.setItem("rr_alreadySaved", "");
            sessionStorage.setItem("rr_toBeAdded", "");
            sessionStorage.setItem("rr_toBeDeleted", "");
            sessionStorage.setItem("ur_alreadySaved", "");
            sessionStorage.setItem("ur_toBeAdded", "");
            sessionStorage.setItem("ur_toBeDeleted", "");
            
            if (roleID) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                // Gets the role object from the data-bindings
                var foundItem  = null;
                for (var i = 0; i < $scope.merchantsList.length; i++) {
                    if(foundItem  == null)
                    {
                        foundItem = $filter('filter')($scope.merchantsList[i].roleList, { RoleID: roleID }, true)[0];
                    }
                }
                
                if (foundItem != undefined)
                {
                    var role_data = foundItem;

                    $scope.popup.title = "Role - Information";
                    $("#DeleteButton").show();

                    $scope.roleInfo.RoleID = roleID;
                    $scope.roleInfo.RoleName = role_data.RoleName;
                    $scope.roleInfo.Description = role_data.Description;
                    $scope.roleInfo.MerchantID = role_data.MerchantID;
                     
                    // Change the color so it's not placeholder grey
                    selectColorBlack("MerchantSelect");

                    // Populates the rights checkboxes
                    populateRights(roleID);
                }
            } else {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                // Changes the form's header and sets the roleID to -1(this tells the db that it's new)
                $("#DeleteButton").hide();
                $scope.popup.title = "New Role - Information";
                $scope.roleInfo.RoleID = "-1";

                // Populates the rights checkboxes
                populateRights();
            }
        }

        function closeMenu() {
            $("#EditMenu").css("display", "none");

            // Clears all html element values
            $scope.roleInfo = getRoleObject();
            // Clears session variables for the form
            sessionStorage.setItem("rr_alreadySaved", "");
            sessionStorage.setItem("rr_toBeAdded", "");
            sessionStorage.setItem("rr_toBeDeleted", "");
            sessionStorage.setItem("ur_alreadySaved", "");
            sessionStorage.setItem("ur_toBeAdded", "");
            sessionStorage.setItem("ur_toBeDeleted", "");

            // Chages the select back to placeholder grey
            selectColorGrey("MerchantSelect");

            // Resets all validation errors
            $scope.validator.resetForm()
        }

        // Deletes the role
        function deleteRole() {
            //if (confirm("Are you sure you want<br>to delete this role?")) {
                SMAAlert.CreateConfirmAlert("Are you sure you want<br>to delete this role?", null, null, null, confirmCallback);
                function confirmCallback(val) {
                //var val = true;
                    if (val === true) {
                        $scope.spinner = SMAAlert.CreateSpinnerAlert();
                        var roleID = $scope.roleInfo.RoleID;

                        DataService.RolesDelete(roleID)
                        .success(function (response2, status, header, config) {
                            // After the role is deleted, recall the populate function
                            $scope.spinner.resolve();
                            populateRoles();
                            closeMenu();
                            SMAAlert.CreateInfoAlert("Role has been deleted.");
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to delete role:<br><br>" + response);
                        });
                    }
                //}
            }
        }

        // Collapse 
        function collapse(merchantID) {
            if ($("#" + merchantID).data("act") != "expand") {
                $("#" + merchantID).html(" + ");
                $("#" + merchantID).data("act", "expand");
                $(".Searchable").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).hide();
                    }
                });
            }
            else {
                $("#" + merchantID).html(" - ");
                $("#" + merchantID).data("act", "collapse");
                $(".Searchable").each(function (i) {
                    if ($(this).data("merchantid") == merchantID) {
                        $(this).show();
                    }
                });
            }
        }

        // Collapse All
        function collapseAll() {
            $(".collapsible").each(function (i) {
                $(this).html(' + ');
            });
            $(".Searchable").each(function (i) {
                $(this).hide();
            });
        }

        // Expand All
        function expandAll() {
            $(".collapsible").each(function () {
                $(this).html(' - ');
            });
            $(".Searchable").each(function (i) {
                $(this).show();
            });
        }

        // Select All User Roles
        function selectAllUserRoles() {
            $("#UsersCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselect All User Roles
        function deselectAllUserRoles() {
            $("#UsersCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }
     
        function selectColorBlack1(id) {
            selectColorBlack(id)
        }        
    }
})();