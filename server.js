var express = require('express');
var fs 		= require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app 	= express();

app.get('/get', function(req, res){
	console.log("accept request");
	url = req.query.url;

	request(url, function(error, response, html) {
		console.log("requested => " + url);

		if (!error) {
			var $ = cheerio.load(html);

			var title, link, year, fullTitle, realTitle, type, episode, size, poster, qualityVideo, quality, qualityRaw;
			var json = [];

			$(".movies-list .ml-item").each(function(i, elem) {
				
				title 	= $(this).find("> a").attr("title");
				link	= $(this).find("> a").attr("href");
				year	= $(this).find(".yellowbox").text();
				poster  = $(this).find(".thumb.mli-thumb").attr("style");

				fullTitle 		= title;
				realTitle 		= title.match(/(.*?)\d{4}\)/g);
				size	  		= title.match(/ \d{3,4}(MB|GB) /g);
				type 	  		= title.match(/ (Episode (\d{2,4})-(\d{2,4})) /g);
				poster    		= /background-image: url\((.*?)\)/g.exec(poster);
				quality   		= / (BD|CAM|HDTC|DVDSrc|Cut|WEBRip|HDTV|HDCAM|DVDRip|HDTS|WEB-DL|UNRATED|Web|WEB|HDRip) /g.exec(title);
				qualityVideo 	= / (\d{3,4}p) /g.exec(title);
				bluray	  		= title.match(/BluRay/g);
				qualityRaw 		= "";

				if (realTitle == null) {
					realTitle = title.match(/(.*?)\d{4}-\)/g);
				}
				if (realTitle == null) {
					realTitle = title.match(/(.*?)\d{4}-\d{4}\)/g);
				}
				if (type != null) {
					episode = / Episode (.*?)-(.*?) /g.exec(title);
					episode = [episode[1], episode[2]];
				}
				if (quality != null) {
					qualityRaw += quality[1] + " ";
				}
				if (bluray != null) {
					qualityRaw += "BluRay ";
				}
				if (qualityVideo != null) {
					qualityRaw += qualityVideo[1];
				}

				json.push({
					"title": realTitle[0],
					"fullTitle": fullTitle,
					"link": link,
					"poster": poster[1],
					"quality": (qualityRaw == "") ? "undefined" : qualityRaw,
					"detail": {
						"year": year,
						"size": (size == null) ? "undefined" : size[0].replace(/ /g, ""),
						"episode": (type == null) ? undefined : episode,
						"type": (type == null) ? "movie/tv" : "series"
					}
				});

				qualityRaw = "";

			});

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(json, null, 3));

		}

	});

});

app.listen('8081');

console.log('Ganool-API Run in Port 8081');

exports = module.exports = app;