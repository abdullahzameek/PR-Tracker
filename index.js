/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

let sizesService = require('./services/sizesService');
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  /*
  When a PR is opened, the main thing we're concerned about is whether it has 
  Haystack in the title. If it does, then we add the label Haystack to it.
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

  /*
  When a PR is closed, we first need to check if it was closed or merged.
  Depending on that we set a variable denoting that state. 
  Once we do that, we need to get the closed_at time and subtract it from the created_at time.
  then we can make the comment with the time
  */  
  app.on("pull_request.closed", async (context) => {

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
    Once we do that, we get all the PRs for that repository. 
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
    //check if the obj is empty 
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
    //get a list of objects that have the PRs for a particular repo
    let repObj = await sizesService.getSize({'repositoryId': repId}).then((resp) =>{
      return resp.data;
    })
    //sum up the sizes, divide by length
    let totalSize = repObj.reduce((n, {size}) => n+size,0)
    let avgSize = totalSize/repObj.length;

    percentDiff = Math.abs((prSize-avgSize)/avgSize)*100
    verbalDiff = (prSize > avgSize) ? 'more' : 'less'
    
    const params = context.issue({ body: `This pull request took ${minutes} minute(s) to be ${closedType}.\n The size of this PR is ${prSize} lines while the average PR to this repo is ${avgSize} lines. This PR is ${percentDiff.toFixed(2)}% ${verbalDiff} than the average PR made to this repository` });

    return context.octokit.issues.createComment(params);

  });
};
