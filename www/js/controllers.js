angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $pouchDB) {
  $scope.items = {};

      $pouchDB.startListening();

      $rootScope.$on("$pouchDB:change", function(event, data) {
          $scope.items[data.doc._id] = data.doc;
          $scope.$apply();
      });

      $rootScope.$on("$pouchDB:delete", function(event, data) {
          delete $scope.items[data.doc._id];
          $scope.$apply();
      });

})

.controller('SearchCtrl', function($rootScope, $scope, $stateParams, meli, $ionicLoading, $timeout, $pouchDB) {

  $scope.buscar = function(){
    //console.log('Buscamos...');
      $ionicLoading.show({
        template: 'Loading...'
      });
    meli.buscar($scope.inputSearch).success(function(res){
      //console.log('Meli response: ',res)
      $scope.productos = res.results;
      $ionicLoading.hide();
    })
    $timeout($ionicLoading.hide, 3000);
  };

  $scope.addToFavs = function (p) {
    p._id = new Date().toISOString();
    $pouchDB.save(p)
      .then(function(){
        $ionicLoading.show({
          template: 'Agregado a Favoritos...'
        });
        $timeout($ionicLoading.hide, 3000);
      }).catch(function(){
        $ionicLoading.show({
          template: 'No se pudo agregar a Favoritos...'
        });
        $timeout($ionicLoading.hide, 3000);
      });
  }
})
.controller('FavsCtrl', function($rootScope, $scope, $log, $stateParams, meli, $ionicLoading, $timeout, $pouchDB) {
    $scope.items = {};

      $pouchDB.startListening();

      $rootScope.$on("$pouchDB:change", function(event, data) {
          $scope.items[data.doc._id] = data.doc;
          $scope.$apply();
      });

      $rootScope.$on("$pouchDB:delete", function(event, data) {
          delete $scope.items[data.doc._id];
          $scope.$apply();
      });

  $scope.favorites;

  function getAllDocs(){
    $pouchDB.allDocs({include_docs:true})
    .then(function(docs){
      $scope.favorites = docs.rows;
    })
    .catch(function(err){
      console.log(err);
    });
  }

  $scope.removeFav = function(doc) {
    $pouchDB.delete(doc._id, doc._rev)
      .then(function(){
        $ionicLoading.show({
          template: 'Favorito borrado'
        });
        $timeout($ionicLoading.hide, 3000);
      })
      .then(getAllDocs)
      .catch(function(){
        $ionicLoading.show({
          template: 'No se pudo quitar este item'
        });
        $timeout($ionicLoading.hide, 3000);
      });
  };

  getAllDocs();

})
;
