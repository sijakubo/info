import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/react"
import styled from "@emotion/styled"

import Layout from "../components/layout"
import Seo from "../components/seo"

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`

const ArticleDate = styled.h6`
  display: inline;
  color: #606060;
`

const MarkerHeader = styled.h4`
  display: inline;
  transform: translate(-50%, -50%);
  background-image: linear-gradient(#B77800, #B77800);
  background-size: 100% 0.03rem;
  background-repeat: no-repeat;
  background-position: 0 100%;
  transition: background-size .7s, background-position .5s, color .7s ease-in-out;

  :hover {
    background-size: 100% 100%;
    background-position: 0 100%;
    transition: background-position .7s, background-size .5s, color .7s ease-in-out;
    color: #33353F
  }
`

const ReadingTime = styled.h5`
  display: inline;
  color: #606060;
`

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <Seo title="Notes" />
      <Content>
        <h1>Notes</h1>
        {data.allMarkdownRemark.edges
          .filter(({ node }) => {
            const rawDate = node.frontmatter.rawDate
            const date = new Date(rawDate)
            return date < new Date()
          })
          .map(({ node }) => (
            <div className="blogpost" key={node.id}>
              <Link
                to={node.frontmatter.path}
                css={css`
                  text-decoration: none;
                  color: inherit;
                `}
              >
                <MarkerHeader>{node.frontmatter.title}</MarkerHeader>
              </Link>
              <div>
                <ArticleDate>{node.frontmatter.date}</ArticleDate>
                <ReadingTime> - {node.timeToRead} min</ReadingTime>
              </div>
              <p>{node.excerpt}</p>
            </div>
          ))}
      </Content>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      filter: { frontmatter: { draft: { eq: false } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            rawDate: date
            path
          }
          fields {
            slug
          }
          timeToRead
          excerpt(pruneLength: 300)
        }
      }
    }
  }
`
