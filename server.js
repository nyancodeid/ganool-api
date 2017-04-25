var express = require('express');
var fs 		= require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app 	= express();

app.get('/get', function(req, res){
	console.log("accept request => get");
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

			res.json(json);
		} else {
			res.writeHead(500);
			res.write("Internal Server Error");

			res.end();
		}

	});
});

app.get('/page', function(req, res) {
	console.log("accept request => /page");

	url = req.query.url;
	request(url, function(error, response, html) {
		console.log("requested => " + url);

		if (!error) {
			var $ = cheerio.load(html);

			var title, poster, imdbRating, releaseDate, duration, quality, language, size, encoder, genres, actors, director, country, screenshot, synopsis, linkDownloads;
			var json = [];

			var posts = $("#singlepostpage");

			title 	= posts.find(".movie_infos > h1").text().replace(/\t/g, "").replace(/\n/g, "").replace(/\r/g, "");
			poster	= posts.find(".poster_post img").attr("src");
			imdbRating = posts.find("span > button.btn-warning > strong").text();
			releaseDate = posts.find(".movie_infos > span:nth-child(5) > button").text();
			duration = posts.find(".movie_infos > span:nth-child(6) > button").text();
			quality = posts.find('p[itemprop="moviequality"]').text().replace("Quality: ", "");
			size = posts.find('p[itemprop="moviesize"]').text().replace("Movie Size : ", "");
			language = posts.find('p[itemprop="movielanguage"]').text().replace("Language : ", "");
			genres = posts.find('p[itemprop="genre"]').text().replace("Genre : ", "").replace(/\t/g, "").replace(/\n/g, "").replace(/\r/g, "").replace(/, /g, ",");
			director = posts.find('p[itemprop="director"]').text().replace("Director: ", "").replace(/\t/g, "").replace(/\n/g, "").replace(/\r/g, "").replace(/, /g, ",");
			actors = posts.find('p[itemprop="actors"]').text().replace("Actors:  \r", "").replace(/\t/g, "").replace(/\n/g, "").replace(/, /g, ",");
			country = posts.find('p[itemprop="country"]').text().replace("Country : ", "");
			synopsis = posts.find('dd[itemprop="desc"] p').text();

			type = title.match(/ (Episode (\d{2,4})-(\d{2,4})) /g);
			if (type == null) {
				linkDownloads = [];

				posts.find("#customtables > table tr").each(function() {
					linkDownloads.push({
						title: $(this).find("> td:first-child").text(),
						link: $(this).find("> td:last-child a").text()
					});
					console.log($(this).find("> td:first-child").text());
				});


				
			} else {
				linkDownloads = [];
				listEpisode = [];
				iseng = [];
				items = posts.find(".mymorequality p").nextUntil("hr", "div");

				posts.find(".mymorequality p").each(function(i, elem) {
					linkDownloads.push({
						title: $(elem).text().replace(/\t/g, "").replace(/\n/g, "").replace(/\r/g, ""),
						links: []
					});
					$(elem).nextUntil("hr", "div").each(function() {
						linkDownloads[i].links.push($(this).find("a").text());
					});
				});
			}

			json.push({
				"title": title,
				"poster": poster,
				"quality": quality,
				"detail": {
					"imdbRating": imdbRating,
					"releaseDate": releaseDate,
					"duration": duration,
					"size": size,
					"language": language
				},
				"country":country,
				"actors": actors.split(','),
				"genre": genres.split(','),
				"director":director,
				"downloads": linkDownloads,
				"synopsis": synopsis,
			});
		}

		res.json(json);
	});
});

app.get('/demo/list', function(req, res) {
	console.log("get demo");
	res.writeHead(200, {'Content-Type': 'text/html'});

	fs.readFile('./demo/list.html', null, function(error, data) {
		if (error) {
			res.writeHead(404);
			res.write("File Not Found");
		} else {
			res.write(data);
		}

		res.end();
	});
});

app.listen('8081');

console.log('Ganool-API Run in Port 8081');

exports = module.exports = app;