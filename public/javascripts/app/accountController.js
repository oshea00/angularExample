app.controller('AccountController', function ($scope, $log, $modal, $window, Restangular, accountDialog, accountRepo, accountTypeRepo) {

    $scope.selections = [];
    $scope.loaded = false;

    var eventName = "accountsUpdated";

    socket.on(eventName,function(msg){
        getAccounts();
    });

    accountRepo.init($scope.rootapipath);
    accountTypeRepo.init($scope.rootapipath);

    $scope.gridDblClickHandler = function (rowItem) {
        $scope.editAccount();
    }


    var getAccountTypes = function () {
        accountTypeRepo.getList()
            .then(function (accts) {
                $scope.accountTypes = accts;
                $scope.loaded = true;
            },
            function (err) {
                $window.alert(getMessage(err));
            });
    };
    getAccountTypes();

    var getAccounts = function () {
        accountRepo.getList()
            .then(function (accts) {
                $scope.accounts = accts;
                $scope.balanceTotal = 0;
                _.each(accts, function (item) { $scope.balanceTotal += item.AccountBalance; });
            },
            function (err) {
                $window.alert(getMessage(err));
            });
    };
    getAccounts();

    $scope.gridOptions = {
        data: 'accounts',
        multiSelect: false,
        selectedItems: $scope.selections,
        filterOptions: {filterText: '', useExternalFilter: false},
        showFilter: true,
        showFooter: true,
        footerTemplate: "<div class='ngFooterPanel'><div class='AccountBalanceTotal'>{{balanceTotal | number: 2}}</div></div>",
        dblClickFn: $scope.gridDblClickHandler,
        plugins: [ngGridDoubleClick],
        columnDefs: [
                     { field: 'AccountCode', displayName: 'Account Code' },
                     { field: 'AccountName', displayName: 'Account Name' },
                     { field: 'AccountTypeCode', displayName: 'Account Type', cellFilter: "match:accountTypes:'AccountTypeCode,Description'" },
                     { field: 'AccountOpened', displayName: 'Account Opened', cellFilter: "date:'MM-dd-yyyy'" },
                     { field: 'AccountBalance', displayName: 'Account Balance', headerClass: 'AccountBalanceHeader', cellClass: 'AccountBalance', cellFilter: "number: 2" }
        ]
    };

    $scope.saveAccount = function (account) {
        accountRepo.save(account)
            .then(function (account) {
                socket.emit(eventName,'account saved');
            },
            function (err) {
                $window.alert(getMessage(err));
                getAccounts();
            });
    };

    $scope.removeAccount = function () {
        var account = $scope.selections[0];
        if (account != undefined) {
            accountRepo.remove(account._id)
              .then(function () {
                  socket.emit(eventName,'account removed');
              },
              function (err) {
                  $window.alert(getMessage(err));
                  getAccounts();
              });
        }
    };

    $scope.addAccount = function () {
        $scope.openDialog('lg', 'Add');
    };

    $scope.editAccount = function () {
        $scope.openDialog('lg', 'Edit');
    };

    $scope.deleteAccount = function () {
        $scope.openDialog('lg', 'Delete');
    };

    $scope.openDialog = function (size, doThis) {
        var acct = {};
        if (doThis === 'Add') {
            acct = {
                _id: 0,
                AccountName: '',
                AccountTypeCode: 'S',
                AccountCode: '',
                AccountOpened: ''
            };
        }
        else
        {
            if (!$scope.selections[0])
                return;

            angular.copy($scope.selections[0], acct);
        }

        var modalInstance = accountDialog.open(size,acct,doThis,$scope.accounts,$scope.accountTypes);

        modalInstance.result.then(function (result) {
            if (result.doThis === 'Delete')
                $scope.removeAccount();
            else
                $scope.saveAccount(result.account);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

});

