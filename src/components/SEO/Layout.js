import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import config from '../../../data/site-config'
import OpenGraph from './OpenGraph'
import TwitterCard from './TwitterCard'

const SEOLayout = ({ location }) => {
  const { name, url, title, description, keywords } = config.site
  const imageUrl = `${url}/${config.siteImage}` // Default image stored in ./static
  const pathname =
    (location.pathname && location.pathname.replace(/\/?$/, '/')) || ''

  return (
    <>
      <Helmet>
        <html lang="en" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={url + pathname} />
      </Helmet>
      <OpenGraph
        title={title}
        type="website"
        siteName={name}
        description={description}
        image={imageUrl}
        url={url + pathname}
      />
      <TwitterCard
        title={title}
        type="summary_large_image"
        site={config.twitterHandle}
        description={description}
        image={imageUrl}
      />
    </>
  )
}
SEOLayout.propTypes = {
  location: PropTypes.object.isRequired,
}

export default SEOLayout
