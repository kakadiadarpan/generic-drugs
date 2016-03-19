Router.route('/', function () {
  this.render('homePage');
});

Router.route('/symptoms/', function () {
  this.render('searchSymptoms');
});