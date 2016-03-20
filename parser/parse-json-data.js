//package ref. variable
var mongojs, db, mongoCollection, jsonFile;
//constants and global variables
var i, updateCount=0;
//param variables
var fileName, collectionName;

//functions
function updateToCollection(updateDoc) {
  updateDoc['_id'] = mongojs.ObjectId().toString();
  mongoCollection.insert(jsonFile[i], function (err) {
    if(err) {
      console.log(err);
    }
    if((jsonFile.length-1)===updateCount++) {
      db.close();
      console.log(updateCount+' has been uploaded to '+collectionName);
    }
  });//end db insert
}

//initialization
mongojs = require('mongojs');
db = mongojs('health-labz');
fileName = process.argv[2];
collectionName = process.argv[3];
mongoCollection = db.collection(collectionName);
jsonFile = require('./'+fileName);

//operations
if(Array.isArray(jsonFile)) {
  for(i=0; i<jsonFile.length; i++) {
    updateToCollection(jsonFile[i]);
  }
} else {
  updateToCollection(jsonFile);
}