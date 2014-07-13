app.filter('match', function () {
    return function (input, lookup, fields) {
        var field = fields.split(",");
        var match = _.find(lookup, function (item) {
            return item[field[0]] === input;
        });
        if (match != undefined)
            return match[field[1]];
        else
            return input;
    }
});

app.controller('AccountController', function ($scope, $log, $modal, $window, Restangular) {

    $scope.selections = [];
    $scope.loaded = false;

    Restangular.setBaseUrl($scope.rootapipath);

    $scope.gridDblClickHandler = function (rowItem) {
        $scope.editAccount();
    }

    var AccountType = Restangular.all('AccountType');

    var getAccountTypes = function () {
        AccountType.getList()
            .then(function (accts) {
                $scope.accountTypes = accts;
                $scope.loaded = true;
            },
            function (err) {
                $window.alert(getMessage(err));
            });
    };

    getAccountTypes();

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

    var Account = Restangular.all('Account');

    var getAccounts = function () {
        Account.getList()
            .then(function (accts) {
                $scope.accounts = accts;
                $scope.balanceTotal = 0;
                _.each(accts, function (item) { $scope.balanceTotal += item.AccountBalance; });
            },
            function (err) {
                $window.alert(getMessage(err));
            });
    };

    $scope.saveAccount = function (account) {
        Account.post(account)
            .then(function (account) {
                getAccounts();
            },
            function (err) {
                $window.alert(getMessage(err));
                getAccounts();
            });
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

    $scope.removeAccount = function () {
        var account = $scope.selections[0];
        if (account != undefined) {
            Restangular.one("Account", account._id).remove()
              .then(function () {
                  getAccounts();
              },
              function (err) {
                  $window.alert(getMessage(err));
                  getAccounts();
              });
        }
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
            angular.copy($scope.selections[0], acct);
        }

        var modalInstance = $modal.open({
            templateUrl: 'accountDlg.html',
            controller: AccountDlgCtrl,
            size: size,
            backdrop: 'static',
            resolve: {
                accounts: function () {
                    return $scope.accounts;
                },
                accountTypes: function () {
                    return $scope.accountTypes;
                },
                account: function () {
                    return acct;
                },
                doThis: function () {
                    return doThis;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (result.doThis === 'Delete')
                $scope.removeAccount();
            else
                $scope.saveAccount(result.account);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    getAccounts();

});

var AccountDlgCtrl = function ($scope, $modalInstance, accounts, accountTypes, account, doThis) {

    $scope.accounts = accounts;
    $scope.accountTypes = accountTypes;
    $scope.account = account;
    $scope.doThis = doThis;
    $scope.unique = true;
    $scope.delete = false;

    if (doThis === 'Delete')
        $scope.delete = true;

    $scope.uniqueAccountCode = function () {
        var found = false;

        found = _.find(accounts, function (a) {
            if (a._id != $scope.account._id && a.AccountCode === $scope.account.AccountCode)
                return true;
            else
                return false;
        });
        $scope.unique = !found;
        return !found;
    };

    $scope.ok = function () {
        $modalInstance.close({ account: $scope.account, doThis: $scope.doThis });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


