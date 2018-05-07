(function () {

    "use strict";

    angular
        .module("SMAClient.SQLite", []);
    angular
        .module("SMAClient.SQLite")
        .constant("SMASQLAggressiveWords", [
            "TRUNCATE", "DELETE", "DROP"
        ])
        .service("SMASQLInitialization", smaSQLInit)
        .service("SMASQLHelpers", ["SMASQLAggressiveWords", smaSQLHelpers])
        .service("SMASQLFunctions", ["SMASQLHelpers", smaSQLFunctions]);

    function smaSQLInit() {
        /*jshint validthis:true */
        var smaSqlInit = this;

        smaSqlInit.init = init;

        return smaSqlInit;

        function init(dbConfigs) {
            if (window.openDatabase) {
                return window.openDatabase(dbConfigs.Name, dbConfigs.Version, dbConfigs.Description, dbConfigs.Size);
            } else {
                return false;
            }
        }
    }

    function smaSQLHelpers(SMASQLAggressiveWords) {
        /*jshint validthis:true */
        var smaSQLH = this;

        smaSQLH.SanitizeInput = sanitizeInput;
        smaSQLH.OnError = onError;

        return smaSQLH;

        function onError(transaction, exception) {
            console.error(transaction);
            console.error(exception);
        }

        function sanitizeInput(input) {
            var returnValue;
            switch (typeof (input)) {
                case "string":
                    returnValue = "";
                    for (var i = 0, len = SMASQLAggressiveWords.length; i < len; i++) {
                        if (input.toUpperCase().indexOf(SMASQLAggressiveWords[i]) !== -1) {
                            returnValue = false;
                            throw new ReferenceError("Bad input: " + SMASQLAggressiveWords[i]);
                        }
                    }
                    returnValue = input.replace('\'', '\'\'');
                    break;
                case "object":
                    if (input === null) {
                        returnValue = null;
                        break;
                    } else if (input.length) {
                        returnValue = [];
                        for (var k = 0, len2 = input.length; k < len2; k++) {
                            returnValue.push(sanitizeInput(input[k]));
                        }
                        break;
                    } else {
                        returnValue = {};
                        Object.keys(input).forEach(function (subObject) {
                            returnValue[subObject] = sanitizeInput(input[subObject]);
                        });
                    }
                    break;
                case "number":
                case "boolean":
                    returnValue = input;
                    break;
                case "undefined":
                    returnValue = null;
                    break;
                default:
                    throw new ReferenceError("Bad input");
            }
            return returnValue;
        }
    }

    function smaSQLFunctions(SMASQLHelpers) {
        /*jshint validthis:true */
        var smaSQLFunc = this;

        // tables
        smaSQLFunc.Table = function () { };
        smaSQLFunc.Table.Create = createTable;
        smaSQLFunc.Table.Truncate = truncateTable;
        smaSQLFunc.Table.Drop = dropTable;

        // data
        smaSQLFunc.Data = function () { };
        smaSQLFunc.Data.Insert = dataInsert;
        smaSQLFunc.Data.Update = dataUpdate;
        smaSQLFunc.Data.SelectStar = dataGetStar;
        smaSQLFunc.Data.SelectColumns = dataGetColumns;
        smaSQLFunc.Data.Delete = dataDelete;

        // query
        smaSQLFunc.Query = function () { };
        smaSQLFunc.Query.CustomRequest = customRequest;

        return smaSQLFunc;

        function createTable(database, tableName, columnStrings) {
            /// <summary>Creates a table with the given name and structure</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">Sets the table name</param>
            /// <param name="columnStringArray" type="Array" optional="false">Table columns to generate</param>
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            columnStrings = SMASQLHelpers.SanitizeInput(columnStrings);
            var sqlString = "CREATE TABLE IF NOT EXISTS " + tableName + "(" + columnStrings.join(", ") + ")";
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, [], function (tx) {
                        resolve(tx, null);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });
        }

        function truncateTable(database, tableName) {
            /// <summary>Truncates a given table</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">The table to truncate</param>
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            var sqlString = "TRUNCATE TABLE IF EXISTS " + tableName;
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, [], function (tx) {
                        resolve(tx, null);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });
        }

        function dropTable(database, tableName) {
            /// <summary>Drops a given table</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">The table to be dropped</param>
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            var sqlString = "DROP TABLE IF EXISTS " + tableName;
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, [], function (tx) {
                        resolve(tx, null);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });
        }

        function dataInsert(database, tableName, columnNameArray, columnValueArray) {
            /// <summary>Inserts data into a given table</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">The table to insert data into</param>
            /// <param name="columnNameArray" type="Array" optional="false">The column names to be inserted</param>
            /// <param name="columnValueArray" type="Array" optional="false">The parameter values to be inserted</param>
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            columnNameArray = SMASQLHelpers.SanitizeInput(columnNameArray);
            columnValueArray = SMASQLHelpers.SanitizeInput(columnValueArray);
            var qs = [];
            for (var i = 0, len = columnValueArray.length; i < len; i++) {
                qs.push("?");
            }
            var sqlString = "INSERT INTO " + tableName + "(" + columnNameArray.join(", ") + ") VALUES (" + qs.join(", ") + ")";
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, columnValueArray, function (tx) {
                        resolve(tx, null);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });

        }

        function dataUpdate(database, tableName, columnNameArray, columnValueArray, conditionString) {
            /// <summary>Update the values of a record based on the condition string</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">The table to be updated</param>
            /// <param name="columnNameArray" type="Array" optional="false">The column names to be inserted</param>
            /// <param name="columnValueArray" type="Array" optional="false">The parameter values to be inserted</param>
            /// <param name="conditionString" type="String" optional="true">The condition string for update (ID=idNumber), subject to sanitization</param>
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            columnNameArray = SMASQLHelpers.SanitizeInput(columnNameArray);
            columnValueArray = SMASQLHelpers.SanitizeInput(columnValueArray);
            conditionString = SMASQLHelpers.SanitizeInput(conditionString);
            var qs = [];
            for (var i = 0, len = columnValueArray.length; i < len; i++) {
                qs.push("?");
            }
            if (!conditionString || !conditionString.length) {
                conditionString = "";
            } else {
                conditionString = " WHERE " + conditionString;
            }
            var sqlString = "UPDATE " + tableName + " SET " + columnNameArray.join("=? ") + "=?" + conditionString;
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, columnValueArray, function (tx) {
                        resolve(tx, null);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });
        }

        function dataGetStar(database, tableName, conditionString) {
            /// <summary>Selects * from the given table and optional condition string</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">The table to get data from</param>
            /// <param name="conditionString" type="String" optional="true">The where statement, excluding "where"</param>
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            conditionString = SMASQLHelpers.SanitizeInput(conditionString);
            if (!conditionString || !conditionString.length) {
                conditionString = "";
            } else {
                conditionString = " WHERE " + conditionString;
            }
            var sqlString = "SELECT * FROM " + tableName + conditionString;
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, [], function (tx, results) {
                        resolve(tx, results);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });
        }

        function dataGetColumns(database, tableName, columnNames, conditionString) {
            /// <summary>Selects only the requested columns</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">The table to get data from</param>
            /// <param name="columnNames" type="Array" optional="false">Array of column names as strings ([ID, Name, Date])</param>
            /// <param name="conditionString" type="String" optional="true">The where statement, excluding "WHERE"</param>
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            columnNames = SMASQLHelpers.SanitizeInput(columnNames);
            conditionString = SMASQLHelpers.SanitizeInput(conditionString);
            if (!conditionString || !conditionString.length) {
                conditionString = "";
            } else {
                conditionString = " WHERE " + conditionString;
            }
            var sqlString = "SELECT " + columnNames.join(", ") + " FROM " + tableName + conditionString;
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, [], function (tx, results) {
                        resolve(tx, results);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });
        }

        function dataDelete(database, tableName, conditionString) {
            /// <summary>Delete given rows from a table based on the optional condition string</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="tableName" type="String" optional="false">The table to delete content from</param>
            /// <param name="conditionString" type="String" optional="true">The where statement, excluding "WHERE"</param>
            conditionString.
            tableName = SMASQLHelpers.SanitizeInput(tableName);
            conditionString = SMASQLHelpers.SanitizeInput(conditionString);
            if (!conditionString || !conditionString.length) {
                conditionString = "";
            } else {
                conditionString = " WHERE " + conditionString;
            }
            var sqlString = "DELETE FROM " + tableName + conditionString;
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    tx.executeSql(sqlString, [], function (tx) {
                        resolve(tx, null);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });
        }

        function customRequest(database, sqlString, itemArray) {
            /// <summary>Requests custom SQL to be executed</summary>
            /// <param name="database" type="Object">The database to be used in the function</param>
            /// <param name="sqlString" type="String" optional="false">The SQL string to be executed</param>
            /// <param name="itemArray" type="Array" optional="false">The array of items to pass as data</param>
            sqlString = SMASQLHelpers.SanitizeInput(sqlString);
            itemArray = SMASQLHelpers.SanitizeInput(itemArray);
            return new Promise(function (resolve, reject) {
                database.transaction(function (tx) {
                    ts.executeSql(sqlString, itemArray, function (tx, results) {
                        resolve(tx, results);
                    }, function (tx, e) {
                        SMASQLHelpers.OnError(tx, e);
                        reject(tx, e);
                    });
                });
            });

        }
    }

})();