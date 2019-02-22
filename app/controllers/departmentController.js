(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("DepartmentController", ["$scope", "$rootScope", "$window", "DataService", "SMAAlertFactory", "ProjectConstants", "$filter", departmentController]);

    function departmentController($scope, $rootScope, $window, DataService, SMAAlert, ProjectConstants, $filter) {
        $scope.popup = {
            title: 'Department - Information',
            showMenu: showMenu,
            closeMenu: closeMenu,
            submitClicked: false,
        }
        $scope.merchantList = [];
        $scope.ddlSchoolList = [];
        $scope.ddlClassList = [];
        $scope.objGradeList = [];
        $scope.objTeacherList = [];
        $scope.objFilterdGrdList = [];
        $scope.classInfo = getClassInfo();
        $scope.message = null;
        $scope.lenth = null;
        $scope.Showgrade = false;
        var cnt1 = 0, cnt2 = 0, cnt3 = 0;
        var schools = [];


        var deptC = this;
        deptC.selectColorBlack = selectColorBlack1;
        deptC.checkClassGradeCheckboxes = checkClassGradeCheckboxes;
        deptC.checkUserSchoolCheckboxes = checkUserSchoolCheckboxes;
        deptC.collapseAll = collapseAll;
        deptC.expandAll = expandAll;
        deptC.collapse = collapse;
        deptC.selectAllGradesBulk = selectAllGradesBulk;
        deptC.selectAllTeachersBulk = selectAllTeachersBulk;
        deptC.deselectAllTeachersBulk = deselectAllTeachersBulk
        deptC.deleteSubject = deleteSubject;
        deptC.selectAllGrades = selectAllGrades;
        deptC.deselectAllGrades = deselectAllGrades;
        deptC.selectAllTeachers = selectAllTeachers;
        deptC.deselectAllTeachers = deselectAllTeachers;
        deptC.loadBulkForm = loadBulkForm;
        deptC.deloadBulkForm = deloadBulkForm;
        deptC.checkTeacherClassCheckboxes = checkTeacherClassCheckboxes;
        deptC.submitForm = submitForm;
        deptC.submitBulkForm = submitBulkForm;
        deptC.AddBulkSchool = AddBulkSchool;

        populateClasses();
        page_init();
        return deptC;
        function getClassInfo() {
            return {
                ClassID: '',
                Name: '',
                Description: '',
                SchoolID: '',
                SchoolName: '',
            };
        }

        function resetObjects() {
            $scope.merchantList = [];
            $scope.ddlSchoolList = [];
            $scope.ddlClassList = [];
            $scope.objGradeList = [];
            $scope.objTeacherList = [];
        }

        function page_init() {
            // Wipes the session variables
            sessionStorage.setItem("cg_alreadySaved", "");
            sessionStorage.setItem("cg_toBeAdded", "");
            sessionStorage.setItem("cg_toBeDeleted", "");
            sessionStorage.setItem("tc_alreadySaved", "");
            sessionStorage.setItem("tc_toBeAdded", "");
            sessionStorage.setItem("tc_toBeDeleted", "");
            sessionStorage.setItem("us_alreadySaved", "");
            sessionStorage.setItem("us_toBeAdded", "");
            sessionStorage.setItem("us_toBeDeleted", "");
            // Form Validation Rules
            $scope.validator = $("#FormInputs").validate({
                rules: {
                    ClassName: {
                        required: true
                    },
                    ClassDescription: {
                        required: true
                    },
                    SchoolSelect: {
                        required: true
                    }
                }
            });

            $scope.validatorBulk = $("#BulkForm").validate({
                rules: {
                    BulkFile: {
                        required: true
                    },
                    SchoolBulkSelect: {
                        required: false
                    }
                }
            });
        }

        function populateClasses() {
            getMerchants();
        }

        function getMerchants() {
            resetObjects();
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            DataService.MerchantGetListByCurrentUser()
            .success(function (response1, status, header, config) {
                $scope.spinner.resolve();
                var merchants = response1;
                var merchants_length = merchants.length;
                var merchants_index = 0;

                if (merchants_length > 0) {

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
                    $scope.merchantList = merchants;
                    getSchools(merchants, merchants_length, merchants_index);
                } else {
                    $scope.spinner.resolve();
                }
            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve merchants:<br><br>" + response);
                }
            });
        }

        function getSchools(merchants, merchants_length, merchants_index) {
            if (merchants_index < merchants_length) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                DataService.SchoolGetListForMerchant(merchants[merchants_index].MerchantID)
                .success(function (response1, status, header, config) {
                    $scope.spinner.resolve();
                    var schools = response1;
                    var schools_length = schools.length;
                    var schools_index = 0;

                    merchants_index++;
                    if (schools_length > 0) {
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
                        $scope.merchantList[(merchants_index - 1)].schoolList = schools;
                        // Populates the school dropdown and bulk menu's dropdown
                        $scope.spinner.resolve();
                        populateSchoolsDropdown(schools);
                        debugger
                        getClasses(merchants, merchants_length, merchants_index, schools, schools_length, schools_index);
                    } else {
                        getSchools(merchants, merchants_length, merchants_index);
                    }
                }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve sites:<br><br>" + response);
                    } else {
                        console.log("Forbidden: Schools.SchoolGetListForMerchant(" + merchants[merchants_index].MerchantID + ")");
                        merchants_index++;
                        getSchools(merchants, merchants_length, merchants_index);
                    }
                });
            } else {
                $scope.spinner.resolve();
            }
        }

        function getClasses(merchants, merchants_length, merchants_index, schools, schools_length, schools_index) {
            if (schools_index < schools_length) {
                if (schools_index == 0) {
                    $scope.spinner = SMAAlert.CreateSpinnerAlert();
                }
                $scope.merchantList[(merchants_index - 1)].schoolList[schools_index].classList = [];
                DataService.ClassGetListForSchool(schools[schools_index].SchoolID)
                    .success(function (response1, status, header, config) {
                        var classes = response1;
                        for (var i = 0, len = classes.length; i < len; i++) {
                            classes[i].SchoolName = schools[schools_index].Name;
                        }
                        if (classes.length > 0) {
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
                            $scope.merchantList[(merchants_index - 1)].schoolList[schools_index].classList = classes;
                            $scope.ddlClassList = $scope.ddlClassList.concat(classes);
                        }
                        schools_index++;
                        getClasses(merchants, merchants_length, merchants_index, schools, schools_length, schools_index);
                        // if ((schools_index - 1) == schools_length) {
                        $scope.spinner.resolve();
                        // }
                    }).error(function (response, status, header, config) {
                        if (status !== 403) {
                            $scope.spinner.resolve();
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to retrieve departments:<br><br>" + response);
                        } else {
                            $scope.spinner.resolve();
                            console.log("Forbidden: Classes.ClassGetListForSchool(" + schools[schools_index].SchoolID + ")");
                            schools_index++;
                            getClasses(merchants, merchants_length, merchants_index, schools, schools_length, schools_index);
                        }
                    });
            } else {
                getSchools(merchants, merchants_length, merchants_index);
            }
        }

        // Populate Schools Dropdown
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

        // Populates the grades checkboxes
        function populateGrades(classID, schoolID, check) {
            // Clears the container
            // $scope.spinner = SMAAlert.CreateSpinnerAlert();
            if (classID) {
                $scope.objGradeList = [];
                DataService.GradeGetAll()
                .success(function (grades, status, header, config) {
                    $scope.objFilterdGrdList = grades;
                    // If it's not a new teacher
                    if (classID !== -1) {
                        DataService.ClassGradeGetListForClass(classID)
                        .success(function (response2, status, header, config) {
                            var classGrades = response2;
                            // If their are class grades for this class
                            if (classGrades.length > 0) {
                                var cg_alreadySaved = [];
                                for (var i = 0, len = classGrades.length; i < len; i++) {
                                    var foundItem = $filter('filter')($scope.objFilterdGrdList, { GradeID: classGrades[i].GradeID }, true)[0];
                                    if (foundItem != undefined) {
                                        foundItem.selection = true;
                                    }
                                    $scope.objGradeList.push(foundItem);
                                    $("#" + classGrades[i].GradeID).prop("checked", true);
                                    cg_alreadySaved.push(classGrades[i].GradeID);
                                }
                                // Joins the array into a string and pushes it to the session variables
                                cg_alreadySaved = cg_alreadySaved.join(",");
                                sessionStorage.setItem("cg_alreadySaved", cg_alreadySaved);
                            }
                            // $scope.spinner.resolve();
                            populateTeachers(classID);
                        }).error(function (response, status, header, config) {
                            $scope.spinner.resolve();
                            if (status !== 403) {
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to retrieve department groups:<br><br>" + response);
                            }
                        });
                    } else {
                        if (check != "bulk") {
                            populateTeachers(classID);
                        }
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve groups:<br><br>" + response);
                    }
                });
            }
            if (schoolID) {
                DataService.GradeGetAll()
                .success(function (grades, status, header, config) {
                    $scope.objGradeListmain = grades;
                    $scope.objFilterdGrdList = $scope.objGradeListmain;
                    if ($scope.sumbit_type == "update") {
                        var tobedelete = $scope.objGradeList;
                        var result = tobedelete.map(function (a) { return a.GradeID; });
                        tobedelete = result.join(",");
                        sessionStorage.setItem('cg_toBeDeleted', tobedelete);
                        $scope.objGradeList = [];
                    }
                    $scope.objGrdListSubmit = [];
                    for (var i = 0; i < schoolID.length; i++) {
                        var foundItem = $filter('filter')($scope.objFilterdGrdList, { GradeID: schoolID[i].GradeID }, true)[0];
                        if (foundItem != undefined) {
                            foundItem.selection = true;
                            $scope.objGrdListSubmit.push(schoolID[i].GradeID);
                            var value = $scope.objGradeList;
                            let chk = value.some(value=>value["GradeID"] === schoolID[i].GradeID);
                            if (chk == false) {
                                $scope.objGradeList.push(foundItem);
                            }
                        }
                    }
                    $scope.objGrdListSubmit = $scope.objGrdListSubmit.join(",");
                    sessionStorage.setItem("" + schoolID[0].SchoolID, $scope.objGrdListSubmit);
                    var classGrades = $scope.objGradeList;
                    var cg_alreadySaved = [];
                    for (var i = 0, len = classGrades.length; i < len; i++) {
                        if (check != "submit") {
                            $("#" + classGrades[i].GradeID).prop("checked", true);
                        }
                        cg_alreadySaved.push(classGrades[i].GradeID);
                    }
                    cg_alreadySaved = cg_alreadySaved.join(",");
                    sessionStorage.setItem("cg_alreadySaved", cg_alreadySaved);
                    $scope.success = check;
                    // $scope.spinner.resolve();
                })
            }
        }

        // Populates the Teachers Checkboxes
        function populateTeachers(classID) {
            // Clears the container
            DataService.MerchantGetListByCurrentUser()
            .success(function (response1, status, header, config) {
                var merchants = response1;
                if (merchants.length > 0) {

                    // Psuedo loop for getting schools by merchant id's
                    function getTeachersByMerchant(index, length, merchants, teachers) {
                        if (index < length) {
                            DataService.TeacherGetListByMerchant(merchants[index].MerchantID)
                            .success(function (response2, status, header, config) {
                                var tempTeachers = response2;

                                if (tempTeachers != "") {
                                    tempTeachers = tempTeachers.filter(function (e) {
                                        return e.Email.substring(0, 9) == "INACTIVE-" == false;
                                    });
                                }

                                for (var i = 0, len = tempTeachers.length; i < len; i++) {
                                    teachers.push(tempTeachers[i]);
                                }
                                index++;
                                getTeachersByMerchant(index, length, merchants, teachers);
                            }).error(function (response, status, header, config) {
                                if (status !== 403) {
                                    $scope.spinner.resolve();
                                    if (response == null) { response = "" }
                                    SMAAlert.CreateInfoAlert("Failed to retrieve employees:<br><br>" + response);
                                } else {
                                    console.log("Forbidden: Teachers.TeacherGetListByMerchant(" + merchants[index].MerchantID + ")");
                                    index++;
                                    getTeachersByMerchant(index, length, merchants, teachers);
                                }
                            });

                        } else {
                            $scope.objTeacherList = teachers;
                            $scope.objTeacherList.forEach(function (obj) { obj.selection = false; });
                            console.log($scope.objTeacherList);
                            if (classID != -1) {

                                DataService.TeacherClassGetListByClass(classID)
                                .success(function (response3, status, header, config) {
                                    var teacherClasses = response3;

                                    if (teacherClasses.length > 0) {
                                        var tc_alreadySaved = [];

                                        for (var i = 0, len = teacherClasses.length; i < len; i++) {
                                            $("#" + teacherClasses[i].TeacherID).prop("checked", true);

                                            var foundItem = $filter('filter')($scope.objTeacherList, { TeacherID: teacherClasses[i].TeacherID }, true)[0];
                                            if (foundItem != undefined) {
                                                foundItem.selection = true;
                                            }

                                            tc_alreadySaved.push(teacherClasses[i].TeacherID);
                                        }

                                        // Joins the array into a string and pushes it to the session variables
                                        tc_alreadySaved = tc_alreadySaved.join(",");
                                        sessionStorage.setItem("tc_alreadySaved", tc_alreadySaved);
                                    }

                                    $scope.spinner.resolve();
                                    $("#EditMenu").css("display", "block");
                                }).error(function (response, status, header, config) {
                                    $scope.spinner.resolve();
                                    if (status !== 403) {
                                        if (response == null) { response = "" }
                                        SMAAlert.CreateInfoAlert("Failed to retrieve employees:<br><br>" + response);
                                    }
                                });

                            } else {
                                $scope.spinner.resolve();
                                $("#EditMenu").css("display", "block");
                            }
                        }
                    }

                    getTeachersByMerchant(0, merchants.length, merchants, []);

                } else {
                    $scope.spinner.resolve();
                    $("#EditMenu").css("display", "block");
                }
            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve merchants:<br><br>" + response);
                }
            });
        }

        // Shows the information menu/form
        function showMenu(classID) {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            if (classID) {
                // $scope.spinner = SMAAlert.CreateSpinnerAlert();
                // Gets the teacher object from the data-bindings
                var class_data = $("#" + classID).data();
                $scope.classInfo.ClassID = classID;
                $scope.classInfo.Name = class_data.name;
                $scope.classInfo.Description = class_data.description;
                $scope.classInfo.SchoolID = class_data.schoolid;
                $scope.classInfo.SchoolName = class_data.schoolname;
                if ($rootScope.businessrpt == true) {
                    $scope.popup.title = "Department - Information";
                }
                if ($rootScope.eductnrpt == true) {
                    $scope.popup.title = "Subject - Information";
                }
                $("#DeleteButton").show();
                $("#BulkSchoolsCheckboxContainer").hide();
                $('#SchoolSelectDiv').show();
                $('#SiteSchoolDiv').hide();
                $scope.sumbit_type = "update";
                // Change the color so it's not placeholder grey
                selectColorBlack("SchoolSelect");

                // Populates the grades checkboxes
                populateGrades(classID);
            } else {
                // Changes the form's header and sets the teacherID to -1(this tells the db that it's new)+
                $scope.popup.title = "New Department - Information";
                $("#DeleteButton").hide();
                $("#BulkSchoolsCheckboxContainer").show();
                $('#SchoolSelectDiv').hide();
                $('#SiteSchoolDiv').show();
                $scope.sumbit_type = "create";
                $scope.classInfo.ClassID = "-1";
                page_init();
                //sessionStorage.setItem("tc_alreadySaved", "");
                //sessionStorage.setItem("tc_toBeAdded", "");
                //sessionStorage.setItem("tc_toBeDeleted", "");
                // Populates the grades checkboxes
                populateGrades(-1);
            }
        }

        // Closes the form/menu
        function closeMenu() {
            $("#EditMenu").css("display", "none");

            // Clears all html element values
            $scope.classInfo = getClassInfo();

            // Clears session variables for the form
            sessionStorage.setItem("cg_alreadySaved", "");
            sessionStorage.setItem("cg_toBeAdded", "");
            sessionStorage.setItem("cg_toBeDeleted", "");
            sessionStorage.setItem("tc_alreadySaved", "");
            sessionStorage.setItem("tc_toBeAdded", "");
            sessionStorage.setItem("tc_toBeDeleted", "");
            sessionStorage.setItem("us_alreadySaved", "");
            sessionStorage.setItem("us_toBeAdded", "");
            sessionStorage.setItem("us_toBeDeleted", "");
            // Chages the select back to placeholder grey
            selectColorGrey("SchoolSelect");

            // Resets all validation errors
            $scope.validator.resetForm();
        }

        // Save Form

        function submitForm(subject) {
            if (cnt3 < 1) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
            }
            cnt3++
            var cg_toBeAdded = sessionStorage.getItem('' + subject.SchoolID);
            if (cg_toBeAdded != null) {
                cg_toBeAdded = cg_toBeAdded != null ? cg_toBeAdded.split(',') : null;
                var cg_toBeAdded_length = cg_toBeAdded.length;
                for (var i = 0; i < cg_toBeAdded_length; i++) {
                    if (cg_toBeAdded[i] == "" || cg_toBeAdded[i] == null || cg_toBeAdded[i] == undefined) {
                        cg_toBeAdded.splice(i, 1);
                    }
                }
            }
            else {
                cg_toBeAdded = "";
            }
            var tc_toBeAdded = sessionStorage.getItem('tc_toBeAdded');
            if (tc_toBeAdded != null) {
                tc_toBeAdded = tc_toBeAdded != null ? tc_toBeAdded.split(',') : null;
                var tc_toBeAdded_length = tc_toBeAdded != null ? tc_toBeAdded.length : 0;
                for (var i = 0; i < tc_toBeAdded_length; i++) {
                    if (tc_toBeAdded[i] == "" || tc_toBeAdded[i] == null || tc_toBeAdded[i] == undefined) {
                        tc_toBeAdded.splice(i, 1);
                    }
                }
            }
            else {
                tc_toBeAdded = "";
            }
            // If it's a new subject
            if (subject.ClassID == -1) {

                DataService.ClassAddNew(subject)
                .success(function (response1, status, header, config) {
                    var subjectID = response1;
                    populateGrades("", subject.SchoolID, "submit")
                    $scope.success = false;
                    var classGrades = [];
                    // Builds the Class Grade objects and pushes it to the array
                    for (var i = 0, len = cg_toBeAdded.length; i < len; i++) {
                        var classGrade = {
                            ClassID: subjectID,
                            GradeID: cg_toBeAdded[i]
                        }
                        classGrades.push(classGrade);
                    }
                    DataService.ClassGradeAddNewBulk(classGrades)
                    .success(function (response3, status, header, config) {
                        //$scope.spinner.resolve();
                    }).error(function (response, status, header, config) {
                        if (response == null) { response = "" }
                        //SMAAlert.CreateInfoAlert("Failed to save department groups:<br><br>" + response);
                        // $scope.spinner.resolve();
                    });
                    if (tc_toBeAdded.length > 0) {

                        var teacherClasses = [];

                        // Builds the TeacherClasses objects and pushes it to the array
                        for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                            var teacherClass = {
                                TeacherID: tc_toBeAdded[i],
                                ClassID: subjectID
                            }
                            teacherClasses.push(teacherClass);
                        }
                        DataService.TeacherClassAddNewBulk(teacherClasses)
                        .success(function (response4, status, header, config) {
                            // After the class is posted, recall the populate function       
                            cnt2++;
                            if (cnt2 == $scope.lenth) {
                                populateClasses();
                                cnt2 = 0;
                                $scope.spinner.resolve();
                                // $window.location.reload();
                                closeMenu()
                                SMAAlert.CreateInfoAlert("New Department has been saved.");
                            }
                            // $scope.message = "New Department has been saved.";
                            //SMAAlert.CreateInfoAlert("New Department has been saved.");
                            // $scope.spinner.resolve();
                        }).error(function (response, status, header, config) {
                            if (response == null) { response = "" }
                            // SMAAlert.CreateInfoAlert("Failed to save employee departments:<br><br>" + response);
                            //$scope.spinner.resolve();
                        });
                    } else {
                        // After the class is posted, recall the populate function                        
                        populateClasses();
                        closeMenu();
                        //SMAAlert.CreateInfoAlert("New Department has been saved.");
                        $scope.spinner.resolve();
                    }

                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    //SMAAlert.CreateInfoAlert("Failed to save Department<br><br>:" + response);
                });
                //$scope.spinner.resolve();
            } else {
                // If it's not a new subject
                //$scope.spinner = SMAAlert.CreateSpinnerAlert();
                DataService.ClassUpdate(subject)
                .success(function (response1, status, header, config) {
                    var cg_toBeDeleted = sessionStorage.getItem('cg_toBeDeleted');
                    if (cg_toBeDeleted != "") {
                        DataService.ClassGradeDelete(subject.ClassID).success(function () {
                            AddGrade_Teacher();
                        })
                    }
                    else {
                        AddGrade_Teacher();
                    }
                    function AddGrade_Teacher() {
                        if (cg_toBeAdded.length > 0) {
                            var classGrades = [];
                            // Builds the ClassGrade objects and pushes it to the array
                            for (var i = 0, len = cg_toBeAdded.length; i < len; i++) {
                                var classGrade = {
                                    ClassID: subject.ClassID,
                                    GradeID: cg_toBeAdded[i]
                                }
                                classGrades.push(classGrade);
                            }
                            DataService.ClassGradeAddNewBulk(classGrades)
                            .success(function (response3, status, header, config) {
                                $scope.spinner.resolve();
                                if (tc_toBeAdded.length > 0) {
                                    var teacherClasses = [];
                                    // Builds the TeacherClasses objects and pushes it to the array
                                    for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                                        var teacherClass = {
                                            TeacherID: tc_toBeAdded[i],
                                            ClassID: subject.ClassID
                                        }
                                        teacherClasses.push(teacherClass);
                                    }
                                    DataService.TeacherClassAddNewBulk(teacherClasses)
                                    .success(function (response4, status, header, config) {
                                        $scope.spinner.resolve();
                                        check_cg_toBeDeleted(subject.ClassID);
                                    }).error(function (response, status, header, config) {
                                        $scope.spinner.resolve();
                                        if (response == null) { response = "" }
                                        SMAAlert.CreateInfoAlert("Failed to save employee departments:<br><br>" + response);
                                    });
                                } else {
                                    check_cg_toBeDeleted(subject.ClassID);
                                }
                            }).error(function (response, status, header, config) {
                                $scope.spinner.resolve();
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to save department groups:<br><br>" + response);
                            });

                        } else {
                            if (tc_toBeAdded.length > 0) {
                                var teacherClasses = [];
                                // Builds the TeacherClasses objects and pushes it to the array
                                for (var i = 0, len = tc_toBeAdded.length; i < len; i++) {
                                    var teacherClass = {
                                        TeacherID: tc_toBeAdded[i],
                                        ClassID: subject.ClassID
                                    }
                                    teacherClasses.push(teacherClass);
                                }

                                DataService.TeacherClassAddNewBulk(teacherClasses)
                                .success(function (response4, status, header, config) {
                                    check_cg_toBeDeleted(subject.ClassID);
                                    $scope.spinner.resolve();
                                    populateClasses();
                                    closeMenu();
                                    SMAAlert.CreateInfoAlert("Department has been updated.");
                                }).error(function (response, status, header, config) {
                                    $scope.spinner.resolve();
                                    if (response == null) { response = "" }
                                    SMAAlert.CreateInfoAlert("Failed to save employee departments:<br><br>" + response);
                                });
                            } else {
                                check_cg_toBeDeleted(subject.ClassID);
                            }
                        }
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to update department:<br><br>" + response);
                });
            }
        }

        // Checks for ClassGrades to be deleted, and then deletes them
        function check_cg_toBeDeleted(classID) {

            // Grabs the session variables(i.e. Class Grades), splits them into arrays, and removes any null or empty values
            var cg_toBeDeleted = sessionStorage.getItem('cg_toBeDeleted');
            cg_toBeDeleted = cg_toBeDeleted != null ? cg_toBeDeleted.split(',') : null;
            var cg_toBeDeleted_length = cg_toBeDeleted != null ? cg_toBeDeleted.length : 0;
            for (var i = 0; i < cg_toBeDeleted_length; i++) {
                if (cg_toBeDeleted[i] == "" || cg_toBeDeleted[i] == null || cg_toBeDeleted[i] == undefined) {
                    cg_toBeDeleted.splice(i, 1);
                }
            }

            // If their are class grades to be deleted
            var cg_toBeDeleted_leng = cg_toBeDeleted != null ? cg_toBeDeleted.length : 0;
            if (cg_toBeDeleted_leng > 0) {
                populateClasses();
                closeMenu();
                SMAAlert.CreateInfoAlert("Department has been updated.");
                // deleteClassGradesLoop(0, cg_toBeDeleted.length, cg_toBeDeleted, classID);
            } else {
                // After the class is posted, recall the populate function
                //$scope.spinner.resolve();
                //populateClasses();
                //closeMenu();
                //SMAAlert.CreateInfoAlert("Department has been updated.");
                check_tc_toBeDeleted(classID);
            }
        }

        // Psuedo Loop for deleting ClassGrades
        function deleteClassGradesLoop(index, length, grades, classID) {
            if (index < length) {
                // Deletes the class grade

                DataService.ClassGradeDelete(classID, grades[index])
                .success(function (response1, status, header, config) {
                    index++;
                    // Recalls the loop
                    deleteClassGradesLoop(index, length, grades, classID);
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to delete department group:<br><br>" + response);
                });

            } else {
                // After the class is posted, recall the populate function
                //$scope.spinner.resolve();
                //populateClasses();
                //closeMenu();
                //SMAAlert.CreateInfoAlert("Department has been updated.");
                check_tc_toBeDeleted(classID);
            }
        }

        // Checks for TeacherClasses to be deleted, and then deletes them
        function check_tc_toBeDeleted(classID) {
            // Grabs the session variables(i.e. Teacher Classes), splits them into arrays, and removes any null or empty values
            var tc_toBeDeleted = sessionStorage.getItem('tc_toBeDeleted');
            tc_toBeDeleted = tc_toBeDeleted != null ? tc_toBeDeleted.split(',') : null;
            var tc_toBeDeleted_length = tc_toBeDeleted !== null ? tc_toBeDeleted.length : 0;
            for (var i = 0; i < tc_toBeDeleted_length; i++) {
                if (tc_toBeDeleted[i] == "" || tc_toBeDeleted[i] == null || tc_toBeDeleted[i] == undefined) {
                    tc_toBeDeleted.splice(i, 1);
                }
            }
            // If their are teacher classes to be deleted  
            var tc_toBeDeleted_len = tc_toBeDeleted != null ? tc_toBeDeleted.length : 0;
            if (tc_toBeDeleted_len > 0) {
                deleteTeacherClassesLoop(0, tc_toBeDeleted_len, tc_toBeDeleted, classID);
            } else {
                // After the class is posted, recall the populate function
                $scope.spinner.resolve();
                populateClasses();
                closeMenu();
                SMAAlert.CreateInfoAlert("Department has been updated.");

            }
        }

        // Psuedo Loop for deleting TeacherClasses
        function deleteTeacherClassesLoop(index, length, teachers, classID) {
            if (index < length) {
                // Deletes the class grade
                var TeacherClasses = [];
                var TeacherClass = { TeacherID: teachers[index], ClassID: classID };
                TeacherClasses.push(TeacherClass);
                DataService.TeacherClassDelete(TeacherClasses)
                .success(function (response1, status, header, config) {
                    index++;
                    // Recalls the loop
                    deleteTeacherClassesLoop(index, length, teachers, classID);
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to delete employee department:<br><br>" + response);
                });

            } else {
                // After the class is posted, recall the populate function
                $scope.spinner.resolve();
                populateClasses();
                closeMenu();
                SMAAlert.CreateInfoAlert("Department has been updated.");
            }
        }

        // Checks for ClassGrade checkboxes
        function checkClassGradeCheckboxes(gradeID, type) {
            var id = '';
            if (type == "bulk") {
                id = gradeID + "1";
            }
            else {
                id = gradeID;
            }
            if ($("#" + id).is(':checked')) {// If it's checked

                var cg_alreadySaved = sessionStorage.getItem("cg_alreadySaved");
                cg_alreadySaved = cg_alreadySaved != null ? cg_alreadySaved.split(',') : null;

                var cg_toBeAdded = sessionStorage.getItem("cg_toBeAdded");
                cg_toBeAdded = cg_toBeAdded != null ? cg_toBeAdded.split(',') : null;

                var cg_toBeDeleted = sessionStorage.getItem("cg_toBeDeleted");
                cg_toBeDeleted = cg_toBeDeleted != null ? cg_toBeDeleted.split(',') : null;
                var temporary_cg_toBeDeleted = cg_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = cg_alreadySaved.length; i < len; i++) {
                    if (cg_alreadySaved[i] == gradeID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = cg_toBeDeleted != null ? cg_toBeDeleted.length : 0; i < len; i++) {
                    if (cg_toBeDeleted[i] == gradeID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_cg_toBeDeleted.length; i < len; i++) {
                        if (temporary_cg_toBeDeleted[i] == gradeID) {
                            cg_toBeDeleted.splice(i, 1);
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
                    cg_toBeAdded.push(gradeID);
                }


                // Resets the session storage variables
                cg_toBeDeleted = cg_toBeDeleted.join(",");
                cg_toBeAdded = cg_toBeAdded.join(",");
                sessionStorage.setItem("cg_toBeDeleted", cg_toBeDeleted);
                sessionStorage.setItem("cg_toBeAdded", cg_toBeAdded);

            } else {// If it's unchecked

                var cg_alreadySaved = sessionStorage.getItem("cg_alreadySaved");
                cg_alreadySaved = cg_alreadySaved != null ? cg_alreadySaved.split(',') : null;

                var cg_toBeAdded = sessionStorage.getItem("cg_toBeAdded");
                cg_toBeAdded = cg_toBeAdded != null ? cg_toBeAdded.split(',') : null;
                var temporary_cg_toBeAdded = cg_toBeAdded;

                var cg_toBeDeleted = sessionStorage.getItem("cg_toBeDeleted");
                cg_toBeDeleted = cg_toBeDeleted != null ? cg_toBeDeleted.split(',') : null;
                var temporary_cg_toBeDeleted = cg_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = cg_alreadySaved.length; i < len; i++) {
                    if (cg_alreadySaved[i] == gradeID) {
                        temporary_cg_toBeDeleted.push(gradeID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = cg_toBeAdded.length; i < len; i++) {
                    if (cg_toBeAdded[i] == gradeID) {
                        temporary_cg_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_cg_toBeDeleted.join(",");
                temporary_cg_toBeAdded.join(",");
                sessionStorage.setItem("cg_toBeDeleted", temporary_cg_toBeDeleted);
                sessionStorage.setItem("cg_toBeAdded", temporary_cg_toBeAdded);

            }
        }

        // Checks for TeacherClass checkboxes
        function checkTeacherClassCheckboxes(teacherID, type) {
            var id = '';
            if (type == "bulk") {
                id = teacherID + "1";
            }
            else {
                id = teacherID;
            }
            if ($("#" + id).is(':checked')) {// If it's checked

                var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                tc_alreadySaved = tc_alreadySaved != null ? tc_alreadySaved.split(',') : null;

                var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                tc_toBeAdded = tc_toBeAdded != null ? tc_toBeAdded.split(',') : null;

                var tc_toBeDeleted = sessionStorage.getItem("tc_toBeDeleted");
                tc_toBeDeleted = tc_toBeDeleted != null ? tc_toBeDeleted.split(',') : null;
                var temporary_tc_toBeDeleted = tc_toBeDeleted;

                // Loops through to check if it's already in the DB
                var alreadySaved = false;
                for (var i = 0, len = tc_alreadySaved.length; i < len; i++) {
                    if (tc_alreadySaved[i] == teacherID) {
                        alreadySaved = true;
                    }
                }

                // Check if it's in the unchecked list
                var toBeDeleted = false;
                for (var i = 0, len = tc_toBeDeleted != null ? tc_toBeDeleted.length : 0; i < len; i++) {
                    if (tc_toBeDeleted[i] == teacherID) {
                        toBeDeleted = true;
                    }
                }

                if (alreadySaved == true && toBeDeleted == true) {
                    // If it's already saved and to be deleted
                    for (var i = 0, len = temporary_tc_toBeDeleted.length; i < len; i++) {
                        if (temporary_tc_toBeDeleted[i] == teacherID) {
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
                    tc_toBeAdded.push(teacherID);
                }


                // Resets the session storage variables
                tc_toBeDeleted = tc_toBeDeleted.join(",");
                tc_toBeAdded = tc_toBeAdded.join(",");
                sessionStorage.setItem("tc_toBeDeleted", tc_toBeDeleted);
                sessionStorage.setItem("tc_toBeAdded", tc_toBeAdded);

            } else {// If it's unchecked

                var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                tc_alreadySaved = tc_alreadySaved != null ? tc_alreadySaved.split(',') : null;

                var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                tc_toBeAdded = tc_toBeAdded != null ? tc_toBeAdded.split(',') : null;
                var temporary_tc_toBeAdded = tc_toBeAdded;

                var tc_toBeDeleted = sessionStorage.getItem("tc_toBeDeleted");
                tc_toBeDeleted = tc_toBeDeleted != null ? tc_toBeDeleted.split(',') : null;
                var temporary_tc_toBeDeleted = tc_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = tc_alreadySaved != null ? tc_alreadySaved.length : 0; i < len; i++) {
                    if (tc_alreadySaved[i] == teacherID) {
                        temporary_tc_toBeDeleted.push(teacherID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = tc_toBeAdded != null ? tc_toBeAdded.length : 0; i < len; i++) {
                    if (tc_toBeAdded[i] == teacherID) {
                        temporary_tc_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_tc_toBeDeleted.join(",");
                temporary_tc_toBeAdded.join(",");
                sessionStorage.setItem("tc_toBeDeleted", temporary_tc_toBeDeleted);
                sessionStorage.setItem("tc_toBeAdded", temporary_tc_toBeAdded);

            }
        }

        // Deletes the subject
        function deleteSubject() {
            SMAAlert.CreateConfirmAlert("Are you sure you want<br>to delete this Department?", null, null, null, confirmCallback);

            function confirmCallback(val) {
                if (val == true) {
                    $scope.spinner = SMAAlert.CreateSpinnerAlert();
                    var classID = $scope.classInfo.ClassID;

                    DataService.ClassDelete(classID)
                    .success(function (response2, status, header, config) {
                        // After the class is deleted, recall the populate function
                        $scope.spinner.resolve();
                        populateClasses();
                        closeMenu();
                        SMAAlert.CreateInfoAlert("Department has been deleted.");
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Department failed to delete:<br><br>" + response);
                    });

                }
            }
        }

        // Submit bulk upload form
        function submitBulkForm() {
            $scope.spinner = SMAAlert.CreateSpinnerAlert();
            processFile();
            return false;
        }

        // Save Bulk Data
        function saveBulkData(tableData) {
            // Gets the merchantID from the select
            var schoolID = $("#SchoolBulkSelect").val();
            var cg_toBeAdded = sessionStorage.getItem('us_toBeAdded');
            cg_toBeAdded = cg_toBeAdded != null ? cg_toBeAdded.split(',') : null;
            var cg_toBeAdded_length = cg_toBeAdded.length;
            for (var i = 0; i < cg_toBeAdded_length; i++) {
                if (cg_toBeAdded[i] == "" || cg_toBeAdded[i] == null || cg_toBeAdded[i] == undefined) {
                    cg_toBeAdded.splice(i, 1);
                }
            }
            schools = cg_toBeAdded;
            // For each row, set the id to -1(so the DB knows it's a new teacher), and set the merchantID
            //for (var j = 0, ln = cg_toBeAdded.length; j < ln; j++) {
            var index = 0;
            function BulkAddClass(index) {
                if (index < cg_toBeAdded.length) {
                    var schoolID = cg_toBeAdded[index];
                    for (var i = 0, len = tableData.length; i < len; i++) {
                        tableData[i].ClassID = -1;
                        tableData[i].SchoolID = cg_toBeAdded[index];
                    }
                    DataService.ClassAddNewBulk(tableData)
                    .success(function (response1, status, header, config) {
                        // $scope.spinner= SMAAlert.CreateSpinnerAlert();
                        var grades = [];
                        var classes = response1;
                        for (var i in schools) {
                            var cg_toBeAdded = sessionStorage.getItem("" + schools[i]);
                            if (cg_toBeAdded != null) {
                                cg_toBeAdded = cg_toBeAdded != null ? cg_toBeAdded.split(',') : null;;
                                var cg_toBeAdded_length = cg_toBeAdded.length;
                                if (cg_toBeAdded[i] == "" || cg_toBeAdded[i] == null || cg_toBeAdded[i] == undefined) {
                                        cg_toBeAdded.splice(i, 1);
                                    } else {
                                        $.merge(grades, cg_toBeAdded);
                                    }                            }
                            else {
                                cg_toBeAdded = "";
                            }
                        }
                        if (grades.length > 0) {
                            var classGrades = []
                            var grdindex = 0;
                            var maxlen = classes.length;
                            function Addclassgrade() {
                                if (grdindex <= classes.length) {
                                    for (var j = 0, lenj = grades.length; j < lenj; j++) {
                                        var classGrade = {
                                            ClassID: classes[grdindex].ClassID,
                                            GradeID: grades[j]
                                        }
                                        classGrades.push(classGrade);
                                    }
                                    var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                                    var teachers = tc_toBeAdded != null ? tc_toBeAdded.split(',') : null;
                                    var teachers_length = teachers != null ? teachers.length : 0;
                                    for (var i = 0; i < teachers_length; i++) {
                                        if (teachers[i] == "" || teachers[i] == null || teachers[i] == undefined) {
                                            teachers.splice(i, 1);
                                        }
                                    }
                                    if (teachers.length <= 0) {
                                        index++;
                                        BulkAddClass(index);
                                    }
                                    if (teachers.length > 0) {
                                        var teacherClasses = []
                                        for (var i = 0, leni = classes.length; i < leni; i++) {
                                            for (var j = 0, lenj = teachers.length; j < lenj; j++) {
                                                var teacherClass = {
                                                    ClassID: classes[i].ClassID,
                                                    TeacherID: teachers[j]
                                                }
                                                teacherClasses.push(teacherClass);
                                            }
                                        }

                                        DataService.TeacherClassAddNewBulk(teacherClasses)
                                        .success(function (response3, status, header, config) {
                                            index++;
                                            BulkAddClass(index);
                                            // Repopulates the teacher list, closes the menu, and shows a success pop-up
                                            $scope.spinner.resolve();
                                            populateClasses();
                                            closeBulkMenu();
                                            SMAAlert.CreateInfoAlert("Departments bulk upload was successful.");
                                        }).error(function (response, status, header, config) {
                                            // Repopulates the teacher list, closes the menu, and shows a success pop-up
                                            $scope.spinner.resolve();
                                            if (response == null) { response = "" }
                                            //SMAAlert.CreateInfoAlert("Failed to upload Departments:<br><br>" + response);
                                        });

                                    } else {
                                        // Repopulates the teacher list, closes the menu, and shows a success pop-up
                                        $scope.spinner.resolve();
                                        populateClasses();
                                        closeBulkMenu();
                                        SMAAlert.CreateInfoAlert("Departments bulk upload was successful.");
                                    }
                                    DataService.ClassGradeAddNewBulk(classGrades)
                                .success(function (response, status, header, config) {
                                    //alert("grade added")
                                    grdindex++;
                                    classGrades = [];
                                    Addclassgrade();
                                }).error(function (response, status, header, config) {
                                    // Repopulates the teacher list, closes the menu, and shows a success pop-up
                                    $scope.spinner.resolve();
                                    if (response == null) { response = "" }
                                    // SMAAlert.CreateInfoAlert("Failed to upload departments:<br><br>" + response);
                                });
                                }
                            }
                            Addclassgrade()
                        } else {
                            var tc_toBeAdded = sessionStorage.getItem("tc_toBeAdded");
                            var teachers = tc_toBeAdded != null ? tc_toBeAdded.split(',') : null;
                            var teachers_length = teachers != null ? teachers.length : 0;
                            for (var i = 0; i < teachers_length; i++) {
                                if (teachers[i] == "" || teachers[i] == null || teachers[i] == undefined) {
                                    teachers.splice(i, 1);
                                }
                            }
                            if (teachers.length <= 0) {
                                index++;
                                BulkAddClass(index);
                            }
                            if (teachers.length > 0) {
                                var teacherClasses = []
                                for (var i = 0, leni = classes.length; i < leni; i++) {
                                    for (var j = 0, lenj = teachers.length; j < lenj; j++) {
                                        var teacherClass = {
                                            ClassID: classes[i].ClassID,
                                            TeacherID: teachers[j]
                                        }
                                        teacherClasses.push(teacherClass);
                                    }
                                }

                                DataService.TeacherClassAddNewBulk(teacherClasses)
                                .success(function (response3, status, header, config) {
                                    index++;
                                    BulkAddClass(index);
                                    if (index == schools.length) {
                                        // Repopulates the teacher list, closes the menu, and shows a success pop-up
                                        $scope.spinner.resolve();
                                        populateClasses();
                                        closeBulkMenu();
                                        SMAAlert.CreateInfoAlert("Departments bulk upload was successful.");
                                    }
                                }).error(function (response, status, header, config) {
                                    // Repopulates the teacher list, closes the menu, and shows a success pop-up
                                    $scope.spinner.resolve();
                                    if (response == null) { response = "" }
                                    SMAAlert.CreateInfoAlert("Failed to upload Departments:<br><br>" + response);
                                });

                            }
                                // Repopulates the teacher list, closes the menu, and shows a success pop-up
                            else {
                                $scope.spinner.resolve();
                                populateClasses();
                                closeBulkMenu();
                                SMAAlert.CreateInfoAlert("Departments bulk upload was successful.");
                            }
                        }
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to upload departments:<br><br>" + response);
                    });
                }
            }
            BulkAddClass(0);
        }

        // Selects all Grades checkboxes
        function selectAllGrades() {
            $("#GradesCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all Grades checkboxes
        function deselectAllGrades() {
            $("#GradesCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Selects all Teacher checkboxes
        function selectAllTeachers() {
            $("#TeacherCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all Teachers checkboxes
        function deselectAllTeachers() {
            $("#TeacherCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Selects all bulk Grades checkboxes
        function selectAllGradesBulk() {
            $("#BulkGradesCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all bulk Grades checkboxes
        function deselectAllGradesBulk() {
            $("#BulkGradesCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Selects all bulk Grades checkboxes
        function selectAllTeachersBulk() {
            $("#BulkTeacherCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == false) {
                    $(this).click();
                }
            });
        }

        // Deselects all bulk Grades checkboxes
        function deselectAllTeachersBulk() {
            $("#BulkTeacherCheckboxContainer input[type=checkbox]").each(function (i) {
                if ($(this).prop("checked") == true) {
                    $(this).click();
                }
            });
        }

        // Loads the grade checkboxes when a school is choosen
        function loadBulkForm() {
            page_init()
            sessionStorage.setItem("cg_alreadySaved", "");
            sessionStorage.setItem("cg_toBeAdded", "");
            sessionStorage.setItem("cg_toBeDeleted", "");
            sessionStorage.setItem("tc_alreadySaved", "");
            sessionStorage.setItem("tc_toBeAdded", "");
            sessionStorage.setItem("tc_toBeDeleted", "");
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            $scope.objGradeList = [];
            $scope.objTeacherList = [];
            populateGrades(-1, "", "bulk")
            //DataService.GradeGetAll()
            //.success(function (response1, status, header, config) {
            //    var grades = response1;

            //    grades.sort(function (a, b) {
            //        var nameA = a.Name.toLowerCase();
            //        var nameB = b.Name.toLowerCase();
            //        if (nameA > nameB) {
            //            return 1;
            //        } else if (nameA < nameB) {
            //            return -1;
            //        } else {
            //            return 0;
            //        }
            //    });
            //    $scope.objGradeList = grades;
            //    $scope.objGradeList.forEach(function (obj) { obj.selection = false; });
            DataService.MerchantGetListByCurrentUser()
            .success(function (response2, status, header, config) {
                var merchants = response2;

                function getTeachersByMerchants(index, length, merchants, teachers) {
                    if (index < length) {

                        DataService.TeacherGetListByMerchant(merchants[index].MerchantID)
                        .success(function (response3, status, header, config) {
                            var tempTeachers = response3;
                            for (var i = 0, len = tempTeachers.length; i < len; i++) {
                                teachers.push(tempTeachers[i]);
                            }
                            index++;
                            getTeachersByMerchants(index, length, merchants, teachers);
                        }).error(function (response, status, header, config) {
                            if (status !== 403) {
                                $scope.spinner.resolve();
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to retrieve employees:<br><br>" + response1);
                            } else {
                                index++;
                                getTeachersByMerchants(index, length, merchants, teachers);
                            }
                        });

                    } else {
                        // Renders the teacher checkboxes
                        $scope.objTeacherList = teachers;
                        $scope.objTeacherList.forEach(function (obj) { obj.selection = false; });
                        $scope.spinner.resolve();
                        showBulkMenu();
                    }
                }
                getTeachersByMerchants(0, merchants.length, merchants, []);
            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve Groups:<br><br>" + response);
                }
            });
            //}).error(function (response, status, header, config) {
            //    $scope.spinner.resolve();
            //    if (status !== 403) {
            //        if (response == null) { response = "" }
            //        SMAAlert.CreateInfoAlert("Failed to retrieve Groups:<br><br>" + response);
            //    }
            //});

        }

        function deloadBulkForm() {
            // Clears the container
            closeBulkMenu();
        }

        function selectColorBlack1(id) {
            var chkgrd = null;
            selectColorBlack(id);
            if (typeof id == "undefined") {
                id = $scope.classInfo.SchoolID;
            }
            if (id) {
                DataService.getGradeListBySchool(id).success(function (res) {
                    var classGrades = res;
                    if (classGrades.length <= 0) {
                        //$scope.objGradeList = [];
                    } else {
                        var grdlst = $scope.objGradeList;
                        if (classGrades.length > 0) {
                            populateGrades("", classGrades)
                            // deselectAllGrades();

                        }
                    }
                })
            }
            else {
                SMAAlert.CreateInfoAlert("SchoolId not found..!!");
            }
        }



        // Collapse 
        function collapse(scholID) {

            if ($("#" + scholID).data("act") != "expand") {
                $("#" + scholID).html(" + ");
                $("#" + scholID).data("act", "expand");
                $(".Searchable").each(function (i) {
                    if ($(this).data("schoolid") == scholID) {
                        $(this).hide();
                    }
                });
            }
            else {
                $("#" + scholID).html(" - ");
                $("#" + scholID).data("act", "collapse");
                $(".Searchable").each(function (i) {
                    if ($(this).data("schoolid") == scholID) {
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


        //--------------------Bulk Upload Code--------------------------------
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
        function checkUserSchoolCheckboxes(schoolID, e) {
            debugger
            if (e.selection == true) {// If it's checked
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
                                
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                    DataService.TeacherGetListBySchool(schoolID)
                    .success(function (teachers, status, header, config) {
                        if (teachers.length > 0) {
                            for (var i = 0, len = teachers.length; i < len; i++) {
                                if ($("#" + teachers[i].TeacherID).prop("checked") == false) {
                                    $("#" + teachers[i].TeacherID).click();
                                }
                            }
                        }
                        $scope.spinner.resolve();
                    }).error(function (response, status, header, config) {
                        $scope.spinner.resolve();
                        if (status !== 403) {
                            if (response == null) { response = "" }
                            SMAAlert.CreateInfoAlert("Failed to retrieve employees by:<br><br>" + response);
                        }
                    });
                
                selectColorBlack1(schoolID);
                //}
            } else {// If it's unchecked

                var us_alreadySaved = sessionStorage.getItem("us_alreadySaved");
                us_alreadySaved = us_alreadySaved != null ? us_alreadySaved.split(",") : null;

                var us_toBeAdded = sessionStorage.getItem("us_toBeAdded");
                us_toBeAdded = us_toBeAdded != null ? us_toBeAdded.split(",") : null;
                var temporary_us_toBeAdded = us_toBeAdded;

                var us_toBeDeleted = sessionStorage.getItem("us_toBeDeleted");
                us_toBeDeleted = us_toBeDeleted != null ? us_toBeDeleted.split(",") : null;
                var temporary_us_toBeDeleted = us_toBeDeleted;

                // If it was already checked(i.e. already in the DB), then add it to the unchecked list(i.e. to be deleted)
                for (var i = 0, len = us_alreadySaved != null ? us_alreadySaved.length : 0; i < len; i++) {
                    if (us_alreadySaved[i] == schoolID) {
                        temporary_us_toBeDeleted.push(schoolID);
                    }
                }

                // If it was checked(i.e. to be added to DB), then splice it from that list
                for (var i = 0, len = us_toBeAdded != null ? us_toBeAdded.length : 0; i < len; i++) {
                    if (us_toBeAdded[i] == schoolID) {
                        temporary_us_toBeAdded.splice(i, 1);
                    }
                }

                // Resets the session storage variables
                temporary_us_toBeDeleted.join(",");
                temporary_us_toBeAdded.join(",");
                sessionStorage.setItem("us_toBeDeleted", temporary_us_toBeDeleted);
                sessionStorage.setItem("us_toBeAdded", temporary_us_toBeAdded);

                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                DataService.TeacherGetListBySchool(schoolID)
                .success(function (teachers, status, header, config) {
                    if (teachers.length > 0) {
                        for (var i = 0, len = teachers.length; i < len; i++) {
                            if ($("#" + teachers[i].TeacherID).prop("checked") == true) {
                                $("#" + teachers[i].TeacherID).click();
                            }
                        }
                    }
                    $scope.spinner.resolve();
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (status !== 403) {
                        if (response == null) { response = "" }
                        SMAAlert.CreateInfoAlert("Failed to retrieve employees:<br><br>" + response);
                    }
                });
                selectColorBlack1(schoolID);
            }
        }
        function AddBulkSchool() {
            var cg_toBeAdded = sessionStorage.getItem('us_toBeAdded');
            cg_toBeAdded = cg_toBeAdded != null ? cg_toBeAdded.split(',') : null;
            var cg_toBeAdded_length = cg_toBeAdded != null ? cg_toBeAdded.length : 0;
            for (var i = 0; i < cg_toBeAdded_length; i++) {
                if (cg_toBeAdded[i] == "" || cg_toBeAdded[i] == null || cg_toBeAdded[i] == undefined) {
                    cg_toBeAdded.splice(i, 1);
                }
            }
            if ($scope.sumbit_type == "create") {
                var index = 0;
                var len = cg_toBeAdded != null ? cg_toBeAdded.length : 0;
                $scope.lenth = len;
                function AddschoolinBulk(index) {
                    if (index < len) {
                        var subject = {
                            ClassID: $scope.classInfo.ClassID,
                            Name: $scope.classInfo.Name,
                            Description: " ",
                            SchoolID: cg_toBeAdded[index],
                        }
                        submitForm(subject)
                        index++;
                        AddschoolinBulk(index)
                    }
                    else {
                        $scope.spinner.resolve();
                        // SMAAlert.CreateInfoAlert("New Department has been saved.")
                        //populateClasses();
                    }

                }
                AddschoolinBulk(0);

            }
            if ($scope.sumbit_type == "update") {
                var subject = {
                    ClassID: $scope.classInfo.ClassID,
                    Name: $scope.classInfo.Name,
                    Description: " ",
                    SchoolID: $scope.classInfo.SchoolID,
                }
                submitForm(subject)
            }

        }
    }
})();