// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);


// ROUTES
weatherApp.config(function ($routeProvider) {

    $routeProvider

    .when('/', {
        templateUrl: 'pages/home.htm',
        controller: 'homeController'
    })

    .when('/city', {
        templateUrl: 'pages/city.htm',
        controller: 'cityController'
    })


    .when('/forecast/:days', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })

    .when('/forecast', {
        templateUrl: 'pages/forecast.htm',
        controller: 'forecastController'
    })

});


// SERVICES

weatherApp.service('cityService', ['$http', '$q', function(){

    this.city = "New York";
    this.coord = [{ lat: "", lon: "" }];
    this.apiKey = "439d4b804bc8187953eb36d2a8c26a02";
    this.units = "metric";
    this.forecastDays = [];

}]);




// CONTROLLERS
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {

    $scope.city = cityService.city;

    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });

}]);


weatherApp.controller('cityController', ['$scope', 'cityService', '$routeParams', '$resource', '$location', '$http', '$q', function($scope, cityService, $routeParams, $resource, $location, $http, $q) {

    $scope.city = cityService.city;

    $scope.q = cityService.city.replace(' ', '%20');
    $scope.days = $routeParams.days || 3;


    $scope.weatherAPI = $resource("https://openweathermap.org/data/2.5/find?q=" + $scope.q + "&appid=" + cityService.apiKey + "&units=" + cityService.units,{ callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
   
    $scope.weatherResult = $scope.weatherAPI.get({ q: cityService.city, cnt: $scope.days  });


    $scope.getCityCoord = function(coord) {
        
            var deferred = $q.defer();
            $http.get("https://openweathermap.org/data/2.5/onecall?lat=" + coord.lat + "&lon=" + coord.lon + "&units=" + cityService.units + "&appid=" + cityService.apiKey, { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }})
            .then(function(response) {
                deferred.resolve(response.data);
                cityService.forecastDays = response.data.daily;
                $location.path('/forecast');
              },
              function(err){
                deferred.reject(err);
              })
             
            return $q.promise;
    }

    
   $scope.convertToFahrenheit = function(degK) {
        
        return Math.round((1.8 * (degK - 273)) + 32);
        
    }

    $scope.convertToCelsius = function(degK) {
        
        return Math.round(degK - 273);
        
    }
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };


}]);

weatherApp.controller('forecastController', ['$scope', 'cityService', '$routeParams', function($scope, cityService, $routeParams) {

    $scope.city = cityService.city;
    $scope.forecastDays = cityService.forecastDays;
    $scope.days = $routeParams.days || '3';
   
    $scope.roundToCelsius = function(celsius) {
        
        return Math.round(celsius);
        
    }
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };

}]);

