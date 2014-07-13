AngularExample project using MEAN stack.

Requires MongoDB to be running

Example:
> mongod --dbpath ./data/db

./data/seed folder has files to seed some example data using mongoimport.

Example:
> mongoimport --db angular --collection accounts --file accounts.txt
> mongoimport --db angular --collection accounttypes --file accounttypes.txt






