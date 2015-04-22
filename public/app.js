(function(){

	var app = angular.module('app', []);

	app.controller('PizzasController', ['$http', function($http){
		var self = this;
		self.pizzas = [];
		self.filters = {
			sizes: []
		};

		$http.get('/pizzas.json').success(function(data){
			self.pizzas = data;
		});
		$http.get('/filters.json').success(function(data){
			self.filters = data;
		})

	}]);

})()
