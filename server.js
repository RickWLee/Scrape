//Dependencies
var express=require('express');
var bodyParser=require('body-parser');
var logger=require('morgan');
var mongoose=require('mongoose');
//npm required for Notes and Article models
var Note=require('./models/Note.js');
var Article=require('./models/Article.js');
//npm reqired for Scraping
var request=require('request');
var cheerio=require('cheerio');
//Mongoose promise deprecate - used bluebird
var Promise= require('bluebird');

mongoose.Promise =Promise;

var app= express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost/news");

var db=mongoose.connection;

db.on('error', function (err){
	console.log('Mongoose Error: ', error);
});

db.once('open', function(){
	console.log("Mongoose connection successful.");
});

//Route

app.get("/", function(req, res){
	res.send(index.html);

});

app.get("/scrape", function(req, res){

	request("https://www.fencing.net/news/world/", function(error, response, html){
		// var domain="https://www.fencing.net";
		var $= cheerio.load(html);
		$("h1").each(function(i, element){
			var result={};

			result.title=$(this).children('a').text();
			result.link=$(this).children('a').attr('href');

		var entry= new Article(result);

		entry.save(function(err,doc){

			if (err) {
				console.log(err);

			} else {
				console.log(doc);
			}

		});
		});
	});

	res.send('Scrape Complete');
});

app.get ('/articles', function(req, res){
	Article.find({}, function(error, doc){

		if (error){

			console.log(error);
		} else {
			res.json(doc);
		}
	});
});

app.get('/articles/:id', function(req, res){

	Article.findOne({"_id": req.params.id})
	.populate("note")
	.exec(function(error,doc){
		if (error){
			console.log(error);
		} else {
			res.json(doc);

		}
	});

});

app.post('/articles/:id', function(req, res){

	var newNote = new Note(req.body);
	newNote.save(function(error, doc){
		if(error){
			console.log(error);

		} else{

			Article.findOneAndUpdate({ "_id":req.params.id}, {"note": doc._id})
			.exec(function(err, doc){
				if(err) {
					console.log(err);
				} else {
					res.send (doc);
					// console.log(doc);
				}
			});
		}
	});

});

app.listen(3000, function(){
console.log("App Running On Port 3000!");

});
