angular.module('immersiatvApp')
    .controller('FileManagerCtrl', FileManagerCtrl);

function FileManagerCtrl($scope, $rootScope, $window, $http, FetchFileFactory){


    var vm = this;
    //$scope.config = fileManagerConfig;

    vm.videolist = [];
    vm.archivos = [];
   // vm.uniqueNames=[];
    
    // vm.postVideo = postVideo;
    // vm.getVideos = getVideos;
    console.log("00000000000000000000000000");

    $scope.showStop=false;
    $scope.showPlay=true;
    $scope.showErrorNoFiles=false;
    //getVideos();

    // detect a change in a file input with an id of “the-file-input”
    $("#the-file-input").change(function() {
        vm.archivos = this.files;
        console.log(vm.archivos);
        $scope.$apply();
    });

    //**************START TREE **********************

    /*function removeByAttr(arr, attr, value){
        var i = arr.length;
        while(i--){
            if( arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value ) ){

                arr.splice(i,1);
            }
        }
        return arr;
    }*/
    
    $scope.removeFile = function(index){
        vm.archivos.splice(index,1);
        //var id = archivo.id;
        //removeByAttr(vm.archivos, 'id', id);

    };


    $scope.playServer = function(arrayFiles){
        console.log(arrayFiles);
        var uri = 'http://84.88.32.108:8080/play';
        var message = arrayFiles;
        if(arrayFiles.length!=0){
            return $http({
                method: 'POST',
                url: uri,
                data: message,
                headers: {'Content-Type': 'application/json; charset=utf-8'}

            }).then(function successCallback(response){
                console.log("plaaaay RESPONSEEEEEEEEEEEEEEEEEEE");

                $scope.showStop=true;
                $scope.showPlay=false;

                console.log(response);
            }, function errorCallback(response){
                console.log(response);
            });
        }
        else{
            $scope.showErrorNoFiles=true;
        }
    };

    $scope.stopServer = function(){
        var uri = 'http://84.88.32.108:8080/stop';

        return $http({
            method: 'POST',
            url: uri,
            data: '',
            headers: {'Content-Type': 'application/json; charset=utf-8'}

        }).then(function successCallback(response){
            console.log("stooop RESPONSEEEEEEEEEEEEEEEEEEE");
            $scope.showStop=false;
            $scope.showPlay=true;

            console.log(response);
        }, function errorCallback(response){
            console.log(response);
        });
    };

    $scope.nodeSelected = function(e, data) {
        $scope.showErrorNoFiles=false;

        var _l = data.node.li_attr;
        if (_l.isLeaf) {
            vm.archivos.push(data.node);
            $scope.$apply();
        }
    };
}

