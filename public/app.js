(function(){

	var app = angular.module('app', []);

	app.controller('PizzasController', ['$scope', '$http', function($scope, $http) {
		$scope.pizzas = [];
		$scope.filters = {
			sizes: []
		};
		$scope.nameSearch = '';

		$scope.stringCompare = function(string, where){
			var string = string.toLowerCase();
			var where = where.toLowerCase();
			if(string == ''){
				return true;
			}
			if(where.indexOf(string)!= -1){
				return true;
			} else {
				return false;
			}
		}
		$scope.filter = function(value, index){
			return $scope.checkFilter(value);
		}

		$scope.checkFilter = function(value){
			return $scope.stringCompare($scope.nameSearch, value.name)
		}

		$http.get('/pizzas.json').success(function(data){
			$scope.pizzas = data;
		});
		$http.get('/filters.json').success(function(data){
			$scope.filters = data;
		})

	}]);

})()
