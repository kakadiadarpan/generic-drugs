Meteor.startup(function(){
	API_URL = 'http://www.truemd.in/api/';
	API_KEY = 'ec24008df1fec041a63ee60a02d6b9';
});

Meteor.methods({
	searchDrugs: function(query, options){
		var drugs, regexQuery;
		if(!query){
			return DrugList.find({name:{
		        $regex:query,
		        $options:'i'
		      }},{$sort:{name:1},limit:50}).fetch()
		} else {
			regexQuery = lodash.escapeRegExp(query);
			drugs = DrugList.find({name:{
		        $regex:regexQuery,
		        $options:'i'
		      }},{$sort:{name:1},limit:50}).fetch()
		}
			return drugs;
		/* else {
			drugs = Meteor.call('getData', query, '5');
			return drugs.map(function(obj){
				return {
					prod_name:obj.suggestion
				};
			});
		}*/
	},

	getData: function(query, limit) {
		var suggestions,
			response = Meteor.call('apiCall','medicine_suggestions',query,limit),
			content = {},
			details = {},
			i,
			alternatives = [];
		if(!lodash.isEmpty(response)){
			content = response.response;
			suggestions = content.suggestions;
			for (i = 0; i < suggestions.length; i++) {
				details = {};
				alternatives = [];
				details = Meteor.call('apiCall','medicine_details',suggestions[i].suggestion);
				suggestions[i].details = details.response;
				alternatives = Meteor.call('apiCall','medicine_alternatives',suggestions[i].suggestion,10);
				suggestions[i].alternatives = alternatives.response.medicine_alternatives;
			}
			return suggestions;
		}
		return false;
	},

	apiCall: function(queryType, query, limit) {
		var varUrl = API_URL + queryType + '?key=' + API_KEY;

		 if (queryType !== 'medicine_details' && limit > 0) {
			varUrl += '&limit=' + limit;
		}
		if (query) {
			varUrl += '&id=' + query;
		}
		res = HTTP.get(varUrl);
		if (res.statusCode !== 400 && res.statusCode !== 401) {
			return JSON.parse(res.content);

		}
	},

	searchSymptoms: function(query){
		if(!query){
			return Symptoms.find({
				name: {
					$regex: query,
					$options: 'i'
					}},{$sort:{name:1},limit:50}).fetch();
		}
		var data = Symptoms.find({name: { $regex: query, $options: 'i'}},{$sort:{name:1},limit:50}).fetch();
		if(data.length > 0){
			return data;
		}
	},

	getDrugDetails: function(drugId){
		return drugId ? DrugList.find({_id:drugId}).fetch() : {};
	},

	getSimilarDrugDetailsByParams: function(searchBy, searchKey){
		return (searchBy && searchKey) ? Products.find({searchBy: searchKey}).fetch() : {};
	}
});
