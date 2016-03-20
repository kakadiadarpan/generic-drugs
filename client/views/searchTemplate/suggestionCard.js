Template.suggestionCard.created = function (){
  var instance = this;

};

Template.suggestionCard.rendered = function(){

};

Template.suggestionCard.helpers({
  getManufacturers: function(doc){
    var data = doc.manufacturers;
    return _.isObject(data.manufacturer.text) ?  data : data;
  },

  console : function(doc){
    console.log(doc);
  }
});

Template.suggestionCard.events({

});

