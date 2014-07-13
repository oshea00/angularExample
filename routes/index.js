var express = require('express');
var router = express.Router();
var path = require("path");

var Account = require("../data/account.js");
var AccountType = require("../data/accountType.js");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { rootapipath: '/api' });
});

router.get('/api/Account', function(req, res) {
    return Account.find(function(err,accounts){
        if (err)
            res.send(404,err);
        res.json(accounts);
    });
});

router.post('/api/Account', function(req,res) {
    var acct = {};
    if (req.body._id == 0) {
        // insert
        acct = new Account(
        {
            AccountCode : req.body.AccountCode,
            AccountName : req.body.AccountName,
            AccountTypeCode : req.body.AccountTypeCode,
            AccountOpened : req.body.AccountOpened,
            AccountBalance : req.body.AccountBalance
        });
        acct.save(function(err){
           if (err)
               res.send(500,err);
           res.json(acct);
        });
    }
    else {
        // update
        Account.findById(req.body._id,function(err,acct) {
            if (err)
                res.send(500,err);

            acct.AccountCode = req.body.AccountCode;
            acct.AccountName = req.body.AccountName;
            acct.AccountTypeCode = req.body.AccountTypeCode;
            acct.AccountOpened = req.body.AccountOpened;
            acct.AccountBalance = req.body.AccountBalance;

            acct.save(function(err){
                if (err)
                    res.status(500,err);
                res.json(acct);
            });
        });
    }
});

router.get('/api/AccountType', function(req, res) {
    AccountType.find(function(err,accountTypes){
        if (err)
            res.send(404,err);
        res.json(accountTypes);

    });
});

router.delete('/api/Account/:id', function(req,res){
    Account.findById(req.params.id,function(err,acct){
        if (acct)
            acct.remove();
    });
    res.send("");
});

module.exports = router;
