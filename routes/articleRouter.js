const express = require("express");
const router = express.Router();
const Article = require("../models/article");

// GET routes
router.get("/", (req, res) => {
  res.render("articlePage");
});

router.get("/addArticle", (req, res) => {
  res.render("addArticle");
});

router.get("/seeArticle", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("seeArticle", {
        articles: articles
      });
    }
  });
});

// Find specific article
router.get("/seeArticle/:title", (req, res) => {
  Article.find({
      title: req.params.title
    },
    (err, articles) => {
      if (err) {
        console.log(err);
      } else {
        res.render("seeArticle", {
          articles: articles
        });
      }
    }
  );
});

// POST ROUTES

router.post("/addArticle", async (req, res) => {
  const {
    title,
    author,
    body
  } = req.body;
  let newArticle = await new Article({
    title,
    author,
    body
  });

  if (!author || !title || !body) {
    req.flash("error", "All fields need to be filled out");
    res.redirect("/article/addArticle");
  }

  newArticle.save(function (err) {
    if (err) {
      console.log("Error:", err);
    } else {
      req.flash("success", "Scroll down to see newly added article.");
      res.redirect("/article/seeArticle");
    }
  });
});


router.post('/searchTitle', async (req, res) => {
  const {
    searchTitle
  } = req.body;

  const postTitle = await Article.findOne({
    title: searchTitle
  })

  if (searchTitle === "") {
    req.flash("error", `Title not found.`);
    res.redirect('/article/seeArticle')
  } else if (!postTitle) {
    req.flash("error", `${searchTitle} not found.`);
    res.redirect('/article/seeArticle')
  } else {
    res.redirect(`/article/seeArticle/${searchTitle}`)
  }
})

module.exports = router;