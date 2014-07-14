// Setup angular database
var db = db.getSiblingDB('angular');

var Accounts = [
    { "AccountCode":"A0001", "AccountName":"Bank of America","AccountTypeCode":"S","AccountOpened":"2014-07-01T08:00:00Z","AccountBalance":1234.00},
    { "AccountCode":"B0001", "AccountName":"Morgan Stanley","AccountTypeCode":"J","AccountOpened":"2014-07-01T08:00:00Z","AccountBalance":4321.00},
    { "AccountCode":"C0001", "AccountName":"BECU","AccountTypeCode":"S","AccountOpened":"2014-07-01T08:00:00Z","AccountBalance":1000.00}
];

var AccountTypes = [
    { "AccountTypeCode":"S","Description":"Single"},
    { "AccountTypeCode":"J","Description":"Joint"}
];

db.accounts.insert(Accounts);
db.accounts.ensureIndex({AccountCode:1},{unique:true,sparse:true});
db.accounttypes.insert(AccountTypes);

var accts = db.accounts.find();
while (accts.hasNext()){
    printjson(accts.next());
}

var accttypes = db.accounttypes.find();
while (accttypes.hasNext()){
    printjson(accttypes.next());
}

var idxs = db.system.indexes.find();
while (idxs.hasNext()){
    print(JSON.stringify(idxs.next()));
}

print("Database Setup!");





