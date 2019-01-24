import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import PostListItem from '../components/Post/ListItem'
import SEO from '../components/SEO'
import Link from '../components/TransitionLink'

const PostCategoriesTemplate = ({ data, pageContext, location }) => {
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
      <Link cover to="/categories">
        ← View all categories
      </Link>
    </Layout>
  )
}

PostCategoriesTemplate.propTypes = {
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
}

export const postCategoriesQuery = graphql`
  query PostsByCategory($uid: String!) {
    allPrismicPosts(
      filter: { data: { category: { uid: { eq: $uid } } } }
      sort: { fields: [data___title], order: DESC }
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
export default PostCategoriesTemplate
