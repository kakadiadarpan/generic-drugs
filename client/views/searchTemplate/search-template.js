Template.searchTemplate.helpers({
  medicines: function(){
    return Template.instance().searchModal.get('searchList');
  },
  /*searchDrugs: function(query, sync){
    return Products.find({prod_name:{
        $regex:query,
        $options:'i'
      }}).fetch()
  }*/

  getSearchCards: function(){
    var searchArr = Template.instance().searchModal.get('searchList');
    return searchArr.length > 0 ? searchArr : [];
  }
});

Template.searchTemplate.events({
  'keyup .search-drugs': function(event, template){
    var query = event.currentTarget.value;
    if(!lodash.isEmpty(query)){
      template.isSearch.set(true);
    } else {
      template.isSearch.set(false);
    }
    template.searchModal.set('searchList',[]);
    Meteor.call('searchDrugs',query,function (err,res) {
      if(res && res.length>0){
        template.searchModal.set('searchList',res);
      }
    });
  },

  'click .drug-card' : function(event, template){
    var drugId = event.currentTarget.dataset.drugId;
    Meteor.call('getDrugDetails', drugId, function(err, res){
      if(res){
        Session.set('drugDetailsForModal',res);
        $('#myModal').modal('show');
      }
    });
  }
});

Template.searchTemplate.rendered = function(){
  
}

Template.searchTemplate.created = function(){
  var instance = this;

  instance.searchModal = new ReactiveDict();
  instance.searchModal.set('searchList',[]);
  instance.searchModal.set('drugDetailedView','');
  instance.isSearch = new ReactiveVar();
  instance.isSearch.set(false);
  /*Meteor.call('searchDrugs','',function (err,res) {
      if(res && res.length>0){
        instance.searchModal.set('searchList',res);
      }
    });*/
}