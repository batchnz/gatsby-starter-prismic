import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Link from '../components/TransitionLink'

import Layout from '../components/Layout'
import PostListItem from '../components/Post/ListItem'
import SEO from '../components/SEO'

const PostTagsTemplate = ({ data, pageContext, location }) => {
  const posts = []
  const hasPosts = data.allPrismicPosts && data.allPrismicPosts.totalCount > 0
  if (hasPosts) posts.push(...data.allPrismicPosts.edges)
  return (
    <Layout>
      <SEO title={pageContext.title} location={location} />
      <h1 className="text-4xl leading-tight mb-8">
        Posts: <small>{pageContext.title}</small>
      </h1>
      {hasPosts &&
        posts.map(({ node }) => (
          <PostListItem
            key={node.id}
            uid={node.uid}
            title={node.data.title}
            date={node.data.date}
            subheading={node.data.subheading}
          />
        ))}
      {!hasPosts && <h2>No Post</h2>}
      <Link cover to="/tags">
        ← View all tags
      </Link>
    </Layout>
  )
}

PostTagsTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}
export const postTagsQuery = graphql`
  query PostsByTag($uid: String!) {
    allPrismicPosts(
      filter: {
        data: { tags: { elemMatch: { tag: { uid: { eq: "Tag Three" } } } } }
      }
    ) {
      totalCount
      edges {
        node {
          ...PostsItem
        }
      }
    }
  }
`

export default PostTagsTemplate
