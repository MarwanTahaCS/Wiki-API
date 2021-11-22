//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//------------------------------------------------------------------------------

async function main() {
  const lineReader = require('line-reader');

  lineReader.eachLine('secret.txt', function(line, last) {
    mongoose.connect(line);
  });
}

// getting-started.js
main().catch(err => console.log(err));

//------------------------------------------------------------------------------
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

//------------------------------------------------------------------------------
app.route("/articles")

  .get(function(req, res){
    Article.find(function(err, foundArticles){
      if(err){
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })

  .post(function(req, res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err){
      if(err){
        res.send(err);
      } else {
        res.send("Successfully added new articles.");
      }
    });
  })

  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(err){
        res.send(err);
      } else {
        res.send("Successfully deleted all documents.")
      }
    });
  });

//------------------------------------------------------------------------------

  app.route("/articles/:articleTitle")

  .get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      } else {
        res.send("cannot find article with this title");
      }
    });
  })

  .put(function(req,res){
    Article.updateOne({title: req.params.articleTitle},{title: req.body.title, content: req.body.content},
      function(err){
        if(!err){
          res.send("Successfully updated the article.");
        } else {
          res.send(err);
        }
      });
  })

  .patch(function(req,res){
    Article.updateOne({title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully updated the article.");
        } else {
          res.send(err);
        }
      });
  })

  .delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle}, function(err){
      if(!err){
        res.send("article deleted successfully.");
      } else {
        res.send(err);
      }
    });
  });

//------------------------------------------------------------------------------

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
