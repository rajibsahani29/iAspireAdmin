
// Show Bulk Add menu
function showBulkMenu() {
    $("#BulkMenu").css("display", "block");
}

// Close Bulk Add menu
function closeBulkMenu() {
    $("#BulkMenu").css("display", "none");
}

// Process File
function processFile(callback) {
   
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
            process_wb(wb, callback);
        };

        reader.readAsArrayBuffer(f);
    }
}

// Process Workbook
function process_wb(wb, callback) {
    var output = "";
    output = JSON.stringify(to_json(wb), 2, 2);
    tableData = JSON.parse(output);

    // THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
    callback(tableData.Sheet1);// THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
    //saveBulkData(tableData.Sheet1);// THIS FUNCTION SHOULD BE ON THE UNIQUE PAGE TO WHICH THIS WAS ORIGINALLY CALLED
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





//<!-- Between Buttons Padding -->
//<div style="float: right; width: 10px;"></div>

//<!-- Add Accounts Bulk button -->
//<div class="verticalalign isEmployee">
//    <div class="Color7 AddNewLocation" onclick="showBulkMenu()">
//        <div class="verticalalign">
//            <div class="ButtonPositioningLocation">
//                <span class="icon-TS-20 FontColor4 CrossArrowIcon"></span>
//                <label class="FontColor1 AddNewArticleText">Add Accounts Bulk</label>
//            </div>
//        </div>
//    </div>
//</div>





//<!-- Bulk Menu Pop Up Form -->
//<div class="TransparentBackground  animated fadeIn" id="BulkMenu">

//    <div class="Transparency"></div>

//    <div class="PopUpDisplay">
//        <div class="verticalalign">
//            <div class="Color3 PopUpWindow animated2 fadeIn">

//                <!-- Top Bar -->
//                <div class="TopBarPopUpWindow">

//                    <div class="verticalalgin2 SmallBarDisplayBoxWidth">
//                        <div class="SmallBarDisplayBox Color7">
//                            <div class="verticalalign">
//                                <span class="icon-iaspire-04 FontColor1 IconLogo"></span>
//                            </div>
//                        </div>
//                    </div>

//                    <div class="verticalalgin2">
//                        <label class="PopUpWindowHeading FontColor2">Bulk District Upload</label>
//                    </div>

//                    <div class="verticalalgin2">
//                        <label class="CancelLabel FontColor2" onclick="closeBulkMenu()">Close</label>
//                    </div>

//                </div>

//                <!-- Form Container -->
//                <form class="AllSettingsContainer">

//                    <div class="SmallSettingContainer">
//                        <label class="FontColor4 PopUpWindowLabel">File</label>
//                        <input type="file" name="BulkFile" id="BulkFile" class="SettingsBox" style="padding: 3px;" />
//                    </div>

//                </form>

//                <div class="SaveButtonContainer isEmployee">
//                    <div class="Color7 FontColor1 SaveButton" onclick="saveForm()">
//                        <div class="verticalalign">
//                            <div class="SavePosititiongContainer">
//                                <span class="icon-TS-22 SaveButtonIcon"></span>
//                                <span class="SaveButtonText">Save</span>
//                            </div>
//                        </div>
//                    </div>
//                </div>

//            </div>
//        </div>
//    </div>

//</div>