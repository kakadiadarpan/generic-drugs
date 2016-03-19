Router.route('/', function () {
  this.render('homePage');
});

Router.route('/symptoms/', function () {
  this.render('searchSymptoms');
});

Router.route('/drugDetails/', function () {
  this.render('suggestionCard');
});

