---
title: "Creating a blog using gatsby and host it on AWS in 15 Minutes"
date: "2021-07-08"
draft: false
path: "/blog/second-title"
---

Of course you would write the first blog post about creating the actual blog itself. So do I.

# Create Gatsby blog

## Install Gatsby
First of all, we need to install [Gatsby](https://www.gatsbyjs.com/) which will generate the static blog pages

```
$ brew install gatsby-cli
```

## Create a blog based on a
```shell
$ gatsby new <name_of_the_blog> <template_url>
$ gatsby new blog https://github.com/niklasmtj/gatsby-starter-julia
```

## Start the blog and customise it

```
$ gatsby develop
```
The blog gets refreshed automatically when you save the files in your IDE

# Add Version Control (GitHub)

...


# Add CI + Deployment

## Install [Gatsby Publish](https://github.com/marketplace/actions/gatsby-publish)
```
$ npm install gh-pages --save-dev
```

Add the following to your `gatsby-config.js`
```
module.exports = {
  pathPrefix: "/<repository_name>",
}
```


## Add Github Actions
```yaml
# This workflow will do a clean install of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: Gatsby Publish

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: enriikke/gatsby-gh-pages-action@v2
      with:
        access-token: ${{ secrets.ACCESS_TOKEN }}
        deploy-branch: gh-pages
        gatsby-args: --prefix-paths
```

## finished

https://sijakubo.github.io/blog/
