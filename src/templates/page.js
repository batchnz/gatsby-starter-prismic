import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import SEO from '../components/SEO'

const PageTemplate = ({ data, location }) => {
  const page = data.prismicPages.data
  return (
    <Layout>
      <SEO
        title={page.title && page.title}
        location={location}
        description="This is the Home description"
      />
      {page.title && (
        <h1 className="text-4xl leading-tight mb-2">{page.title}</h1>
      )}
      {page.subheading && <h2 className="text-xl mb-8">{page.subheading}</h2>}
      <div
        className="rte"
        dangerouslySetInnerHTML={{ __html: page.body.html }}
      />
    </Layout>
  )
}

PageTemplate.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
}

export const pageQuery = graphql`
  query pageByUid($uid: String!) {
    prismicPages(uid: { eq: $uid }) {
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
`

export default PageTemplate
