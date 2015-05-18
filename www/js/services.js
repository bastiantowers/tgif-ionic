angular.module('starter')
.factory('meli',function ($http) {

    console.log('Factory meli Loaded');

    var buscar = function(q) {
        return $http.get('https://api.mercadolibre.com/sites/MLA/search?q='+ q);
    }

    return {
        buscar:buscar
    }
})