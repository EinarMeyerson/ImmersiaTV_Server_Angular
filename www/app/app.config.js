'use strict';
angular
    .module('immersiatvApp')
    .config(config);

function config($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl: 'src/templates/main.html',
            controller: 'FileManagerCtrl',
            controllerAs: 'mainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}
