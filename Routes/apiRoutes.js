var requestuest = requestuire("requestuest");
var mongoose = requestuire('mongoose');
var cheerio = requestuire("cheerio");
var db = requestuire("../models");

module.exports = function (app) {

    app.get('/articles', function (request, response) {
        requestuest("https://www.nytimes.com", function(error, responseponse, html) {

            var $ = cheerio.load(html);

            var userResults = [];
            
            $("a.story-link").each(function(i, element) {

                var link = $(element).attr("href");
                var title = $($(element).find("h2.headline")[0]).text().trim();
                var summary = $($(element).find("p.summary")[0]).text().trim();
                userResults.push({
                link: link,
                title: title,
                summary: summary
                });
            });

            db.article.create(userResults)
                .then(function(dbArticle) {
                })
                .catch(function(error) {
                return response.json(error);
                });
                
            db.article.find({}).then(function(dbData){
                console.log("DB DATA --------------------, ", dbData)
                response.json(dbData);
            });
        });

    });

    app.put("/save-article/:articleId", function(request, response) {
        db.article.findByIdAndUpdate(request.params.articleId, {    $set: { saved: true }
        }).then(function(data) {
            response.json(data);
        });
    });

    app.get("/display-saved/", function(request, response) {
        db.article.find( 
            { saved: true }
        ).then(function(data) {
            response.json(data);
        });
    });

    app.put("/delete-from-saved/:articleId", function(request, response) {
        db.article.findByIdAndUpdate(request.params.articleId, {    $set: { saved: false }
        }).then(function(data) {
            response.json(data);
        });
    });

    app.post("/create-note/:articleId", function(request, response) {
        console.log(request.body);
        db.Note.create(request.body)
            .then(function(dbNote) {
                console.log(dbNote._id)
                return db.article.findOneAndUpdate({_id: request.params.articleId}, { $push: { note: dbNote._id } }, { new: true });
            }).then(function(dbArticle) {
                response.json(dbArticle);
            }).catch(function(error) {
                response.json(error);
        });
    });

    app.get("/show-article-notes/:articleId", function(request, response) {
        db.article.findById(request.params.articleId)
          .populate("note")
          .then(function(dbArticle) {
            response.json(dbArticle);
          })
          .catch(function(error) {
            response.json(error);
          });
      
      });

      app.delete("/delete-note/:noteId", function (request, response) {
        db.Note.findByIdAndRemove(request.params.noteId, (error, note) => {
            if (error) return response.status(500).send(error);
            return response.status(200).send();
        });

    });
        

};