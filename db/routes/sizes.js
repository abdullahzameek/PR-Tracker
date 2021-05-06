const router = require("express").Router();
let Sizes = require("../models/sizes.model");

//create an entry for a PR with its size
router.route("/createSize").post((req, res) => {
  console.log(req.body);

  const repositoryId = req.body.repositoryId;
  const size = req.body.size
  const prId = req.body.prId

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

//update an existing PR's size
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

//get all the PR sizes for a particular repository
router.route("/getSize").get((req, res) => {
    console.log(req.query)
    Sizes.find({
        'repositoryId': Number(req.query.repositoryId)
    })
        .then(s => res.json(s))
        .catch(err => res.status(400).json('Error: ' + err));
})

//find a particular PR by Id.
router.route("/findPr").get((req, res) => {
    console.log(req.query)
    Sizes.find({
        'prId': Number(req.query.prId)
    })
        .then(s => res.json(s))
        .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;
