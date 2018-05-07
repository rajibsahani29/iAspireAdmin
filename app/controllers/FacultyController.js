

(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .controller("FacultyController", ["$scope", "DataService", "SMAAlertFactory", "ProjectConstants", FacultyController]);


    function FacultyController($scope, DataService, SMAAlert, ProjectConstants) {
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
        //$scope.classInfo = getClassInfo();
        populateTeachers();

        var deptC = this;
        //deptC.selectColorBlack = selectColorBlack1;
        //deptC.checkClassGradeCheckboxes = checkClassGradeCheckboxes;
        deptC.collapseAll = collapseAll;
        deptC.expandAll = expandAll;
        deptC.collapse = collapse;
        //deptC.selectAllGradesBulk = selectAllGradesBulk;
        //deptC.selectAllTeachersBulk = selectAllTeachersBulk;
        //deptC.deselectAllTeachersBulk = deselectAllTeachersBulk
        //deptC.deleteSubject = deleteSubject;
        //deptC.selectAllGrades = selectAllGrades;
        //deptC.deselectAllGrades = deselectAllGrades;
        //deptC.selectAllTeachers = selectAllTeachers;
        //deptC.deselectAllTeachers = deselectAllTeachers;
        //deptC.loadBulkForm = loadBulkForm;
        //deptC.deloadBulkForm = deloadBulkForm;
        //deptC.checkTeacherClassCheckboxes = checkTeacherClassCheckboxes;
        //deptC.submitForm = submitForm;
        //deptC.submitBulkForm = submitBulkForm;


        //populateClasses();
        //page_init();
        return deptC;
        function populateTeachers() {
            //window.spinner = SMAAlert.CreateSpinnerAlert();

            // Clears out the html elements
            $("#TeachersContainer").html("");
            $("#Datalist").html("");
            $("#MerchantSelect").html('<option class="FontColor3" disabled selected value="">District</option>');
            $("#MerchantBulkSelect").html('<option class="FontColor3" disabled selected value="">District</option>');

            getMerchants();
        }
        function getMerchants() {
            //resetObjects();
           // $scope.spinner = SMAAlert.CreateSpinnerAlert();

            DataService.MerchantGetListByCurrentUser()
            .success(function (response1, status, header, config) {
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
                    populateTeachersLoop(merchants, 0, merchants.length);
                    //getSchools(merchants, merchants_length, merchants_index);
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

        function populateTeachersLoop(merchants, index, length) {
            // Psuedo foreach loop
            if (index < length) {
                $("#TeachersContainer").append("<div class='MerchantNameHeader'><span class='collapsible' id='" + merchants[index].MerchantID + "' onclick='collapse(\"" + merchants[index].MerchantID + "\")'> - </span>" + merchants[index].Name + "</div>");

                DataService.GetFacultyListForMerchant(merchants[index].MerchantID)
               .success(function (response1, status, header, config) {                             
                    var teachers = response1;
                    //Adds the merhant name to the teacher object
                    for (var i = 0, len = teachers.length; i < len; i++) {
                        teachers[i].MerchantName = merchants[index].Name;
                    }
                    // Appends the teachers to the container and the datalist(for searching)
                    if (teachers.length > 0) {

                        var sort_teachers = function (left, right) {
                            var nameorder = left.LastName.toLowerCase() === right.LastName.toLowerCase() ? 0 : (left.LastName.toLowerCase() < right.LastName.toLowerCase() ? -1 : 1);
                            if ((left.IsTiedToUser && right.IsTiedToUser) || (!left.IsTiedToUser && !right.IsTiedToUser)) {
                                return nameorder;
                            } else if (left.IsTiedToUser) {
                                return -1;
                            } else {
                                return 1;
                            }
                        }

                        teachers.sort(sort_teachers);
                        $scope.objTeacherList = teachers
                        //$("#TeachersContainer").append($("#TeacherTemplate").$render(teachers));
                        //$("#Datalist").append($("#DatalistTemplate").$render(teachers));
                    } else {
                        $("#TeachersContainer").append("<div class='NoTeachersHeader Searchable' data-merchantid='" + merchants[index].MerchantID + "'>No faculty are available for this merchant.</div>");
                    }

                    // Increment our index and recall the function
                    index++;
                    populateTeachersLoop(merchants, index, length);
               }).error(function (response, status, header, config) {
                   if (status !== 403) {
                       $scope.spinner.resolve();
                       if (response == null) { response = "" }
                       SMAAlert.CreateInfoAlert("Failed to retrieve sites:<br><br>" + response);
                   } else {
                       console.log("Forbidden: Schools.SchoolGetListForMerchant(" + merchants[merchants_index].MerchantID + ")");
                       merchants_index++;
                       populateTeachersLoop(merchants, index, length);
                       //getSchools(merchants, merchants_length, merchants_index);
                   }
               });
            } else {
                // Resolves the spinner once our psuedo loop finishes
                //$scope.spinner.resolve();
            }
        }
        function showMenu(teacherID) {
            // If a teacherID is passed, then populate the form
            if (teacherID) {
                $scope.spinner = SMAAlert.CreateSpinnerAlert();
                // Gets the teacher object from the data-bindings
                var teacher = $("#" + teacherID).data();

                $("#PopUpWindowHeading").html("Faculty - Information");

                // Inserts object values into html elements
                $("#TeacherIDHidden").val(teacherID);
                $("#TeacherFirstName").val(teacher.firstname);
                $("#TeacherLastName").val(teacher.lastname);
                $("#TeacherEmail").val(teacher.email);
                $("#MerchantSelect").val(teacher.merchantid);

                // Change the color so it's not placeholder grey
                selectColorBlack('MerchantSelect');

                // Shows the Delete Button
                $("#DeleteButton").show();

                // Populates the classes checkboxes
                populateClasses(teacher.merchantid);

            } else {
                // Hides the Delete Button
                $("#DeleteButton").hide();

                // Changes the form's header and sets the teacherID to -1(this tells the db that it's new)
                $("#PopUpWindowHeading").html("New Faculty -  Information");
                $("#TeacherIDHidden").val(-1);
                $("#EditMenu").css("display", "block");
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

            // Chages the select back to placeholder grey
            selectColorGrey("SchoolSelect");

            // Resets all validation errors
            $scope.validator.resetForm();
        }
        function populateClasses(merchantID) {
            // Clears the checkboxes
            $("#ClassesCheckboxContainer").html("");

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

                        populateClassesLoop(schools, index, length, []);
                    } else {
                        window.spinner.resolve();
                    }
                 }).error(function (response, status, header, config) {
                     SMAAlert.CreateErrorAlert("Failed to retrieve schools!<br><br>" + response);
                 });                    
            }
        }
        function populateClassesLoop(schools, index, length, schoolHeaders) {
            if (index < length) {
                DataService.ClassGetListForSchool(schools[index].SchoolID)
                 .success(function (response1, status, header, config) {               
                    var classes = response1;
                    if (classes == "") {
                        $("#ClassesCheckboxContainer").append("<div class='" + schools[index].SchoolID + "FontColor4 PopUpWindowLabel'><br />" + schools[index].Name + "</div>");
                        $("#ClassesCheckboxContainer").append('<div class="SmallSettingContainer" style="height: 20px; min-height:20px; max-height: 20px; margin: 5px 0 5px 10px;"><label class="FontColor4 PopUpWindowLabel" style="float:none">No classes available for this school.</label></div>');
                    } else {
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
                        $scope.ddlClassList = classes;
                        //$("#ClassesCheckboxContainer").append($("#ClassCheckboxTemplate").render(classes));
                    }

                    schoolHeaders.push(schools[index].SchoolID);
                    index++;
                    populateClassesLoop(schools, index, length, schoolHeaders);
                 }).error(function (response, status, header, config) {
                    if (status !== 403) {
                        window.spinner.resolve();
                        SMAAlert.CreateErrorAlert("Failed to retrieve subjects!<br><br>" + response);
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

                var teacherID = $("#TeacherIDHidden").val();

                // If it's not a new teacher
                if (teacherID !== "-1") {
                    // Get the TeacherClasses by the teacher
                    DataService.TeacherClassGetListByTeacher(teacherID)
                 .success(function (response2, status, header, config) {                   
                        var teacherClasses = response2;

                     //var tc_alreadySaved = sessionStorage.getItem("tc_alreadySaved");
                        var tc_alreadySaved = "";
                        tc_alreadySaved = tc_alreadySaved.split(",");

                        for (var j = 0, lenj = teacherClasses.length; j < lenj; j++) {
                            $("#" + teacherClasses[j].ClassID).prop('checked', true);
                            tc_alreadySaved.push(teacherClasses[j].ClassID);
                        }

                        tc_alreadySaved = tc_alreadySaved.join(",");
                        sessionStorage.setItem("tc_alreadySaved", tc_alreadySaved);

                        //window.spinner.resolve();
                        $("#EditMenu").css("display", "block");
                 }).error(function (response, status, header, config) {
                        //window.spinner.resolve();
                        if (status !== 403) {
                            SMAAlert.CreateErrorAlert("Failed to retrieve teacher classes!<br><br>" + response);
                        } else {
                            console.log("Forbidden: Teachers.TeacherClassGetListByTeacher(" + teacherID + ")");
                        }
                    });
                } else {
                    //window.spinner.resolve();
                    $("#EditMenu").css("display", "block");
                }
            }
        }

        // Save Form
        function submitForm() {

            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            // Creates the subject object from the inputs
            var subject = {
                ClassID: $scope.classInfo.ClassID,
                Name: $scope.classInfo.Name,
                Description: $scope.classInfo.Description,
                SchoolID: $scope.classInfo.SchoolID,
            }

            // Grabs the session variables(i.e. Class Grades), splits them into arrays, and removes any null or empty values
            var cg_toBeAdded = sessionStorage.getItem('cg_toBeAdded');
            cg_toBeAdded = cg_toBeAdded.split(',');
            var cg_toBeAdded_length = cg_toBeAdded.length;
            for (var i = 0; i < cg_toBeAdded_length; i++) {
                if (cg_toBeAdded[i] == "" || cg_toBeAdded[i] == null || cg_toBeAdded[i] == undefined) {
                    cg_toBeAdded.splice(i, 1);
                }
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

            // If it's a new subject
            if (subject.ClassID == -1) {
                DataService.ClassAddNew(subject)
                .success(function (response1, status, header, config) {
                    var subjectID = response1;

                    if (cg_toBeAdded > 0) {

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
                                    $scope.spinner.resolve();
                                    populateClasses();
                                    closeMenu();
                                    SMAAlert.CreateInfoAlert("New Department has been saved.");
                                }).error(function (response, status, header, config) {
                                    $scope.spinner.resolve();
                                    if (response == null) { response = "" }
                                    SMAAlert.CreateInfoAlert("Failed to save employee departments:<br><br>" + response);
                                });

                            } else {
                                // After the class is posted, recall the populate function
                                $scope.spinner.resolve();
                                populateClasses();
                                closeMenu();
                                SMAAlert.CreateInfoAlert("New Department has been saved.");
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
                                    ClassID: subjectID
                                }
                                teacherClasses.push(teacherClass);
                            }

                            DataService.TeacherClassAddNewBulk(teacherClasses)
                            .success(function (response4, status, header, config) {
                                // After the class is posted, recall the populate function
                                $scope.spinner.resolve();
                                populateClasses();
                                closeMenu();
                                SMAAlert.CreateInfoAlert("New Department has been saved.");
                            }).error(function (response, status, header, config) {
                                $scope.spinner.resolve();
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to save employee departments:<br><br>" + response);
                            });
                        } else {
                            // After the class is posted, recall the populate function
                            $scope.spinner.resolve();
                            populateClasses();
                            closeMenu();
                            SMAAlert.CreateInfoAlert("New Department has been saved.");
                        }
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to save Department<br><br>:" + response);
                });
            } else {
                // If it's not a new subject
                DataService.ClassUpdate(subject)
                .success(function (response1, status, header, config) {

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
                            }).error(function (response, status, header, config) {
                                $scope.spinner.resolve();
                                if (response == null) { response = "" }
                                SMAAlert.CreateInfoAlert("Failed to save employee departments:<br><br>" + response);
                            });
                        } else {
                            check_cg_toBeDeleted(subject.ClassID);
                        }
                    }
                }).error(function (response, status, header, config) {
                    $scope.spinner.resolve();
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to update department:<br><br>" + response);
                });
            }
        }
        function check_cg_toBeDeleted(classID) {
            // Grabs the session variables(i.e. Class Grades), splits them into arrays, and removes any null or empty values
            var cg_toBeDeleted = sessionStorage.getItem('cg_toBeDeleted');
            cg_toBeDeleted = cg_toBeDeleted.split(',');
            var cg_toBeDeleted_length = cg_toBeDeleted.length;
            for (var i = 0; i < cg_toBeDeleted_length; i++) {
                if (cg_toBeDeleted[i] == "" || cg_toBeDeleted[i] == null || cg_toBeDeleted[i] == undefined) {
                    cg_toBeDeleted.splice(i, 1);
                }
            }

            // If their are class grades to be deleted
            if (cg_toBeDeleted.length > 0) {
                deleteClassGradesLoop(0, cg_toBeDeleted.length, cg_toBeDeleted, classID);
            } else {
                // After the class is posted, recall the populate function
                //$scope.spinner.resolve();
                //populateClasses();
                //closeMenu();
                //SMAAlert.CreateInfoAlert("Department has been updated.");
                check_tc_toBeDeleted(classID);
            }
        }
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
    }
})();