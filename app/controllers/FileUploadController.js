
var app = angular.module('myApp', ['lr.upload']);

app.controller('HomeCtrl', ['$scope', 'upload', '$http', 'DataService', function ($scope, upload, $http, DataService) {

    $scope.doUpload = function () {
        upload({
            url: DataService.getIP() + DataService.getPath() + 'Home/Upload',
            method: 'POST',
            data: {
                aFile: $scope.myFile
            }
        }).then(
          function (response) {
              console.log(response.data);
          },
          function (response) {
              console.error(response);
          }
        );
    }
}])

  .directive('uploadFile', ['$parse', function ($parse) {
      return {
          restrict: 'A',
          link: function (scope, element, attrs) {

              var file_uploaded = $parse(attrs.uploadFile);

              element.bind('change', function () {
                  scope.$apply(function () {
                      file_uploaded.assign(scope, element[0].files[0]);
                  });
              });
          }
      };
  }]);