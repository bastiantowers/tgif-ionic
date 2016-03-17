var test;
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, pouchDB) {

  $scope.db = pouchDB('favs');
  $scope.remoteDB = pouchDB('http://127.0.0.1:5984/favs');

  $scope.db.sync($scope.remoteDB, { live: true, include_docs: true});

  //test = pouchDB;
})

.controller('SearchCtrl', function($scope, $stateParams, meli, $ionicLoading, $timeout, pouchDB) {

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
    //console.log(p);
    p._id = new Date().toISOString();
    $scope.db.put(p)
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
.controller('FavsCtrl', function($scope, $log, $stateParams, meli, $ionicLoading, $timeout, pouchDB) {
  $log.log('FavsCtrl READY');

  $scope.favorites;

  function getAllDocs(){
    $scope.db.allDocs({include_docs:true})
    .then(function(docs){
      $scope.favorites = docs.rows;
    })
    .catch(function(err){
      console.log(err);
    });
  }

  $scope.removeFav = function(doc) {
    $scope.db.remove(doc)
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
