// SERVICES
weatherApp.service('cityService', ['$location', function($location){

    this.city = "";
    this.country= [];
    this.coord = [{ lat: "", lon: "" }];
    this.apiKey = "439d4b804bc8187953eb36d2a8c26a02";
    this.units = "metric";
    this.forecastDays = [];
    this.weatherResult = [];
    this.index = 1;

    this.goToService = function(enter) {
        if(enter.keyCode === 13)
        $location.path('/city');
    }

}]);