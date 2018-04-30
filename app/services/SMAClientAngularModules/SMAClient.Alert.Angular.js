(function () {

    "use strict";

    angular
        .module("SMAAlert", []);
    angular
        .module("SMAAlert")
        .config(config)
        .run(run)
        .factory("SMAAlertBaseFactory", ["SMAAlertGlobalValues", factory])
        .factory("SMAAlertGlobalValues", value)
        .factory("SMAAlertDisplay", ["SMAAlertGlobalValues", display])
        .factory("SMAAlertFactory", ["SMAAlertBaseFactory", "SMAAlertGlobalValues", "SMAAlertDisplay", controller]);

    function value() {
        /*jshint validthis:true */
        var val = this;

        val.CurrentAlertIndex = 0;
        val.BlurAndDarken = false;
        val.ActiveAlertsCounter = 0;
        val.ActiveAlerts = [];

        val.GetAlertIndex = getAlertIndex;
        val.HeaderText = "Alert";
        val.BodyText = "";
        val.FooterText1 = "YES";
        val.FooterText2 = "NO";
        val.TransitionEvent = getTransitionEventName;
        val.TransitionName = getTransitionName;
        val.TransformName = getTransformName;
        val.AnimationEvent = getAnimationEventName;
        val.HeaderImageHeight = 43;
        val.HeaderImageWidth = 183;

        return val;

        function getAlertIndex() {
            return val.CurrentAlertIndex++;
        }

        function getTransitionEventName() {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transitionend',
                'WebkitTransition': 'webkitTransitionEnd',
                'MozTransition': 'transitionend',
                'MSTransition': 'msTransitionEnd',
                'OTransition': 'oTransitionEnd'
            };

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }

        function getTransitionName() {
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'transition': 'transition',
                'WebkitTransition': 'WebkitTransition',
                'MozTransition': 'MozTransition',
                'MSTransition': 'MSTransition',
                'OTransition': 'OTransition'
            };

            for (t in transitions) {
                if (el.style[t] !== undefined) {
                    return transitions[t];
                }
            }
        }

        function getTransformName() {
            var t;
            var el = document.createElement('fakeelement');
            var transforms = {
                'transform': 'transform',
                'WebkitTransform': 'WebkitTransform',
                'MozTransform': 'MozTransform',
                'MSTransform': 'MSTransform',
                'OTransform': 'OTransform'
            };
            for (t in transforms) {
                if (el.style[t] !== undefined) {
                    return transforms[t];
                }
            }
        }

        function getAnimationEventName() {
            var t;
            var el = document.createElement('fakeelement');
            var transforms = {
                'animation': 'animationend',
                'WebkitAnimation': 'webkitAnimationEnd',
                'OAnimation': 'oanimationend',
                'MSAnimation': 'MSAnimationEnd'
            };
            for (t in transforms) {
                if (el.style[t] !== undefined) {
                    return transforms[t];
                }
            }
            console.error("No Animation event found");
        }
    }

    function config() {
        /*jshint validthis:true */
        var conf = this;

        return conf;
    }

    function run() {
        /*jshint validthis:true */
        var ru = this;

        return ru;
    }

    function factory(SMAAlertGlobalValues) {
        /*jshint validthis:true */
        var fac = this;

        fac.CreateHeader = createHeader;
        fac.CreateBody = createBody;
        fac.CreateFooter = createFooter;
        fac.CreateBaseAlert = createBaseAlert;

        return fac;

        function createHeader(divID, titleText, excludeHeaderImageBoolean, excludeHeaderTextBoolean) {
            // create image header
            var titleContainer = document.createElement('div');
            titleContainer.id = divID + "TitleContainer";
            titleContainer.className = "TitleContainerPosition TitleContainer";

            var titleWrapper = document.createElement('div');
            titleWrapper.id = divID + "TitleWrapper";
            titleWrapper.className = "TitleWrapperPosition TitleWrapper";

            var titleImageWrapper = document.createElement('div');
            titleImageWrapper.id = divID + "TitleImageWrapper";
            titleImageWrapper.className = "TitleImageWrapperPosition TitleImageWrapper";

            var titleImage = document.createElement('div');
            titleImage.id = divID + "TitleImage";
            titleImage.className = "TitleImagePosition TitleImage";

            // create left/right padding with dismiss button
            var leftOfImage = document.createElement("div");
            leftOfImage.id = divID + "LeftOfImage";
            leftOfImage.className = "LeftOfImagePosition LeftOfImage";
            //leftOfImage.innerHTML = "X";

            var rightOfImage = document.createElement("div");
            rightOfImage.id = divID + "RightOfImage";
            rightOfImage.className = "RightOfImagePosition RightOfImage";
            //rightOfImage.innerHTML = "X";


            // create text header
            var titleLabelWrapper = document.createElement('div');
            titleLabelWrapper.id = divID + "TitleLabelWrapper";
            titleLabelWrapper.className = "TitleLabelWrapperPosition TitleLabelWrapper";

            var titleLabel = document.createElement('label');
            titleLabel.id = divID + "Title";
            titleLabel.className = "TitleLabelPosition TitleLabel";
            titleLabel.innerHTML = titleText;

            // assemble header
            if (excludeHeaderImageBoolean === false) {
                titleImageWrapper.appendChild(leftOfImage);
                titleImageWrapper.appendChild(titleImage);
                titleImageWrapper.appendChild(rightOfImage);
            }
            if (excludeHeaderTextBoolean === false) {
                titleWrapper.appendChild(titleImageWrapper);
                titleLabelWrapper.appendChild(titleLabel);
            }
            titleWrapper.appendChild(titleLabelWrapper);
            titleContainer.appendChild(titleWrapper);

            return titleContainer;
        }

        function createBody(divID, bodyText) {
            // create body
            var bodyContainer = document.createElement('div');
            bodyContainer.id = divID + "BodyContainer";
            bodyContainer.className = "BodyContainerPosition BodyContainer";
            // this kind of has to be fudged
            bodyContainer.style.maxHeight = (window.innerHeight - SMAAlertGlobalValues.HeaderImageHeight - 40 - 40 - 40 - 20);

            var bodyWrapper = document.createElement('div');
            bodyWrapper.id = divID + "BodyWrapper";
            bodyWrapper.className = "BodyWrapperPosition BodyWrapper";

            var body = document.createElement('div');
            body.id = divID + "Body";
            body.className = "BodyPosition Body";
            body.innerHTML = bodyText;

            // assemble body
            bodyWrapper.appendChild(body);
            bodyContainer.appendChild(bodyWrapper);

            return bodyContainer;
        }

        function createFooter(divID, footerText) {
            if (!footerText) {
                footerText = "Dismiss Message";
            }
            // create footer
            var footerContainer = document.createElement('div');
            footerContainer.id = divID + "FooterContainer";
            footerContainer.className = "FooterContainerPosition FooterContainer";

            var footerWrapper = document.createElement('div');
            footerWrapper.id = divID + "FooterWrapper";
            footerWrapper.className = "FooterWrapperPosition FooterWrapper";

            var footerButton = document.createElement('div');
            footerButton.id = divID + "FooterButton";
            footerButton.className = "FooterButtonPosition FooterButton";
            footerButton.innerHTML = footerText;

            // assemble footer
            footerWrapper.appendChild(footerButton);
            footerContainer.appendChild(footerWrapper);

            return footerContainer;
        }

        function createBaseAlert(divID, titleText, bodyText, excludeHeaderImageBoolean, excludeHeaderTextBoolean, excludeBodyBoolean) {
            if (excludeHeaderImageBoolean !== true) {
                excludeHeaderImageBoolean = false;
            }
            if (excludeHeaderTextBoolean !== true) {
                excludeHeaderTextBoolean = false;
            }
            if (excludeBodyBoolean !== true) {
                excludeBodyBoolean = false;
            }
            //if (excludeFooterBoolean !== true) {
            //    excludeFooterBoolean = false;
            //}

            // create element
            var block = document.createElement('div');
            block.id = divID;
            block.className = "SMAClientAlertContainer";

            var innerBlock = document.createElement('div');
            innerBlock.id = divID + "InnerBlock";
            innerBlock.className = "AlertPosition Alert";
            innerBlock.style.maxHeight = window.innerHeight - 10;
            innerBlock.style.maxWidth = window.innerWidth - 10;

            // get header
            var headerContainer = document.createElement("div");
            if (excludeHeaderImageBoolean === false || excludeHeaderTextBoolean === false) {
                headerContainer = createHeader(divID, titleText, excludeHeaderImageBoolean, excludeHeaderTextBoolean);
            }

            // get body
            var bodyContainer = document.createElement("div");
            if (excludeBodyBoolean === false) {
                bodyContainer = createBody(divID, bodyText);
            }

            // get footer
            var footerContainer = document.createElement("div");
            //if (excludeFooterBoolean === false) {
            //    footerContainer = alertHelper.createFooter(divID, footerText);
            //}

            // set up element
            innerBlock.appendChild(headerContainer);
            innerBlock.appendChild(bodyContainer);
            innerBlock.appendChild(footerContainer);

            block.appendChild(innerBlock);

            // set up alert resize
            window.onresize = function () {
                innerBlock.style.maxHeight = window.innerHeight - 10;
                innerBlock.style.maxWidth = window.innerWidth - 10;
                bodyContainer.style.maxHeight = window.innerHeight - headerContainer.offsetHeight - 60;
            };

            // return element
            return block;
        }
    }

    function display(SMAAlertGlobalValues) {
        /*jshint validthis:true */
        var disp = this;

        disp.ShowAlert = showAlert;
        disp.RemoveAlert = removeAlert;
        disp.RemoveAllAlerts = removeAllAlerts;

        return disp;

        function showAlert(block) {
            //var didAnimationComplete = false;
            if (SMAAlertGlobalValues.ActiveAlertsCounter === 0) {
                SMAAlertGlobalValues.BlurAndDarken = true;
            }
            SMAAlertGlobalValues.ActiveAlertsCounter += 1;
            SMAAlertGlobalValues.ActiveAlerts.push(block.id);

            if (SMAAlertGlobalValues.BlurAndDarken === true) {
                var bg = document.createElement('div');
                bg.id = "bg";
                bg.className = "SMAClientAlertContainer SMAClientAlertBlur SMAClientAlertDarken";
                document.body.appendChild(bg);
                SMAAlertGlobalValues.BlurAndDarken = false;
            }
            block.firstChild.classList.add("AnimateIn");
            document.body.appendChild(block);
        }

        function removeAlert(divID) {
            //var didAnimationFinish = false;
            var index = SMAAlertGlobalValues.ActiveAlerts.indexOf(divID);
            if (index > -1) {
                SMAAlertGlobalValues.ActiveAlerts.splice(index, 1);
            }
            var transitionEventString = SMAAlertGlobalValues.TransitionEvent();
            var alertDiv = document.getElementById(divID.toString());
            alertDiv.addEventListener(SMAAlertGlobalValues.AnimationEvent(), animationEnd);
            function animationEnd() {
                alertDiv.parentElement.removeChild(alertDiv);
                SMAAlertGlobalValues.ActiveAlertsCounter -= 1;
                if (SMAAlertGlobalValues.ActiveAlertsCounter === 0) {
                    var bg = document.getElementById("bg");
                    bg.parentNode.removeChild(bg);
                }
            }
            alertDiv.firstChild.classList.add("AnimateOut");
        }

        function removeAllAlerts() {
            for (var i = SMAAlertGlobalValues.ActiveAlerts.length - 1; i >= 0; i--) {
                removeAlert(SMAAlertGlobalValues.ActiveAlerts[i]);
            }
        }
    }

    function controller(SMAAlertBaseFactory, SMAAlertGlobalValues, SMAAlertDisplay) {
        /*jshint validthis:true */
        var cont = this;

        cont.CreateSpinnerAlert = createSpinnerAlert;
        cont.CreateLoadingAlert = createLoadingAlert;
        cont.CreateLoadingBarAlert = createLoadingBarAlert;
        cont.CreateInfoAlert = createInfoAlert;
        cont.CreateSuccessAlert = createSuccessAlert;
        cont.CreateErrorAlert = createErrorAlert;
        cont.CreateWarningAlert = createWarningAlert;
        cont.CreateConfirmAlert = createConfirmAlert;
        cont.CreateConfirmAlertWithCancel = createConfirmAlertWithCancel;
        cont.CreateWebPageAlert = createWebPageAlert;
        cont.CreateCustomAlert = createCustomAlert;
        cont.RemoveAllAlerts = removeAllAlerts;

        return cont;

        function createSpinnerAlert(headerText, successCallback, failCallback) {
            var divID = "SMAClientAlert" + SMAAlertGlobalValues.GetAlertIndex();
            var headText = headerText || "Loading" || SMAAlertGlobalValues.HeaderText;

            var block = SMAAlertBaseFactory.CreateBaseAlert(divID, headText, "");
            // add info class
            block.firstChild.classList.add("Info");

            // create progress element
            var progress = document.createElement("progress");

            block.firstChild.childNodes[1].firstChild.firstChild.innerHTML = "";
            block.firstChild.childNodes[1].firstChild.firstChild.appendChild(progress);

            SMAAlertDisplay.ShowAlert(block);
            var returnProm = {
                resolve: null,
                reject: null
            };
            new Promise(function (resolve, reject) {
                returnProm.resolve = resolve;
                returnProm.reject = reject;
            }).then(function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (successCallback && typeof (successCallback) == "function") {
                    successCallback(val);
                }
            }, function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (failCallback && typeof (failCallback) == "function") {
                    failCallback(val);
                }
            });

            return returnProm;
        }
        function createLoadingAlert() {

        }
        function createLoadingBarAlert() {

        }
        function createInfoAlert(headerText, bodyText, successCallback, failCallback) {
            var divID = "SMAClientAlert" + SMAAlertGlobalValues.GetAlertIndex();
            var headText = headerText || "Info" || SMAAlertGlobalValues.HeaderText;
            var bodText = bodyText || "" || SMAAlertGlobalValues.BodyText;

            var block = SMAAlertBaseFactory.CreateBaseAlert(divID, headText, bodText);
            // add info class
            block.firstChild.classList.add("Info");

            // create progress element

            SMAAlertDisplay.ShowAlert(block);
            var returnProm = {
                resolve: null,
                reject: null
            };
            new Promise(function (resolve, reject) {
                returnProm.resolve = resolve;
                returnProm.reject = reject;
            }).then(function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (successCallback && typeof (successCallback) == "function") {
                    successCallback(val);
                }
            }, function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (failCallback && typeof (failCallback) == "function") {
                    failCallback(val);
                }
            });

            // set up onclick dismiss
            block.firstChild.firstChild.firstChild.firstChild.childNodes[2].onclick = function () {
                returnProm.resolve();
            };

            return returnProm;
        }
        function createSuccessAlert() {

        }
        function createErrorAlert() {

        }
        function createWarningAlert() {

        }
        function createConfirmAlert(bodyText, headerText, yesText, noText, successCallback, failCallback) {
            var divID = 'SMAClientAlert' + SMAAlertGlobalValues.GetAlertIndex();
            headerText = headerText || "Confirm" || SMAAlertGlobalValues.HeaderText;
            yesText = yesText || "YES";
            noText = noText || "NO";

            var returnProm = {
                resolve: null,
                reject: null
            };
            new Promise(function (resolve, reject) {
                returnProm.resolve = resolve;
                returnProm.reject = reject;
            }).then(function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (successCallback && typeof (successCallback) == "function") {
                    successCallback(val);
                }
            }, function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (failCallback && typeof (failCallback) == "function") {
                    failCallback(val);
                }
            });

            var block = SMAAlertBaseFactory.CreateBaseAlert(divID, headerText, bodyText);

            block.firstChild.classList.add("Confirm");
            block.firstChild.removeChild(block.firstChild.childNodes[2]);
            block.firstChild.appendChild(SMAAlertBaseFactory.CreateFooter(divID));

            // remove existing button
            block.firstChild.childNodes[2].firstChild.removeChild(block.firstChild.childNodes[2].firstChild.firstChild);

            // Create child element that is clickable (div with on-click)
            var footerButtonOne = document.createElement('div');
            footerButtonOne.id = divID + "FooterButtonOne";
            footerButtonOne.className = "FooterButtonOnePosition FooterButtonOne";
            footerButtonOne.textContent = yesText;
            footerButtonOne.onclick = function () {
                returnProm.resolve(true);
            };

            var footerButtonTwo = document.createElement('div');
            footerButtonTwo.id = divID + "FooterButtonTwo";
            footerButtonTwo.className = "FooterButtonTwoPosition FooterButtonTwo";
            footerButtonTwo.textContent = noText;
            footerButtonTwo.onclick = function () {
                returnProm.resolve(false);
            };

            // Add new element to the footer
            block.firstChild.childNodes[2].firstChild.appendChild(footerButtonOne);
            block.firstChild.childNodes[2].firstChild.appendChild(footerButtonTwo);

            // set up dismissable button
            block.firstChild.firstChild.firstChild.firstChild.childNodes[2].onclick = function () {
                returnProm.resolve("Cancel");
            };

            // display block
            SMAAlertDisplay.ShowAlert(block);

            return returnProm;
        }
        function createConfirmAlertWithCancel() {

        }
        function createWebPageAlert() {

        }
        function createCustomAlert(bodyObject, headerText, successCallback, failCallback) {
            var divID = "SMAClientAlert" + SMAAlertGlobalValues.GetAlertIndex();
            var headText = headerText || "Alert" || SMAAlertGlobalValues.HeaderText;

            var block = SMAAlertBaseFactory.CreateBaseAlert(divID, headerText, null);

            // set style class
            block.firstChild.classList.add("Info");

            // set body to be the object that was passed
            block.firstChild.childNodes[1].firstChild.innerHTML = "";
            if (bodyObject.appendChild) {
                block.firstChild.childNodes[1].firstChild.appendChild(bodyObject);
            } else {
                block.firstChild.childNodes[1].firstChild.innerHTML = bodyObject;
            }
            //block.firstChild.childNodes[1].firstChild.appendChild(bodyObject);

            SMAAlertDisplay.ShowAlert(block);
            var returnProm = {
                resolve: null,
                reject: null
            };
            new Promise(function (resolve, reject) {
                returnProm.resolve = resolve;
                returnProm.reject = reject;
            }).then(function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (successCallback && typeof (successCallback) == "function") {
                    successCallback(val);
                }
            }, function (val) {
                SMAAlertDisplay.RemoveAlert(divID);
                if (failCallback && typeof (failCallback) == "function") {
                    failCallback(val);
                }
            });

            // set up onclick dismiss
            block.firstChild.firstChild.firstChild.firstChild.childNodes[2].onclick = function () {
                returnProm.resolve();
            };

            return returnProm;
        }
        function removeAllAlerts() {
            return SMAAlertDisplay.RemoveAllAlerts();
        }
    }

})();