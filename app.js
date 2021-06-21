const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);



/////ARTICLES TARGETING ARTICLES

app.route("/articles")

.get(function(req,res){

  Article.find({}, function(err, foundItems){
    if(!err){
      res.send(foundItems);
    } else {
      res.send(err);
    }
  });

})

.post(function(req, res){

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully added a new Article.")
    } else{
      res.send(err);
    }
  });

})

.delete(function(req, res){

  Article.deleteMany({}, function(err){
    if(!err){
      console.log("Deleted all Articles successfully.");
    } else{
      console.log(err);
    }
  });

});



//////REQUESTS TARGETING SPECIFIC ARTICLE

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, result){
    if(!err){
      res.send(result);
    } else {
      res.send("No articles matching the title was found.");
    }

  });

})

.put(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated Article.");
      } else{
        res.send(err);
      }
    }
  );

})

.patch(function(req, res){

  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article");
      } else  {
        res.send(err);
      }
    }
  )

})

.delete(function(req, res){

  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully deleted the article.");
      } else {
        res.send(err);
      }
    }
  );

});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
