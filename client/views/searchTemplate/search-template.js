Template.searchTemplate.helpers({
  medicines: function(){
    return Template.instance().searchModal.get('searchList');
  }
  /*searchDrugs: function(query, sync){
    return Products.find({prod_name:{
        $regex:query,
        $options:'i'
      }}).fetch()
  }*/
});

Template.searchTemplate.events({
  'keydown .search-drugs': function(event, template){
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
  }
});

Template.searchTemplate.rendered = function(){
  
}

Template.searchTemplate.created = function(){
  var instance = this;

  instance.searchModal = new ReactiveDict();
  instance.searchModal.set('searchList',[]);
  instance.isSearch = new ReactiveVar();
  instance.isSearch.set(false);
  Meteor.call('searchDrugs','',function (err,res) {
      if(res && res.length>0){
        instance.searchModal.set('searchList',res);
      }
    });
}