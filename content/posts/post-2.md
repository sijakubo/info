+++
date = "2020-07-09"
draft = false
title = "Creating a blog using Gatsby and host it on GitHub Pages in 15 Minutes for free"
tags = ["Gatsby", "GitHub", "GitHub Pages", "CI/CD"]
+++

Of course you would write the first blog post about creating the actual blog itself. So do I.

# Create Gatsby blog

## Install Gatsby

First of all, we need to install [Gatsby](https://www.gatsbyjs.com/) which will generate the static blog pages

```shell
$ brew install gatsby-cli
```

## Create a blog based on a Template

```shell
$ gatsby new <name_of_the_blog> <template_url>
//e.g.:
$ gatsby new blog https://github.com/niklasmtj/gatsby-starter-julia
```

## Start the blog and customise it
The blog gets refreshed automatically when you save the files in your IDE

```shell
$ gatsby develop
```


# Add Version Control (GitHub)

When initializing the Gatsby project. An initial commit has been made with the base structure of the project. After the Adjustments and
Customization has been, add the project to VSC. In my example i'm unsing Github. So i created a Repository and added the remote of my
project to this location:

```shell
$ git remote add origin https://github.com/sijakubo/info.git
// check the remotes
$ git remote -v
```

After that, I pushed the changes to master

# Add CI + Deployment to GitHub Pages

## Publish Configuration

We're going to add GitHub Actions to build the project and deploy the blog to GithubPages. To build an publish the changes to github pages,
there is a neat project for that:

```shell
$ npm install gh-pages --save-dev
```

`gh-pages` needs the repository name in order to copy the public files to GitHub Pages. Therefore, add the following to
your `gatsby-config.js`

```javascript
module.exports = {
  pathPrefix: "/<repository_name>",
}
```

Then add a deploy script to your `package.json`:

```json
"scripts": {
  "deploy": "gatsby build --prefix-paths && gh-pages -d public"
}
```

## Add Github Actions

In order to automate all the things, we are going to setup a CI process to publish the blog after we have pushed a change to the master
branch.

Add the following workflow to your project at `<project-root>/.github/workflows/node.js.yml`

```yaml
name: Gatsby Publish

# Execute the Action on every master push
on:
  push:
    branches: [ master ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      # checkout the latest master
      - uses: actions/checkout@v2
      # run: npm install
      # run: npm run build -- --prefix-paths
      # push the public files to the GitHub pages branch
      - uses: enriikke/gatsby-gh-pages-action@v2
        with:
          access-token: ${{ secrets.ACCESS_TOKEN }}
          deploy-branch: gh-pages
          gatsby-args: --prefix-paths
```

Please note, that this will require a `${{ secrets.ACCESS_TOKEN }}`. This Token can be generated in your GitHub Settings and needs to be
within the GitHub Repository -> Settings -> Secrets. Otherwise, the build step will fail.

## finished

That's about it. Your blog should now be available on GitHub Pages: https://sijakubo.github.io/info/
