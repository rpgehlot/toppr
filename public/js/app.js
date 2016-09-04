var toppr = angular.module('toppr',['ngRoute']);

toppr.service('DataService',['$http',function($http){

	this.ListAllBattles = function($scope){
			$http.get('/api/battles/list').success(function(res){
				console.log(res);
				$scope.battles = res;
			});		
	};
	this.getbattleCount = function($scope){
			$http.get('/api/battles/count').success(function(res){
				console.log(res);
				$scope.count = res.response;
			});
	};
	this.getstats = function($scope){
			$http.get('/api/battles/stat').success(function(res){
				console.log(res);
				$scope.stats = res;
			});
	};
}]);
toppr.controller('ListBattleController',['$scope','DataService',function($scope,DataService){
	console.log('ListBattleController instantiated');
	$scope.battles=[];
	DataService.ListAllBattles($scope);
}]);

toppr.controller('CountController',['$scope','DataService',function($scope,DataService){
	console.log('CountController instantiated');
	$scope.count=0;
	DataService.getbattleCount($scope);
}]);

toppr.controller('statcontroller',['$scope','DataService',function($scope,DataService){
	console.log('statcontroller instantiated');
	$scope.stats={};
	DataService.getstats($scope);

}]);

toppr.config(function($routeProvider, $locationProvider){

	$routeProvider.
		when('/',{
			templateUrl : 'static/partials/battles.html',
			controller : 'ListBattleController'
		}).
		when('/count',{
			templateUrl : 'static/partials/count.html',
			controller : 'CountController'
		}).
		when('/stats',{
			templateUrl : 'static/partials/stat.html',
			controller : 'statcontroller'
		}).
		when('/search',{
			templateUrl : 'static/partials/search.html',
			controller : ''
		}).
		otherwise({
			redirectTo :  '/'
		});

});




