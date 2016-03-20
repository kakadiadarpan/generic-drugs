//package ref. variable
var LineByLineReader, lr, mongojs, db, mongoCollection;
//constants and global variables
var docTypes, chemicalTypes, headerRow=true, headerNames, mongoRecordObj, updateCount=0;
//param variables
var filename, collectionName, type, updateKey, updateType, pushKey;
//object with functions
var proceedQuery, modifyFields, getFieldUpdateQuery;

docTypes = {
  'B': 'Biopharmaceutics',
  'M': 'Presubmission',
  'N': 'Approval',
  'P': 'Periodic Safety Report',
  'S': 'Supplement',
  'SB': 'SBA',
  'SC': 'Chemistry',
  'SCA': 'Packaging Addition',
  'SCB': 'Facility Addition',
  'SCC': 'Supplier Addition',
  'SCD': 'Packager Addition',
  'SCE': 'Expiration Date Change',
  'SCF': 'Formulation Revision',
  'SCG': 'Chemistry Generic',
  'SCI': 'Chemistry in Effect',
  'SCM': 'Manufacturing Change or Addition',
  'SCP': 'Package Change',
  'SCQ': 'Chemistry New Strength',
  'SCR': 'Manufacturing Revision',
  'SCS': 'Control Supplement',
  'SCX': 'Chemistry Expedite',
  'SDC': '',
  'SDS': 'Distributor',
  'SE1': 'New or Modified Indication',
  'SE2': 'New Dosage Regimen',
  'SE3': 'New Route of Administration',
  'SE4': 'Comparative Efficacy Claim',
  'SE5': 'Patient Population Altered',
  'SE6': 'OTC Labeling',
  'SE7': 'Accelerated Approval',
  'SE8': 'Efficacy Supplement with Clinical Data to Support',
  'SED': 'Efficacy (MarkIV)',
  'SEF': '',
  'SES': 'General Efficacy (MarkIV)',
  'SF': 'Final Printed Labeling (MarkIV)',
  'SFP': 'Final Printed Labeling - MarkIV',
  'SL': 'Labeling',
  'SLA': 'Labeling (MarkIV)',
  'SLI': 'Labeling in Effect',
  'SLM': 'Labeling (MarkIV)',
  'SLR': 'Labeling Revision',
  'SLS': 'Labeling (MarkIV)',
  'SLX': 'Labeling Expedite',
  'SO': 'Other',
  'SOA': 'Other Amendment',
  'SPD': 'Practioner Draft Labeling',
  'SPF': 'Practioner Draft Labeling',
  'SRC': 'Resubmission - Chemistry (MarkIV)',
  'SRE': 'Resubmission - Efficacy (MarkIV)',
  'SRO': 'Resubmission - Other (MarkIV)',
  'SS': 'Microbiology',
  'SSA': 'Supplement Amendment (MarkIV)',
  'SSP': 'Supplement Pediatric (MarkIV)',
  'SSR': 'Supplement Resubmission (MarkIV)',
  'SSW': 'Supplement Withdrawal (MarkIV)',
  'TA': 'Tentative Approval',
  'Y': 'Annual Report'
};

chemicalTypes = {
  '1': 'New molecular entity (NME)',
  '2': 'New active ingredient',
  '3': 'New dosage form',
  '4': 'New combination',
  '5': 'New formulation  or new manufacturer',
  '6': 'New indication [no longer used]',
  '7': 'Drug already marketed without an approved NDA',
  '8': 'OTC (over-the-counter) switch',
  '9': 'New indication submitted as distinct NDA, consolidated with original NDA after approval',
  '10': 'New indication submitted as distinct NDA - not consolidated'
};

//functions
function splitSubordinateFields(fieldValue) {
  var j, stringSplitters=[';'];
  if(fieldValue) {
    for(j=0; j<stringSplitters.length; j++) {
      if(fieldValue.indexOf(stringSplitters[j]) !== -1) {
        fieldValue=fieldValue.split(stringSplitters[j]);
      }
    }//end for
  }//end if

  return fieldValue;
}

function getSetQuery(fieldsDoc) {
  var query=[], updateKeyObj={};
  if(fieldsDoc[updateKey]) {
    updateKeyObj[updateKey] = fieldsDoc[updateKey];
    query.push(updateKeyObj);
    query.push(getFieldUpdateQuery[updateType](fieldsDoc));
  } else {
    console.log('failed to update ');
    console.log(fieldsDoc);
  }
  return query;
}

//objects with functions
modifyFields = {
  'DocType': function(docType) {
    //console.log(docType)
    return docType;
  },
  'Chemical_Type': function(chemicalType) {
    return chemicalTypes[chemicalType];
  }
};

getFieldUpdateQuery = {
  '$set': function(fieldsDoc) {
    var j, modifiedDoc={};
    modifiedDoc[updateType]={};
    delete  headerNames[updateKey];
    for(j=0; j<headerNames.length; j++) {
      if(modifyFields[headerNames[j]]) {
        modifiedDoc[updateType][headerNames[j]] = modifyFields[headerNames[j]](fieldsDoc[headerNames[j]]);
      } else {
        modifiedDoc[updateType][headerNames[j]] = fieldsDoc[headerNames[j]];
      }
    }//end for

    return modifiedDoc;
  },
  '$push': function(fieldsDoc) {
    var j, modifiedDoc={};
    modifiedDoc[updateType]={};
    modifiedDoc[updateType][pushKey]={};
    delete  headerNames[updateKey];
    for(j=0; j<headerNames.length; j++) {
      if(modifyFields[headerNames[j]]) {
        modifiedDoc[updateType][pushKey][headerNames[j]] = modifyFields[headerNames[j]](fieldsDoc[headerNames[j]]);
      } else {
        modifiedDoc[updateType][pushKey][headerNames[j]] = fieldsDoc[headerNames[j]];
      }
    }//end for

    return modifiedDoc;
  }
};

proceedQuery = {
  'insert': function(queryDoc) {
    //queryDoc['_id'] = queryDoc['ApplNo']+queryDoc['ProductNo'];
    queryDoc['_id'] = mongojs.ObjectId().toString();
    mongoCollection.insert(queryDoc, function (err) {
      if(err) {
        console.log(err);
      }
      lr.resume();//resume to next line after insert
    });//end db insert
  },
  'update': function(queryDoc) {
    var generatedQuery = getSetQuery(queryDoc);
    mongoCollection.update(generatedQuery[0], generatedQuery[1], {multi: true}, function (err, res) {
      if(err) {
        console.log(err);
      } else {
        console.log(res);
      }
      console.log(updateCount++);
      lr.resume();//resume to next line after update
    });//end db update
  }
};

//initialization
LineByLineReader = require('line-by-line');
mongojs = require('mongojs');
db = mongojs('health-labz');
filename = process.argv[2];
collectionName = process.argv[3];
type = process.argv[4];
updateKey = process.argv[5];
updateType = '$'+process.argv[6];
pushKey = process.argv[7];
mongoCollection = db.collection(collectionName);

//begin process
lr = new LineByLineReader(filename);
console.log('Processing...');

lr.on('error', function (err) {
  console.log(err);
});

lr.on('line', function (line) {
  var i;
  if(line) {
    //wait until mongo query to complete
    lr.pause();
    mongoRecordObj = {};

    if(headerRow) {
      headerNames=line.split('\t');
      lr.resume();
    } else {
      line = line.split('\t');
      for (i=0; i<headerNames.length; i++) {
        mongoRecordObj[headerNames[i]]=splitSubordinateFields(line[i]);
      }//end for

      proceedQuery[type](mongoRecordObj);
    }//end else

    //Considering first row as header row
    //setting header row false after first iteration
    headerRow=false;
  }
});

//end process
lr.on('end', function () {
  db.close();
  console.log('Data Successfully updated to "'+collectionName+'"');
});

