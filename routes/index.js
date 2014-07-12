var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/angular');

var Account = mongoose.model('accounts', new mongoose.Schema({
        AccountCode:String,
        AccountName:String,
        AccountTypeCode:String,
        AccountOpened:Date,
        AccountBalance:Number
}));

var AccountType = mongoose.model('accounttypes', new mongoose.Schema({
        AccountTypeCode:String,
        Description:String
}));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/api/Account', function(req, res) {
    res.setHeader("Content-Type", "application/json");
    Account.find(function(err,accounts){
        if (err) {
            res.status(404);
            res.send(err);
        }
        else {
            res.send(accounts);
        }
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
           if (err) {
               res.status(500);
               res.send(err);
           } else {
               res.send(acct);
           }
        });
    }
    else {
        // update
        Account.findById(req.body._id,function(err,acct){
            if (err) {
              res.send(err);
            } else {
                acct.AccountCode = req.body.AccountCode;
                acct.AccountName = req.body.AccountName;
                acct.AccountTypeCode = req.body.AccountTypeCode;
                acct.AccountOpened = req.body.AccountOpened;
                acct.AccountBalance = req.body.AccountBalance;
                acct.save(function(err){
                    if (err){
                        res.status(500);
                        res.send(err);
                    } else {
                        res.send(acct);
                    }
                });
            }
        });
    }
});

router.get('/api/AccountType', function(req, res) {
    res.setHeader("Content-Type", "application/json");
    AccountType.find(function(err,accountTypes){
        if (err) {
            res.status(404);
            res.send(err);
        }
        else {
            res.send(accountTypes);
        }
    });
});

router.delete('/api/Account/:id', function(req,res){
    Account.findById(req.params.id,function(err,acct){
        if (acct)
        {
            acct.remove();
        }
    });
    res.status(200);
    res.send("");
});

module.exports = router;
