var mongoose = require("mongoose");

var Account = mongoose.model('accounts', new mongoose.Schema({
    AccountCode     :String,
    AccountName     :String,
    AccountTypeCode :String,
    AccountOpened   :Date,
    AccountBalance  :Number
}));

module.exports = Account;

