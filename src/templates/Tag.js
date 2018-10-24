import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import PostListItem from '../components/PostListItem'

class TagTemplate extends Component {
  render() {
    const { data, pageContext } = this.props
    const posts = data.allPrismicPost.edges
    return (
      <Layout>
        <Helmet title={pageContext.title} />
        <h1 className="mb-6">{pageContext.title}</h1>
        {posts &&
          Array.isArray(posts) &&
          posts.length > 0 &&
          posts.map(({ node }) => (
            <PostListItem
              key={node.id}
              uid={node.uid}
              title={node.data.title}
              date={node.data.date}
              subheading={node.data.subheading}
            />
          ))}
        <Link to="/tags">to back</Link>
      </Layout>
    )
  }
}

export const tagQuery = graphql`
  query PostByTag($uid: String!) {
    allPrismicPost(
      filter: {
        data: {
          tags: {
            elemMatch: {
              tag: { document: { elemMatch: { uid: { eq: $uid } } } }
            }
          }
        }
      }
    ) {
      edges {
        node {
          id
          uid
          data {
            title
            subheading
            date(formatString: "dddd DD MMMM YYYY")
          }
        }
      }
    }
  }
`

export default TagTemplate
