angular.module('buttons', [])
    .controller('buttonCtrl', ButtonCtrl)
    .factory('buttonApi', buttonApi)
    .constant('apiUrl', 'http://localhost:1337'); // CHANGED for the lab 2017!

function ButtonCtrl($scope, buttonApi) {
    $scope.buttons = []; //Initially all was still
    $scope.list = [];

    $scope.errorMessage = '';
    $scope.refreshList = refreshList;
    $scope.isLoading = isLoading;
    $scope.refreshButtons = refreshButtons;
    $scope.rowClick=rowClick;
    $scope.abort=abort;
    $scope.sale=sale;
    $scope.buttonClick = buttonClick;
    $scope.sum = function (items, prop) {
        return (items.reduce(function (a, b) {
            return Number(a) + Number(b[prop]);

        }, 0)).toFixed(2);
    };
    $scope.user ='';
    $scope.startTime =0;
    $scope.stopTime = 0;
    $scope.started = false;
    $scope.login = login;
    $scope.logout = logout;

    var loading = false;

    function isLoading() {
        return loading;
    }

    function refreshButtons() {
        loading = true;
        $scope.errorMessage = '';
        buttonApi.getButtons()
            .success(function (data) {
                $scope.buttons = data;
                loading = false;
            })
            .error(function () {
                $scope.errorMessage = "Unable to load Buttons:  Database request failed";
                loading = false;
            });
    }

    function buttonClick($event) {
        if($scope.user==""){
            alert("you are not logged in")
        }else {
            $scope.errorMessage = '';
            buttonApi.clickButton($event.target.id)
                .success(function () {
                    refreshList();
                    if (!$scope.started) {
                        $scope.startTime = Date.now();
                    }
                    $scope.started = true;
                })
                .error(function () {
                    $scope.errorMessage = "Unable click";
                });
        }
    }

    // refreshButtons();  //make sure the buttons are loaded


    function refreshList() {
        loading = true;
        $scope.errorMessage = '';
        buttonApi.getList()
            .success(function (data) {
                $scope.list = data;
                loading = false;
            })
            .error(function () {
                $scope.errorMessage = "Unable to load Buttons:  Database request failed";
                loading = false;
            });
    }

    function rowClick($event) {
        if($scope.user==""){
            alert("you are not logged in")
        }else {
            $scope.errorMessage = '';
            buttonApi.clickRow($event.srcElement.parentElement.id)
                .success(function () {
                    refreshList();
                })
                .error(function () {
                    $scope.errorMessage = "Unable to click row";
                });
        }
    }

    function abort($event) {
        if($scope.user==""){
            alert("you are not logged in")
        }else {
            console.log("aborting");
            buttonApi.abortTransaction().success(function () {
                refreshList();
                $scope.started = false;
            }).error(function () {
                $scope.errorMessage = "Unable to abort";
            });
        }

    }

    function login(user) {
        $scope.user=user;
    }

    function logout() {
        $scope.user="";
    }

    function sale($event) {
        $scope.errorMessage = '';
        if($scope.user==""){
            alert("you are not logged in")
        }else {
            buttonApi.sale($scope.user).success(function () {
                $scope.stopTime = Date.now();
                $scope.started = false;
                refreshList();
            }).error(function () {
                $scope.errorMessage = "Unable to process";
            });
        }
    }

    refreshList();  //make sure the list items are loaded
    refreshButtons();  //make sure the buttons are loaded
}

/*
function buttonApi($http, apiUrl) {
    return {if($scope.user==""){
            alert("you are not logged in")
        }else {
        getButtons: function () {
            var url = apiUrl + '/buttons';
            return $http.get(url);
        },
        clickButton: function (id) {
            var url = apiUrl + '/click?id=' + id;
//      console.log("Attempting with "+url);
            return $http.get(url); // Easy enough to do this way
        }$scope.errorMessage = '';
    };
}
*/
function buttonApi($http, apiUrl) {
    return {
        getButtons: function () {
            var url = apiUrl + '/buttons';
            return $http.get(url);
        },
        clickButton: function (id) {
            var url = apiUrl + '/click?id=' + id;
            return $http.get(url); // Easy enough to do this way
        },
        clickRow: function (id) {
            var url = apiUrl + '/deleteRow?id=' + id;
            console.log("attmpting to deal with " + url);
            return $http.get(url); // Easy enough to do this way
        },
        getList: function () {
            var url = apiUrl + '/list';
            return $http.get(url);
        },
        abortTransaction: function () {
            var url = apiUrl + '/void';
            return $http.get(url);
        },
        sale: function (user) {
            var url = apiUrl + '/sale?user='+user;
            return $http.get(url);
        }
    };
}

