
// CONTROLLERS
weatherApp.controller('homeController', ['$scope', 'cityService', '$location', '$http', '$q', function($scope, cityService, $location, $http, $q) {

    $scope.city = cityService.city;
    $scope.q = "";
    $scope.weatherResult = cityService.weatherResult;

    $scope.$watch('city', function() {
        cityService.city = $scope.city;
        $scope.q = cityService.city.replace(' ', '%20');  
    });

    $scope.$watch('weatherResult', function() {
        cityService.weatherResult = $scope.weatherResult;
    });

    $scope.goTo = function(enter){
        cityService.goToService(enter);
    }

    $scope.submit = function() {

        var deferred = $q.defer();
        $http.get("https://openweathermap.org/data/2.5/find?q=" + $scope.q + "&appid=" + cityService.apiKey + "&units=" + cityService.units,{ callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }})
        .then(function(response) {
            deferred.resolve(response.data);
            $scope.weatherResult = response.data;
            $location.path('/city');
          },
          function(err){
            deferred.reject(err);
          })
         
        return $q.promise;
    }
    
}]);


weatherApp.controller('cityController', ['$scope', 'cityService', '$routeParams', '$location', '$http', '$q', function($scope, cityService, $routeParams, $location, $http, $q) {

    $scope.city = cityService.city;
    $scope.index = cityService.index;
    $scope.country = cityService.country;
    $scope.weatherResult = cityService.weatherResult;

    $scope.q = cityService.city.replace(' ', '%20');
    $scope.days = $routeParams.days || 3;

    $scope.$watch('weatherResult', function() {
        cityService.weatherResult = $scope.weatherResult;
    });

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

    $scope.GetRowIndex = function (index) {
        $scope.$watch('index', function() {
                cityService.index = index;
        });
    };

}]);

weatherApp.controller('forecastController', ['$scope', 'cityService', '$routeParams', function($scope, cityService, $routeParams) {

    $scope.city = cityService.city;
    $scope.index = cityService.index;
    $scope.weatherResult = cityService.weatherResult;
    $scope.forecastDays = cityService.forecastDays;
    $scope.country = $scope.weatherResult.list[$scope.index].sys.country;
    $scope.days = $routeParams.days || '3';
   
    $scope.roundToCelsius = function(celsius) {
        
        return Math.round(celsius);
        
    }
    
    $scope.convertToDate = function(dt) { 
      
        return new Date(dt * 1000);
        
    };

}]);