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

  getMixture: function () {
    if(this && this.mixtures && this.mixtures.mixture){
      var data = this.mixtures.mixture;
      if(data[0] && data[0].name){
        return data[0].name;
      } else if(data && data.name){
        return data.name;
      }
    }
  },

  getIngredients: function () {
    if(this && this.mixtures && this.mixtures.mixture){
      var data = this.mixtures.mixture;
      if(data[0] && data[0].ingredients){
        return data[0].ingredients;
      } else if(data && data.ingredients){
        return data.ingredients;
      }
    }
  }
});

Template.suggestionCard.events({

});

