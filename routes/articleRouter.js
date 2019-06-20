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

// Edit article route
router.get("/editArticle/:id", (req, res, ) => {
  Article.findById({
    _id: req.params.id
  }, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("editArticle", {
        articles: articles
      })
    }
  })
})

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
      req.flash("success", "Article added");
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

// PUT ROUTES
router.post('/editArticle/:id', (req, res) => {
  const {
    title,
    body
  } = req.body;

  let article = {
    title,
    body
  };

  let query = {
    _id: req.params.id
  }

  Article.updateOne(query, article, function (err) {
    if (err) {
      console.log("Error:", err);
    } else {
      req.flash("success", "Article updated");
      res.redirect("/article/seeArticle");
    }
  });
})



module.exports = router;