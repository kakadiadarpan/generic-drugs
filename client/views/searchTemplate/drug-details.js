Template.drugDetails.created = function(argument) {
	// body...
}

Template.drugDetails.helpers({
	getIngredients: function (argument) {
		var ingredients = this.activeingred;
		return ingredients.join(',');
	},

	getDrugBankId: function (argument) {
		var data = this;
		//return 'http://www.drugbank.ca/drugs/' + data['drugbank-id'][0]['#text'];
	},

	getCreated: function (argument) {
		var data = this;
		return data['-created'];
	},

	getUpdated: function (argument) {
		var data = this;
		return data['-updated'];
	},

	getNumbers: function (argument) {
		var data = this,
			drugbank_id = data['drugbank-id'],
			return_text={};

		return_text['other'] = [];

		for (var i = drugbank_id.length - 1; i >= 0; i--) {
			if(typeof drugbank_id[i] ==='object'){
				if(drugbank_id[i]['-primary']){
					return_text['primary'] = drugbank_id[i]['#text'] + return_text;
				} else {
					return_text['other'].push(drugbank_id[i]);
				}
			}
		}
		return_text['other'] = return_text['other'].join(',');
		return return_text;

	},

	getGroups: function (argument) {
		var data = this;
		return data['groups'].join(',');
	},

	getSynonyms: function (argument) {
		var data = this,
			synonym = [];

		for (var i = data['synonyms']['synonym'].length - 1; i >= 0; i--) {
			synonym.push(data['synonyms']['synonym'][i]['#text']);
		}

	},

	getCreatedDate: function(){
		var data = this._created;
		return data ? data : '';
	},

	getUpdatedDate: function(){
		var data = this_.updated;
		return data ? data : '';
	},

	getTargets : function (){
		var data = this.targets;
		return !(_.isEmpty(data)) ? data.target : {};
	},

	getExteralLinks : function(){
		var data = this['external-links'];
		return !(_.isEmpty(data)) ? data['external-link'] : {};
	},

	getExternalIdentifiers : function(){
		var data = this['external-identifiers'];
		return !(_.isEmpty(data)) ? data['external-identifier'] : {};
	},

	getExperimentalProperties: function(){
		var data = this['experimental-properties'];
		return !(_.isEmpty(data)) ? data['property'] : {};
	},

	getPatents : function(){
		var data = this['patents'];
		return !(_.isEmpty(data)) ? data['patent'] : {};
	},

	getDosageForm: function(){
		var data = this['dosages'];
		return !(_.isEmpty(data)) ? data['dosage'] : {};
	}
})