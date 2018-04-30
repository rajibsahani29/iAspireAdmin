(function () {
    "use strict";
    angular
        .module("iAspireApp")
        .directive("surveyform", [surveyForm])
        .controller("FormEditorController", ["$scope", "DataService", "SMAAlertFactory", "ProjectConstants", "$routeParams", formEditorController]);

 
    function surveyForm() {
        return {
            restrict: 'A',
            scope: {
                'survey': '='
            },
            template: '',
            link: function (scope, element, attrs) {
                console.log("ssss", scope.survey)
                var currentPage = 1, previousDisplayOrder = 0, totalPages = 0;

                var questionsContainer = angular.element('<table/>');
                questionsContainer.attr("style","width:100%");

                var questionTable = angular.element('<table/>');
                questionTable.attr("class", "questionBuilder");

                var pageBreakRow = BuildRow(null);
                questionTable.append(pageBreakRow);

                    //angular.forEach(scope.survey, function (question, index) {
                    //    while (question.PageNumber > currentPage) {

                    //    }
                    //    if (question.PageNumber == currentPage) {
                    //        AddQuestionWebControl(questionTable, question);
                    //        previousDisplayOrder = question.DisplayOrder;
                    //    }

                    //},[]);

                


            }
        };
        /*
        function AddQuestionWebControl(questionTable, question) {
            QuestionItem questionWebControl = QuestionItemFactory.Create(question, LanguagesDropdownlist.SelectedValue, this.UniqueID, 0, null, true, true);

            // Set question's style
            // and bind the data
            Style questionStyle = new Style();
            questionStyle.CssClass = "surveyQuestion";

            Style answerStyle = new Style();
            answerStyle.CssClass = "surveyAnswer";


            if (questionWebControl is ActiveQuestion)
            {
                ((ActiveQuestion)questionWebControl).EnableClientSideValidation = false;
                ((ActiveQuestion)questionWebControl).EnableServerSideValidation = false;
                ((ActiveQuestion)questionWebControl).ValidationMarkStyle.CssClass = "icon-warning-sign"; //GB
            }
            if (questionWebControl is SectionQuestion)
            {
                ((SectionQuestion)questionWebControl).SectionOptionStyle.CssClass = "questionOptions";
                ((SectionQuestion)questionWebControl).ValidationMarkStyle.CssClass = "icon-warning-sign"; //GB
            }
            
            if (questionWebControl is MatrixQuestion)
            {
                ((MatrixQuestion)questionWebControl).MatrixHeaderStyle = answerStyle;
                ((MatrixQuestion)questionWebControl).MatrixItemStyle = answerStyle;
                ((MatrixQuestion)questionWebControl).MatrixAlternatingItemStyle = answerStyle;
                ((MatrixQuestion)questionWebControl).ValidationMarkStyle.CssClass = "icon-warning-sign"; //GB
            }

            questionWebControl.RenderMode = ControlRenderMode.ReadOnly;
            questionWebControl.AnswerStyle = answerStyle;
            questionWebControl.QuestionStyle = questionStyle;
   

            questions.Add(questionWebControl);

            // Add the question and its options to the table
            questionTable.Rows.Add(BuildQuestionOptionsRow(question));

            if (questionWebControl is MatrixQuestion)
            {
                // questionWebControl.Width = new Unit(400.0,UnitType.Pixel);
                questionTable.Rows.Add(BuildRow(questionWebControl));
            }
        else{
            questionTable.Rows.Add(BuildRow(questionWebControl));
            }
                
        }
        */
        function BuildRow(child)
        {

            var row = angular.element('<tr/>');
            var cell = angular.element('<td/>');
            if (child != undefined && child != null)
            {
                cell.append(child);
            }
            row.append(cell);
            return row;
        }

    }
    function formEditorController($scope, DataService, SMAAlert, ProjectConstants, $routeParams) {
        $scope.LanguageList = null;

        var formEditC = this;
        formEditC.SurveyID = $routeParams.SurveyID;
        formEditC.SurveyInfo = getSurveyObject();

        populateSurveyBuilder();

        return formEditC;
        function getSurveyObject() {
            return {
                SelectedLanguage: null,
                QuestionList: [],
                PageCount: 0,
            };
        }

        function populateSurveyBuilder() {
            //formEditC.SurveyInfo = getSurveyObject();
            var blnLanguage = false, blnQuestions = false, blnPageCount = false;
            $scope.spinner = SMAAlert.CreateSpinnerAlert();

            DataService.GetLanguageList(formEditC.SurveyID)
            .success(function (response, status, header, config) {
                $scope.LanguageList = response;
                blnLanguage = true;
                checkAllRequestDone();

                DataService.GetQuestionList(formEditC.SurveyID,null)
               .success(function (response, status, header, config) {
                   formEditC.SurveyInfo.QuestionList = response.questionData.Questions;
                   formEditC.SurveyInfo.QuestionList
                   angular.forEach(formEditC.SurveyInfo.QuestionList, function (question, index) {
                       formEditC.SurveyInfo.QuestionList[index].AnswerHtml = response.AnswerHTML[question.QuestionId];
                   }, []);
                   blnQuestions = true;
                   checkAllRequestDone();
               }).error(function (response, status, header, config) {
                   $scope.spinner.resolve();
                   if (status !== 403) {
                       if (response == null) { response = "" }
                       SMAAlert.CreateInfoAlert("Failed to retrieve Language:<br><br>" + response);
                   }
               });

            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve Language:<br><br>" + response);
                }
            });
             

            DataService.GetSurveyPageCount(formEditC.SurveyID)
            .success(function (response, status, header, config) {
                formEditC.SurveyInfo.PageCount = response;
                blnPageCount = true;
                checkAllRequestDone();
            }).error(function (response, status, header, config) {
                $scope.spinner.resolve();
                if (status !== 403) {
                    if (response == null) { response = "" }
                    SMAAlert.CreateInfoAlert("Failed to retrieve Language:<br><br>" + response);
                }
            });

            function checkAllRequestDone() {
                if (blnLanguage && blnQuestions && blnPageCount)
                {
                    $scope.spinner.resolve();   
                    generateSurveyDesign();
                }
            }

        }


        function generateSurveyDesign() {
            console.log("Language", $scope.LanguageList);
            console.log("Survey", formEditC.SurveyInfo);
            var currentPage = 1, previousDisplayOrder = 0, totalPages = formEditC.SurveyInfo.PageCount;

        }

        
        //////////////// builder Functions //////////////
        function myfunction() {

        }



    }
})();