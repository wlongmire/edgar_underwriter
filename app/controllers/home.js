var express = require('express'),
    $ = require('jquery'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    http = require('http');

module.exports = function (app) {
  app.use('/', router);
  app.use( bodyParser.json());
  app.use( bodyParser.urlencoded({
    extended: true
  }));
};

var knex = require('knex')({
	client: 'mysql',
	connection: {
  	host: 'us-cdbr-azure-east-a.cloudapp.net',
		user: 'b068a96499d036',
		password: '2c4041cb',
		database: 'eagertobp'
	}
});


var subs = [];

knex.select().from('submissionanalytics').limit(300).then(function(results){
      subs = results;
      
      subs.forEach(function(s, i){
        s.id = i;
        s.rating = null;
        s.quote = null;
      });

});



router.get('/', function (req, res, next) {

  
    res.render('index', {
      submissions:subs
    });
  
});

router.get('/sub/:id', function (req, res, next) {

  res.render('submission', {
    sub: subs[req.params.id]
  });

});

router.post('/sub/:id/rating', function (req, res, next) {
  var alert = {
    type:(!req.body.rating)?'danger':'success',
    message:(!req.body.rating)?'Error: Please select a rating.':'Successfully changed rating.',
  }

  if (req.body.rating) {
    subs[req.params.id].rating = req.body.rating;
    subs[req.params.id].rating_date = new Date();
  }

  res.render('submission', {
    sub: subs[req.params.id],
    alert: alert
  });
});

router.post('/sub/:id/quote', function (req, res, next) {
  var alert = {
    type:(!req.body.comment)?'danger':'success',
    message:(!req.body.comment)?'Error: Please enter a Quote Comment.':'Successfully quoted. Sending response to User.'
  }

  if (req.body.comment) {
    subs[req.params.id].quote = req.body.comment;
    subs[req.params.id].quote_date = new Date();
  }

  res.render('submission', {
    sub: subs[req.params.id],
    alert: alert
  });
});