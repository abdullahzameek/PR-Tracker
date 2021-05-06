const router = require("express").Router();
let PullReq = require("../models/pullReq.model");

router.route("/").get((req, res) => {
  console.log("nothing to see here, move on");
});

router.route("/createpr").post((req, res) => {
  console.log(req.body);

  const prId = req.body.prId;
  const prTitle = req.body.prTitle;
  const prCreatedAt = Date.parse(req.body.prCreatedAt);
  const repositoryId = req.body.repositoryId;

  // const newArticle = new Article(body);
  const newPr = new PullReq({
    prId,
    prTitle,
    prCreatedAt,
    repositoryId,
  });

  console.log(newPr);

  newPr
    .save()
    .then(() => res.json("Added Pull Request!"))
    .catch((err) => {
      console.log("error " + err);
      res.status(400).json("Error: " + err);
    });
});

router.route("/updatepr").post((req, res) => {
  PullReq.find({
    prId: req.body.prId,
  })
    .then(pr => {
      pr.prId = req.body.prId;
      pr.prTitle = req.body.prTitle;
      pr.prCreatedAt = req.body.prCreatedAt;
      pr.repositoryId = req.body.repositoryId;
      pr.prSize = req.body.prSize;
      pr.prClosedAt = req.body.prClosedAt;
      pr.prMergedAt = req.body.prMergedAt;
      pr.prMerged = req.body.prMerged;
      pr.prAdditions = req.body.prAdditions;
      pr.prDeletions =  req.body.prDeletions;

      pr
        .save()
        .then(() => res.json("PR Updated"))
        .catch((err) => console.log("the err is ", err));
    })
    .catch((err) => console.log("the err is ", err));
});

module.exports = router;
