import React from "react"
import { graphql } from "gatsby"
import styled from "@emotion/styled"
import Layout from "../components/layout"
import Seo from "../components/seo"

const Content = styled.div`
  margin: 0 auto;
  max-width: 860px;
  padding: 1.45rem 1.0875rem;
`

const MarkedHeader = styled.h1`
  display: inline;
  border-radius: 1em 0 1em 0;
`

const HeaderDate = styled.h5`
  margin-top: 10px;
  color: #B77800
`

// STYLE THE TAGS INSIDE THE MARKDOWN HERE
const MarkdownContent = styled.div`
  a {
    position: relative;
  }
  a > code:hover {
    text-decoration: underline;
  }
`

const Data = ({ data }) => {
  const post = data.markdownRemark
  return (
          <Layout>
            <Seo
                    title={post.frontmatter.title}
                    description={post.frontmatter.description || post.excerpt}
            />
            <Content>
              <MarkedHeader>{post.frontmatter.title}</MarkedHeader>
              <HeaderDate>
                {post.frontmatter.date} - {post.timeToRead} min
              </HeaderDate>
              <MarkdownContent dangerouslySetInnerHTML={{ __html: post.html }} />
            </Content>
          </Layout>
  )
}

export default Data

export const query = graphql`
  query ($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt(pruneLength: 160)
      frontmatter {
        date(formatString: "DD MMMM, YYYY")
        path
        title
      }
      timeToRead
    }
  }
`
