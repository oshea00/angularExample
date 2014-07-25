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

app.directive('isNumber', ['numberFilter',function(numberFilter){
    return{
        require:'ngModel',
        link: function(scope, elem, attrs, ctrl){
            var digits = attrs.isNumber.length===0 ? "2" : attrs.isNumber;
            ctrl.$parsers.unshift(checkForNumber);
            ctrl.$formatters.unshift(formatNumber);

            function checkForNumber(viewValue){

                // Checks for positive or negative decimal or integer number with or without thousand separators
                if (/^-{0,1}\d{1,3}(,\d{3})*\.{0,1}\d*$|^-{0,1}\d*\.{0,1}\d*$/.test(viewValue)) {
                    ctrl.$setValidity('isNumber',true);
                }
                else{
                    ctrl.$setValidity('isNumber', false);
                }
                return viewValue.replace(/,/g,'');
            }

            function formatNumber(viewValue) {
                return numberFilter(viewValue,digits);
            }
        }
    };
}]);

app.factory('accountDialog', ['$modal',function($modal){

    function open(size,acct,doThis,accounts,accountTypes) {
        return $modal.open({
            templateUrl: 'accountDlg.html',
            controller: AccountDlgCtrl,
            size: size,
            backdrop: 'static',
            resolve: {
                accounts: function () {
                    return accounts;
                },
                accountTypes: function () {
                    return accountTypes;
                },
                account: function () {
                    return acct;
                },
                doThis: function () {
                    return doThis;
                }
            }
        });
    }

    return {
        open : open
    };

}]);

var AccountDlgCtrl = function ($scope, $modalInstance, lookupDialog, accounts, accountTypes, account, doThis) {

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

    $scope.getCode = function() {
        var modalInstance = lookupDialog.open('lg');

        modalInstance.result.then(function (result) {
            $scope.account.AccountCode = result.lookupCode;
        });
    };

    $scope.ok = function () {
        $modalInstance.close({ account: $scope.account, doThis: $scope.doThis });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

app.factory('lookupDialog', ['$modal',function($modal){

    function open(size) {
        return $modal.open({
            templateUrl: 'lookupDlg.html',
            controller: LookupDlgCtrl,
            size: size,
            backdrop: 'static',
            resolve: {
                result : function(){
                    return { LookupCode : "" };
                }
            }
        });
    }

    return {
        open : open
    };

}]);

var LookupDlgCtrl = function ($scope, $modalInstance, result) {

    $scope.result = result;

    $scope.ok = function () {
        $modalInstance.close({ lookupCode: $scope.result.LookupCode });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
