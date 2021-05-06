const router = require("express").Router();
let Sizes = require("../models/sizes.model");

router.route("/").get((req, res) => {
  console.log("nothing to see here, move on");
});

router.route("/createSize").post((req, res) => {
  console.log(req.body);

  const repositoryId = req.body.repositoryId;
  const size = req.body.size
  const prId = req.body.prId
  // const newArticle = new Article(body);
  const newSize = new Sizes({
    repositoryId,
    size,
    prId
  });

  console.log(newSize);

  newSize
    .save()
    .then(() => res.json("Added Size!"))
    .catch((err) => {
      console.log("error " + err);
      res.status(400).json("Error: " + err);
    });
});

router.route("/updateSize").post((req, res) => {
  Sizes.findOne({
    prId: req.body.prId,
  })
    .then(s => {
      s.repositoryId = req.body.repositoryId;
      s.size = req.body.size
      s.prId = req.body.prId

      s.save()
        .then(() => res.json("PR Updated"))
        .catch((err) => console.log("the err is ", err));
    })
    .catch((err) => console.log("the err is ", err));
});

router.route("/getSize").get((req, res) => {
    console.log(req.query)
    Sizes.find({
        'repositoryId': Number(req.query.repositoryId)
    })
        .then(s => res.json(s))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route("/findPr").get((req, res) => {
    console.log(req.query)
    Sizes.find({
        'prId': Number(req.query.prId)
    })
        .then(s => res.json(s))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;
