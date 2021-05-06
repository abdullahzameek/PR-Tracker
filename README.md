# track-prs

> A GitHub App built with [Probot](https://github.com/probot/probot) that An app that tracks how long it takes for a PR to be merged

This app was scaffolded and built with the help of Probot,while the backend component was built with NodeJS+Express interacting with a MongoDB database. 

## Setup

```sh
# Install dependencies
npm install

#Install dependencies for the Express App 
cd db/ 
npm install

# Run the bot
npm start

# Start the Express App on a separate terminal. (App has successfully launched if you see `MongoDB database connection established successfully`)
cd db/
npm run dev 
```

# Demo Link

https://www.loom.com/share/d8ffdc29a0744697a2a9808364c8d35f

# Features

## Github App 

1) When the Github App is setup on a particular repository, it will handle webhooks from the pull_request event (namely, opened and closed).


2) When a PR is opened, it will look at the Title of the PR. If it contains the word HayStack, it will add the label "HayStack"
to the PR. This is done by examining the value of `context.payload.pull_request.title` for a case-insensitive occurence of the word.


3) When a PR is closed, multiple actions are performed.

    a) The time duration between opened and closed is calculated using the `closed_at` and `created_at` keys.

    b) If the `merged` property is set to true, we set the type of "closed" to be "merged".

    c) We calculate the PR size to be the sum of additions and deletions. 

4) We then interact with our Express App and MongoDB database. We look for that particular PR in the collection. If it doesnt exist, we add a new document to the collection with the `prId`, `repositoryId` and `size`. If it already exists, then we just update the size. Once the updates are done, we get all the PRs for that particular repository and calculate the average size. 

5) Once all this is done, we build up the comment using the duration for closing, as well as the difference between average PR size and the size of the PR that we're trying to merge.

## Github Action.

The action was built using the basic Github Action boilerplate code, as well as the github-scripts package to make use of Javascript in the `scripts` components of the YAML file. The script itself is very straightforward - a random number is generated between 10 and 20, and the process is put to sleep for that amount of time, following which a comment with that time is made to the PR.

# Additional Notes/Thoughts

This was the first time I worked with Github Webhooks, so I found this project to be a pretty great learning experience. I think I was able to work through this project in a fairly reasonable time (around 4-4.5 hrs approximately, including the Bonus Todo). I think the biggest challenge I faced with this was simply getting used to the Probot framework and then figuring out how the Github Actions YAML file needed to be structured. My initial idea was to also have a MongoDB Collection for each individual PR. I did write some code out for that part of the backend, but then soon realised that for the scope of this take home, I didnt really need to have persistent records for the details of each individual PR, but rather, just having the records of their sizes would be sufficient. 
All in all, I'm pretty happy that I was able to accomplish the task, and I'm looking forward to hearing any feedback you have!
