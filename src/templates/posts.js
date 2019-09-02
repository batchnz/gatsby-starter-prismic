import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'

import Layout from '../components/Layout'
import SEO from '../components/SEO'
import PostLabel from '../components/Post/Label'

const PostTemplate = ({ data, pageContext, location }) => {
  const { previous, next } = pageContext
  const post = data.allPrismicPosts.edges[0].node.data

  let localImage = false
  if (post.image.url && post.image.localFile.childImageSharp) {
    localImage = post.image.localFile.childImageSharp
    localImage.alt = post.image.alt ? post.image.alt : 'Feature Image'
  }
  return (
    <Layout>
      <SEO
        title={post.title && post.title}
        type="article"
        description={post.subheading && post.subheading}
        location={location}
        image={localImage && localImage.fluid && localImage.fluid.src}
      />
      {post.title && (
        <h1 className="text-4xl leading-tight mb-1">{post.title}</h1>
      )}
      {post.date && (
        <div className="text-xl text-grey-dark mb-4">{post.date}</div>
      )}

      {post.subheading && <h2 className="text-xl mb-6">{post.subheading}</h2>}

      <div className="mb-12">
        {post.tags &&
          Array.isArray(post.tags) &&
          post.tags.length > 0 &&
          post.tags.map(item => {
            const { tag } = item
            const { title } = tag.document.data
            if (tag.isBroken) return null
            return (
              <PostLabel text={title} slug={`/tags/${tag.slug}`} key={tag.id} />
            )
          })}
        {post.category && !post.category.isBroken && (
          <PostLabel
            text={post.category.document.data.title}
            slug={`/categories/${post.category.uid}`}
            key={post.category.uid}
          />
        )}
      </div>

      {localImage && (
        <Img fluid={localImage.fluid} alt={localImage.alt} className="mb-6" />
      )}

      <div
        className="rte"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
      <div className="flex justify-between mt-12">
        <div>
          {previous && (
            <Link to={`/posts/${previous.uid}`} rel="prev">
              ← {previous.data.title}
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link to={`/posts/${next.uid}`} rel="next">
              {next.data.title} →
            </Link>
          )}
        </div>
      </div>
    </Layout>
  )
}

PostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export const postQuery = graphql`
  query PostsByUid($uid: String!) {
    allPrismicPosts(filter: { uid: { eq: $uid } }) {
      edges {
        node {
          uid
          data {
            title
            subheading
            image {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 960) {
                    ...GatsbyImageSharpFluid
                  }
                }
              }
              url
              alt
            }
            date(formatString: "dddd DD MMMM YYYY")
            body {
              html
            }
            category {
              uid
              document {
                ... on PrismicPostsCategories {
                  id
                  data {
                    title
                  }
                }
              }
            }
            tags {
              tag {
                id
                slug
                isBroken
                document {
                  ... on PrismicPostsTags {
                    id
                    data {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export default PostTemplate
