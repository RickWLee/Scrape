var express=require('express');
var bodyParser=require('body-parser');
var logger=require('morgan');
var mongoose=require('mongoose');
var request=require('request');
var cheerio=require('cheerio');
var promise= require('bluebird');
var note=require('./models/note.js');
var article=require('./models/article.js');
mongoose.Promise =promise;

var app= express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static('public'));

var databaseUrl="mongodb://localhost/news";
if(process.env.MONGODB_URI){
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(databaseUrl);
}

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

	request("http://www.wdwmagic.com/news.htm", function(error, response, html){

		var $= cheerio.load(html);
		$(".clear-top-margin").each(function(i, element){
			var result={};

			result.title=$(this).children('a').text();
			result.link=$(this).children('a').attr('href');

		var entry= new article(result);

		entry.save(function(err.doc){

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



