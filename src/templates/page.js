import React, { Component } from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import SEOPage from '../components/SEO/Page'

class PageTemplate extends Component {
  render() {
    const [pageData] = this.props.data.allPrismicPage.edges
    const page = pageData.node.data
    return (
      <Layout location={this.props.location}>
        <SEOPage title={page.title} location={this.props.location} />
        <h1 className="mb-6">{page.title}</h1>
        <h2 className="mb-6">{page.subheading}</h2>
        <div dangerouslySetInnerHTML={{ __html: page.body.html }} />
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query PageByUid($uid: String!) {
    allPrismicPage(filter: { uid: { eq: $uid } }) {
      edges {
        node {
          uid
          data {
            title
            subheading
            body {
              html
            }
          }
        }
      }
    }
  }
`

export default PageTemplate