// DIRECTIVES
weatherApp.directive("cityReport", function () {
    return {
        restrict: 'E',
        templateUrl: 'directives/cityReport.htm',
        replace: true,
        scope: {
            city: "=",
            convertToCelsius: '&',
            country: "="
        }
    }
});