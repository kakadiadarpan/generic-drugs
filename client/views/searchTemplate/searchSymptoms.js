Template.searchSymptoms.created = function (){
  var instance = this;

  instance.searchSymptomsModel = new ReactiveDict();
  instance.searchSymptomsModel.set('searchKey','');
  instance.isSelected = new ReactiveVar();
  instance.isSelected.set(false);
};

Template.searchSymptoms.rendered = function(){

};

Template.searchSymptoms.helpers({
  symptoms: function(){
    var isSelected;
    if(!isSelected){
      return Template.instance().searchSymptomsModel.get('searchList');
    }
  }
});

Template.searchSymptoms.events({
  'keyup .search-drugs': function(event, template){
    template.isSelected.set(false);
    var query = event.currentTarget.value;
    if(!lodash.isEmpty(query)){
      query = lodash.escapeRegExp(query);
      template.searchSymptomsModel.set('searchList','');
    } else {
      template.searchSymptomsModel.set('searchList','');
    }
    Meteor.call('searchSymptoms',query,function (err,res) {
      if(res && res.length>0){
        template.searchSymptomsModel.set('searchList',res);
      } else {
        template.searchSymptomsModel.set('searchList',[]);
      }
    });
  },

  'click .symptom-list': function(event, template){
    template.isSelected.set(true);
    var symptomId = event.target.dataset.sympId;
    var symptomList = template.searchSymptomsModel.get('searchList');
    var currObj = _.find(symptomList, function(v) {
      return v.id = symptomId;
    });
    template.$('.search-drugs').val(event.target.textContent);
    template.$('.symptom-list').addClass('hidden');
    if(currObj && currObj.parent_relation){

    }
  }
});

