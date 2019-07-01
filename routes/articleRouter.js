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
  // Article.find({
  //     title: req.params.title
  //   },
  //   (err, articles) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.render("seeArticle", {
  //         articles: articles
  //       });
  //     }
  //   }
  // );
  Article.find({
      title: req.params.title
    })
    .then(articles => {
      res.render('seeArticle', {
        articles: articles
      })
    })
    .catch(err => console.log(err))
});

// Edit article route
router.get("/editArticle/:id", (req, res, ) => {
  // Article.findById({
  //   _id: req.params.id
  // }, (err, articles) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.render("editArticle", {
  //       articles: articles
  //     })
  //   }
  // })

  Article.findById(req.params.id)
    .then(articles => {
      res.render("editArticle", {
        articles: articles
      })
    })
    .catch(err => console.log('Error: ', err))

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

  // newArticle.save(function (err) {
  //   if (err) {
  //     console.log("Error:", err);
  //   } else {
  //     req.flash("success", "Article added");
  //     res.redirect("/article/seeArticle");
  //   }
  // });

  newArticle.save()
    .then(() => {
      req.flash("success", "Article added");
      res.redirect("/article/seeArticle");
    })
    .catch(err => {
      console.log("Error: ", err)
    })
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

// BACK TO ARTICLE (FROM EDIT ARTICLE PAGE) PAGE
router.post('/editArticle/back', (req, res) => {
  res.redirect('/article/seeArticle')
})

// EDIT ARTICLE POSTS
router.post('/editArticle/:id', (req, res) => {
  // const {
  //   title,
  //   body
  // } = req.body;

  // let article = {
  //   title,
  //   body
  // };

  // let query = {
  //   _id: req.params.id
  // }

  // Article.updateOne(query, article, function (err) {
  //   if (err) {
  //     console.log("Error:", err);
  //   } else {
  //     req.flash("success", "Article updated");
  //     res.redirect("/article/seeArticle");
  //   }
  // });
  // promises method
  Article.findById(req.params.id)
    .then(articles => {
      articles.title = req.body.title;
      articles.body = req.body.body;

      articles.save()
        .then(() => {
          req.flash("success", "Article updated");
          res.redirect("/article/seeArticle");
        })
        .catch(err => console.log("Error: ", err))
    })
    .catch(err => {
      console.log("Error: ", err);
      res.redirect('/articles/seeArticle');
    })
})



module.exports = router;