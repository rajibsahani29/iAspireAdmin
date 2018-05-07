(function () {

    "use strict";

    angular
        .module("iAspireApp")
        .factory("DataService", ["$http", "ProjectConstants", "$q", "$timeout", dataService]);

    function dataService($http, ProjectConstants, $q, $timeout) {
        var dS = this;

        // user
        dS.validateUserLogin = validateUserLogin;
        dS.validateAccessID = validateAccessID;
        dS.ReValidateuserLogin = reValidateuserLogin
        dS.GetSessionsList = getSessionsList;
        dS.UserLogout = userLogout;
        dS.GetVotesListForUser = getVotesListForUser;
        dS.UserGetListForMerchant = userGetListForMerchant;
        dS.GetVotesListForUserWithTeacherAddins = getVotesListForUserWithTeacherAddins;
        dS.GetSEAddinsVotesListForUser = getSEAddinsVotesListForUser;
        dS.CreateAccount = createAccount;
        dS.CreateiAspireUserAccount = createiAspireUserAccount;
        dS.UpdateUserAccount = updateUserAccount;
        dS.SendResetPasswordEmail = sendResetPasswordEmail;
        dS.UserRoleAddNew = userRoleAddNew;
        dS.UserRoleDelete = userRoleDelete;
        dS.UserRoleGetDetails = userRoleGetDetails;
        dS.UserSchoolAddNew = userSchoolAddNew;
        dS.UserSchoolDelete = userSchoolDelete;
        dS.UserSchoolgetListForUser = userSchoolgetListForUser;
        dS.UserSchoolGetDetails = userSchoolGetDetails;
        dS.UserMerchantAddNew = userMerchantAddNew;
        dS.UserMerchantDelete = userMerchantDelete;
        dS.UserMerchantGetDetails = userMerchantGetDetails;
        dS.UserTeacherAddNew = userTeacherAddNew;
        dS.UserTeacherDelete = userTeacherDelete;
        dS.UserTeacherGetDetails = userTeacherGetDetails;
        dS.UserVoterAddNew = userVoterAddNew;
        dS.UserVoterDelete = userVoterDelete;
        dS.UserVoterGetDetails = userVoterGetDetails;
        dS.UserTeacherAccessGetListByUserID = userTeacherAccessGetListByUserID;
        dS.UserTeacherAccessAddNewBulk = userTeacherAccessAddNewBulk;
        dS.UserTeacherAccessDelete = userTeacherAccessDelete;
        dS.GetFacultyListForMerchant = GetFacultyListForMerchant;
        //Roles
        dS.RolesAddNew = rolesAddNew;
        dS.RolesUpdate = rolesUpdate;
        dS.RolesGetDetails = rolesGetDetails;
        dS.RolesGetDetailsWithRights = rolesGetDetailsWithRights;
        dS.RolesGetListForMerchant = rolesGetListForMerchant;
        dS.RolesGetListForMerchantWithRights = rolesGetListForMerchantWithRights;
        dS.RolesGetListForCurrentUser = rolesGetListForCurrentUser;
        dS.RolesGetListForCurrentUserWithRights = rolesGetListForCurrentUserWithRights;
        dS.RolesGetListForUser = rolesGetListForUser;
        dS.RolesGetListForUserWithRights = rolesGetListForUserWithRights;
        dS.RolesDelete = rolesDelete;
        dS.RoleRightsAddNewBulk = roleRightsAddNewBulk;
        dS.RoleRightsAddNew = roleRightsAddNew;
        dS.RoleRightsDelete = roleRightsDelete;
        dS.RoleRightsGetDetails = roleRightsGetDetails;
        dS.UserRolesGetListbyRole = userRolesGetListbyRole;


        //Rights
        dS.RightsAddNew = rightsAddNew;
        dS.RightsUpdate = rightsUpdate;
        dS.RightsGetDetails = rightsGetDetails;
        dS.RightsGetFullList = rightsGetFullList;
        dS.RightsDelete = rightsDelete;


        //Merchant
        dS.GetMerchantByCurrentUser = getMerchantByCurrentUser;
        dS.MerchantGetListByCurrentUser = merchantGetListByCurrentUser;
        dS.MerchantGetDetails = merchantGetDetails;
        dS.MerchantAddNew = merchantAddNew;
        dS.MerchantUpdate = merchantUpdate;
        dS.MerchantDelete = merchantDelete;
        dS.MerchantUserGetListByMerchant = merchantUserGetListByMerchant;
        dS.MerchantUserAddNew = merchantUserAddNew;
        dS.MerchantUserGetDetails = merchantUserGetDetails;
        dS.MerchantUserDelete = merchantUserDelete;
        dS.MerchantSurveyAddNew = merchantSurveyAddNew;
        dS.MerchantSurveyGetDetails = merchantSurveyGetDetails;
        dS.MerchantSurveyDelete = merchantSurveyDelete;
        dS.MerchantSurveyGetListBySurvey = merchantSurveyGetListBySurvey;
        dS.MerchantCreateNewFullAccountWithAdminLogin = merchantCreateNewFullAccountWithAdminLogin;


        //School
        dS.SchoolAddNew = schoolAddNew;
        dS.SchoolAddNewBulk = schoolAddNewBulk;
        dS.SchoolUpdate = schoolUpdate;
        dS.SchoolGetListForUser = schoolGetListForUser;
        dS.SchoolGetListForMerchant = schoolGetListForMerchant;
        dS.SchoolGetDetails = schoolGetDetails;
        dS.SchoolDelete = schoolDelete;
        dS.SchoolSurveyGetListBySurvey = schoolSurveyGetListBySurvey;
        dS.SchoolSurveyAddNew = schoolSurveyAddNew;
        dS.SchoolSurveyDelete = schoolSurveyDelete;
        dS.SchoolGradeAddNewBulk = SchoolGradeAddNewBulk;
        //Teachers
        dS.GetTeachersForCurrentUser = getTeachersForCurrentUser;
        dS.TeacherGetListByMerchant = teacherGetListByMerchant;
        dS.TeacherGetListBySchool = teacherGetListBySchool;
        dS.teacherGetListByClass = teacherGetListByClass;
        dS.GetTeachersBySurvey = getTeachersBySurvey;
        dS.TeacherGetDetails = teacherGetDetails;
        dS.TeacherAddNew = teacherAddNew;
        dS.TeacherUpdate = teacherUpdate;
        dS.TeacherDelete = teacherDelete;
        dS.TeacherBulkAddNew = teacherBulkAddNew;
        dS.TeacherClassAddNewBulk = teacherClassAddNewBulk;
        dS.TeacherClassAddNew = teacherClassAddNew;
        dS.TeacherClassGetListByTeacher = teacherClassGetListByTeacher;
        dS.TeacherClassGetListByClass = teacherClassGetListByClass;
        dS.TeacherClassDelete = teacherClassDelete;


        //Merchant Settings
        dS.CreateMerchantSetting = createMerchantSetting;
        dS.UpdateMerchantSetting = updateMerchantSetting;
        dS.GetMerchantSettingValue = getMerchantSettingValue;
        dS.GetMerchantSettings = getMerchantSettings;
        dS.DeleteMerchantSettingDetails = deleteMerchantSettingDetails;

        //Classes
        dS.ClassGetListForUser = classGetListForUser;
        dS.ClassGetListForSchool = classGetListForSchool;
        dS.ClassGetDetails = classGetDetails;
        dS.ClassAddNew = classAddNew;
        dS.ClassAddNewBulk = classAddNewBulk;
        dS.ClassUpdate = classUpdate;
        dS.ClassDelete = classDelete;
        dS.ClassGradeAddNew = classGradeAddNew;
        dS.ClassGradeAddNewBulk = classGradeAddNewBulk;
        dS.ClassGradeGetDetails = classGradeGetDetails;
        dS.ClassGradeDelete = classGradeDelete;
        dS.ClassGradeGetListForClass = classGradeGetListForClass;
        dS.ClassStudentAddNew = classStudentAddNew;
        dS.ClassStudentAddNewBulk = classStudentAddNewBulk;
        dS.ClassStudentGetDetails = classStudentGetDetails;
        dS.ClassStudentGetListByClass = classStudentGetListByClass;
        dS.ClassStudentGetListByStudent = classStudentGetListByStudent;
        dS.ClassStudentDelete = classStudentDelete;


        //Grades
        dS.GradeGetAll = GradeGetAll;
        dS.GradeGetDetails = GradeGetDetails;
        dS.GradeAddNew = GradeAddNew;
        dS.GradeUpdate = GradeUpdate;
        dS.GradeDelete = GradeDelete;

        //Survey
        dS.GetSurveyListForUser = getSurveyListForUser;
        dS.GetAllSurveys = getAllSurveys;
        dS.GetTESurveyListForUser = getTESurveyListForUser;
        dS.GetSESurveyListForUser = getSESurveyListForUser;
        dS.SurveyVariableAddNew = surveyVariableAddNew;
        dS.SurveyDetailAddNew = surveyDetailAddNew;
        dS.SurveyDetailDelete = surveyDetailDelete;
        dS.GetSurveyVariables = getSurveyVariables;
        dS.GetSurveyVariablesFiltered = getSurveyVariablesFiltered;
        dS.SurveyDetailGetListBySurvey = surveyDetailGetListBySurvey;
        dS.SurveyVariableGetListForSurvey = surveyVariableGetListForSurvey;
        dS.GetSummaryGuid = getSummaryGuid;
        dS.SurveyTypeGetBaseList = surveyTypeGetBaseList;
        dS.SurveyVariableDelete = surveyVariableDelete;
        dS.ArchiveSurvey = ArchiveSurvey;
		dS.CloneSurvey = CloneSurvey;
		dS.CloneSurveyByName = CloneSurveyByName;
		dS.surveyTypeGetList = surveyTypeGetList;
        dS.setSurveyFormTypeTitle = setSurveyFormTypeTitle;
		dS.addSurveyFormType = addSurveyFormType;
		dS.deleteSurveyType = deleteSurveyType;
		dS.getSurveyListByListID = getSurveyListByListID;
        //NSurvey
        dS.CreateSurveyForm = createSurveyForm;
        dS.UploadXMLSurvey = uploadXMLSurvey;
        dS.GetLanguageList = getLanguageList;
        dS.GetQuestionList = getQuestionList;
        dS.GetSurveyPageCount = getSurveyPageCount;
		//START NILESH-TSK3.0
        dS.SurveyChangeActiveStatus = surveyChangeActiveStatus;
        //END NILESH-TSK3.0
        //-------gRADE-----------
        dS.getGradeListBySchool = getGradeListBySchool;
        dS.getSchoolListByGrade = getSchoolListByGrade;
        dS.SchoolGradeDeleteBulk = SchoolGradeDeleteBulk;
        //-----------------------
		

        dS.getSurveys = getSurveysForUser;
        dS.getSurveyListByListName = getSurveyListByListName;
        dS.UserByParam = UserByParam;
        dS.UploadFile = UploadFile;
        dS.getImage = getImage;
        dS.getIP = getIP;
        //START NILESH-TSK70
        dS.getPath = getPath;
        //END NILESH-TSK70
        return dS;

        // API Interface
        function getIP() {
            //return "http://10.50.10.64";
            //return "http://localhost:81";
            return "http://localhost:59795";
            //return "http://localhost:85";
           //return "http://localhost:8081";
           //return "https://192.168.1.101";
            //return "http://localhost";
            //return "https://104.44.135.42";
        }

        function getPath() {
            return "/";
        }
        function getBaseURL() {
            var str = getIP();
            return str + "/api/";
            //return str + "/iAspireWebAPI/api/";
            //return str + (str.indexOf("azurewebsites") > -1 ? "/WebAPI/api/" : "/iAspireWebAPI/api/");
        }

        //*****----- USER -----*****//
        function UploadFile(file) {
            //var url = getIP() + "/iAspireWebAPI/Home/Upload";

            //START NILESH-TSK70
            //var url = getIP() + "/Home/Upload";
            var url = getIP() + getPath() + "Home/Upload";
            //END NILESH-TSK70
            return $http({
                method: "POST",
                url: url,                
                data: file
            });
        }
        function getImage(id)
        {
            //var url = getIP() + "/iAspireWebAPI/Home/getImage?merchantid=" + id;

            //START NILESH-TSK70
            //var url = getIP() + "Home/getImage?merchantid=" + id;
            var url = getIP() + getPath() + "Home/getImage?merchantid=" + id;
            //END NILESH-TSK70
            return $http({
                method: "GET",
                url: url,                
            });
        }
        function validateUserLogin(loginObject) {
            var url = getBaseURL() + "Users/Validate";
            return $http({
                method: "POST",
                url: url,
                headers: {
                    "X-iA-AccessID": undefined // this ensures that the accessID token is not passed for this call (which causes an error in the API)
                },
                data: loginObject
            });
        }

        function userLogout() {
            var url = getBaseURL() + "Users/Logout";
            return $http.post(url);
        }

        function validateAccessID(accessID) {
            var url = getBaseURL() + "Users/Validate/" + accessID;
            //return $http.get(url);
            return $http({
                method: "GET",
                url: url,
                headers: {
                    "X-iA-AccessID": undefined // this ensures that the accessID token is not passed for this call (which causes an error in the API)
                }
            });
        }

        // ReValidates the user's loging info, but also requires the user to already be logged in (Project Identity)
        function reValidateuserLogin(userLoginInfo) {
            var url = getBaseURL() + "Users/Validate/Again";
            return $http({
                method: "POST",
                url: url,
                data: userLoginInfo
            });
        }

        // Gets current session list
        function getSessionsList() {
            var url = getBaseURL() + "Users/Current/Sessions";
            return $http.get(url);
        }







        // Gets the list of votes for the currently logged in user M0014
        function getVotesListForUser(variableMode) {
            var url = getBaseURL() + "Users/Votes/" + variableMode;
            return $http.get(url);
        }

        // Gets list of users for a merchant
        function userGetListForMerchant(merchantID) {
            var url = getBaseURL() + "Users/List/ByMerchant/" + merchantID;
            return $http.get(url);
        }

        // Gets a list of Voters with the addition of any Votes that were submitted for teachers the user has explicit access to
        function getVotesListForUserWithTeacherAddins(variableMode) {
            var url = getBaseURL() + "Users/Votes/WithTeacherAddins/" + variableMode;
            return $http.get(url);
        }

        // Returns a list of voters for all users tied to the school(s) of the given user
        function getSEAddinsVotesListForUser() {
            var url = getBaseURL() + "Users/Votes/SE/Addins/BySchool";
            return $http.get(url);
        }

        // Creates a new SurveyProject user and creates trial account data
        function createAccount(createAccountObject) {
            var url = getBaseURL() + "Users/CreateNew";
            return $http({
                method: "POST",
                url: url,
                data: createAccountObject
            });
        }

        // Creates a new iAspire user account
        function createiAspireUserAccount(createAccountObject) {
            var url = getBaseURL() + "Users/iAspire/CreateNew";
            return $http({
                method: "POST",
                url: url,
                data: createAccountObject
            });
        }

        // Updates a user account
        function updateUserAccount(createAccountObject) {
            var url = getBaseURL() + "Users/iAspire/Update";
            return $http({
                method: "POST",
                url: url,
                data: createAccountObject
            });
        }

        // Sends the email for a password reset
        function sendResetPasswordEmail(userLoginInfo) {
            var url = getBaseURL() + "Users/Validate/Reset";
            return $http({
                method: "POST",
                url: url,
                data: userLoginInfo
            });
        }

        // Adds a new user role
        function userRoleAddNew(userRole) {
            var url = getBaseURL() + "UserRoles";
            return $http({
                method: "POST",
                url: url,
                data: userRole
            });
        }

        // Deletes a user role
        function userRoleDelete(userRole) {
            var url = getBaseURL() + "UserRoles/" + userRole.UserID + "/" + userRole.RoleID;
            return $http.delete(url);
        }

        // Gets the details of a user role
        function userRoleGetDetails(userID, roleID) {
            var url = getBaseURL() + "UserRoles/" + userID + "/" + roleID;
            return $http.get(url);
        }

        // Adds new user school
        function userSchoolAddNew(userSchool) {
            var url = getBaseURL() + "UserSchools";
            return $http({
                method: "POST",
                url: url,
                data: userSchool
            });
        }

        // Deletes a user school
        function userSchoolDelete(userSchool) {
            var url = getBaseURL() + "UserSchools/" + userSchool.UserID + "/" + userSchool.SchoolID;
            return $http.delete(url);
        }

        // Gets the details of a user school
        function userSchoolgetListForUser(userID) {
            var url = getBaseURL() + "UserSchools/" + userID;
            return $http.get(url);
        }

        // Gets the details of a user school
        function userSchoolGetDetails(userID, schoolID) {
            var url = getBaseURL() + "UserSchools/" + userID + "/" + schoolID;
            return $http.get(url);
        }
        //Add grade with school
        function SchoolGradeAddNewBulk(SchoolGrades) {
            var url = getBaseURL() + "SchoolGrades/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: SchoolGrades
            });
        }
        //Delete grade with school
        function SchoolGradeDeleteBulk(SchoolGrades) {
            var url = getBaseURL() + "Grades/DeleteBulk";
            return $http({
                method: "POST",
                url: url,
                data: SchoolGrades
            });
        }
        //Add grade with school
        function getGradeListBySchool(SchoolID) {
            var url = getBaseURL() + "Grades/List/School/" + SchoolID;
            return $http.get(url);
        }
        function getSchoolListByGrade(GradeID) {
            var url = getBaseURL() + "Schools/List/Grade/" + GradeID;
            return $http.get(url);
        }
        // Adds a new merchant user 
        function userMerchantAddNew(userID, merchantID) {
            var userMerchant = {
                UserID: userID,
                MerchantID: merchantID
            }
            var url = getBaseURL() + "UserMerchants";

            return $http({
                method: "POST",
                url: url,
                data: userMerchant
            });
        }

        // Deletes a user merchant
        function userMerchantDelete(userID, merchantID) {
            var url = getBaseURL() + "UserMerchants/" + userID + "/" + merchantID;
            return $http.delete(url);
        }

        // Gets the details for a user merchant
        function userMerchantGetDetails(userID, merchantID) {
            var url = getBaseURL() + "UserMerchants/" + userID + "/" + merchantID;
            return $http.get(url);
        }

        // Adds a new user teacher
        function userTeacherAddNew(userTeacher) {
            var url = getBaseURL() + "UserTeachers";
            return $http({
                method: "POST",
                url: url,
                data: userTeacher
            });
        }

        // Deletes a user teacher
        function userTeacherDelete(userTeacher) {
            var url = getBaseURL() + "UserTeachers/" + userTeacher.UserID + "/" + userTeacher.TeacherID;
            return $http.delete(url);
        }

        // Gets the details for a user teacher
        function userTeacherGetDetails(userID, teacherID) {
            var url = getBaseURL() + "UserTeachers/" + userID + "/" + teacherID;
            return $http.get(url);
        }

        // Adds new user voter
        function userVoterAddNew(userVoter) {
            var url = getBaseURL() + "UserVoters";
            return $http({
                method: "POST",
                url: url,
                data: userVoter
            });
        }

        // Deletes a user voter
        function userVoterDelete(userID, voterID) {
            var url = getBaseURL() + "UserVoters/" + userID + "/" + voterID;
            return $http.delete(url);
        }

        // Gets the details for a user voter
        function userVoterGetDetails(userID, voterID) {
            var url = getBaseURL() + "UserVoters/" + userID + "/" + voterID;
            return $http.get(url);
        }

        // Gets a list of user teacher access by user id
        function userTeacherAccessGetListByUserID(userID) {
            var url = getBaseURL() + "UserTeacherAccess/List/ByUser?userID=" + userID;
            return $http.get(url);
        }

        // Gets a list of user teacher access by user id
        function userTeacherAccessAddNewBulk(userTeacherAccessList) {
            var url = getBaseURL() + "UserTeacherAccess/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: userTeacherAccessList
            });
        }

        // Deletes a user teacher access connection
        function userTeacherAccessDelete(userTeacherAccess) {
            var url = getBaseURL() + "UserTeacherAccess?userID=" + userTeacherAccess.UserID + "&teacherID=" + userTeacherAccess.TeacherID;
            return $http.delete(url);
        }


        //*****-----MERCHANT-----*****//
        function getMerchantByCurrentUser() {
            var url = getBaseURL() + "Merchant/Current";
            return $http.get(url);
        }

        // Gets the full list of Merchants for the logged in user
        function merchantGetListByCurrentUser() {
            var url = getBaseURL() + "Merchant/Current/List";
            return $http.get(url);
        }

        // Gets the details of a given Merchant
        function merchantGetDetails(merchantID) {
            var url = getBaseURL() + "Merchant/" + merchantID;
            return $http.get(url);
        }

        // Creates a new Merchant and saves it
        function merchantAddNew(newMerchant) {
            var url = getBaseURL() + "Merchant";
            return $http({
                method: "POST",
                url: url,
                data: newMerchant
            });
        }

        // Updates the given merchant
        function merchantUpdate(updatedMerchant) {
            var url = getBaseURL() + "Merchant/Update";
            return $http({
                method: "POST",
                url: url,
                data: updatedMerchant
            });
        }

        // Deletes a given Merchant
        function merchantDelete(merchantID) {
            var url = getBaseURL() + "Merchant/" + merchantID;
            return $http.delete(url);
        }

        // Gets list of merchant users by the merchantID
        function merchantUserGetListByMerchant(merchantID) {
            var url = getBaseURL() + "MerchantUsers/List/" + merchantID;
            return $http.get(url);
        }

        // Creates a new link between a Merchant and a User
        function merchantUserAddNew(merchantUser) {
            var url = getBaseURL() + "MerchantUsers";
            return $http({
                method: "POST",
                url: url,
                data: merchantUser
            });
        }

        // Gets the details of a MerchantUser by a given merchantID and userID
        function merchantUserGetDetails(merchantID, userID) {
            var url = getBaseURL() + "MerchantUsers/" + merchantID + "/" + userID;
            return $http.get(url);
        }

        // Removes the link between a Merchant and a User by a given merchantID and userID
        function merchantUserDelete(merchantUser) {
            var url = getBaseURL() + "MerchantUsers/" + merchantUser.MerchantID + "/" + merchantUser.UserID;
            return $http.delete(url);
        }

        // Creates a new link between a Merchant and a Survey by a given merchantSurvey
        function merchantSurveyAddNew(merchantSurvey) {
            var url = getBaseURL() + "MerchantSurveys";
            return $http({
                method: "POST",
                url: url,
                data: merchantSurvey
            });
        }

        // Gets the details of a MerchantSurvey buy a given merchantID and surveyID
        function merchantSurveyGetDetails(merchantID, surveyID) {
            var url = getBaseURL() + "MerchantSurveys/" + merchantID + "/" + surveyID;
            return $http({
                method: "POST",
                url: url
            });
        }

        // Removes the link between a Merchant and a Survey by a given merchantID and surveyID
        function merchantSurveyDelete(merchantSurvey) {
            var url = getBaseURL() + "MerchantSurveys/" + merchantSurvey.MerchantID + "/" + merchantSurvey.SurveyID;
            return $http.delete(url);
        }

        // Gets the list of a MerchantSurveys by a given surveyID
        function merchantSurveyGetListBySurvey(surveyID) {
            var url = getBaseURL() + "MerchantSurveys/BySurvey/" + surveyID;
            return $http.get(url);
        }

        // Create New Full Account with Admin Login
        function merchantCreateNewFullAccountWithAdminLogin(merchant) {
            var url = getBaseURL() + "Merchant/NewFullAccount";
            return $http({
                method: "POST",
                url: url,
                data: merchant
            });
        }



        /*****----- SCHOOL -----*****/
        // Creates a new school and saves it
        function schoolAddNew(newSchool) {
            var url = getBaseURL() + "Schools";
            return $http({
                method: "POST",
                url: url,
                data: newSchool
            });
        }

        // Bulk save of many schools
        function schoolAddNewBulk(newSchools) {
            var url = getBaseURL() + "Schools/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: newSchools
            });
        }

        // Updates a given school
        function schoolUpdate(updatedSchool) {
            var url = getBaseURL() + "Schools/Update";
            return $http({
                method: "POST",
                url: url,
                data: updatedSchool
            });
        }

        // Gets the list of available schools for the currently logged in user
        function schoolGetListForUser() {
            var url = getBaseURL() + "Schools/Current";
            return $http.get(url);
        }

        // Gets the list of available schools for the currently logged in user
        function schoolGetListForMerchant(merchantID) {
            var url = getBaseURL() + "Schools/List/ByMerchant/" + merchantID;
            return $http.get(url);
        }
        function GetFacultyListForMerchant(merchantID) {
            var url = getBaseURL() + "Teachers/List/Merchant/" + merchantID;
            return $http.get(url);
        }
        // Gets the details of a School by a given schoolID
        function schoolGetDetails(schoolID) {
            var url = getBaseURL() + "Schools/" + schoolID;
            return $http.get(url);
        }

        // Deletes a School by a given schoolID
        function schoolDelete(schoolID) {
            var url = getBaseURL() + "Schools/" + schoolID;
            return $http.delete(url);
        }

        // Gets list of school surveys by the survey id
        function schoolSurveyGetListBySurvey(surveyID) {
            var url = getBaseURL() + "Schools/Survey/BySurvey/" + surveyID;
            return $http.get(url);
        }

        function schoolSurveyAddNew(schoolSurvey) {
            var url = getBaseURL() + "Schools/Survey";
            return $http({
                method: "POST",
                url: url,
                data: schoolSurvey
            });
        }

        function schoolSurveyDelete(schoolSurvey) {
            var url = getBaseURL() + "Schools/Survey?schoolID=" + schoolSurvey.SchoolID + "&surveyID=" + schoolSurvey.SurveyID;
                                    
            return $http.delete(url);
        }

        /*****----- TEACHER -----*****/
        // Returns the complete list of teachers that a given user has access to
        // DON'T USE THIS!!! Get teachers by merchantgetip
        function getTeachersForCurrentUser() {
            var url = getBaseURL() + "Teachers/Current";
            return $http.get(url);
        }
        // Returns the complete list of teachers that are available for a district
        function teacherGetListByMerchant(merchantID) {
            var url = getBaseURL() + "Teachers/List/Merchant/" + merchantID;
            return $http.get(url);
        }        
        // Returns the complete list of teachers that are available for a school
        function teacherGetListBySchool(schoolID) {
            var url = getBaseURL() + "Teachers/List/BySchool/" + schoolID;
            return $http.get(url);
        }
        function teacherGetListByClass(classID) {
            var url = getBaseURL() + "Teachers/List/ByClass/" + classID;
            return $http.get(url);
        }
        // returns a list of teachers that are available for a given survey
        function getTeachersBySurvey(surveyID) {
            var url = getBaseURL() + "Teachers/Current/" + surveyID;
            return $http.get(url);
        }
        // Gets the details of a requested teacher
        function teacherGetDetails(teacherID) {
            var url = getBaseURL() + "Teachers/" + teacherID;
            return $http.get(url);
        }

        // Creates a new Teacher and saves it
        function teacherAddNew(newTeacher) {
            var url = getBaseURL() + "Teachers";
            return $http({
                method: "POST",
                url: url,
                data: newTeacher
            });
        }

        // Updates a given teacher
        function teacherUpdate(updatedTeacher) {
            var url = getBaseURL() + "Teachers/Update";
            return $http({
                method: "POST",
                url: url,
                data: updatedTeacher
            });
        }

        // Deletes a given teacher
        function teacherDelete(teacherID) {
            var url = getBaseURL() + "Teachers/" + teacherID;
            return $http.delete(url);
        }

        // Bulk upload of new teachers
        function teacherBulkAddNew(teachers) {
            var url = getBaseURL() + "Teachers/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: teachers
            });
        }

        // Add bulk Teacher Classes
        function teacherClassAddNewBulk(teacherClasses) {
            var url = getBaseURL() + "TeacherClass/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: teacherClasses
            });
        }

        // Add a new Teacher Class
        function teacherClassAddNew(teacherClass) {
            var url = getBaseURL() + "TeacherClass";
            return $http({
                method: "POST",
                url: url,
                data: teacherClass
            });
        }

        // Returns TeacherClasses by TeacherID
        function teacherClassGetListByTeacher(teacherID) {
            var url = getBaseURL() + "TeacherClass/ByTeacher/" + teacherID;
            return $http.get(url);
        }

        // Returns TeacherClasses by ClassID
        function teacherClassGetListByClass(classID) {
            var url = getBaseURL() + "TeacherClass/ByClass/" + classID;
            return $http.get(url);
        }

        // Deletes a teacher class
        function teacherClassDelete(teacherID, classID) {
            var url = getBaseURL() + "TeacherClass?teacherID=" + teacherID + "&classID=" + classID;
            return $http.delete(url);
        }




        /*****----- MERCHANT SETTINGS -----*****/

        // Post New Merchant Settings
        function createMerchantSetting(merchantSetting) {
            var url = getBaseURL() + "/MerchantSettings";
            return $http({
                method: "POST",
                url: url,
                data: merchantSetting
            });
        }

        // Update Merchant Settings
        function updateMerchantSetting(merchantSetting) {
            var url = getBaseURL() + "MerchantSettings/Update";
            return $http({
                method: "POST",
                url: url,
                data: merchantSetting
            });
        }

        // Get value of a specific Merchant Setting
        function getMerchantSettingValue(merchantID, keyName, valueName) {
            var url = getBaseURL() + "MerchantSettings/Details?merchantID=" + merchantID + "&keyName=" + keyName + "&valueName=" + valueName;
            return $http.get(url);
        }

        // Get a list of Merchant Settings by MerchantID
        function getMerchantSettings(merchantID) {
            var url = getBaseURL() + "MerchantSettings?merchantID=" + merchantID;
            return $http.get(url);
        }

        // Delete a  Merchant Setting
        function deleteMerchantSettingDetails(merchantID) {
            var url = getBaseURL() + "MerchantSettings?merchantID=" + merchantID + "&keyName=" + keyName + "&valueName=" + valueName;
            return $http.delete(url);
        }


        /*****----- ROLES -----*****/

        // Adds a new role
        function rolesAddNew(newRole) {
            var url = getBaseURL() + "Roles";
            return $http({
                method: "POST",
                url: url,
                data: newRole
            });
        }

        // Updates a role
        function rolesUpdate(updatedRole) {
            var url = getBaseURL() + "Roles/Update";
            return $http({
                method: "POST",
                url: url,
                data: updatedRole
            });
        }

        // Gets role with details
        function rolesGetDetails(roleID) {
            var url = getBaseURL() + "Roles/" + roleID;
            return $http.get(url);
        }

        // Gets role with details and rights
        function rolesGetDetailsWithRights(roleID) {
            var url = getBaseURL() + "Roles/" + roleID + "/WithRights";
            return $http.get(url);
        }

        // Gets list of roles for a merchant
        function rolesGetListForMerchant(merchantID) {
            var url = getBaseURL() + "Roles/Merchant/" + merchantID;
            return $http.get(url);
        }

        // Gets list of roles for a merchant with rights
        function rolesGetListForMerchantWithRights() {
            var url = getBaseURL() + "Roles/Merchant/WithRights";
            return $http.get(url);
        }

        // Gets a list roles for the current user
        function rolesGetListForCurrentUser() {
            var url = getBaseURL() + "Roles/Current";
            return $http.get(url);
        }

        // Gets a list roles for the current user with the rights
        function rolesGetListForCurrentUserWithRights() {
            var url = getBaseURL() + "Roles/Current/WithRights";
            return $http.get(url);
        }

        // Gets a list of roles for a given user
        function rolesGetListForUser(userID) {
            var url = getBaseURL() + "Roles/User/" + userID;
            return $http.get(url);
        }

        // Gets a list of roles for a given user with rights
        function rolesGetListForUserWithRights(userID) {
            var url = getBaseURL() + "Roles/User/" + userID + "/WithRights";
            return $http.get(url);
        }

        // Deletes a role
        function rolesDelete(roleID) {
            var url = getBaseURL() + "Roles/" + roleID;
            return $http.delete(url);
        }

        // Adds a new right to a role
        function roleRightsAddNewBulk(roleRights) {
            var url = getBaseURL() + "RoleRights/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: roleRights
            });
        }

        // Adds a new right to a role
        function roleRightsAddNew(roleRight) {
            var url = getBaseURL() + "RoleRights";
            return $http({
                method: "POST",
                url: url,
                data: roleRight
            });
        }

        // Deletes a given role's given right
        function roleRightsDelete(roleID, rightID) {
            var url = getBaseURL() + "RoleRights/" + roleID + "/" + rightID;
            return $http.delete(url);
        }

        // Gets a given role's given right's details
        function roleRightsGetDetails(roleID, rightID) {
            var url = getBaseURL() + "RoleRights/" + roleID + "/" + rightID;
            return $http.get(url);
        }

        // Gets user roles by role id
        function userRolesGetListbyRole(roleID) {
            var url = getBaseURL() + "UserRoles/ByRole/" + roleID;
            return $http.get(url);
        }


        /*****----- ROLES -----*****/

        // Adds a new right
        function rightsAddNew(newRight) {
            var url = getBaseURL() + "Rights";
            return $http({
                method: "POST",
                url: url,
                data: newRight
            });
        }

        // Updates a right
        function rightsUpdate(updatedRight) {
            var url = getBaseURL() + "Rights/Update";
            return $http({
                method: "POST",
                url: url,
                data: updatedRight
            });
        }

        // Gets the details of a right
        function rightsGetDetails(rightID) {
            var url = getBaseURL() + "Rights/" + rightID;
            return $http.get(url);
        }

        // Gets the full list of rights
        function rightsGetFullList() {
            var url = getBaseURL() + "Rights";
            return $http.get(url);
        }

        // Deletes a right based on the rightID
        function rightsDelete(rightID) {
            var url = getBaseURL() + "Rights/" + rightID;
            return $http.get(url);
        }



        //*****----- CLASS -----*****//

        // Returns a full list of classes
        // DO NOT USE
        function classGetListForUser() {
            var url = getBaseURL() + "Classes/Current";
            return $http.get(url);
        }

        // Returns a full list of classes based on the Merchant
        function classGetListForSchool(schoolID) {
            var url = getBaseURL() + "Classes/List/BySchool/" + schoolID;
            return $http.get(url);
        }

        // Gets the details of a Class by a given classID
        function classGetDetails(classID) {
            var url = getBaseURL() + "Classes/" + classID;
            return $http.get(url);
        }

        // Creates a new class
        function classAddNew(newClass) {
            var url = getBaseURL() + "Classes";
            return $http({
                method: "POST",
                url: url,
                data: newClass
            });
        }

        // Bulk upload for classes
        function classAddNewBulk(newClasses) {
            var url = getBaseURL() + "Classes/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: newClasses
            });
        }

        // Updates the given class
        function classUpdate(updatedClass) {
            var url = getBaseURL() + "Classes/Update";
            return $http({
                method: "POST",
                url: url,
                data: updatedClass
            });
        }

        // Deletes the given class
        function classDelete(classID) {
            var url = getBaseURL() + "Classes/" + classID;
            return $http.delete(url);
        }

        // Creates a new ClassGrade
        function classGradeAddNew(classGrade) {
            var url = getBaseURL() + "ClassGrades";
            return $http({
                method: "POST",
                url: url,
                data: classGrade
            });
        }

        // Creates a lot of new ClassGrades
        function classGradeAddNewBulk(classGrades) {
            var url = getBaseURL() + "ClassGrades/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: classGrades
            });
        }

        // Gets the details of a ClassGrade by a given classID and gradeID
        function classGradeGetDetails(classID, gradeID) {
            var url = getBaseURL() + "ClassGrades/" + classID + "/" + gradeID;
            return $http.get(url);
        }

        // Deletes a ClassGrade by a given classID and gradeID
        function classGradeDelete(classID, gradeID) {
            var url = getBaseURL() + "ClassGrades/DeleteGrade/" + classID;
            return $http.delete(url);
        }

        // Gets a list of Grades for a Class by a given classID
        function classGradeGetListForClass(classID) {
            var url = getBaseURL() + "ClassGrades/ByClass/" + classID;
            return $http.get(url);
        }

        // Creates a link between a class and a student
        function classStudentAddNew(classStudent) {
            var url = getBaseURL() + "ClassStudents";
            return $http({
                method: "POST",
                url: url,
                data: classStudent
            });
        }

        // Creates multiple links between classes and students
        function classStudentAddNewBulk(classStudents) {
            var url = getBaseURL() + "ClassStudents/Bulk";
            return $http({
                method: "POST",
                url: url,
                data: classStudents
            });
        }

        // Gets the details of a link between a class and a student (See if the link exists)
        function classStudentGetDetails(classID, studentID) {
            var url = getBaseURL() + "ClassStudents/" + classID + "/" + studentID;
            return $http.get(url);
        }

        // Gets a list of links between classes and students by a given classID
        function classStudentGetListByClass(classID) {
            var url = getBaseURL() + "ClassStudents/ByClass/" + classID;
            return $http.get(url);
        }

        // Gets a list of links between classes and students by a given studentID
        function classStudentGetListByStudent(studentID) {
            var url = getBaseURL() + "ClassStudents/ByStudent/" + studentID;
            return $http.get(url);
        }

        // Removes a link between a class and a student
        function classStudentDelete(classID, studentID) {
            var url = getBaseURL() + "ClassStudents/" + classID + "/" + studentID;
            return $http.delete(url);
        }



        //*****----- GRADES -----*****//

        // Gets all of the grades
        function GradeGetAll() {
            var url = getBaseURL() + "Grade/All";
            return $http.get(url);
        }

        // Gets the details of a Grade by a given gradeID
        function GradeGetDetails(gradeID) {
            var url = getBaseURL() + "Grade/" + gradeID;
            return $http.get(url);
        }

        // Creates a new Grade and saves it
        function GradeAddNew(newGrade) {
            var url = getBaseURL() + "Grade";
           // return $http.post(url);
            return $http({
                method: "POST",
                url: url,
                data:newGrade
            });
        }

        // Updates a given Grade
        function GradeUpdate(updatedGrade) {
            var url = getBaseURL() + "Grade/Update";
            return $http({
                method: "POST",
                url: url,
                data: updatedGrade
            });
        }

        // Deletes a given Grade
        function GradeDelete(gradeID) {
            var url = getBaseURL() + "Grade/" + gradeID;
            return $http.delete(url);
        }


        //*****----- SURVEY -----*****//
        // Returns a list of available surveys for the user
        function getSurveyListForUser() {
            var url = getBaseURL() + "Surveys/CurrentUser";
            return $http.get(url); 
        }

        // Returns a list of all surveys
        function getAllSurveys() {
            var url = getBaseURL() + "Surveys/All";
            return $http.get(url); 
        }

        // Returns a list of Teacher Evaluation Surveys available for the user
        function getTESurveyListForUser() {
            var url = getBaseURL() + "Surveys/CurrentUser/TE";
            return $http.get(url);
        }

        // Returns a list of Special Education Surveys available for the user
        function getSESurveyListForUser() {
            var url = getBaseURL() + "Surveys/CurrentUser/SE";
            return $http.get(url);
        }

        // Adds a new Survey Variables
        function surveyVariableAddNew(surveyVariable) {
            var url = getBaseURL() + "Surveys/SurveyVariables";
            return $http({
                method: "POST",
                url: url,
                data: surveyVariable
            });
        }

        // Adds a new Survey Detail
        function surveyDetailAddNew(surveyDetail) {
            var url = getBaseURL() + "Surveys/SurveyDetails";
            return $http({
                method: "POST",
                url: url,
                data: surveyDetail
            });
        }

        // Adds a new Survey Detail
        function surveyDetailDelete(surveyDetail) {
            var url = getBaseURL() + "surveys/SurveyDetails/" + surveyDetail.SurveyID + "/" + surveyDetail.SurveyTypeID;
            return $http.delete(url);
        }

        // returns the pre-survey survey data
        function getSurveyVariables(surveyID, variableMode) {
            var url = getBaseURL() + "Surveys/Current/" + surveyID + "/" + variableMode + "/Variables";//M0014
            return $http.get(url);
        }

        // Posts the survey variables
        function getSurveyVariablesFiltered(pssa, variableMode) { //M0014
            var url = getBaseURL() + "Surveys/Current/Variables";
            return $http({
                method: "POST",
                url: url,
                data: { pssa: pssa, variableMode: variableMode }
            });
        }

        // returns the survey type
        function surveyDetailGetListBySurvey(surveyID) {
            var url = getBaseURL() + "surveys/SurveyDetails/" + surveyID;
            return $http.get(url);
        }

        // returns the pre-survey survey questions
        function surveyVariableGetListForSurvey(surveyID, variableMode) {//M0014
            var url = getBaseURL() + "Surveys/SurveyVariables/" + surveyID + "/" + variableMode;
            return $http.get(url);
        }

        // Gets the survey summary by a given voter id
        function getSummaryGuid(voterID) {
            var url = getBaseURL() + "Surveys/Current/Summary/" + voterID;
            return $http.get(url);
        }

        // Gets the survey types
        function surveyTypeGetBaseList() {
            var url = getBaseURL() + "Surveys/SurveyTypes";
            return $http.get(url);
        }

        // Delete's a survey variable (aka Pre-Survey Survey Question)
        function surveyVariableDelete(surveyID, displayOrder) {
            var url = getBaseURL() + "Surveys/SurveyVariables/" + surveyID + "/" + displayOrder;
            return $http.delete(url);
        }



        //*****----- NSURVEY -----*****//
        // Add new Survey Form
        function createSurveyForm(SurveyTitle,merchantid,type) {
            var url = getBaseURL() + "NSurvey/Survey/" + SurveyTitle + "/" + merchantid + "/" + type;
            // return $http.post(url, '"' + SurveyTitle + '"');
            return $http.post(url);
        }

        function uploadXMLSurvey(formdata,merchantID,Type) {
            var url = getBaseURL() + "NSurvey/Import/" + merchantID + "/" + Type;
            return $http.post(url, formdata, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            });
        }
        function ArchiveSurvey(merchantid, surveyid) {
            var url = getBaseURL() + "NSurvey/Archive/" + merchantid + "/" + surveyid;            
            return $http.post(url);
        }
		function CloneSurvey(merchantid, surveyid,type) {
            var url = getBaseURL() + "NSurvey/CloneSurvey/" + merchantid + "/" + surveyid+"/" +type;
            return $http.post(url);
        }
		
		function CloneSurveyByName(merchantid, surveyname, surveytitle, type) {
            var url = getBaseURL() + "NSurvey/CloneSurveyByName/" + merchantid + "/" + surveyname + "/" + surveytitle + "/" + type;
            return $http.post(url);
        }		
        function getLanguageList(SurveyID) {
            var url = getBaseURL() + "NSurvey/Language/" + SurveyID;
            return $http.get(url);
        }

        function getQuestionList(SurveyID, LanguageCode) {
            var url = getBaseURL() + "NSurvey/SurveyQuestion/" + SurveyID + "/" + LanguageCode;
            return $http.get(url);
        }

        function getSurveyPageCount(SurveyID) {
            var url = getBaseURL() + "NSurvey/PageCount/" + SurveyID;
            return $http.get(url);
        }
		
		//START NILESH-TSK3.0
        function surveyChangeActiveStatus(SurveyId, ActiveStatus)
        {
            var url = getBaseURL() + "NSurvey/SurveyChangeActiveStatus?SurveyId=" + SurveyId + "&ActiveStatus=" + ActiveStatus;
            return $http.get(url);
        }
        //END NILESH-TSK3.0


        //----------------Business-----------------------
        function getSurveysForUser() {
            var url = getBaseURL() + "Surveys/CurrentUser";
            return $http.get(url);
        }
        function getSurveyListByListName(listName) {
            var url = getBaseURL() + "Surveys/CurrentUser" + (listName ? "?listName=" + listName : "");
            return $http.get(url);
        }
		function UserByParam(merchantid,str) {
            var url = getBaseURL() + "Surveys/UserByParam/" + merchantid+"/"+str;
            return $http.get(url);
        }       
		function surveyTypeGetList(merchantID) {
            var url = getBaseURL() + "Surveys/GetSurveyTypeByMerchant/" + merchantID;
            return $http.get(url);
        }
        function setSurveyFormTypeTitle(merchantID, survey) {
            var url = getBaseURL() + "Surveys/SetSurveyTypeTitleByMerchant/" + merchantID;
            return $http({
                method: "POST",
                url: url,
                data: survey
            });            
        }
        function addSurveyFormType(merchantID, survey) {
            var url = getBaseURL() + "Surveys/AddSurveyFormType/" + merchantID;
            return $http({
                method: "POST",
                url: url,
                data: survey
            });
        }
		function getSurveyListByListID(listID) {
            var url = getBaseURL() + "Surveys/CurrentUser/" + listID;
            return $http.get(url);
        }
		function deleteSurveyType(ID) {
            var url = getBaseURL() + "Surveys/DeleteSurveyFormType/" + ID;
            return $http.delete(url);
        }
    }

})();