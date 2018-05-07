webpackJsonp([1,4],{

/***/ 106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_environments_environment__ = __webpack_require__(344);
/* unused harmony export AppSettings */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UrlConfig; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


var AppSettings = (function () {
    function AppSettings() {
    }
    return AppSettings;
}());
var UrlConfig = (function () {
    function UrlConfig(_window) {
        this._window = _window;
        this.API_BASE = "";
        this.WAP_BASE = "";
        this.API_BASE = this._window.location.protocol + "//" + __WEBPACK_IMPORTED_MODULE_1_environments_environment__["a" /* environment */].ApiUrl + __WEBPACK_IMPORTED_MODULE_1_environments_environment__["a" /* environment */].ApiPath;
        this.WAP_BASE = this._window.location.protocol + "//" + __WEBPACK_IMPORTED_MODULE_1_environments_environment__["a" /* environment */].WapUrl + __WEBPACK_IMPORTED_MODULE_1_environments_environment__["a" /* environment */].WapPath;
    }
    UrlConfig = __decorate([
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Inject */])(Window)), 
        __metadata('design:paramtypes', [Object])
    ], UrlConfig);
    return UrlConfig;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/app.setting.js.map

/***/ }),

/***/ 337:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_NSurveyXmlData__ = __webpack_require__(537);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_SurveyJSJsonData__ = __webpack_require__(341);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directives_surveyEditor_directive__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_setting__ = __webpack_require__(106);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyEditorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








//import { NotificationsService } from 'angular2-notifications';
var urlSetting = new __WEBPACK_IMPORTED_MODULE_7__app_setting__["a" /* UrlConfig */](window);
var SurveyEditorComponent = (function () {
    //private _notificationsService: NotificationsService, 
    function SurveyEditorComponent(document, activatedRoute, surveyService) {
        this.document = document;
        this.activatedRoute = activatedRoute;
        this.surveyService = surveyService;
        this.surveyData = new __WEBPACK_IMPORTED_MODULE_4__models_SurveyJSJsonData__["a" /* SurveyJSData */]();
        this.isLoading = false;
        this.options = {
            position: ["bottom", "left"],
            timeOut: 5000,
            lastOnBottom: true
        };
        this.lstLayoutCSS = [{ text: '-1', value: '-Select-', selected: true }];
        this.LayoutFormData = this.getDefaultLayoutFormData();
        var tempUrl = document.location.href;
        tempUrl = tempUrl.replace('Survey/', '');
        this.backUrl = tempUrl.substr(0, tempUrl.indexOf('editor/')) + "form";
        console.log("backUrl", this.backUrl);
    }
    SurveyEditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (params) {
            _this.surveyID = params['surveyID'];
        });
        this.getSurveyXml(this.surveyID);
        // this.getLanguageDetails().then(
        //   (data) => { console.log(data); },
        //   (err) => { console.log(err); }
        // );
    };
    SurveyEditorComponent.prototype.getDefaultLayoutFormData = function () {
        this.UploadFileContent = null;
        return {
            LayoutCss: "-1",
            EditCss: '',
            HeaderTemplate: '',
            FooterTemplate: '',
            isEditCss: false,
            ErrorMessage: '',
            ErrorMessageUpload: '',
            SuccessMessage: '',
            SuccessUploadMessage: '',
        };
    };
    SurveyEditorComponent.prototype.resetDefaultLayoutFormData = function () {
        this.UploadFileContent = null;
        this.selectedFile.nativeElement.value = "";
        if (this.LayoutFormData) {
            this.LayoutFormData.EditCss = '';
            this.LayoutFormData.isEditCss = false;
            this.LayoutFormData.ErrorMessage = '';
            this.LayoutFormData.ErrorMessageUpload = '';
            this.LayoutFormData.SuccessMessage = '';
            this.LayoutFormData.SuccessUploadMessage = '';
        }
    };
    SurveyEditorComponent.prototype.getSurveyXml = function (SurveyID) {
        var _this = this;
        this.isLoading = true;
        var nSurveyJson = new __WEBPACK_IMPORTED_MODULE_3__models_NSurveyXmlData__["a" /* NSurveyXmlData */]();
        this.surveyService.getSurveyXml(SurveyID).then(function (xmlData) {
            if (xmlData != undefined) {
                _this.getSurveyDetails(nSurveyJson, xmlData);
            }
            else {
                alert("No Data Found");
            }
        }, function (err) {
            _this.isLoading = false;
            _this.showError(err);
        });
    };
    SurveyEditorComponent.prototype.getSurveyDetails = function (nSurveyJson, xmlData) {
        var _this = this;
        this.surveyService.getSurveyDetails(this.surveyID).then(function (data) {
            _this.isLoading = false;
            console.log(data.json());
            _this.SurveyGuid = data.json();
            var strSurveyGuid = data.json();
            nSurveyJson.loadData(xmlData);
            if (!nSurveyJson.survey) {
                nSurveyJson.survey = {};
            }
            else if (!nSurveyJson.survey.question) {
                nSurveyJson.survey.question = [];
            }
            nSurveyJson.survey.question.sort(function (a, b) { return Number(a._DisplayOrder) - Number(b._DisplayOrder); });
            nSurveyJson.survey.SurveyID = _this.surveyID;
            _this.surveyData.loadNSurvey(nSurveyJson);
            _this.surveyData.SurveyJson.SurveyGUID = strSurveyGuid;
            _this.json = _this.surveyData.SurveyJson;
            _this.surveyTitle = nSurveyJson.survey.Title;
            console.log("nSurveyJson", nSurveyJson);
            console.log("SurveyJson", _this.surveyData);
        }, function (err) {
            _this.isLoading = false;
            _this.showError(err);
        });
    };
    SurveyEditorComponent.prototype.questionAdded = function (question) {
        var _this = this;
        console.log("Add Question", question);
        var objQuestion = question.nquestion;
        objQuestion.SurveyID = this.surveyID;
        console.log("objQuestion", objQuestion);
        //if (objQuestion.Answer.length > 0 || objQuestion.SelectionModeId > 0) 
        {
            this.isLoading = true;
            this.surveyService.createQuestion(objQuestion).then(function (data) {
                _this.isLoading = false;
                if (data.status == 200) {
                    _this.updateReturnValueAfterAddEdit(question, data);
                }
                else {
                    alert("Error adding new question");
                }
            }, function (err) {
                _this.isLoading = false;
                _this.showError(err);
            });
        }
    };
    SurveyEditorComponent.prototype.questionModified = function (question) {
        var _this = this;
        console.log("Update Question", question);
        var objQuestion = question.nquestion;
        objQuestion.SurveyID = this.surveyID;
        //if (objQuestion.Answer.length > 0 || objQuestion.SelectionModeId > 0) 
        {
            this.isLoading = true;
            this.surveyService.updateQuestion(objQuestion).then(function (data) {
                _this.isLoading = false;
                if (data.status == 200) {
                    _this.updateReturnValueAfterAddEdit(question, data);
                }
                else {
                    alert("Error adding new question");
                }
            }, function (err) {
                _this.showError(err);
            });
        }
    };
    SurveyEditorComponent.prototype.updateReturnValueAfterAddEdit = function (question, data) {
        var surveyQuestion = question.SurveyElement;
        var retValue = data.json();
        if (retValue.Answer && retValue.Answer.length > 0) {
            var index = retValue.Answer.length - 1;
            while (index >= 0) {
                if (retValue.Answer[index]._OprationType === 'delete') {
                    retValue.Answer.splice(index, 1);
                }
                else {
                    retValue.Answer[index]._OprationType = "";
                }
                index -= 1;
            }
        }
        if (retValue.Rows && retValue.Rows.length > 0) {
            var index = retValue.Rows.length - 1;
            while (index >= 0) {
                if (retValue.Rows[index]._OprationType === 'delete') {
                    retValue.Rows.splice(index, 1);
                }
                else {
                    retValue.Rows[index]._OprationType = "";
                }
                index -= 1;
            }
            if (retValue.Rows.length == surveyQuestion.rows.length) {
                surveyQuestion.rows.forEach(function (rw, idx) {
                    rw.rowid = retValue.Rows[idx].RowId;
                });
            }
        }
        if (retValue.Columns && retValue.Columns.length > 0) {
            var index = retValue.Columns.length - 1;
            while (index >= 0) {
                if (retValue.Columns[index]._OprationType === 'delete') {
                    retValue.Columns.splice(index, 1);
                }
                else {
                    retValue.Columns[index]._OprationType = "";
                }
                index -= 1;
            }
            if (retValue.Columns.length == surveyQuestion.columns.length) {
                surveyQuestion.columns.forEach(function (rw, idx) {
                    rw.columnid = retValue.Columns[idx].ColumnId;
                });
            }
        }
        if (question.choices && question.choices.length > 0) {
            // FOR CHOICE TYPE QUESTION
            if (surveyQuestion.choices.length <= retValue.Answer.length) {
                surveyQuestion.choices.forEach(function (rw, idx) {
                    rw.rowid = retValue.Answer[idx].AnswerId;
                });
            }
        }
        else {
        }
        //question.choices
        question.nquestion.QuestionID = retValue.QuestionID;
        question.nquestion.Answer = retValue.Answer;
        question.nquestion.Rows = retValue.Rows;
        question.nquestion.Columns = retValue.Columns;
        question.questionid = retValue.QuestionID;
        question.SurveyElement.questionid = retValue.QuestionID;
        console.log("Updated", question.nquestion);
    };
    SurveyEditorComponent.prototype.questionOrderChanged = function (question) {
        var _this = this;
        var nQue = question.nquestion;
        console.log("nQue", nQue);
        this.isLoading = true;
        this.surveyService.changeQuestionDisplayOrder(nQue.QuestionID, nQue.DisplayOrder).then(function (data) {
            _this.isLoading = false;
            //alert("Added" + data);
        }, function (err) {
            _this.isLoading = false;
            _this.showError(err);
        });
    };
    SurveyEditorComponent.prototype.questionDeleted = function (question) {
        var _this = this;
        console.log(question);
        var QuestionId = question.questionid ? question.questionid : 0;
        if (QuestionId > 0) {
            this.isLoading = true;
            this.surveyService.deleteQuestion(QuestionId).then(function (data) {
                _this.isLoading = false;
                ///alert("delete")
            }, function (err) {
                _this.showError(err);
            });
        }
    };
    SurveyEditorComponent.prototype.surveySaved = function (survey) {
        this.json = survey;
    };
    SurveyEditorComponent.prototype.saveSurveyDetails = function (surveyDetails) {
        var _this = this;
        if (surveyDetails.SurveyId > 0 && surveyDetails.Title.length > 0) {
            this.isLoading = true;
            this.surveyService.updateSurveyDetails(surveyDetails).then(function (data) {
                _this.isLoading = false;
                _this.surveyTitle = surveyDetails.Title;
            }, function (err) {
                _this.showError(err);
            });
        }
        else {
            alert("Please enter survey title.");
        }
    };
    SurveyEditorComponent.prototype.LayoutButton_Click = function (data) {
        //this.LayoutFormData = this.getDefaultLayoutFormData();
        this.resetDefaultLayoutFormData();
        this.getLayoutData();
    };
    SurveyEditorComponent.prototype.getLayoutData = function () {
        var _this = this;
        this.isLoading = true;
        this.surveyService.getSurveyTemplateCSS(this.surveyID, "").then(function (data) {
            _this.isLoading = false;
            var Responce = data.json();
            _this.lstLayoutCSS = Responce.lstCSSFiles;
            var item = _this.lstLayoutCSS.find(function (t) { return t.selected == true; });
            if (item) {
                _this.LayoutFormData.LayoutCss = item.value;
            }
            $("#modalLayout").modal("show");
        }, function (err) {
            _this.isLoading = false;
            _this.showError(err);
        });
    };
    SurveyEditorComponent.prototype.EditCSS_click = function () {
        /*
        this._notificationsService.success(
          'Some Title',
          'Some Content',
          {
              timeOut: 5000,
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
          }
        )
        */
        var _this = this;
        this.resetDefaultLayoutFormData();
        if (this.LayoutFormData.LayoutCss != "-1") {
            this.isLoading = true;
            this.surveyService.getCSSContent(this.surveyID, this.LayoutFormData.LayoutCss).then(function (data) {
                _this.isLoading = false;
                _this.LayoutFormData.isEditCss = true;
                _this.LayoutFormData.EditCss = data.json().data;
                //console.log(data.json())
            }, function (error) {
                _this.isLoading = false;
                _this.LayoutFormData.EditCss = "";
                _this.showError(error);
            });
        }
        else {
            this.LayoutFormData.EditCss = "";
            this.LayoutFormData.ErrorMessage = "Please select css file.";
        }
    };
    SurveyEditorComponent.prototype.EdirCancel_click = function () {
        this.resetDefaultLayoutFormData();
    };
    SurveyEditorComponent.prototype.SaveEditCSS_click = function () {
        var _this = this;
        if (this.LayoutFormData.LayoutCss != "-1") {
            this.isLoading = true;
            var objSurveyLayout = {
                SurveyId: this.surveyID,
                SelectedFile: this.LayoutFormData.LayoutCss,
                FileContent: this.LayoutFormData.EditCss,
            };
            this.surveyService.saveSurveyCSS(objSurveyLayout).then(function (data) {
                _this.isLoading = false;
                _this.resetDefaultLayoutFormData();
                _this.LayoutFormData.SuccessMessage = "Save Success.!";
            }, function (error) {
                _this.isLoading = false;
                _this.LayoutFormData.EditCss = "";
                _this.LayoutFormData.ErrorMessage = "Something went wrong, Please try again !";
                _this.showError(error);
            });
        }
        else {
            this.LayoutFormData.EditCss = "";
            this.LayoutFormData.ErrorMessage = "No file selected for update.";
        }
    };
    SurveyEditorComponent.prototype.DeleteCSS_click = function () {
        var _this = this;
        if (confirm("Are you sure want to delete ?")) {
            //this.resetDefaultLayoutFormData();
            if (this.LayoutFormData.LayoutCss != "-1") {
                this.isLoading = true;
                this.surveyService.deleteSurveyCSS(this.surveyID, this.LayoutFormData.LayoutCss).then(function (data) {
                    //this.LayoutFormData = this.getDefaultLayoutFormData();
                    _this.resetDefaultLayoutFormData();
                    _this.getLayoutData();
                    _this.LayoutFormData.SuccessMessage = "Delete Success.!";
                }, function (error) {
                    _this.isLoading = false;
                    _this.showError(error);
                });
            }
            else {
                this.LayoutFormData.EditCss = "";
                this.LayoutFormData.ErrorMessage = "Please select css file.";
            }
        }
    };
    SurveyEditorComponent.prototype.DownloadCSS_click = function () {
        var _this = this;
        this.resetDefaultLayoutFormData();
        if (this.LayoutFormData.LayoutCss != "-1") {
            this.isLoading = true;
            this.surveyService.getCSSContent(this.surveyID, this.LayoutFormData.LayoutCss).then(function (data) {
                _this.isLoading = false;
                _this.downloadFile(data.json().data, _this.LayoutFormData.LayoutCss);
            }, function (error) {
                _this.isLoading = false;
                _this.showError(error);
            });
        }
        else {
            this.LayoutFormData.EditCss = "";
            this.LayoutFormData.ErrorMessage = "Please select css file.";
        }
    };
    SurveyEditorComponent.prototype.downloadFile = function (data, fileName) {
        var a = document.createElement("a");
        var blob = new Blob([data], { type: "octet/stream" }), url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        /*
        var blob = new Blob([data], { type: 'text/csv' });
        var url= window.URL.createObjectURL(blob);
        window.open(url);
        */
    };
    SurveyEditorComponent.prototype.onChangeCSS = function (e) {
        this.resetDefaultLayoutFormData();
    };
    SurveyEditorComponent.prototype.SaveLayout_click = function () {
        var _this = this;
        this.LayoutFormData.EditCss = '';
        this.LayoutFormData.isEditCss = false;
        this.isLoading = true;
        var objSurveyLayout = {
            SurveyId: this.surveyID,
            SelectedFile: this.LayoutFormData.LayoutCss,
            HeaderTemplate: this.LayoutFormData.HeaderTemplate,
            FooterTemplate: '',
        };
        this.surveyService.saveSurveyLayout(objSurveyLayout).then(function (data) {
            _this.isLoading = false;
            _this.resetDefaultLayoutFormData();
            _this.LayoutFormData.SuccessMessage = "Save Success.!";
        }, function (error) {
            _this.isLoading = false;
            _this.LayoutFormData.EditCss = "";
            _this.LayoutFormData.ErrorMessage = "Something went wrong, Please try again !";
            _this.showError(error);
        });
    };
    SurveyEditorComponent.prototype.Upload_click = function () {
        var _this = this;
        this.isLoading = true;
        if (this.UploadFileContent && this.UploadFileContent.has("uploadFile")) {
            this.UploadFileContent.append('SurveyId', this.surveyID.toString());
            this.surveyService.uploadSurveyCSS(this.UploadFileContent).then(function (data) {
                //this.LayoutFormData = this.getDefaultLayoutFormData();
                _this.getLayoutData();
                _this.resetDefaultLayoutFormData();
                _this.LayoutFormData.SuccessUploadMessage = "File Upload Success.!";
            }, function (err) {
                _this.isLoading = false;
                //this.showError(err); 
            });
        }
    };
    SurveyEditorComponent.prototype.fileChange = function (event) {
        this.UploadFileContent = new FormData();
        var fileList = event.target.files;
        if (fileList.length > 0) {
            var file = fileList[0];
            this.UploadFileContent.append('uploadFile', file, file.name);
            var headers = new Headers();
        }
    };
    // getLanguageDetails() {
    //   const promise = new Promise((resolve, reject) => {
    //     this.surveyService.getLanguageList(this.surveyID).subscribe(
    //       data => {
    //         resolve(data);
    //       },
    //       error => {
    //         reject(error);
    //       }
    //     )
    //   })
    //   return promise;
    // }
    SurveyEditorComponent.prototype.showError = function (error) {
        if (error.ok == false) {
            if (error.status == 0) {
                alert("Connection Error");
            }
            else {
                alert(error.status + " : " + error.statusText);
            }
        }
        else {
            throw error;
        }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_6__directives_surveyEditor_directive__["a" /* SurveyEditorDirectiveComponent */]), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_6__directives_surveyEditor_directive__["a" /* SurveyEditorDirectiveComponent */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_6__directives_surveyEditor_directive__["a" /* SurveyEditorDirectiveComponent */]) === 'function' && _a) || Object)
    ], SurveyEditorComponent.prototype, "surveyRef", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_5" /* ViewChild */])('fuUploadCSS'), 
        __metadata('design:type', Object)
    ], SurveyEditorComponent.prototype, "selectedFile", void 0);
    SurveyEditorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Component */])({
            selector: 'SurveyJs',
            template: __webpack_require__(707),
            styles: [__webpack_require__(706)],
            encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* ViewEncapsulation */].None,
            providers: [__WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__["a" /* NSurveyService */]]
        }),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["g" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__angular_platform_browser__["c" /* DOCUMENT */])), 
        __metadata('design:paramtypes', [Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__["a" /* NSurveyService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__["a" /* NSurveyService */]) === 'function' && _c) || Object])
    ], SurveyEditorComponent);
    return SurveyEditorComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/surveyeditor.component.js.map

/***/ }),

/***/ 338:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__ = __webpack_require__(343);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyFormComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SurveyFormComponent = (function () {
    function SurveyFormComponent(activatedRoute, surveyService) {
        this.activatedRoute = activatedRoute;
        this.surveyService = surveyService;
        this.json = {
            title: 'Product Feedback Survey Example', showProgressBar: 'top', pages: [
                {
                    questions: [{
                            type: 'matrix',
                            name: 'Quality',
                            title: 'Please indicate if you agree or disagree with the following statements',
                            columns: [{
                                    value: 1,
                                    text: 'Strongly Disagree'
                                },
                                {
                                    value: 2,
                                    text: 'Disagree'
                                },
                                {
                                    value: 3,
                                    text: 'Neutral'
                                },
                                {
                                    value: 4,
                                    text: 'Agree'
                                },
                                {
                                    value: 5,
                                    text: 'Strongly Agree'
                                }
                            ],
                            rows: [{
                                    value: 'affordable',
                                    text: 'Product is affordable'
                                },
                                {
                                    value: 'does what it claims',
                                    text: 'Product does what it claims'
                                },
                                {
                                    value: 'better then others',
                                    text: 'Product is better than other products on the market'
                                },
                                {
                                    value: 'easy to use',
                                    text: 'Product is easy to use'
                                }
                            ]
                        },
                        {
                            type: 'rating',
                            name: 'satisfaction',
                            title: 'How satisfied are you with the Product?',
                            mininumRateDescription: 'Not Satisfied',
                            maximumRateDescription: 'Completely satisfied'
                        },
                        {
                            type: 'rating',
                            name: 'recommend friends',
                            visibleIf: '{satisfaction} > 3',
                            title: 'How likely are you to recommend the Product to a friend or co-worker?',
                            mininumRateDescription: 'Will not recommend',
                            maximumRateDescription: 'I will recommend'
                        },
                        {
                            type: 'comment',
                            name: 'suggestions',
                            title: 'What would make you more satisfied with the Product?',
                        }
                    ]
                }, {
                    questions: [{
                            type: 'radiogroup',
                            name: 'price to competitors',
                            title: 'Compared to our competitors, do you feel the Product is',
                            choices: ['Less expensive', 'Priced about the same', 'More expensive', 'Not sure']
                        },
                        {
                            type: 'radiogroup',
                            name: 'price',
                            title: 'Do you feel our current price is merited by our product?',
                            choices: ['correct|Yes, the price is about right',
                                'low|No, the price is too low for your product',
                                'high|No, the price is too high for your product'
                            ]
                        },
                        {
                            type: 'multipletext',
                            name: 'pricelimit',
                            title: 'What is the... ',
                            items: [{
                                    name: 'mostamount',
                                    title: 'Most amount you would every pay for a product like ours'
                                },
                                {
                                    name: 'leastamount',
                                    title: 'The least amount you would feel comfortable paying'
                                }
                            ]
                        }
                    ]
                }, {
                    questions: [{
                            type: 'text',
                            name: 'email',
                            title: 'Thank you for taking our survey. Please enter your email address, then press the "Submit" button.'
                        }]
                }]
        };
    }
    SurveyFormComponent.prototype.ngOnInit = function () {
        // let nSurveyJson = new NSurveyXmlData();
        // nSurveyJson.loadXml(this.getSurveyXml());
        // console.log(nSurveyJson)
    };
    SurveyFormComponent.prototype.getSurveyXml = function () {
        this.surveyService.getSurveyXml(2132).then(function (data) {
            console.log(data);
        }, function (error) {
            console.log(error);
        });
        return "";
    };
    SurveyFormComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Component */])({
            selector: 'survey-form',
            template: '<survey [json]="json"></survey>',
            styleUrls: [],
            providers: [__WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__["a" /* NSurveyService */]]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__["a" /* NSurveyService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_nsurvey_service__["a" /* NSurveyService */]) === 'function' && _b) || Object])
    ], SurveyFormComponent);
    return SurveyFormComponent;
    var _a, _b;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/surveyform.component.js.map

/***/ }),

/***/ 339:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__ = __webpack_require__(535);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_survey_knockout__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_survey_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__SurveyWidget_ck_editor__ = __webpack_require__(532);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__SurveyWidget_signature_pad__ = __webpack_require__(533);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_setting__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_SurveyJSJsonData__ = __webpack_require__(341);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyEditorDirectiveComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









//import * as $ from 'jquery';
var showdown = __webpack_require__(738);
var SurveyEditorDirectiveComponent = (function () {
    function SurveyEditorDirectiveComponent() {
        var _this = this;
        this.surveySaved = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.onQuestionRemoved = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.onQuestionAdded = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.onQuestionModified = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.onQuestionChangeOrder = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.onLayoutClick = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.onSaveSurveyDetails = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]();
        this.strWapBase = '';
        this.strCurrentOperation = '';
        this.isAddModelSubmitting = false;
        this.doOnQuestionModified = function (editor, options) {
            _this.strCurrentOperation = "";
            //console.log("options", options);
            var element = null;
            var parentElement = null;
            var actionType = '';
            //if (options.type == "ADDED_FROM_TOOLBOX" || options.type == "ELEMENT_COPIED") {
            if (options.type == "ADDED_FROM_TOOLBOX") {
                element = options.question;
                parentElement = options.question.parent;
                actionType = "ADD";
            }
            else if (options.type == "DO_DROP" && options.newElement) {
                element = options.newElement;
                parentElement = options.newElement.parent;
                actionType = "ADD";
            }
            else if (options.type == "ELEMENT_COPIED") {
                element = options.question;
                parentElement = options.question.parent;
                actionType = "COPY";
            }
            else if (options.type == "DO_DROP" && !options.newElement) {
                //alert(options.moveToIndex);
                parentElement = options.moveToParent;
                element = options.target;
                actionType = "REORDER";
            }
            else if (options.type == "OBJECT_DELETED" && !options.newElement) {
                element = options.target;
                parentElement = options.target.parent;
                actionType = "DELETE";
            }
            else if (options.type == "QUESTION_CHANGED_BY_EDITOR") {
                element = options.question;
                parentElement = options.question.parent;
                actionType = "MODIFY";
            }
            else if (options.type == "QUESTION_CONVERTED") {
                console.log("options", options);
                element = options.newValue;
                parentElement = options.newValue.parent;
                actionType = "QUESTION_CONVERTED";
            }
            console.log(actionType, element);
            if (actionType == "ADD") {
                _this.isAddModelSubmitting = true;
                /*
                if (options.type == "ELEMENT_COPIED") {
                    element.title = element.title + " - Cloned";
                    element.nquestion.QuestionID = 0;
                }
                else {
                    this.SetDefaultsForControls(element);
                }
                */
                _this.SetDefaultsForControls(element);
                var self = _this;
                editor.showElementEditor(element, function (isCanceled) {
                    if (isCanceled) {
                        if (options.type == "ELEMENT_COPIED") {
                            self.strCurrentOperation = 'COPY';
                        }
                        else {
                            self.strCurrentOperation = 'CANCEL';
                        }
                        editor.deleteElement(element);
                    }
                });
            }
            else if (actionType == "MODIFY") {
                // For Survey Edit
                if (element.getType() == "survey") {
                    var surveyDetails = {};
                    surveyDetails.Title = element.title;
                    surveyDetails.isActive = element.isActive;
                    surveyDetails.SurveyId = element.surveyid;
                    surveyDetails.QuestionNumberingDisabled = editor.survey.showQuestionNumbers == 'off' ? true : false;
                    _this.onSaveSurveyDetails.emit(surveyDetails);
                    console.log(element);
                }
                else {
                    var json = _this.getSurveyQuestionJSON(element, parentElement);
                    json.SurveyElement = element;
                    if (_this.isAddModelSubmitting) {
                        //ADD QUESTION CASE
                        _this.isAddModelSubmitting = false;
                        json.nquestion.QuestionID = 0;
                        //json.SurveyQuestion = element;
                        _this.onQuestionAdded.emit(json);
                    }
                    else {
                        //EDIT QUESTION CASE
                        _this.onQuestionModified.emit(json);
                    }
                }
            }
            else if (actionType == "COPY") {
                element.title = element.title + " - Cloned";
                element.nquestion.QuestionID = 0;
                var json = _this.getSurveyQuestionJSON(element, parentElement);
                json.SurveyElement = element;
                json.nquestion.QuestionID = 0;
                _this.onQuestionAdded.emit(json);
            }
            else if (actionType == "DELETE") {
                editor.allowing = false;
                console.log("element", element);
                //options.allowing = false;
                //options.allowing = options.elementType !== 'page' && options.element.name === 'page1';
                //alert("Delete call");
                var objConteol = element; //? options.question : options.panel;
                var json = new __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"]().toJsonObject(element);
                console.log("Deleted Question", json);
                if (json.nquestion.QuestionID > 0) {
                    _this.onQuestionRemoved.emit(json);
                }
            }
            else if (actionType == "REORDER") {
                if (options.moveToIndex != undefined) {
                    //var json =  this.getSurveyQuestionJSON(element,parentElement);
                    var nDisplayOrder = element.nquestion.DisplayOrder;
                    var json = _this.getSurveyQuestionJSON(element, parentElement);
                    json.nquestion.DisplayOrder = nDisplayOrder;
                    if (json.nquestion.DisplayOrder < options.moveToIndex) {
                        json.nquestion.DisplayOrder = options.moveToIndex;
                    }
                    else {
                        json.nquestion.DisplayOrder = options.moveToIndex + 1;
                    }
                    _this.onQuestionChangeOrder.emit(json);
                }
            }
            else if (actionType = "QUESTION_CONVERTED") {
                var newElement = options.newValue;
                var oldElement = options.oldValue;
                var json = _this.getConvertedQuestion(oldElement, newElement);
                json.SurveyElement = element;
                _this.onQuestionModified.emit(json);
            }
        };
        this.doOnQuestionRemoved = function (sender, options) {
            sender.allowing = false;
            /*
            console.log("type", options);
            //options.allowing = false;
            //options.allowing = options.elementType !== 'page' && options.element.name === 'page1';
            //alert("Delete call");
            var objConteol = options.element ? options.element : options.panel;
            var json = new Surveyko.JsonObject().toJsonObject(objConteol);
            console.log("Deleted Question", json);
            this.onQuestionRemoved.emit(json);
            */
        };
        this.doOnSaveSurvey = function () {
            console.log(JSON.stringify(_this.editor.text));
            _this.surveySaved.emit(JSON.parse(_this.editor.text));
        };
        var urlSetting = new __WEBPACK_IMPORTED_MODULE_6__app_setting__["a" /* UrlConfig */](window);
        this.strWapBase = urlSetting.WAP_BASE;
    }
    SurveyEditorDirectiveComponent.prototype.ngOnInit = function () {
        this.initSurveyEditor();
    };
    SurveyEditorDirectiveComponent.prototype.ngOnChanges = function (changes) {
        if (this.editor != undefined && this.json) {
            this.editor.text = JSON.stringify(this.json);
            this.editor.saveSurveyFunc = this.doOnSaveSurvey;
            this.editor.onModified.add(this.doOnQuestionModified);
            var self = this;
            this.editor.onElementDeleting.add(function (editor, options) {
                // if(self.isCopiedElementDeleting)
                // {
                //     self.isCopiedElementDeleting = false;
                //     options.allowing = false;
                // }
                // else 
                var arrNoBe = ['CANCEL', 'COPY'];
                if (arrNoBe.indexOf(self.strCurrentOperation) == -1) {
                    if (!window.confirm("Are you sure want to delete the question?")) {
                        options.allowing = false;
                    }
                }
                // else
                // {
                //     self.strCurrentOperation = "";
                // }
            });
            this.editor.onElementDoubleClick.add(function (editor, options) {
                editor.showElementEditor(options.element, function (isCanceled) {
                    //if (isCanceled) editor.deleteElement(options.element);
                });
            });
            this.setSurveyToolbar();
        }
    };
    SurveyEditorDirectiveComponent.prototype.initSurveyEditor = function () {
        //Initilize Widgets
        __WEBPACK_IMPORTED_MODULE_4__SurveyWidget_ck_editor__["a" /* initCkEditor */](__WEBPACK_IMPORTED_MODULE_3_survey_knockout__);
        __WEBPACK_IMPORTED_MODULE_5__SurveyWidget_signature_pad__["a" /* initSignaturePad */](__WEBPACK_IMPORTED_MODULE_3_survey_knockout__);
        this.setSurveyEditorCustomSetting();
        var editorOptions = {
            showEmbededSurveyTab: __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showEmbededSurveyTab,
            showJSONEditorTab: __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showJSONEditorTab,
            showTestSurveyTab: __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showTestSurveyTab,
            generateValidJSON: __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].generateValidJSON,
            showPropertyGrid: __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showPropertyGrid,
            showOptions: __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showOptions,
            questionTypes: __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].questionTypes,
            //designerHeight        : "75vh"
            designerHeight: "73vh",
        };
        this.editor = new __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["SurveyEditor"]('surveyEditorContainer', editorOptions);
        this.editor.haveCommercialLicense = true;
        this.editor.showApplyButtonInEditors = __WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showApplyButtonInEditors;
        this.editor.onElementAllowOperations.add(function (editor, options) {
            options.allowEdit = true; //default value - allow show Editor question/panel/page
            options.allowDelete = true; //remove delete menu item
            options.allowCopy = true; //remove Copy menu item
            options.allowAddToToolbox = false; // remove add to toolbox menu item
            options.allowDragging = true; //default allow drag this question/page
            options.allowChangeType = true; //do not allow to convert question from one question to another
            options.allowShowHideTitle = false;
            options.allowChangeRequired = false;
        });
        this.editor.onCanShowProperty.add(function (sender, options) {
            if (options.obj.getType() == "page") {
                options.canShow = false;
            }
            else if (options.obj.getType() == "survey") {
                //var allProperyList = ['clearInvisibleValues','completeText','completedBeforeHtml','completedHtml','cookieName','firstPageIsStarted','focusFirstQuestionAutomatic','goNextPageAutomatic','isSinglePage','loadingHtml','locale','maxTimeToFinish','maxTimeToFinishPage','mode','pageNextText','pagePrevText','questionErrorLocation','questionStartIndex','questionTitleLocation','questionTitleTemplate','questionsOrder','requiredText','sendResultOnPageNext','showCompletedPage','showNavigationButtons','showPageNumbers','showPageTitles','showPrevButton','showProgressBar','showQuestionNumbers','showTimerPanel','showTimerPanelMode','showTitle','startSurveyText','storeOthersAsComment','title','triggers'];
                //console.log(options.obj);
                var arrDisplayProp = ['title', 'showQuestionNumbers', 'isActive'];
                if (arrDisplayProp.indexOf(options.property.name) > -1) {
                    options.canShow = true;
                }
                else {
                    options.canShow = false;
                }
            }
            //console.log(options.property.name);
        });
        //Create showdown mardown converter
        var converter = new showdown.Converter();
        function doMarkdown(survey, options) {
            //convert the mardown text to html
            var str = converter.makeHtml(options.text);
            if (str.startsWith("<p>") && str.endsWith("</p>")) {
                //remove root paragraphs <p></p>
                str = str.substring(3);
                str = str.substring(0, str.length - 4);
            }
            options.html = str;
        }
        this.editor.onDesignerSurveyCreated.add(function (editor, options) {
            options.survey.onTextMarkdown.add(doMarkdown);
            options.survey.onGetQuestionTitle.add(function (survey, options) {
                if (options.question.title == options.question.name)
                    options.title = "";
            });
        });
        this.editor.onSetPropertyEditorOptions.add(function (sender, options) {
            options.editorOptions.itemsEntryType = "fast";
        });
        /*
        this.editor.onDefineElementMenuItems.add(function(editor, options) {
            //options.items.unshift({text: "Add Into Shared Repository", onClick: function(obj){ }});
            options.items.splice(options.items.findIndex(t=>t.name=="addToToolbox"),1);
        });
        */
        this.initilizeCustomControls();
    };
    SurveyEditorDirectiveComponent.prototype.setSurveyEditorCustomSetting = function () {
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["defaultBootstrapCss"].navigationButton = "btn btn-primary";
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["removeAdorners"](["controlLabel", "item", "title", "label", "itemText", "itemTitle"]);
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.findProperty("questionbase", "name").readOnly = true;
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("questionbase", { name: "questionid:number", default: 0 });
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("questionbase", { name: "customcontrol:boolean", default: false });
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("questionbase", { name: "answertypeid:number", default: 0 });
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("questionbase", { name: "questiontype:string" });
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("questionbase", { name: "nquestion:NQuestion", default: {} });
        //Surveyko.JsonObject.metaData.addProperty("questionbase", { name: "iscommentineditor:boolean", default: false });
        //SurveyEditor.defaultStrings.pe["iscommentineditor"] = "Show As Editor";
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["defaultStrings"].pe["startWithNewLine"] = "Start Question with New Line";
        // remove visibleIf tab for all questions
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["SurveyQuestionEditorDefinition"].definition["questionbase"].tabs = [];
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["SurveyQuestionEditorDefinition"].definition["questionbase"].properties = [
            "title",
            "html",
            //"defaultValue",
            //"placeHolder",
            "commentText",
            { name: "isRequired" },
            "startWithNewLine",
            "iscommentineditor"
        ];
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["SurveyQuestionEditorDefinition"].definition.selectbase.tabs = [{ name: "general" }, { name: "choices", index: 10 }];
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["SurveyQuestionEditorDefinition"].definition["selectbase"].properties = [
            { name: "hasOther", tab: "choices" },
            { name: "otherText", tab: "choices" },
            { name: "colCount", tab: "choices" },
        ];
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("survey", { name: "isActive:boolean", default: false });
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("survey", { name: "surveyid:number", default: 0 });
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.findProperty("survey", "title").type = "string";
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.findProperty("survey", "showQuestionNumbers").setChoices(["on", "off"], undefined);
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["SurveyQuestionEditorDefinition"].definition["survey"].properties = [
            "title",
            "showQuestionNumbers",
            "isActive"
        ];
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("ItemValue", { name: "rowid:number", default: -1 });
        //Surveyko.JsonObject.metaData.findProperty("itemvalue", "value").visible = false;
        //Surveyko.JsonObject.metaData.findProperty("itemvalue", "value").isRequired = false;
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("panel", { name: "questionid:number", default: 0 });
        __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"].metaData.addProperty("matrixdropdowncolumn", { name: "columnid:number", default: -1 });
        //Surveyko.JsonObject.metaData.findProperty("matrixdropdowncolumn","name").visible = false;
        __WEBPACK_IMPORTED_MODULE_2_surveyjs_editor__["SurveyQuestionEditorDefinition"].definition["html"].tabs = [];
        /* UNCOMMENT After New Release
        SurveyEditor.SurveyQuestionEditorDefinition.definition.html = {
            tabs: [{ name: "general", visible: false }, { name: "html", index: 10 }]
        }
        */
    };
    SurveyEditorDirectiveComponent.prototype.setSurveyToolbar = function () {
        if (this.editor != undefined) {
            var edt = this.editor;
            var DefaultToolbar = this.editor.toolbarItems().map(function (a) { return a.id; }); // ["svd-survey-settings","svd-redo","svd-options","svd-test","svd-save","svd_state"]
            $(DefaultToolbar).each(function () {
                var _this = this;
                var exceptHide = ["svd-survey-settings"];
                if (exceptHide.indexOf(this + "") == -1) {
                    var index = edt.toolbarItems().findIndex(function (t) { return t.id == _this + ""; });
                    edt.toolbarItems().splice(index, 1);
                }
            });
            if (this.editor.toolbarItems().findIndex(function (t) { return t.id == 'custom-preview'; }) == -1) {
                var strWapURL = this.strWapBase;
                var SurveyGuid = this.json.SurveyGUID;
                this.editor.toolbarItems.push({
                    id: "custom-preview",
                    visible: true,
                    title: "Survey Preview",
                    action: function () {
                        window.open(strWapURL + "surveymobile.aspx?surveyid=" + SurveyGuid, "_blank");
                    }
                });
            }
            if (this.editor.toolbarItems().findIndex(function (t) { return t.id == 'custom-layout'; }) == -1) {
                var LayoutEvent = this.onLayoutClick;
                this.editor.toolbarItems.push({
                    id: "custom-layout",
                    visible: true,
                    title: "Layout",
                    action: function () {
                        LayoutEvent.emit("");
                    }
                });
            }
        }
    };
    SurveyEditorDirectiveComponent.prototype.initilizeCustomControls = function () {
        var _this = this;
        var toolCurrentDateTime = {};
        Object.assign(toolCurrentDateTime, {
            name: "datetime", isCopied: false, iconName: "icon-text", title: 'Date & Time',
            json: {
                type: "text",
                inputType: "datetime",
                name: "datetime",
                title: "Date & Time",
            }
        });
        this.editor.toolbox.addItem(toolCurrentDateTime);
        var toolPhoto = {};
        Object.assign(toolPhoto, {
            name: "photo", isCopied: false, iconName: "icon-file", title: 'Photo',
            json: {
                type: "file",
                name: "photo",
                title: "Photo:"
            }
        });
        this.editor.toolbox.addItem(toolPhoto);
        var toolVideo = {};
        Object.assign(toolVideo, {
            name: "video", isCopied: false, iconName: "icon-file", title: 'Video',
            json: {
                type: "file",
                name: "video",
                title: "Video:"
            }
        });
        this.editor.toolbox.addItem(toolVideo);
        var toolVoice = {};
        Object.assign(toolVoice, {
            name: "voice", isCopied: false, iconName: "icon-file", title: 'Voice',
            json: {
                type: "file",
                name: "voice",
                title: "Voice:"
            }
        });
        this.editor.toolbox.addItem(toolVoice);
        var toolSection = {};
        Object.assign(toolSection, {
            name: "section", isCopied: false, iconName: "icon-html", title: 'Section',
            json: {
                type: "html",
                name: "section",
                html: "<div style=\"width: 100%; background-color: #00A8C6; border-radius: 5px; padding: 0px 10px; color: white;\">\n<p style=\"text-align:center\"><span style=\"font-size:16px\">Text</span></p>\n</div>\n"
            }
        });
        this.editor.toolbox.addItem(toolSection);
        var toolObserverOnlyComment = {};
        Object.assign(toolObserverOnlyComment, {
            name: "ObserverOnlyComment", isCopied: false, iconName: "icon-comment", title: 'Observer Only Comment',
            json: {
                type: "comment",
                name: "ObserverOnlyComment1",
                title: "<div class=\"nostyle clsNCRemoveExceptGlobalAdminObserver\"><strong>Coaches Only Comments</strong></div>"
            }
        });
        this.editor.toolbox.addItem(toolObserverOnlyComment);
        if (__WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showPreSurveyQuestion) {
            __WEBPACK_IMPORTED_MODULE_8__models_SurveyJSJsonData__["b" /* preSurveyQuestionList */].forEach(function (element) {
                var item = {};
                Object.assign(item, {
                    name: element.name, isCopied: false, iconName: "icon-expression", title: element.title,
                    json: {
                        "type": element.type,
                        "placeHolder": element.placeHolder,
                        "title": element.title,
                    }
                });
                _this.editor.toolbox.addItem(item);
            });
        }
        if (__WEBPACK_IMPORTED_MODULE_1__surveyJsEditorSetting__["a" /* SurveyJSEditorSetting */].showXMLCustomQuestion) {
            __WEBPACK_IMPORTED_MODULE_8__models_SurveyJSJsonData__["c" /* xmlControlList */].forEach(function (element) {
                var item = {};
                Object.assign(item, {
                    name: element.name, isCopied: false, iconName: "icon-dropdown", title: element.title,
                    json: {
                        "type": "dropdown",
                        "choicesByUrl": {
                            "url": _this.strWapBase + "XmlData/" + element.xmlFile,
                            "path": "NSurveyDataSource;XmlDataSource;XmlAnswers;XmlAnswer",
                            "valueName": "AnswerValue",
                            "titleName": "AnswerDescription"
                        },
                        "name": element.name,
                        "customcontrol": true,
                        //"title": element.title,
                        "answertypeid": element.AnswerTypeId,
                        "questiontype": element.name.toLowerCase(),
                    }
                });
                _this.editor.toolbox.addItem(item);
            });
        }
    };
    SurveyEditorDirectiveComponent.prototype.SetDefaultsForControls = function (question) {
        question.nquestion = {};
        if (question.getType() == 'checkbox' || question.getType() == 'radiogroup' || question.getType() == 'dropdown') {
            if (question.choices && question.choices.length > 0) {
                //var obj = question.choices.shift();
                question.choices = [];
            }
        }
        else if (question.getType() == 'matrixdropdown') {
            question.choices = [];
            question.columns = [];
            question.rows = [];
            question.cellType = "text";
        }
    };
    SurveyEditorDirectiveComponent.prototype.getConvertedQuestion = function (oldElement, newElement) {
        var inputType = newElement.getType();
        var inputType1 = inputType == "checkbox" ? "radiogroup" : inputType;
        var newAnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType(inputType);
        var json = new __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"]().toJsonObject(newElement);
        json.type = newElement.getType();
        json.elementId = newElement.id;
        json.questiontype = json.questiontype && json.questiontype != "" ? json.questiontype : json.type;
        console.log(json.nquestion);
        if (json.nquestion) {
            json.nquestion.QuestionType = "single";
            if (inputType == "dropdown") {
                json.nquestion.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.DropDownListSingle;
            }
            else if (inputType == "matrixdropdown") {
                json.nquestion.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.MultiMatrix;
                json.nquestion.QuestionType = "matrix";
            }
            else if (inputType == "html") {
                json.nquestion.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.StaticTextInformation;
            }
            else if (inputType == "checkbox") {
                json.nquestion.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.CheckBoxMultiple;
                if (json.nquestion.LayoutModeId == __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].LayoutModeId.Horizontal) {
                    json.colCount = json.nquestion.Answer.length;
                    newElement.colCount = json.nquestion.Answer.length;
                }
            }
            else {
                json.nquestion.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.RadioButtonSingle;
                if (json.nquestion.LayoutModeId == __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].LayoutModeId.Horizontal) {
                    json.colCount = json.nquestion.Answer.length;
                    newElement.colCount = json.nquestion.Answer.length;
                }
            }
            if (json.nquestion.Answer && json.nquestion.Answer.length > 0) {
                json.nquestion.Answer.forEach(function (ans) {
                    if (ans.AnswerTypeId != 2 || inputType == "dropdown") {
                        ans.AnswerTypeId = newAnswerTypeId;
                    }
                    ans._OprationType = 'edit';
                });
            }
        }
        return json;
    };
    SurveyEditorDirectiveComponent.prototype.getSurveyQuestionJSON = function (element, parent) {
        var json = new __WEBPACK_IMPORTED_MODULE_3_survey_knockout__["JsonObject"]().toJsonObject(element);
        json.type = element.getType();
        json.elementId = element.id;
        json.questiontype = json.questiontype && json.questiontype != "" ? json.questiontype : json.type;
        json.nquestion = this.getNQuestionByQuestion(element, parent);
        return json;
    };
    SurveyEditorDirectiveComponent.prototype.getNQuestionByQuestion = function (question, parent) {
        var returnValue;
        if (question.nquestion) {
            returnValue = question.nquestion;
        }
        else {
            returnValue = {};
        }
        returnValue.PageNumber = (parent ? parent.visibleIndex : 0) + 1;
        //if (!(returnValue.DisplayOrder && returnValue.DisplayOrder > 0)) 
        {
            returnValue.DisplayOrder = (parent ? parent.elements.indexOf(question) : 0) + 1;
        }
        //returnValue.QuestionText = (question.title && question.title != '') ? question.title : question.name;
        returnValue.QuestionText = (question.name == question.title) ? '' : question.title;
        returnValue.QuestionType = "single";
        returnValue.isSidebySide = !question.startWithNewLine;
        var inputType = question.getType();
        if (inputType == "text" && question.inputType != undefined) {
            inputType = question.inputType;
        }
        if (inputType == "dropdown") {
            returnValue.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.DropDownListSingle;
        }
        else if (inputType == "matrixdropdown") {
            returnValue.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.MultiMatrix;
            returnValue.QuestionType = "matrix";
        }
        else if (inputType == "html") {
            returnValue.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.StaticTextInformation;
            returnValue.QuestionText = question.html;
        }
        else if (inputType == "checkbox") {
            returnValue.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.CheckBoxMultiple;
        }
        else {
            returnValue.SelectionModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].SelectionMode.RadioButtonSingle;
        }
        if (returnValue.QuestionType == "single") {
            if (returnValue.Answer == undefined) {
                returnValue.Answer = [];
            }
            if (question.choices && question.choices.length > 0) {
                //Implement Delete Case Here
                var CurrentIDList = question.choices.map(function (el) { if (el.value)
                    return el.rowid; });
                returnValue.Answer.forEach(function (element) {
                    if (CurrentIDList.indexOf(Number(element.AnswerId)) == -1) {
                        if (element.AnswerTypeId != 2) {
                            element._OprationType = 'delete';
                        }
                    }
                });
                //Check for Add/Modify case
                question.choices.forEach(function (element) {
                    var ansText = '';
                    var ansValue = -1;
                    var opType = '';
                    if (typeof (element) == "string") {
                        ansText = element;
                        opType = 'add';
                    }
                    else {
                        var ansIndex = returnValue.Answer.findIndex(function (a) { return a.AnswerId == element.rowid; });
                        ansText = element.text;
                        if (ansIndex != -1) {
                            opType = 'edit';
                            ansValue = element.value;
                        }
                        else {
                            opType = 'add';
                        }
                    }
                    if (opType == 'add') {
                        var ans_1 = {};
                        var inputType1 = inputType == "checkbox" ? "radiogroup" : inputType;
                        ans_1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType(inputType1);
                        ans_1.Answertext = ansText;
                        ans_1.AnswerId = -1;
                        ans_1._OprationType = opType;
                        //if (question.isRequired) { ans.isMandatory = question.isRequired; }
                        if (ans_1.AnswerTypeId > 0) {
                            returnValue.Answer.push(ans_1);
                        }
                    }
                    else if (opType == 'edit') {
                        var ans = returnValue.Answer.find(function (a) { return a.AnswerId == element.rowid; });
                        if (ans) {
                            ans._OprationType = opType;
                            ans.Answertext = ansText;
                        }
                    }
                });
                // If Col Count is 0 or greater Then 1 it will be horizontal
                if (question.colCount != 1) {
                    returnValue.LayoutModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].LayoutModeId.Horizontal;
                }
                else {
                    returnValue.LayoutModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].LayoutModeId.Vertical;
                }
                if (question.hasOther && question.hasOther == true) {
                    var eleItem = returnValue.Answer.filter(function (t) { return t.AnswerTypeId == 2; })[0];
                    if (eleItem == undefined) {
                        var answer = {};
                        answer.AnswerTypeId = 2;
                        answer.AnswerId = -1;
                        answer.Answertext = question.otherText;
                        answer._OprationType = 'add';
                        //if (question.isRequired) { answer.isMandatory = question.isRequired; }
                        returnValue.Answer.push(answer);
                    }
                    else {
                        eleItem.Answertext = question.otherText;
                        eleItem._OprationType = 'edit';
                        var idx = returnValue.Answer.findIndex(function (t) { return t.AnswerTypeId == 2; });
                        var item = returnValue.Answer.slice(idx, 1);
                        if (item.length != 0) {
                            returnValue.Answer.push(item[0]);
                        }
                    }
                }
                else {
                    var eleItem = returnValue.Answer.filter(function (t) { return t.AnswerTypeId == 2; })[0];
                    if (eleItem != undefined) {
                        eleItem._OprationType = 'delete';
                    }
                }
            }
            else {
                var answer = {};
                //if (question.isRequired) { answer.isMandatory = question.isRequired; }
                var xmlControlIds = __WEBPACK_IMPORTED_MODULE_8__models_SurveyJSJsonData__["c" /* xmlControlList */].map(function (item) { return item.AnswerTypeId; });
                if (xmlControlIds.indexOf(question.answertypeid) > -1) {
                    var arrControl = __WEBPACK_IMPORTED_MODULE_8__models_SurveyJSJsonData__["c" /* xmlControlList */].filter(function (a) { return a.AnswerTypeId == question.answertypeid; });
                    if (arrControl.length > 0) {
                        inputType = arrControl[0].name;
                    }
                }
                if (inputType != "html") {
                    answer.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType(inputType);
                }
                //FOR EDIT
                if (returnValue.Answer && returnValue.Answer.length > 0) {
                    //FOR DATETIME
                    if (inputType == "datetime") {
                        question.nquestion.LayoutModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].LayoutModeId.Horizontal;
                        // If Already DateTime -> do nothiung
                        if (!(returnValue.Answer.findIndex(function (t) { return t.AnswerTypeId == new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text'); }) > -1
                            && returnValue.Answer.findIndex(function (t) { return t.AnswerTypeId == new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('datetime'); }) > -1)) {
                            returnValue.Answer.forEach(function (ele) {
                                ele._OprationType = 'delete';
                            });
                            if (answer.AnswerTypeId > 0) {
                                answer._OprationType = 'add';
                                answer.DefaultText = '##CurrentDateTime##';
                                returnValue.Answer.push(answer);
                                var answer1 = {};
                                answer1._OprationType = 'add';
                                answer1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text');
                                answer1.DefaultText = '##CurrentTime##';
                                returnValue.Answer.push(answer1);
                            }
                        }
                        else {
                            //IF Already DateTime Re Set Default text
                            var ans1 = returnValue.Answer.find(function (t) { return t.AnswerTypeId == new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('datetime'); });
                            if (ans1 != undefined) {
                                ans1.DefaultText = '##CurrentDateTime##';
                                ans1._OprationType = 'edit';
                            }
                            var ans2 = returnValue.Answer.find(function (t) { return t.AnswerTypeId == new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text'); });
                            if (ans2 != undefined) {
                                ans2.DefaultText = '##CurrentTime##';
                                ans2._OprationType = 'edit';
                            }
                        }
                    }
                    else {
                        question.nquestion.LayoutModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].LayoutModeId.Vertical;
                        //if(question.defaultValue && question.defaultValue != "")
                        if (inputType == 'text' && question.placeHolder && question.placeHolder != "") {
                            //EDIT CODE FOR PRESURVEY
                            var arrDefaultTexts = (question.placeHolder + "").split(',');
                            for (var i = 0; i < returnValue.Answer.length; i++) {
                                if (i < arrDefaultTexts.length) {
                                    if (i == 0) {
                                        if (returnValue.Answer[i].AnswerTypeId != new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text')) {
                                            returnValue.Answer[i].AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text');
                                            returnValue.Answer[i].DefaultText = (arrDefaultTexts[i] + "").trim();
                                            returnValue.Answer[i]._OprationType = 'edit';
                                        }
                                    }
                                }
                                else {
                                    returnValue.Answer[i]._OprationType = 'delete';
                                }
                            }
                            if (arrDefaultTexts.length > returnValue.Answer.length) {
                                for (var i = returnValue.Answer.length; i < arrDefaultTexts.length; i++) {
                                    var answer1 = {};
                                    answer1._OprationType = 'add';
                                    answer1.DefaultText = (arrDefaultTexts[i] + "").trim();
                                    if (i == 0) {
                                        answer1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text');
                                    }
                                    else {
                                        answer1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('hidden');
                                    }
                                    returnValue.Answer.push(answer1);
                                }
                            }
                        }
                        else {
                            returnValue.Answer.forEach(function (ans) {
                                if (ans.DefaultText && ans.DefaultText != "") {
                                    ans.DefaultText = "";
                                    ans._OprationType = 'edit';
                                }
                            });
                            if (returnValue.Answer.length == 1 && returnValue.Answer[0].AnswerTypeId == answer.AnswerTypeId) {
                            }
                            else {
                                returnValue.Answer.forEach(function (ele) {
                                    ele._OprationType = 'delete';
                                });
                                answer._OprationType = 'add';
                                returnValue.Answer.push(answer);
                            }
                        }
                    }
                }
                else {
                    //FOR DATETIME
                    if (inputType == "datetime") {
                        if (answer.AnswerTypeId > 0) {
                            answer.DefaultText = '##CurrentDateTime##';
                            returnValue.Answer.push(answer);
                            var answer1 = {};
                            answer1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text');
                            answer1.DefaultText = '##CurrentTime##';
                            returnValue.Answer.push(answer1);
                            question.nquestion.LayoutModeId = __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["b" /* NInfo */].LayoutModeId.Horizontal;
                        }
                    }
                    else {
                        //if(question.defaultValue && question.defaultValue != "")
                        if (inputType == 'text' && question.placeHolder && question.placeHolder != "") {
                            if (inputType != 'text') {
                                question.type = 'text';
                            }
                            var arrDefaultTexts = (question.placeHolder + "").split(',');
                            for (var i = 0; i < arrDefaultTexts.length; i++) {
                                var answer1 = {};
                                answer1.DefaultText = arrDefaultTexts[i];
                                if (i == 0) {
                                    answer1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text');
                                }
                                else {
                                    answer1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('hidden');
                                }
                                returnValue.Answer.push(answer1);
                            }
                        }
                        else {
                            if (answer.AnswerTypeId == 0) {
                                answer.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType('text');
                            }
                            if (answer.AnswerTypeId > 0) {
                                //if(returnValue.Answer == undefined) returnValue.Answer = [];
                                returnValue.Answer.push(answer);
                            }
                        }
                    }
                }
            }
            if (question.isRequired) {
                returnValue.Answer.forEach(function (answer) {
                    answer.isMandatory = question.isRequired;
                });
            }
        }
        else if (returnValue.QuestionType == "matrix") {
            if (returnValue.Rows == undefined) {
                returnValue.Rows = [];
            }
            if (returnValue.Columns == undefined) {
                returnValue.Columns = [];
            }
            //Implement Delete Case Here
            var CurrentRowIDList = question.rows.map(function (el) { if (el.rowid != undefined)
                return el.rowid; });
            returnValue.Rows.forEach(function (row) {
                if (CurrentRowIDList.indexOf(Number(row.RowId)) == -1 && row._OprationType != 'ignore') {
                    row._OprationType = 'delete';
                }
            });
            var CurrentColIDList = question.columns.map(function (el) { if (el.columnid != undefined)
                return el.columnid; });
            returnValue.Columns.forEach(function (col) {
                if (CurrentColIDList.indexOf(Number(col.ColumnId)) == -1) {
                    col._OprationType = 'delete';
                }
            });
            question.rows.forEach(function (element) {
                var opType = '';
                var row = returnValue.Rows.find(function (a) { return a.RowId == element.rowid; });
                if (row == undefined || (row && row._OprationType != 'ignore')) {
                    if (typeof (element) == "string") {
                        opType = 'add';
                    }
                    else {
                        //var ansIndex = returnValue.Rows.findIndex(a=>a.RowId == element.rowid);
                        if (row != undefined) {
                            opType = 'edit';
                        }
                        else {
                            opType = 'add';
                        }
                    }
                    if (opType == 'add') {
                        var matrixRow = {};
                        matrixRow.Name = typeof (element) == "string" ? ' ' : element.text;
                        matrixRow.RowId = 0;
                        matrixRow._OprationType = opType;
                        returnValue.Rows.push(matrixRow);
                    }
                    else if (opType == 'edit') {
                        //var row = returnValue.Rows.find(a=>a.RowId == element.rowid);
                        if (row != undefined) {
                            row._OprationType = opType;
                            row.Name = typeof (element) == "string" ? ' ' : element.text;
                        }
                    }
                }
            });
            question.columns.forEach(function (element) {
                var opType = '';
                var col = returnValue.Columns.find(function (a) { return a.ColumnId == element.columnid; });
                if (col == undefined || (col && col._OprationType != 'ignore')) {
                    if (typeof (element) == "string") {
                        opType = 'add';
                    }
                    else {
                        //var ansIndex = returnValue.Columns.findIndex(a=>a.ColumnId == element.columnid);
                        if (col != undefined) {
                            opType = 'edit';
                        }
                        else {
                            opType = 'add';
                        }
                    }
                    var cellType_1 = question.cellType;
                    if (element.cellType != 'default') {
                        if (element.cellType == 'text') {
                            cellType_1 = element.inputType;
                        }
                        else {
                            cellType_1 = element.cellType;
                        }
                    }
                    if (opType == 'add') {
                        var matrixCol_1 = {};
                        matrixCol_1.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType(cellType_1);
                        matrixCol_1.Name = typeof (element) == "string" ? ' ' : element.title;
                        matrixCol_1.ColumnId = 0;
                        matrixCol_1.isMandatory = false;
                        matrixCol_1._OprationType = opType;
                        //FOR XML DropDown
                        if (cellType_1 == 'dropdown') {
                            matrixCol_1.ChoiceList = [];
                            element.choices.forEach(function (chElement) {
                                var ansText = '';
                                //let ansValue: number = -1;
                                if (typeof (chElement) == "string") {
                                    ansText = chElement;
                                }
                                else {
                                    ansText = chElement.text;
                                }
                                var ans = {};
                                ans.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType(cellType_1);
                                ans.Answertext = ansText;
                                ans.AnswerId = -1;
                                if (ans.AnswerTypeId > 0) {
                                    matrixCol_1.ChoiceList.push(ans);
                                }
                            });
                        }
                        if (matrixCol_1.AnswerTypeId != 0) {
                            returnValue.Columns.push(matrixCol_1);
                        }
                    }
                    else if (opType == 'edit') {
                        // DO Nothing if XML Dropdown
                        if (col != undefined && cellType_1 != 'dropdown') {
                            col._OprationType = opType;
                            col.AnswerTypeId = new __WEBPACK_IMPORTED_MODULE_7__models_NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeIdByType(cellType_1);
                            //col.Name  = typeof (element) == "string" ? element : (element.title ? element.title: element.name);
                            col.Name = typeof (element) == "string" ? ' ' : element.title;
                            col.isMandatory = element.isRequired;
                        }
                    }
                }
            });
        }
        console.log(returnValue);
        return returnValue;
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Input */])(), 
        __metadata('design:type', Object)
    ], SurveyEditorDirectiveComponent.prototype, "json", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]) === 'function' && _a) || Object)
    ], SurveyEditorDirectiveComponent.prototype, "surveySaved", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]) === 'function' && _b) || Object)
    ], SurveyEditorDirectiveComponent.prototype, "onQuestionRemoved", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Output */])(), 
        __metadata('design:type', (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]) === 'function' && _c) || Object)
    ], SurveyEditorDirectiveComponent.prototype, "onQuestionAdded", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Output */])(), 
        __metadata('design:type', (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]) === 'function' && _d) || Object)
    ], SurveyEditorDirectiveComponent.prototype, "onQuestionModified", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Output */])(), 
        __metadata('design:type', (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]) === 'function' && _e) || Object)
    ], SurveyEditorDirectiveComponent.prototype, "onQuestionChangeOrder", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Output */])(), 
        __metadata('design:type', (typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]) === 'function' && _f) || Object)
    ], SurveyEditorDirectiveComponent.prototype, "onLayoutClick", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Output */])(), 
        __metadata('design:type', (typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["w" /* EventEmitter */]) === 'function' && _g) || Object)
    ], SurveyEditorDirectiveComponent.prototype, "onSaveSurveyDetails", void 0);
    SurveyEditorDirectiveComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Component */])({
            selector: 'survey-editor',
            template: "<div id=\"surveyEditorContainer\" json></div>",
        }), 
        __metadata('design:paramtypes', [])
    ], SurveyEditorDirectiveComponent);
    return SurveyEditorDirectiveComponent;
    var _a, _b, _c, _d, _e, _f, _g;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/surveyEditor.directive.js.map

/***/ }),

/***/ 340:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NSurveyLogic; });
/* unused harmony export NQuestion */
/* unused harmony export NAnswer */
/* unused harmony export NMatrixRow */
/* unused harmony export NMatrixColumn */
/* unused harmony export NAnswerType */
/* unused harmony export NSurveyDetails */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NInfo; });
var NSurveyLogic = (function () {
    function NSurveyLogic() {
    }
    NSurveyLogic.prototype.getAnswerTypeIdByType = function (_AnswerType) {
        if (NInfo.AnswerType[_AnswerType] != undefined) {
            return NInfo.AnswerType[_AnswerType];
        }
        return 0;
    };
    NSurveyLogic.prototype.getAnswerTypeByID = function (_TypeID) {
        try {
            return Object.keys(NInfo.AnswerType).find(function (key) { return NInfo.AnswerType[key] === Number(_TypeID); });
        }
        catch (ex) {
            return undefined;
        }
    };
    return NSurveyLogic;
}());
var NQuestion = (function () {
    function NQuestion() {
        this.RandomizeAnswers = false;
        this.RatingEnabled = false;
        this.ShowHelpText = false;
        this.isSidebySide = false;
    }
    return NQuestion;
}());
var NAnswer = (function () {
    function NAnswer() {
        this.AnswerIDText = "";
        this.Answertext = "";
        this.DefaultText = "";
        this.AnswerAlias = "";
        this.AnswerPipeAlias = "";
        this.ImageURL = "";
        this.isMandatory = false;
        this.isRatePart = false;
        this.isSelected = false;
        this.ScorePoint = 0;
        this.SliderValue = 0;
        this.SliderMin = 0;
        this.SliderMax = 0;
        this.isSliderAnimate = false;
        this.SliderStep = 0;
        this.RegularExpressionId = 0;
    }
    return NAnswer;
}());
var NMatrixRow = (function () {
    function NMatrixRow() {
    }
    return NMatrixRow;
}());
var NMatrixColumn = (function () {
    function NMatrixColumn() {
    }
    return NMatrixColumn;
}());
var NAnswerType = (function () {
    function NAnswerType() {
    }
    return NAnswerType;
}());
var NSurveyDetails = (function () {
    function NSurveyDetails() {
    }
    return NSurveyDetails;
}());
var NInfo = {
    AnswerType: {
        text: 3,
        date: 22,
        datetime: 22,
        email: 26,
        password: 28,
        range: 56,
        comment: 24,
        html: 58,
        file: 30,
        checkbox: 20,
        radiogroup: 1,
        dropdown: 1,
        matrixdropdown: 0,
        signaturepad: 102,
        hidden: 101,
        editor: 31,
        xmlactivitiesofdailyliving: 109,
        xmlevaluation: 111,
        xmlgradelist: 59,
        xmlrelatedcompetencies: 106,
        xmlshorttermobjectivearticulation: 108,
        xmlshorttermobjectivelanguage: 110,
        xmlstatus: 107,
        xmlsubjectlist: 60,
        xmlcountrylist: 4,
    },
    SelectionMode: {
        RadioButtonSingle: 1,
        CheckBoxMultiple: 2,
        DropDownListSingle: 3,
        MultiMatrix: 4,
        StaticTextInformation: 5,
    },
    LayoutModeId: {
        Vertical: 1,
        Horizontal: 2
    }
};
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/NSurveyModel.js.map

/***/ }),

/***/ 341:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app_setting__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NSurveyModel__ = __webpack_require__(340);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyJSData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return xmlControlList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return preSurveyQuestionList; });
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


var urlSetting = new __WEBPACK_IMPORTED_MODULE_0__app_setting__["a" /* UrlConfig */](window);
var SurveyJSData = (function () {
    function SurveyJSData() {
        this.SurveyJson = {};
    }
    SurveyJSData.prototype.loadNSurvey = function (nSurvey) {
        var _this = this;
        //this.SurveyJson.pages = [];
        //this.SurveyJson.pages.push({ name: 'page1', elements: [] });
        this.SurveyJson = this.initilizeSurveyJson(nSurvey);
        if (nSurvey.survey) {
            this.SurveyJson.title = nSurvey.survey.Title;
        }
        if (nSurvey.survey.question) {
            nSurvey.survey.question.forEach(function (que) {
                var element = _this.getConvertedQuestion(que);
                if (element != null) {
                    //element.nquestion.LanguageCode = 
                    element.nquestion.SurveyID = nSurvey.survey.SurveyID;
                    _this.SurveyJson.pages[0].elements.push(element);
                }
            });
        }
    };
    /**
     * Get converted surveyjs page element from given question object.
     * @param question
     */
    SurveyJSData.prototype.getConvertedQuestion = function (question) {
        var returnValue = {};
        returnValue = this.getQuestionType(question);
        return returnValue;
    };
    /**
     * Get Question type for question
     * @param question
     */
    SurveyJSData.prototype.getQuestionType = function (question) {
        var returnValue;
        var qType = new QuestionType(question);
        return qType.returnSurveyElement();
    };
    SurveyJSData.prototype.initilizeSurveyJson = function (nSurvey) {
        var _surveyid = 0, _title = '', _showQuestionNumbers = '', _isActive = false;
        if (nSurvey) {
            _surveyid = nSurvey.survey.SurveyID;
            _title = nSurvey.survey.Title;
            _isActive = nSurvey.survey.Activated;
            _showQuestionNumbers = nSurvey.survey.QuestionNumberingDisabled && eval(nSurvey.survey.QuestionNumberingDisabled + "") == true ? 'off' : 'on';
        }
        return {
            pages: [{ name: 'page1', elements: [] }],
            showQuestionNumbers: _showQuestionNumbers,
            title: _title,
            isActive: _isActive,
            showTitle: false,
            surveyid: _surveyid,
        };
    };
    return SurveyJSData;
}());
var QuestionType = (function () {
    function QuestionType(question) {
        this.AnswerTypeId = 0;
        this.IsSameTypeAnswer = false;
        this._question = question;
        this.AnswerTypeId = -1;
        this.SelectionModeId = question._SelectionModeId;
        this.LayoutModeId = question._LayoutModeId;
        if (question.answers != undefined && question.answers.length > 0) {
            this.IsSameTypeAnswer = question.answers.map(function (r) { return r._AnswerTypeId; }).every(function (val) { return val === question.answers[0]._AnswerTypeId; });
            if (this.IsSameTypeAnswer) {
                this.AnswerTypeId = question.answers[0]._AnswerTypeId;
            }
        }
    }
    QuestionType.prototype.returnSurveyElement = function () {
        var _this = this;
        var returnValue = this.initilizeQuestion();
        returnValue.answertypeid = this.AnswerTypeId;
        //RadioButton
        if (this.SelectionModeId == enSelectionModeId.RadioButton) {
            //FOR DATE TIME CONTROL
            if (this._question.answers.filter(function (a) { return a._AnswerTypeId == enAnswerTypeId.FieldCalendarType || a._AnswerTypeId == enAnswerTypeId.FieldBasicType; }).length == 2 && this._question.answers.length == 2) {
                var element = new ITextQuestion(returnValue, enInputType.DateTime);
                Object.assign(element, returnValue);
                returnValue = element;
            }
            else {
                //FOR PRESURVEY QUESTION
                var isPreSurveyQuestion = true;
                if (this._question.answers.findIndex(function (t) { return (t._AnswerTypeId != enAnswerTypeId.FieldBasicType && t._AnswerTypeId != enAnswerTypeId.iAspireHidden); }) > -1) {
                    isPreSurveyQuestion = false;
                }
                if (isPreSurveyQuestion == true && this._question.answers.length > 1) {
                    var eleMulti = this.getMultiQuestionInColumn(returnValue);
                    if (eleMulti != null) {
                        Object.assign(eleMulti, returnValue);
                    }
                    returnValue = eleMulti;
                }
                else {
                    var eleOther = this.getQuestionByAnswer(this._question.answers[0]);
                    if (eleOther != null) {
                        Object.assign(eleOther, returnValue);
                    }
                    returnValue = eleOther;
                }
            }
        }
        else if (this.SelectionModeId == enSelectionModeId.Checkbox) {
            //FOR DATE TIME CONTROL
            if (this._question.answers.filter(function (a) { return a._AnswerTypeId == enAnswerTypeId.FieldCalendarType || a._AnswerTypeId == enAnswerTypeId.FieldBasicType; }).length == 2 && this._question.answers.length == 2) {
                var element = new ITextQuestion(returnValue, enInputType.DateTime);
                Object.assign(element, returnValue);
                returnValue = element;
            }
            else {
                //FOR PRESURVEY QUESTION
                var isPreSurveyQuestion = true;
                if (this._question.answers.findIndex(function (t) { return (t._AnswerTypeId != enAnswerTypeId.FieldBasicType && t._AnswerTypeId != enAnswerTypeId.iAspireHidden); }) > -1) {
                    isPreSurveyQuestion = false;
                }
                if (isPreSurveyQuestion == true && this._question.answers.length > 1) {
                    var eleMulti = this.getMultiQuestionInColumn(returnValue);
                    if (eleMulti != null) {
                        Object.assign(eleMulti, returnValue);
                    }
                    returnValue = eleMulti;
                }
                else {
                    var eleOther = this.getQuestionByAnswer(this._question.answers[0]);
                    if (eleOther != null && eleOther.constructor.name == "IRadioGroupQuestion") {
                        var eleOther1 = eleOther;
                        eleOther1.type = enType.CheckBox;
                        Object.assign(eleOther1, returnValue);
                    }
                    else if (eleOther != null) {
                        Object.assign(eleOther, returnValue);
                    }
                    returnValue = eleOther;
                }
            }
        }
        else if (this.SelectionModeId == enSelectionModeId.DropDownList) {
            if (this.IsSameTypeAnswer) {
                //Selection text
                if (this.AnswerTypeId == enAnswerTypeId.SelectionTextType) {
                    var element = new IDropDownQuestion(returnValue, this._question.answers);
                    Object.assign(element, returnValue);
                    returnValue = element;
                }
                else {
                    var xmlControlIds = xmlControlList.map(function (item) { return item.AnswerTypeId; });
                    if (xmlControlIds.indexOf(Number(this.AnswerTypeId)) > -1) {
                        var element = new IDropDownQuestion(returnValue, this._question.answers);
                        Object.assign(element, returnValue);
                        var control = xmlControlList.find(function (c) { return c.AnswerTypeId == _this.AnswerTypeId; });
                        if (control != null) {
                            element.questiontype = control.name.toLowerCase();
                            element.setChoicesByUrl(control);
                        }
                        returnValue = element;
                    }
                    else {
                        console.error("Not Found: 1 this.AnswerTypeId = " + this.AnswerTypeId);
                    }
                }
            }
            else {
                //FOR PRESURVEY QUESTION
                if (this._question.answers.length > 1) {
                    var eleMulti = this.getMultiQuestionInColumn(returnValue);
                    if (eleMulti != null) {
                        Object.assign(eleMulti, returnValue);
                    }
                    returnValue = eleMulti;
                }
            }
        }
        else if (this.SelectionModeId == enSelectionModeId.Static) {
            var element = new IHtmlQuestion(returnValue, clsFunction.getSpaceIfTextObject(this._question.QuestionText));
            Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (this.SelectionModeId == enSelectionModeId.Matrix) {
            var element_1 = new IMatrixDropdownQuestion(returnValue);
            Object.assign(element_1, returnValue);
            returnValue.nquestion.Rows = [];
            returnValue.nquestion.Columns = [];
            // For ROWS
            if (this._question.childquestions && this._question.childquestions.length > 0) {
                this._question.childquestions.forEach(function (child) {
                    var itemText = clsFunction.getSpaceIfTextObject(child.QuestionText);
                    element_1.rows.push({ text: itemText, value: 'row', rowid: child.ChildQuestionId });
                    returnValue.nquestion.Rows.push({ RowId: child.ChildQuestionId, Name: itemText, _OprationType: '' });
                });
            }
            else {
            }
            //FOR COLUMNS
            if (this._question.answers && this._question.answers.length > 0) {
                this._question.answers.forEach(function (ans) {
                    element_1.columns.push(_this.getMatrixCoulmn(ans));
                    returnValue.nquestion.Columns.push({ ColumnId: ans._AnswerId, _OprationType: '', Name: clsFunction.getSpaceIfTextObject(ans.AnswerText), AnswerTypeId: ans._AnswerTypeId, isMandatory: returnValue.isRequired, Value: '' });
                });
            }
            returnValue = element_1;
        }
        else if (this.SelectionModeId == enSelectionModeId.MultiMatrix) {
            var element_2 = new IMatrixDropdownQuestion(returnValue);
            Object.assign(element_2, returnValue);
            returnValue.nquestion.Rows = [];
            returnValue.nquestion.Columns = [];
            if (this._question.childquestions && this._question.childquestions.length > 0) {
                this._question.childquestions.forEach(function (child) {
                    var itemText = clsFunction.getSpaceIfTextObject(child.QuestionText);
                    element_2.rows.push({ text: itemText, value: 'row', rowid: child.ChildQuestionId });
                    returnValue.nquestion.Rows.push({ RowId: child.ChildQuestionId, Name: itemText, _OprationType: '' });
                });
            }
            else {
                element_2.rows.push({ value: 'Row', text: ' ', rowid: 0 });
                returnValue.nquestion.Rows.push({ RowId: 0, Name: ' ', _OprationType: 'ignore' });
            }
            if (this._question.answers.length > 0) {
                this._question.answers.forEach(function (ans) {
                    element_2.columns.push(_this.getMatrixCoulmn(ans));
                    returnValue.nquestion.Columns.push({ ColumnId: ans._AnswerId, _OprationType: '', Name: clsFunction.getSpaceIfTextObject(ans.AnswerText), AnswerTypeId: ans._AnswerTypeId, isMandatory: returnValue.isRequired, Value: '' });
                });
            }
            /*
            //element.rows.push({value:'row', text:' ', rowid:0});
            this._question.answers.forEach(ans=> {
                element.columns.push(this.getMatrixCoulmn(ans));
            });
            */
            returnValue = element_2;
        }
        else {
            //DateTime [Check for Calender type with Date and Time]
            if (this._question.answers.filter(function (a) { return a._AnswerTypeId == enAnswerTypeId.FieldCalendarType || a._AnswerTypeId == enAnswerTypeId.FieldBasicType; }).length == 2 && this._question.answers.length == 2) {
                var element = new ITextQuestion(returnValue, enInputType.DateTime);
                Object.assign(element, returnValue);
                returnValue = element;
            }
            else if (this._question.answers.filter(function (a) { return a._AnswerTypeId == enAnswerTypeId.FieldBasicType || a._AnswerTypeId == enAnswerTypeId.iAspireHidden; }).length == 2 && this._question.answers.length == 2) {
                var elePanel_1 = new IPanelQuestion();
                Object.assign(elePanel_1, returnValue);
                this._question.answers.forEach(function (ans) {
                    var eleText = new ITextQuestion(returnValue, enInputType.Text);
                    Object.assign(elePanel_1, returnValue);
                    //eleText.defaultValue = ans.DefaultText;
                    eleText.placeHolder = ans.DefaultText;
                    eleText.name = ans._AnswerId.toString();
                    eleText.title = ' ';
                    eleText.startWithNewLine = false;
                    elePanel_1.elements.push(eleText);
                });
                returnValue = elePanel_1;
            }
            else {
                if (this._question.answers.length == 1) {
                    var eleOther = this.getQuestionByAnswer(this._question.answers[0]);
                    if (eleOther != null) {
                        Object.assign(eleOther, returnValue);
                    }
                    returnValue = eleOther;
                }
                else {
                    console.error("Impliment for multianswer text");
                }
            }
        }
        return returnValue;
    };
    QuestionType.prototype.getMultiQuestionInColumn = function (returnValue) {
        var element = new ITextQuestion(returnValue, enInputType.Text);
        if (this._question.answers.length < 3) {
            var arrVal_1 = [];
            this._question.answers.forEach(function (ans) {
                arrVal_1.push(ans.DefaultText);
            });
            element.placeHolder = arrVal_1.join(',');
        }
        return element;
        /*
        let elePanel: IPanelQuestion = new IPanelQuestion();
        this._question.answers.forEach(ans=> {
             let element: IBaseQuestion = this.getQuestionByAnswer(ans);
             if(element != null)
             {
                 element.name = ans._AnswerId.toString();
                 element.title = ' ';
                 element.startWithNewLine = false;
             }
             elePanel.elements.push(element);
        })
        return elePanel;
        */
    };
    QuestionType.prototype.getMatrixCoulmn = function (answer) {
        var returnValue = {};
        returnValue.columnid = answer._AnswerId;
        //returnValue.name = clsFunction.getSpaceIfTextObject(answer.AnswerText);
        returnValue.name = 'column';
        returnValue.title = clsFunction.getSpaceIfTextObject(answer.AnswerText);
        returnValue.isRequired = answer._Mandatory;
        //RadioGroup
        if (answer._AnswerTypeId == enAnswerTypeId.SelectionTextType) {
            returnValue.cellType = enMatrixCellType.RadioGroup;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.FieldBasicType ||
            answer._AnswerTypeId == enAnswerTypeId.FieldCalendarType ||
            answer._AnswerTypeId == enAnswerTypeId.FieldEmailType ||
            answer._AnswerTypeId == enAnswerTypeId.FieldPasswordType) {
            returnValue.cellType = enMatrixCellType.Text;
            returnValue.inputType = new __WEBPACK_IMPORTED_MODULE_1__NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeByID(answer._AnswerTypeId);
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.FieldLargeType) {
            returnValue.cellType = enMatrixCellType.Comment;
        }
        else if (answer._AnswerTypeId == 106 || (answer.answerType && answer.answerType.TypeNameSpace == "Votations.NSurvey.WebControls.UI.AnswerXmlListItem")) {
            returnValue.cellType = enMatrixCellType.DropDown;
            //returnValue.choices = [];
            if (answer.answerType != undefined) {
                returnValue.choicesByUrl = {
                    url: urlSetting.WAP_BASE + "XmlData/" + answer.answerType.XMLDataSource,
                    path: "NSurveyDataSource;XmlDataSource;XmlAnswers;XmlAnswer",
                    valueName: "AnswerValue",
                    titleName: "AnswerDescription"
                };
            }
        }
        return returnValue;
    };
    QuestionType.prototype.getQuestionByAnswer = function (answer) {
        var returnValue;
        if (answer == undefined)
            return returnValue;
        var xmlControlIds = xmlControlList.map(function (item) { return item.AnswerTypeId; });
        if (answer._AnswerTypeId == enAnswerTypeId.BooleanType || answer._AnswerTypeId == enAnswerTypeId.SelectionOtherType) {
            var element = new ICheckboxGroupQuestion(returnValue, this._question.answers);
            if (this._question._LayoutModeId == __WEBPACK_IMPORTED_MODULE_1__NSurveyModel__["b" /* NInfo */].LayoutModeId.Horizontal) {
                element.colCount = this._question.answers.length;
            }
            //Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.SelectionTextType || answer._AnswerTypeId == enAnswerTypeId.SelectionOtherType) {
            var element = new IRadioGroupQuestion(returnValue, this._question.answers);
            if (this._question._LayoutModeId == __WEBPACK_IMPORTED_MODULE_1__NSurveyModel__["b" /* NInfo */].LayoutModeId.Horizontal) {
                element.colCount = this._question.answers.length;
            }
            //Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.FieldBasicType
            || answer._AnswerTypeId == enAnswerTypeId.FieldEmailType
            || answer._AnswerTypeId == enAnswerTypeId.FieldPasswordType) {
            var inputType = new __WEBPACK_IMPORTED_MODULE_1__NSurveyModel__["a" /* NSurveyLogic */]().getAnswerTypeByID(answer._AnswerTypeId);
            var element = new ITextQuestion(returnValue, inputType);
            if (answer.DefaultText && answer.DefaultText.trim() != "") {
                //element.defaultValue = answer.DefaultText;
                element.placeHolder = answer.DefaultText;
            }
            //Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.FieldCalendarType) {
            var element = new ITextQuestion(returnValue, enInputType.Date);
            //Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.FieldLargeType) {
            var element = new ICommentQuestion(returnValue);
            //Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.ExtendedFreeTextBoxType) {
            var element = new ICKEditor(returnValue);
            //Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.iAspireHidden) {
            var element = new ITextQuestion(returnValue, enInputType.Text);
            //element.defaultValue = answer.DefaultText;
            element.placeHolder = answer.DefaultText;
            //Object.assign(element, returnValue);
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.ExtendedFileUploadType) {
            var element = new IFileUploadQuestion();
            returnValue = element;
        }
        else if (xmlControlIds.indexOf(Number(answer._AnswerTypeId)) > -1) {
            var element = new IDropDownQuestion(returnValue, this._question.answers);
            var control = xmlControlList.find(function (c) { return c.AnswerTypeId == answer._AnswerTypeId; });
            if (control != null) {
                element.questiontype = control.name.toLowerCase();
                element.setChoicesByUrl(control);
            }
            returnValue = element;
        }
        else if (answer._AnswerTypeId == enAnswerTypeId.iAspireSignature) {
            var element = new ISignaturePad(returnValue);
            returnValue = element;
        }
        if (this._question.answers.filter(function (a) { return (a._Mandatory && a._Mandatory + "" == 'true'); }).length > 0) {
            returnValue.isRequired = true;
        }
        return returnValue;
    };
    QuestionType.prototype.initilizeQuestion = function () {
        if (this._question == undefined)
            return {};
        var strTitle = " ";
        var strName = " ";
        if (this._question.QuestionText != null && this._question.QuestionText != undefined && this._question.QuestionText != "") {
            strName = strName.length > 70 ? strName.substr(0, 70) + "..." : strName;
            strTitle = clsFunction.getSpaceIfTextObject(this._question.QuestionText);
        }
        this._question.isSidebySide = this._question.isSidebySide || false;
        return {
            questionid: this._question.OldQuestionId,
            questiontype: '',
            name: strName,
            title: strTitle,
            answertypeid: 0,
            nquestion: this.setNQuestionData(this._question),
            readOnly: false,
            startWithNewLine: !eval(this._question.isSidebySide + ""),
        };
    };
    QuestionType.prototype.setNQuestionData = function (que) {
        var _this = this;
        var returnValue = {};
        returnValue.SurveyID = que._SurveyId;
        returnValue.QuestionID = que.OldQuestionId;
        returnValue.QuestionText = clsFunction.getSpaceIfTextObject(que.QuestionText);
        returnValue.PageNumber = que._PageNumber;
        returnValue.DisplayOrder = que._DisplayOrder;
        //returnValue.QuestionType = que.;
        returnValue.SelectionModeId = que._SelectionModeId;
        //returnValue.Answer = que.;
        //returnValue.Rows = que.;
        //returnValue.Columns = que.;
        //returnValue.LanguageCode = ;
        //returnValue.ColumnsNumber = que.;
        returnValue.MinSelectionRequired = que._MinSelectionRequired;
        returnValue.MaxSelectionAllowed = que._MaxSelectionAllowed;
        returnValue.LayoutModeId = que._LayoutModeId;
        returnValue.RandomizeAnswers = que._RandomizeAnswers;
        returnValue.RatingEnabled = que._RatingEnabled;
        returnValue.QuestionPipeAlias = que.QuestionPipeAlias;
        returnValue.QuestionIdText = clsFunction.getSpaceIfTextObject(que.QuestionIDText);
        returnValue.ShowHelpText = que.ShowHelpText;
        returnValue.Alias = que.Alias;
        returnValue.HelpText = que.HelpText;
        returnValue.isSidebySide = que.isSidebySide;
        returnValue.Answer = [];
        returnValue.ChildQuestion = que.childquestions;
        if (!returnValue.ChildQuestion) {
            returnValue.ChildQuestion = [];
        }
        que.answers.forEach(function (ans) {
            returnValue.Answer.push(_this.setNAnswerData(ans));
        });
        return returnValue;
    };
    QuestionType.prototype.setNAnswerData = function (ans) {
        var nAns = {};
        nAns.AnswerId = ans._AnswerId;
        nAns.AnswerTypeId = ans._AnswerTypeId;
        nAns.AnswerIDText = clsFunction.getSpaceIfTextObject(ans.AnswerIdText);
        nAns.Answertext = clsFunction.getSpaceIfTextObject(ans.AnswerText);
        nAns.DefaultText = clsFunction.getSpaceIfTextObject(ans.DefaultText);
        nAns.AnswerAlias = ans.AnswerAlias;
        nAns.AnswerPipeAlias = ans.AnswerPipeAlias;
        nAns.ImageURL = ans.ImageURL;
        nAns.isMandatory = ans._Mandatory;
        nAns.isRatePart = ans._RatePart;
        nAns.isSelected = ans._Selected;
        nAns.ScorePoint = ans._ScorePoint;
        nAns.SliderRange = ans.SliderRange;
        nAns.SliderValue = ans.SliderValue;
        nAns.SliderMin = ans.SliderMax;
        nAns.SliderMax = ans.SliderMax;
        nAns.isSliderAnimate = ans.SliderAnimate;
        nAns.SliderStep = ans.SliderStep;
        nAns.RegularExpressionId = ans._RegularExpressionId;
        return nAns;
    };
    return QuestionType;
}());
var IBaseQuestion = (function () {
    function IBaseQuestion() {
        this.answertypeid = 0;
    }
    return IBaseQuestion;
}());
var ITextQuestion = (function (_super) {
    __extends(ITextQuestion, _super);
    //defaultValue: string;
    //placeHolder:string;
    function ITextQuestion(que, _inputType) {
        _super.call(this);
        this.type = enType.Text;
        this.inputType = _inputType;
    }
    return ITextQuestion;
}(IBaseQuestion));
var ISignaturePad = (function (_super) {
    __extends(ISignaturePad, _super);
    function ISignaturePad(que) {
        _super.call(this);
        this.type = enType.SignaturePad;
    }
    return ISignaturePad;
}(IBaseQuestion));
var ICommentQuestion = (function (_super) {
    __extends(ICommentQuestion, _super);
    //iscommentineditor:boolean;
    function ICommentQuestion(que) {
        _super.call(this);
        //this.iscommentineditor = false;
        this.type = enType.Comment;
    }
    return ICommentQuestion;
}(IBaseQuestion));
var ICKEditor = (function (_super) {
    __extends(ICKEditor, _super);
    //defaultValue: string;
    //placeHolder: string;
    function ICKEditor(que) {
        _super.call(this);
        this.type = enType.Editor;
    }
    return ICKEditor;
}(IBaseQuestion));
var IFileUploadQuestion = (function (_super) {
    __extends(IFileUploadQuestion, _super);
    function IFileUploadQuestion() {
        _super.call(this);
        this.type = enType.FileUpload;
    }
    return IFileUploadQuestion;
}(IBaseQuestion));
var IHtmlQuestion = (function (_super) {
    __extends(IHtmlQuestion, _super);
    function IHtmlQuestion(que, HtmlString) {
        _super.call(this);
        this.type = enType.Html;
        this.html = HtmlString;
    }
    return IHtmlQuestion;
}(IBaseQuestion));
var IDropDownQuestion = (function (_super) {
    __extends(IDropDownQuestion, _super);
    function IDropDownQuestion(que, answers) {
        var _this = this;
        _super.call(this);
        this.type = enType.DropDown;
        this.choices = [];
        answers.forEach(function (ans) {
            _this.choices.push({ rowid: ans._AnswerId, value: ans._AnswerId.toString(), text: clsFunction.getSpaceIfTextObject(ans.AnswerText) });
        });
    }
    IDropDownQuestion.prototype.setChoicesByUrl = function (element) {
        this.choicesByUrl = {
            url: urlSetting.WAP_BASE + "XmlData/" + element.xmlFile,
            path: "NSurveyDataSource;XmlDataSource;XmlAnswers;XmlAnswer",
            valueName: "AnswerValue",
            titleName: "AnswerDescription"
        };
    };
    return IDropDownQuestion;
}(IBaseQuestion));
var IRadioGroupQuestion = (function (_super) {
    __extends(IRadioGroupQuestion, _super);
    function IRadioGroupQuestion(que, answers) {
        var _this = this;
        _super.call(this);
        this.type = enType.RadioGroup;
        this.choices = [];
        answers.forEach(function (ans) {
            ans.AnswerText = clsFunction.getSpaceIfTextObject(ans.AnswerText);
            if (ans._AnswerTypeId == enAnswerTypeId.SelectionOtherType) {
                _this.hasOther = true;
                _this.otherText = clsFunction.getSpaceIfTextObject(ans.AnswerText);
            }
            else {
                _this.choices.push({ rowid: ans._AnswerId, value: ans._AnswerId.toString(), text: clsFunction.getSpaceIfTextObject(ans.AnswerText) });
            }
        });
    }
    return IRadioGroupQuestion;
}(IBaseQuestion));
var ICheckboxGroupQuestion = (function (_super) {
    __extends(ICheckboxGroupQuestion, _super);
    function ICheckboxGroupQuestion(que, answers) {
        var _this = this;
        _super.call(this);
        this.type = enType.CheckBox;
        this.choices = [];
        answers.forEach(function (ans) {
            ans.AnswerText = clsFunction.getSpaceIfTextObject(ans.AnswerText);
            if (ans._AnswerTypeId == enAnswerTypeId.SelectionOtherType) {
                _this.hasOther = true;
                _this.otherText = clsFunction.getSpaceIfTextObject(ans.AnswerText);
            }
            else {
                _this.choices.push({ rowid: ans._AnswerId, value: ans._AnswerId.toString(), text: clsFunction.getSpaceIfTextObject(ans.AnswerText) });
            }
        });
    }
    return ICheckboxGroupQuestion;
}(IBaseQuestion));
var IMatrixDropdownQuestion = (function (_super) {
    __extends(IMatrixDropdownQuestion, _super);
    function IMatrixDropdownQuestion(que) {
        _super.call(this);
        this.type = enType.MatrixDropdown;
        this.choices = [];
        this.columns = [];
        this.rows = [];
    }
    return IMatrixDropdownQuestion;
}(IBaseQuestion));
var IPanelQuestion = (function (_super) {
    __extends(IPanelQuestion, _super);
    function IPanelQuestion() {
        _super.call(this);
        this.type = enType.Panel;
        this.elements = [];
    }
    return IPanelQuestion;
}(IBaseQuestion));
var enMatrixCellType;
(function (enMatrixCellType) {
    enMatrixCellType[enMatrixCellType["DropDown"] = 'dropdown'] = "DropDown";
    enMatrixCellType[enMatrixCellType["CheckBox"] = 'checkbox'] = "CheckBox";
    enMatrixCellType[enMatrixCellType["RadioGroup"] = 'radiogroup'] = "RadioGroup";
    enMatrixCellType[enMatrixCellType["Text"] = 'text'] = "Text";
    enMatrixCellType[enMatrixCellType["Comment"] = 'comment'] = "Comment";
    enMatrixCellType[enMatrixCellType["Boolean"] = 'boolean'] = "Boolean";
    enMatrixCellType[enMatrixCellType["DateTime"] = 'datetime'] = "DateTime";
    enMatrixCellType[enMatrixCellType["Date"] = 'date'] = "Date";
    enMatrixCellType[enMatrixCellType["Email"] = 'email'] = "Email";
    enMatrixCellType[enMatrixCellType["Password"] = 'password'] = "Password";
})(enMatrixCellType || (enMatrixCellType = {}));
var enType;
(function (enType) {
    enType[enType["Text"] = 'text'] = "Text";
    enType[enType["Html"] = 'html'] = "Html";
    enType[enType["RadioGroup"] = 'radiogroup'] = "RadioGroup";
    enType[enType["CheckBox"] = 'checkbox'] = "CheckBox";
    enType[enType["Comment"] = 'comment'] = "Comment";
    enType[enType["FileUpload"] = 'file'] = "FileUpload";
    enType[enType["Panel"] = 'panel'] = "Panel";
    enType[enType["Editor"] = 'editor'] = "Editor";
    enType[enType["DropDown"] = 'dropdown'] = "DropDown";
    enType[enType["MatrixDropdown"] = 'matrixdropdown'] = "MatrixDropdown";
    enType[enType["SignaturePad"] = 'signaturepad'] = "SignaturePad";
})(enType || (enType = {}));
var enInputType;
(function (enInputType) {
    enInputType[enInputType["Text"] = 'text'] = "Text";
    enInputType[enInputType["Color"] = 'color'] = "Color";
    enInputType[enInputType["Date"] = 'date'] = "Date";
    enInputType[enInputType["DateTime"] = 'datetime'] = "DateTime";
    enInputType[enInputType["Time"] = 'time'] = "Time";
})(enInputType || (enInputType = {}));
var enSelectionModeId;
(function (enSelectionModeId) {
    enSelectionModeId[enSelectionModeId["Checkbox"] = 2] = "Checkbox";
    enSelectionModeId[enSelectionModeId["DropDownList"] = 3] = "DropDownList";
    enSelectionModeId[enSelectionModeId["Matrix"] = 4] = "Matrix";
    enSelectionModeId[enSelectionModeId["MultiMatrix"] = 6] = "MultiMatrix";
    enSelectionModeId[enSelectionModeId["RadioButton"] = 1] = "RadioButton";
    enSelectionModeId[enSelectionModeId["Static"] = 5] = "Static";
})(enSelectionModeId || (enSelectionModeId = {}));
var enAnswerTypeId;
(function (enAnswerTypeId) {
    enAnswerTypeId[enAnswerTypeId["SelectionTextType"] = 1] = "SelectionTextType";
    enAnswerTypeId[enAnswerTypeId["SelectionOtherType"] = 2] = "SelectionOtherType";
    enAnswerTypeId[enAnswerTypeId["FieldBasicType"] = 3] = "FieldBasicType";
    enAnswerTypeId[enAnswerTypeId["XMLCountryList"] = 4] = "XMLCountryList";
    enAnswerTypeId[enAnswerTypeId["BooleanType"] = 20] = "BooleanType";
    enAnswerTypeId[enAnswerTypeId["FieldRequiredType"] = 21] = "FieldRequiredType";
    enAnswerTypeId[enAnswerTypeId["FieldCalendarType"] = 22] = "FieldCalendarType";
    enAnswerTypeId[enAnswerTypeId["FieldLargeType"] = 24] = "FieldLargeType";
    enAnswerTypeId[enAnswerTypeId["FieldEmailType"] = 26] = "FieldEmailType";
    enAnswerTypeId[enAnswerTypeId["FieldHiddenType"] = 27] = "FieldHiddenType";
    enAnswerTypeId[enAnswerTypeId["FieldPasswordType"] = 28] = "FieldPasswordType";
    enAnswerTypeId[enAnswerTypeId["SubscriberXMLList"] = 29] = "SubscriberXMLList";
    enAnswerTypeId[enAnswerTypeId["ExtendedFileUploadType"] = 30] = "ExtendedFileUploadType";
    enAnswerTypeId[enAnswerTypeId["ExtendedFreeTextBoxType"] = 31] = "ExtendedFreeTextBoxType";
    enAnswerTypeId[enAnswerTypeId["FieldSliderType"] = 56] = "FieldSliderType";
    enAnswerTypeId[enAnswerTypeId["iAspireHidden"] = 101] = "iAspireHidden";
    enAnswerTypeId[enAnswerTypeId["iAspireSignature"] = 102] = "iAspireSignature";
    enAnswerTypeId[enAnswerTypeId["iAspireEncrypted"] = 103] = "iAspireEncrypted";
    enAnswerTypeId[enAnswerTypeId["XmlActivitiesOfDailyLiving"] = 109] = "XmlActivitiesOfDailyLiving";
    enAnswerTypeId[enAnswerTypeId["XmlEvaluation"] = 111] = "XmlEvaluation";
    enAnswerTypeId[enAnswerTypeId["XmlGradeList"] = 59] = "XmlGradeList";
    enAnswerTypeId[enAnswerTypeId["XmlRelatedCompetencies"] = 106] = "XmlRelatedCompetencies";
    enAnswerTypeId[enAnswerTypeId["XmlShortTermObjectiveArticulation"] = 108] = "XmlShortTermObjectiveArticulation";
    enAnswerTypeId[enAnswerTypeId["XmlShortTermObjectiveLanguage"] = 110] = "XmlShortTermObjectiveLanguage";
    enAnswerTypeId[enAnswerTypeId["XmlStatus"] = 107] = "XmlStatus";
    enAnswerTypeId[enAnswerTypeId["XmlSubjectList"] = 60] = "XmlSubjectList";
    enAnswerTypeId[enAnswerTypeId["XmlCountryList"] = 4] = "XmlCountryList";
})(enAnswerTypeId || (enAnswerTypeId = {}));
var xmlControlList = [
    { AnswerTypeId: 109, xmlFile: 'ActivitiesofDailyLiving.xml', name: 'xmlactivitiesofdailyliving', title: 'XML - ActivitiesofDailyLiving' },
    { AnswerTypeId: 111, xmlFile: 'Evaluation.xml', name: 'xmlevaluation', title: 'XML - Evaluation' },
    { AnswerTypeId: 59, xmlFile: 'grades.xml', name: 'xmlgradelist', title: 'XML - Grade List' },
    { AnswerTypeId: 106, xmlFile: 'RelatedCompetencies.xml', name: 'xmlrelatedcompetencies', title: 'XML - Related Competencies' },
    { AnswerTypeId: 108, xmlFile: 'ShortTermObjectiveArticulation.xml', name: 'xmlshorttermobjectivearticulation', title: 'XML - ShortTermObjectiveArticulation' },
    { AnswerTypeId: 110, xmlFile: 'ShortTermObjectiveLanguage.xml', name: 'xmlshorttermobjectivelanguage', title: 'XML - ShortTermObjectiveLanguage' },
    { AnswerTypeId: 107, xmlFile: 'Status.xml', name: 'xmlstatus', title: 'XML - Status' },
    { AnswerTypeId: 60, xmlFile: 'subject.xml', name: 'xmlsubjectlist', title: 'XML - Subject List' },
    { AnswerTypeId: 4, xmlFile: 'countries.xml', name: 'xmlcountrylist', title: 'XML - CountryList' }
];
var preSurveyQuestionList = [
    { type: 'text', title: 'Employee', name: 'employeename', placeHolder: '##EmployeeName##,##EmployeeID##', },
    { type: 'text', title: 'Teacher', name: 'teachername', placeHolder: '##TeacherName##,##TeacherID##', },
    { type: 'text', title: 'iAspire User', name: 'username', placeHolder: '##iAspireUserName##,##iAspireUserID##', },
    //{ type:'text', title:'Site/Department/Region', name:'sitename', placeHolder:'##SiteName##,##SiteID##',},
    { type: 'text', title: 'Site', name: 'sitename', placeHolder: '##SiteName##,##SiteID##', },
    { type: 'text', title: 'Department', name: 'department', placeHolder: '##SiteName##,##SiteID##', },
    { type: 'text', title: 'School', name: 'schoolname', placeHolder: '##SchoolName##,##SchoolID##', },
    { type: 'text', title: 'Grade', name: 'gradename', placeHolder: '##GradeName##,##GradeID##', },
    { type: 'text', title: 'Subject', name: 'subject', placeHolder: '##SubjectName##,##SubjectID##', },
];
var clsFunction = (function () {
    function clsFunction() {
    }
    clsFunction.getSpaceIfTextObject = function (TextValue) {
        return typeof (TextValue) == 'object' ? ' ' : TextValue;
    };
    return clsFunction;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/SurveyJSJsonData.js.map

/***/ }),

/***/ 342:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_setting__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AuthService = (function () {
    function AuthService(_http) {
        this._http = _http;
        this.strBaseUrl = '';
        this.headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var urlSetting = new __WEBPACK_IMPORTED_MODULE_1__app_setting__["a" /* UrlConfig */](window);
        this.strBaseUrl = urlSetting.API_BASE;
    }
    AuthService.prototype.validateAccessID = function (accessID) {
        var headers = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Headers */]();
        headers.append("X-iA-AccessID", undefined);
        //headers.append('Access-Control-Allow-Headers', 'Content-Type');
        //headers.append('Access-Control-Allow-Methods', 'GET');
        //headers.append('Access-Control-Allow-Origin', '*');
        return this._http.get(this.strBaseUrl + "Users/Validate/" + accessID, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    AuthService.prototype.extractData = function (res) {
        console.log(res);
        var body = res.json();
        return body.data || {};
    };
    AuthService.prototype.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    AuthService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_http__["c" /* Http */]) === 'function' && _a) || Object])
    ], AuthService);
    return AuthService;
    var _a;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/auth.service.js.map

/***/ }),

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_x2js__ = __webpack_require__(745);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_x2js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_x2js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_setting__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NSurveyService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var NSurveyService = (function () {
    function NSurveyService(_http) {
        this._http = _http;
        this.strBaseUrl = '';
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        var AccessID = localStorage.getItem("AccessID");
        AccessID = JSON.parse(AccessID);
        this.headers.append("X-iA-AccessID", AccessID);
        var urlSetting = new __WEBPACK_IMPORTED_MODULE_4__app_setting__["a" /* UrlConfig */](window);
        this.strBaseUrl = urlSetting.API_BASE;
    }
    /**
     * Get Survey XMl from Survey by SurveyID
     * @param SurveyID
     */
    NSurveyService.prototype.getSurveyXml = function (SurveyID) {
        var _x2js = new __WEBPACK_IMPORTED_MODULE_3_x2js__();
        this.headers.append('Accept', 'application/xml');
        return this._http.get(this.strBaseUrl + "NSurvey/SurveyXML/" + SurveyID, { headers: this.headers }).map(function (res) { return _x2js.xml2js(res.text()); }).toPromise();
        //.map(res => JSON.parse((res.text(),'  ')))
    };
    /**
     * Delete Survey Question by QuestionID
     * @param QuestionID
     */
    NSurveyService.prototype.deleteQuestion = function (QuestionID) {
        return this._http.get(this.strBaseUrl + "NSurvey/QuestionDelete/" + QuestionID, { headers: this.headers }).toPromise();
    };
    /**
     * Create New Question In Survey
     * @param QuestionID
     */
    NSurveyService.prototype.createQuestion = function (question) {
        return this._http.post(this.strBaseUrl + "NSurvey/CreateQuestion", question, { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.changeQuestionDisplayOrder = function (QuestionId, DisplayOrder) {
        return this._http.get(this.strBaseUrl + "NSurvey/QuestionDisplayOrderChange?QuestionId=" + QuestionId + "&DisplayOrder=" + DisplayOrder, { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.updateQuestion = function (question) {
        return this._http.post(this.strBaseUrl + "NSurvey/UpdateQuestion", question, { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.getSurveyDetails = function (SurveyID) {
        return this._http.get(this.strBaseUrl + "NSurvey/SurveyDetails/" + SurveyID, { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.getSurveyTemplateCSS = function (SurveyID, LanguageCode) {
        if (LanguageCode == "")
            LanguageCode = null;
        return this._http.get(this.strBaseUrl + "NSurvey/SurveyLayout/" + SurveyID + "/" + LanguageCode, { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.getCSSContent = function (SurveyID, FileName) {
        return this._http.get(this.strBaseUrl + "NSurvey/SurveyCSSContent/" + SurveyID + "/" + FileName + "/", { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.deleteSurveyCSS = function (SurveyID, FileName) {
        return this._http.get(this.strBaseUrl + "NSurvey/SurveyCSSDelete/" + SurveyID + "/" + FileName + "/", { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.uploadSurveyCSS = function (formData) {
        //this.headers.set('Content-Type', 'multipart/form-data');
        //this.headers.append('Accept', 'application/json');
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
        var urlSetting = new __WEBPACK_IMPORTED_MODULE_4__app_setting__["a" /* UrlConfig */](window);
        var url = urlSetting.WAP_BASE + "AjaxWebForm.aspx";
        formData.append("DoAction", "UploadSurveyCSS");
        return this._http.post(url, formData, options).toPromise();
    };
    NSurveyService.prototype.saveSurveyCSS = function (SurveyLayout) {
        return this._http.post(this.strBaseUrl + "NSurvey/SurveyCSSSave", SurveyLayout, { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.updateSurveyDetails = function (SurveyDetails) {
        return this._http.post(this.strBaseUrl + "NSurvey/SurveyDetailsSave", SurveyDetails, { headers: this.headers }).toPromise();
    };
    NSurveyService.prototype.saveSurveyLayout = function (SurveyLayout) {
        return this._http.post(this.strBaseUrl + "NSurvey/SurveyLayoutSave", SurveyLayout, { headers: this.headers }).toPromise();
    };
    /*
    getLanguageList(SurveyID:string){
        return this._http.get(this.strBaseUrl + "NSurvey/Language/" + SurveyID, {headers: this.headers})
            .map(res => res.json());
    }
    getSurveyPageCount(SurveyID:string){
        return this._http.get(this.strBaseUrl + "NSurvey/PageCount/" + SurveyID, {headers: this.headers})
            .map((resp: Response) => resp.json());

    }
    */
    // from https://angular.io/docs/ts/latest/guide/server-communication.html
    NSurveyService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* Response */]) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        //console.error(errMsg);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(errMsg);
    };
    NSurveyService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object])
    ], NSurveyService);
    return NSurveyService;
    var _a;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/nsurvey.service.js.map

/***/ }),

/***/ 344:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false,
    ApiUrl: 'localhost:59795/',
    ApiPath: 'api/',
    WapUrl: 'localhost:4976/',
    WapPath: ''
};
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/environment.js.map

/***/ }),

/***/ 411:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 411;


/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(502);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(344);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(540);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/main.js.map

/***/ }),

/***/ 532:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_surveyjs_editor__ = __webpack_require__(409);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_surveyjs_editor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_surveyjs_editor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_knockout__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_survey_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_surveyjs_widgets__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_surveyjs_widgets___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_surveyjs_widgets__);
/* harmony export (immutable) */ __webpack_exports__["a"] = initCkEditor;



//import { CKEDITOR } from 'ckeditor'
var ckEditorConfig = {
    // justify,font,colorbutton
    extraPlugins: 'justify,font,panelbutton,colorbutton',
    toolbar: [
        { name: 'document', items: ['Source'] },
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', 'Subscript', 'Superscript'] },
        { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
        { name: 'colors', items: ['TextColor', 'BGColor'] },
        { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'PageBreak'] },
        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo'] },
        { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
    ],
    allowedContent: true,
    autoParagraph: false,
    enterMode: false,
};
function initCkEditor(Survey) {
    // UnComment if want to add in Toolbox
    __WEBPACK_IMPORTED_MODULE_2_surveyjs_widgets__["ckeditor"](__WEBPACK_IMPORTED_MODULE_1_survey_knockout__);
    //console.log("window", window);
    window["CKEDITOR"].plugins.addExternal('justify', window.location.origin + window.location.pathname + 'assets/ck-addon/justify/', 'plugin.js');
    window["CKEDITOR"].plugins.addExternal('panelbutton', window.location.origin + window.location.pathname + 'assets/ck-addon/panelbutton/', 'plugin.js');
    window["CKEDITOR"].plugins.addExternal('colorbutton', window.location.origin + window.location.pathname + 'assets/ck-addon/colorbutton/', 'plugin.js');
    window["CKEDITOR"].plugins.addExternal('font', window.location.origin + window.location.pathname + 'assets/ck-addon/font/', 'plugin.js');
    var CkEditor_ModalEditor = {
        afterRender: function (modalEditor, htmlElement) {
            var editor = window["CKEDITOR"].replace(htmlElement, ckEditorConfig);
            editor.config.autoParagraph = false;
            editor.config.enterMode = window["CKEDITOR"].ENTER_BR;
            editor.on("change", function () {
                modalEditor.editingValue = editor.getData();
            });
            editor.setData(modalEditor.editingValue);
        },
        destroy: function (modalEditor, htmlElement) {
            var instance = window["CKEDITOR"].instances[htmlElement.id];
            if (instance) {
                instance.removeAllListeners();
                window["CKEDITOR"].remove(instance);
            }
        }
    };
    __WEBPACK_IMPORTED_MODULE_0_surveyjs_editor__["SurveyPropertyModalEditor"].registerCustomWidget("html", CkEditor_ModalEditor);
    __WEBPACK_IMPORTED_MODULE_0_surveyjs_editor__["SurveyPropertyModalEditor"].registerCustomWidget("text", CkEditor_ModalEditor);
    var questionDef = __WEBPACK_IMPORTED_MODULE_0_surveyjs_editor__["SurveyQuestionEditorDefinition"].definition.questionbase;
    //questionDef.tabs.push({name: "title", index: 0});
    //SurveyEditor.defaultStrings.pe.tabs["title"] = "Title";
    var ind = questionDef.properties.indexOf("title");
    if (ind > -1)
        questionDef.properties.splice(ind, 1);
    /*
    //Modify Question Editor. Remove title from general and add it as a tab.
   
    var questionDef = SurveyEditor.SurveyQuestionEditorDefinition.definition.questionbase;
    questionDef.tabs.push({name: "title", index: 1});
    SurveyEditor.defaultStrings.pe.tabs["title"] = "Title";
    var ind = questionDef.properties.indexOf("title");
    if(ind > -1) questionDef.properties.splice(ind, 1);
    
    */
}
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/ck-editor.js.map

/***/ }),

/***/ 533:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_surveyjs_widgets__ = __webpack_require__(410);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_surveyjs_widgets___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_surveyjs_widgets__);
/* harmony export (immutable) */ __webpack_exports__["a"] = initSignaturePad;

function initSignaturePad(Survey) {
    __WEBPACK_IMPORTED_MODULE_0_surveyjs_widgets__["signaturepad"](Survey);
    /*
    var SignaturePad_ModalEditor = {
      name: "signature_pad",
      htmlTemplate: "<canvas class='signature'></canvas>",
      isFit : function(question) { return question["renderAs"] === 'signature_pad'; },
      afterRender: function(question, el) {
          var elS = el.querySelector("canvas");
          var me = this;
          me.signaturePad = new SignaturePad(elS);
          me.signaturePad.penColor = "#1ab394";
          me.signaturePad.fromDataURL(question.value);
          if(question.isReadOnly) {
            me.signaturePad.off();
          }
          me.signaturePad.onEnd = function() {
            var data = me.signaturePad.toDataURL();
            question.value = data;
          }
      },
      willUnmount: function(question, el) {
          this.signaturePad.off();
      }
    }
     
    Survey.CustomWidgetCollection.Instance.addCustomWidget(SignaturePad_ModalEditor);
    Survey.JsonObject.metaData.addProperty("text", {name: "renderAs", default: "standard", choices: ["standard", "signature_pad"]});
    */
}
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/signature_pad.js.map

/***/ }),

/***/ 534:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_angular__ = __webpack_require__(741);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_survey_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_survey_angular__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyFormDirectiveComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SurveyFormDirectiveComponent = (function () {
    function SurveyFormDirectiveComponent() {
    }
    Object.defineProperty(SurveyFormDirectiveComponent.prototype, "json", {
        set: function (value) {
            var surveyModel = new __WEBPACK_IMPORTED_MODULE_1_survey_angular__["ReactSurveyModel"](value);
            __WEBPACK_IMPORTED_MODULE_1_survey_angular__["SurveyNG"].render('surveyElement', { model: surveyModel });
        },
        enumerable: true,
        configurable: true
    });
    SurveyFormDirectiveComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Input */])(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], SurveyFormDirectiveComponent.prototype, "json", null);
    SurveyFormDirectiveComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Component */])({
            selector: 'survey',
            template: "<div class=\"survey-container contentcontainer codecontainer\"><div id=\"surveyElement\"></div></div>",
        }), 
        __metadata('design:paramtypes', [])
    ], SurveyFormDirectiveComponent);
    return SurveyFormDirectiveComponent;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/surveyForm.directive.js.map

/***/ }),

/***/ 535:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SurveyJSEditorSetting; });
var SurveyJSEditorSetting = (function () {
    function SurveyJSEditorSetting() {
    }
    SurveyJSEditorSetting.showJSONEditorTab = true;
    SurveyJSEditorSetting.showEmbededSurveyTab = false;
    SurveyJSEditorSetting.showTestSurveyTab = true;
    SurveyJSEditorSetting.showPropertyGrid = false;
    SurveyJSEditorSetting.showApplyButtonInEditors = false;
    SurveyJSEditorSetting.generateValidJSON = true;
    SurveyJSEditorSetting.showOptions = false;
    SurveyJSEditorSetting.showXMLCustomQuestion = false;
    SurveyJSEditorSetting.showPreSurveyQuestion = true;
    SurveyJSEditorSetting.questionTypes = ["text", "checkbox", "radiogroup", "dropdown", "comment", "html", "file", "radiogroup", "matrixdropdown"];
    return SurveyJSEditorSetting;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/surveyJsEditorSetting.js.map

/***/ }),

/***/ 536:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActiveUser; });
var ActiveUser = (function () {
    function ActiveUser() {
    }
    return ActiveUser;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/ActiveUser.js.map

/***/ }),

/***/ 537:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NSurveyXmlData; });
/* unused harmony export Question */
/* unused harmony export ChildQuestion */
/* unused harmony export Answer */
var NSurveyXmlData = (function () {
    //question: Question[];
    //multiLanguageText:MultiLanguageText[];
    //answerType: AnswerType[];
    //answer:Answer[];
    //answerProperty :AnswerProperty[];
    function NSurveyXmlData() {
    }
    NSurveyXmlData.prototype.loadData = function (objJson) {
        console.log(objJson);
        if (objJson == undefined || objJson.NSurveyForm == undefined) {
            throw new Error('Data could not be Null');
        }
        else {
            if (objJson.NSurveyForm.Question == undefined) {
                objJson.NSurveyForm.Question = [];
            }
            if (objJson.NSurveyForm.Answer == undefined) {
                objJson.NSurveyForm.Answer = [];
            }
            if (objJson.NSurveyForm.AnswerType == undefined) {
                objJson.NSurveyForm.AnswerType = [];
            }
            if (objJson.NSurveyForm.ChildQuestion == undefined) {
                objJson.NSurveyForm.ChildQuestion = [];
            }
            if (objJson.NSurveyForm.Question.constructor != Array) {
                var que = objJson.NSurveyForm.Question;
                objJson.NSurveyForm.Question = [];
                objJson.NSurveyForm.Question.push(que);
            }
            if (objJson.NSurveyForm.Answer.constructor != Array) {
                var ans = objJson.NSurveyForm.Answer;
                objJson.NSurveyForm.Answer = [];
                objJson.NSurveyForm.Answer.push(ans);
            }
            if (objJson.NSurveyForm.AnswerType.constructor != Array) {
                var ansType = objJson.NSurveyForm.AnswerType;
                objJson.NSurveyForm.AnswerType = [];
                objJson.NSurveyForm.AnswerType.push(ansType);
            }
            if (objJson.NSurveyForm.ChildQuestion.constructor != Array) {
                var child = objJson.NSurveyForm.ChildQuestion;
                objJson.NSurveyForm.ChildQuestion = [];
                objJson.NSurveyForm.ChildQuestion.push(child);
            }
        }
        objJson = objJson.NSurveyForm;
        if (objJson.Survey != undefined) {
            this.survey = objJson.Survey;
            if (objJson.Question.length > 0) {
                this.survey.question = objJson.Question.filter(function (item) { return item.ParentQuestionID == undefined; });
            }
            if (objJson.MultiLanguageText != undefined) {
                this.survey.multiLanguageText = objJson.MultiLanguageText;
            }
        }
        if (objJson.AnswerProperty != undefined && typeof (objJson.AnswerProperty) == "object") {
            var answer = objJson.Answer.filter(function (x) { return x._AnswerId == objJson.AnswerProperty; });
        }
        else if (objJson.AnswerProperty != undefined) {
            objJson.AnswerProperty.forEach(function (ansProp) {
                var answer = objJson.Answer.filter(function (x) { return x._AnswerId == ansProp._AnswerId; });
                answer.answerProperty.push(ansProp);
            });
        }
        if (this.survey.question && this.survey.question.length > 0) {
            this.survey.question.forEach(function (question) {
                var childQuestionList = objJson.ChildQuestion.filter(function (a) { return a._ParentQuestionId == question._QuestionId; });
                if (childQuestionList.length > 0) {
                    question.childquestions = [];
                    childQuestionList.forEach(function (child) {
                        child.ChildQuestionId = child.QuestionId;
                        question.childquestions.push(child);
                    });
                }
                question.answers = objJson.Answer.filter(function (x) { return x._QuestionId == question._QuestionId; });
                if (question.answers.length > 0) {
                    question.answers.forEach(function (ans) {
                        var _answerType = objJson.AnswerType.filter(function (x) { return x._AnswerTypeID == ans._AnswerTypeId; });
                        if (_answerType != undefined || _answerType.length > 0) {
                            ans.answerType = _answerType[0];
                        }
                    });
                }
            });
        }
    };
    return NSurveyXmlData;
}());
var AnswerType = (function () {
    function AnswerType() {
    }
    return AnswerType;
}());
var Survey = (function () {
    function Survey() {
    }
    return Survey;
}());
var Question = (function () {
    function Question() {
    }
    return Question;
}());
var ChildQuestion = (function () {
    function ChildQuestion() {
    }
    return ChildQuestion;
}());
var Answer = (function () {
    function Answer() {
    }
    return Answer;
}());
var AnswerProperty = (function () {
    function AnswerProperty() {
    }
    return AnswerProperty;
}());
var MultiLanguageText = (function () {
    function MultiLanguageText() {
    }
    return MultiLanguageText;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/NSurveyXmlData.js.map

/***/ }),

/***/ 538:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyErrorHandler; });
var MyErrorHandler = (function () {
    function MyErrorHandler() {
    }
    MyErrorHandler.prototype.handleError = function (error) {
        // do something with the exception
        console.error(error.stack);
    };
    return MyErrorHandler;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/app.ErrorHandler.js.map

/***/ }),

/***/ 539:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_ActiveUser__ = __webpack_require__(536);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__(342);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(authService) {
        this.authService = authService;
    }
    AppComponent.prototype.ngOnInit = function () {
        this.activeUser = new __WEBPACK_IMPORTED_MODULE_1__models_ActiveUser__["a" /* ActiveUser */]();
        this.initUser();
    };
    AppComponent.prototype.initUser = function () {
        var _this = this;
        //localStorage.setItem('AccessID','\"2cf3900e-120e-49dd-87b1-caa0efeb7d0b\"');
        var accessID = localStorage.getItem("AccessID");
        if (accessID !== null) {
            // add popup here, only fires if the accessID was saved
            accessID = JSON.parse(accessID);
            this.AccessID = accessID;
            this.authService.validateAccessID(accessID).subscribe(function (data) {
                _this.activeUser = data;
                //console.log("response",this.activeUser);
            }, function (error) {
                if (error.status == 401) {
                    window.location.href = "../#/login";
                }
                else {
                    console.log("myerror", error);
                }
            }, function () {
                //console.log("Finished")
            });
        }
        else {
            // user is not remembered, must log in
            this.resetUser();
            window.location.href = "../#/login";
        }
    };
    AppComponent.prototype.resetUser = function () {
        localStorage.clear();
        sessionStorage.clear();
        this.activeUser.isUserAuthorized = false;
        this.activeUser.UserID = null;
        this.AccessID = null;
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Q" /* Component */])({
            selector: 'app-root',
            template: '<router-outlet></router-outlet>',
            styleUrls: [],
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/app.component.js.map

/***/ }),

/***/ 540:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_ErrorHandler__ = __webpack_require__(538);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(539);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_surveyForm_directive__ = __webpack_require__(534);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__directives_surveyEditor_directive__ = __webpack_require__(339);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__SurveyEditor_surveyeditor_component__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__SurveyForm_surveyform_component__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_routing__ = __webpack_require__(541);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_auth_service__ = __webpack_require__(342);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { SimpleNotificationsModule } from 'angular2-notifications';
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            //BrowserAnimationsModule, SimpleNotificationsModule.forRoot()
            imports: [__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */], __WEBPACK_IMPORTED_MODULE_11__app_routing__["a" /* routing */],],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */], __WEBPACK_IMPORTED_MODULE_7__directives_surveyForm_directive__["a" /* SurveyFormDirectiveComponent */], __WEBPACK_IMPORTED_MODULE_8__directives_surveyEditor_directive__["a" /* SurveyEditorDirectiveComponent */], __WEBPACK_IMPORTED_MODULE_9__SurveyEditor_surveyeditor_component__["a" /* SurveyEditorComponent */],
                __WEBPACK_IMPORTED_MODULE_10__SurveyForm_surveyform_component__["a" /* SurveyFormComponent */],
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_12__services_auth_service__["a" /* AuthService */],
                { provide: Window, useValue: window },
                { provide: __WEBPACK_IMPORTED_MODULE_4__angular_common__["a" /* LocationStrategy */], useClass: __WEBPACK_IMPORTED_MODULE_4__angular_common__["b" /* HashLocationStrategy */] },
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_5__app_ErrorHandler__["a" /* MyErrorHandler */] }
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_6__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/app.module.js.map

/***/ }),

/***/ 541:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SurveyEditor_surveyeditor_component__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SurveyForm_surveyform_component__ = __webpack_require__(338);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });



var appRoutes = [
    { path: '', redirectTo: 'editor/2397', pathMatch: 'full' },
    { path: 'editor/:surveyID', pathMatch: 'full', component: __WEBPACK_IMPORTED_MODULE_1__SurveyEditor_surveyeditor_component__["a" /* SurveyEditorComponent */] },
    { path: 'surveyform', component: __WEBPACK_IMPORTED_MODULE_2__SurveyForm_surveyform_component__["a" /* SurveyFormComponent */] },
];
var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["b" /* RouterModule */].forRoot(appRoutes);
//# sourceMappingURL=F:/Projects/2. Working/SchoolProject/Source/aFinal Source/VM/EducationBusinessAdmin/Survey/SourceCode/src/app.routing.js.map

/***/ }),

/***/ 706:
/***/ (function(module, exports) {

module.exports = "#surveyEditorContainer .editor-tabs { display: none !important; } \r\n#nHeader {margin-bottom: 0;border-radius: 0;border-bottom: 1px solid #f3f3f4;border-top: 0;}\r\n#nHeader .navbar-header {margin-left: -15px;background-color: #92e3f2;}\r\n#nHeader .SurveyTitle {padding: 20px 10px 10px 20px;font-size: 20px;font-weight: bold;}\r\n#nHeader .navbar-right .btn-success:hover {background-color:#489048; }\r\n#nHeader .navbar-right .btn-success:focus {background-color:#489048; }\r\n\r\n\r\n.col-lg-2.col-md-2.col-sm-1.col-xs-1.svd_toolbox { overflow-y: auto; height: 82vh;}\r\n.panel.card.svd_content { padding-top: 10px; padding-bottom: 2px; }\r\n\r\n/* LOADING CLASS */\r\n.loaderContainer {background-color: #ffffffe6 ;z-index: 1100;position: fixed;width: 100%;height: 100%; }\r\n\r\n/* Button Style */\r\n.nbtn {   border-radius: 2px;  padding: 0.6em 1em;  font-size: 1em;  line-height: 1em;  min-width: 6em; }\r\n.nbtn-primary {  background-color: #1ab394 !important;  border-color: #1ab394 !important; }\r\n.nbtn-primary:active { color: #fff;  background-color: #204d74 !important; border-color: #122b40 !important; }\r\n.nbtn-small {  font-size: 0.85em !important;  font-weight: bold !important; }\r\n\r\n/* Layout Modal  Style */\r\n.modal-ku {   width: 750px;  margin: 40px auto; }\r\n#modalLayout .modal-body {   padding: 0px !important; }\r\n\r\n/* TAB Style */\r\n.tabbable-panel {  border:1px solid #eee;  /*padding: 10px;*/ }\r\n.tabbable-line > .nav-tabs {   border: none;  margin: 0px;  background-color: #f9f9f9;}\r\n.tabbable-line > .nav-tabs > li {   margin-right: 2px;}\r\n.tabbable-line > .nav-tabs > li > a {   border: 0;  margin-right: 0;  color: #737373;}\r\n.tabbable-line > .nav-tabs > li > a > i {   color: #a6a6a6;}\r\n.tabbable-line > .nav-tabs > li.open, .tabbable-line > .nav-tabs > li:hover {   border-bottom: 4px solid #b8e8df;  /*border-bottom: 4px solid #fbcdcf*/}\r\n.tabbable-line > .nav-tabs > li.open > a, .tabbable-line > .nav-tabs > li:hover > a {   border: 0;  background: none !important;  color: #333333;}\r\n.tabbable-line > .nav-tabs > li.open > a > i, .tabbable-line > .nav-tabs > li:hover > a > i {   color: #a6a6a6;}\r\n.tabbable-line > .nav-tabs > li.open .dropdown-menu, .tabbable-line > .nav-tabs > li:hover .dropdown-menu {  margin-top: 0px;}\r\n.tabbable-line > .nav-tabs > li.active {  border-bottom: 4px solid #1ab394;  /*border-bottom: 4px solid #f3565d*/  position: relative;}\r\n.tabbable-line > .nav-tabs > li.active > a {  border: 0;  color: #333333;  background-color: #f9f9f9;}\r\n.tabbable-line > .nav-tabs > li.active > a > i {  color: #404040;}\r\n.tabbable-line > .tab-content {   margin-top: -3px;  background-color: #fff;  border: 0;  border-top: 1px solid #eee;  /* padding: 15px 0; */  padding: 25px;}\r\n.portlet .tabbable-line > .tab-content {  padding-bottom: 0;}\r\n\r\n \r\n.layoutError { color:red;font-weight: bold;}\r\n.layoutSuccess { color:#008000;font-weight: bold; }"

/***/ }),

/***/ 707:
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"isLoading\" class=\"loaderContainer\">\r\n    <div class=\"spincontainer\">\r\n        <div class=\"spinner\"></div>\r\n    </div>\r\n</div>\r\n\r\n<!-- <input type=\"button\" value=\"Test\" (click)=\"TestFunction($event)\"> -->\r\n\r\n<nav id=\"nHeader\" class=\"navbar\">\r\n    <div class=\"container-fluid\">\r\n        <div class=\"navbar-header\">\r\n            <img height=\"60px\" width=\"227px\" style=\"margin: 5px 10px;\" src=\"assets\\images\\MainLogo.png\" alt=\"Logo\" />\r\n        </div>\r\n        <ul class=\"nav navbar-nav\">\r\n            <li class=\"active\">\r\n                <div class=\"SurveyTitle\">{{surveyTitle}}</div>\r\n            </li>\r\n        </ul>\r\n        <ul class=\"nav navbar-nav navbar-right\">\r\n            <li style=\"padding: 10px;\">\r\n                <a href=\"{{backUrl}}\" class=\"btn btn-success nbtn nbtn-primary\" style=\"padding: 10px 15px;\">\r\n                    <i class=\"glyphicon glyphicon-arrow-left\" aria-hidden=\"true\"></i> Back to Form List</a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</nav>\r\n\r\n<!-- <div class=\"row\" style=\"background-color:#f3f3f4;padding: 15px;margin: 0;border: none;position: relative; margin-bottom: -57px;\">\r\n    <div class=\"col-lg-2 col-md-2 col-sm-1 col-xs-1 svd_toolbox\">&nbsp;</div>    \r\n    <div class=\"col-xs-11 svd_editors col-lg-10 col-md-10 col-sm-11\">\r\n        <span style=\"margin-right: 7px;\">\r\n            <button type=\"button\" class=\"btn btn-primary nbtn-small nbtn nbtn-primary\">Survey Preview</button>\r\n        </span>\r\n        <span style=\"margin-right: 7px;\">\r\n            <button type=\"button\" class=\"btn btn-primary nbtn-small nbtn nbtn-primary\">Layout</button>\r\n        </span>\r\n    </div>  \r\n</div> -->\r\n\r\n<survey-editor [json]=\"json\" (onQuestionAdded)=\"questionAdded($event)\" (onQuestionModified)=\"questionModified($event)\" (onQuestionRemoved)=\"questionDeleted($event)\"\r\n    (onQuestionChangeOrder)=\"questionOrderChanged($event)\" (onLayoutClick)=\"LayoutButton_Click($event)\" \r\n    (onSaveSurveyDetails)=\"saveSurveyDetails($event)\">\r\n</survey-editor>\r\n\r\n<!-- <simple-notifications [options]=\"options\"></simple-notifications> -->\r\n\r\n<div class=\"modal fade\" id=\"modalLayout\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modalSurveyLabel\">\r\n    <div class=\"modal-dialog modal-ku\" role=\"document\">\r\n        <div class=\"modal-content\">\r\n            <form class=\"form-horizontal\">\r\n                <div class=\"modal-header\">\r\n                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n                        <span aria-hidden=\"true\">&times;</span>\r\n                    </button>\r\n                    <h4 class=\"modal-title\" id=\"modalSurveyLabel\">Survey Layout</h4>\r\n                </div>\r\n                <div class=\"modal-body\">\r\n                    <div id=\"surveyContainerInPopup\">\r\n                        <div class=\"tabbable-panel\">\r\n                            <div class=\"tabbable-line\">\r\n                                <ul class=\"nav nav-tabs \">\r\n                                    <li class=\"active\">\r\n                                        <a href=\"#tab_default_1\" data-toggle=\"tab\">CSS Template File</a>\r\n                                    </li>\r\n                                    <li>\r\n                                        <a href=\"#tab_default_2\" data-toggle=\"tab\">Upload File</a>\r\n                                    </li>\r\n                                </ul>\r\n                                <div class=\"tab-content\">\r\n                                    <div class=\"tab-pane active\" id=\"tab_default_1\">\r\n                                        <div class=\"form-group\">\r\n                                            <div class=\"alert alert-danger\" *ngIf=\"this.LayoutFormData.ErrorMessage.length > 0\">\r\n                                                <strong>Error! </strong> {{this.LayoutFormData.ErrorMessage}}.\r\n                                            </div>\r\n                                            <div class=\"alert alert-success\" *ngIf=\"this.LayoutFormData.SuccessMessage.length > 0\">\r\n                                                <strong>Success! </strong> {{this.LayoutFormData.SuccessMessage}}.\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"form-group\">\r\n                                            <label class=\"control-label col-sm-3\" for=\"email\">Css template File:</label>\r\n                                            <div class=\"col-sm-9\">\r\n                                                <select name=\"ddlLayoutCss\" class=\"form-control\" [(ngModel)]=\"LayoutFormData.LayoutCss\" (ngModelChange)=\"onChangeCSS($event)\">\r\n                                                        <option *ngFor=\"let item of lstLayoutCSS\" [value]=\"item.value\"\r\n                                                        [attr.selected]=\"item.selected== true ? true : null\" >{{item.text}}</option>\r\n                                                </select>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"form-group\"> \r\n                                            <div class=\"col-sm-offset-3 col-sm-9\">\r\n                                                <div class=\"pull-right\">\r\n                                                    <button type=\"button\" class=\"btn btn-primary nbtn nbtn-primary\" (click)=\"EditCSS_click()\">Edit</button>\r\n                                                    <button type=\"button\" class=\"btn btn-primary nbtn nbtn-primary\" (click)=\"DeleteCSS_click()\">Delete</button>\r\n                                                    <button type=\"button\" class=\"btn btn-primary nbtn nbtn-primary\" (click)=\"DownloadCSS_click()\">Download</button>\r\n                                                </div>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"form-group\" *ngIf=\"LayoutFormData.isEditCss == true\"> \r\n                                            <label class=\"control-label col-sm-3\" for=\"email\">Edit CSS:</label>\r\n                                            <div class=\"col-sm-9\">\r\n                                                <textarea name=\"txtEditCss\" [(ngModel)]=\"LayoutFormData.EditCss\" cols=\"20\" rows=\"10\" class=\"form-control\"></textarea>\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"form-group\"> \r\n                                            <div class=\"col-sm-offset-3 col-sm-9\">\r\n                                                <button type=\"button\" *ngIf=\"this.LayoutFormData.isEditCss == true\" class=\"btn btn-primary nbtn nbtn-primary\" (click)=\"SaveEditCSS_click()\">Update</button>\r\n                                                <button type=\"button\" *ngIf=\"this.LayoutFormData.isEditCss == true\" class=\"btn btn-default nbtn\" (click)=\"EdirCancel_click()\">Cancel</button>\r\n                                                \r\n                                                <button type=\"button\" *ngIf=\"this.LayoutFormData.isEditCss == false\" class=\"btn btn-primary nbtn nbtn-primary\" (click)=\"SaveLayout_click()\">Save</button>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"tab-pane\" id=\"tab_default_2\">\r\n                                        <div class=\"form-group\">\r\n                                            <div class=\"alert alert-danger\" *ngIf=\"this.LayoutFormData.ErrorMessageUpload.length > 0\">\r\n                                                <strong>Error! </strong> {{this.LayoutFormData.ErrorMessageUpload}}.\r\n                                            </div>\r\n                                            <div class=\"alert alert-success\" *ngIf=\"this.LayoutFormData.SuccessUploadMessage.length > 0\">\r\n                                                <strong>Success! </strong> {{this.LayoutFormData.SuccessUploadMessage}}.\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"form-group\">\r\n                                            <label class=\"control-label col-sm-3\" for=\"pwd\">Select File:</label>\r\n                                            <div class=\"col-sm-9\">\r\n                                                <input #fuUploadCSS type=\"file\" name=\"fuCss\" style=\"width: 100%;padding: 8px 0;\" (change)=\"fileChange($event)\" placeholder=\"Upload file\" accept=\".css\" >\r\n                                            </div>\r\n                                        </div>\r\n                                        <div class=\"form-group\"> \r\n                                            <div class=\"col-sm-offset-3 col-sm-9\">\r\n                                                <button type=\"button\" class=\"btn btn-primary nbtn nbtn-primary\" (click)=\"Upload_click()\">Upload</button>\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!-- <div class=\"modal-footer\">\r\n                    <button type=\"button\" class=\"btn btn-default nbtn\" data-dismiss=\"modal\">Close</button>\r\n                </div> -->\r\n            </form>\r\n \r\n        </div>\r\n    </div>\r\n</div>"

/***/ }),

/***/ 747:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(412);


/***/ })

},[747]);
//# sourceMappingURL=main.bundle.map