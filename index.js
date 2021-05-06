/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

let prService = require("./services/prService");
let sizesService = require('./services/sizesService');
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  // app.on("pull_request", handlePullReq);
   /*
    1) Check the status of the PR - if its opened, then we add that particular record to the database
    along with the id, created date, title, labels, and size (we'll prolly need to soemthing with the size later)
    2) if the PR status is closed, then we take the id of that particular PR and then look up the PR in the database
    by id. we get the created_at date adn then we can calculate the time taken from there.
    3) Check the title of the PR for the word Haystack, if it contains it, then we add haystack to the list of labels.
    4) the average PR size should be straightforward. When we close a PR, we will update the size in the db, along with 
    a count and that will allow us to do the third part. 
  */

  app.on("pull_request.opened", async (context) => {
    if(context.payload.pull_request.title.toLowerCase().includes('haystack')){
      let label = "Haystack"
      let p = context.issue({
        labels : [label]
      })
      return context.octokit.issues.addLabels(p);
    }

    return; 
  });


  app.on("pull_request.closed", async (context) => {
    /*
    When a PR is closed, we first need to check if it was closed or merged.
    Depending on that we set a variable denoting that state. 
    Once we do that, we need to get the closed_at time and subtract it from the created_at time.
    then we can make the comment with the time
    */  
    let end_time = Date.parse(context.payload.pull_request.closed_at)
    let start_time = Date.parse(context.payload.pull_request.created_at)
    let repId = Number(context.payload.repository.id);
    let prId = Number(context.payload.pull_request.id)

    let durationMs = end_time-start_time
    let minutes = Math.floor(durationMs/1000/60);
    let closedType;

    if(context.payload.pull_request.merged === false){
        closedType = 'closed'
    }
    else{
        closedType = 'merged'
    }
    
    /*
    First, we check if the PR already exists in the collection. 
    if it does, then we update the size.
    if it doesnt, then we create a new entry.
    once we do that, we get all the PRs for that repository. 
    Using that, we can then calculate the average PR size. 
    */
    const prSize = Number(context.payload.pull_request.additions) + Number(context.payload.pull_request.deletions)
    
    let resObj = await sizesService.findPr({'prId': prId}).then((resp) =>{
      return resp.data;
    })
    let reqObj = {
      repositoryId :repId,
      size : prSize,
      prId : prId
    }

    if(Object.keys(resObj).length === 0){
      await sizesService.createSize(reqObj).then((resp) => {
        console.log(resp.data);
      });
    }
    else{
      await sizesService.updateSize(reqObj).then((resp) => {
        console.log(resp.data)
      })
    }

    let repObj = await sizesService.getSize({'repositoryId': repId}).then((resp) =>{
      return resp.data;
    })
    let totalSize = repObj.reduce((n, {size}) => n+size,0)
    let avgSize = totalSize/repObj.length;

    percentDiff = Math.abs((prSize-avgSize)/avgSize)*100
    verbalDiff = (prSize > avgSize) ? 'more' : 'less'
    
    const params = context.issue({ body: `This pull request took ${minutes} minute(s) to be ${closedType}.\n The size of this PR is ${prSize} lines while the average PR to this repo is ${avgSize} lines. This PR is ${percentDiff.toFixed(2)}% ${verbalDiff} than the average PR made to this repository` });

    return context.octokit.issues.createComment(params);

  });
};
