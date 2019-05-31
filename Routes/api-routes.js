var require = require("request");
var cheerio = require("cheerio");
var note = ("../models/note.js");
var item = ("../models/item.js");

module.exports = function (app) {
    app.get("/articles", function (request, response) {
        request("http://www.nytimes", function (error, response, html) {
            var $ = cheerio.load(html);
            const results = [];
            
            $("story-link").each(function(i, element) {

                var link = $(element).attr("href");
                var title = $($(element).find("h2.headline")[0]).text().trim();
                var summary = $($(element).find("p.summary")[0]).text().trim();
                results.push({
                link: link,
                title: title,
                summary: summary
                });
            });

