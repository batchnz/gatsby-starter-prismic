const config = require('./config/site')

require('dotenv').config({
  path: `.env`,
})

const { RichText } = require('prismic-reactjs')
const { Elements } = RichText

module.exports = {
  siteMetadata: {
    title: config.site.title,
    description: config.site.description,
    siteUrl: config.site.siteUrl, // No trailing slash
    twitterHandle: config.site.twitterHandle,
    image: config.site.image,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/images`,
        name: 'images',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.site.title,
        short_name: config.manifest.shortName,
        start_url: '/',
        background_color: config.manifest.bgColor,
        theme_color: config.manifest.themeColor,
        display: 'minimal-ui',
        icon: `src/images/${config.manifest.icon}`, // This path is relative to the root of the site
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: config.google.analytics.trackingId,
        head: true, // Put tracking script in the head
        respectDNT: true, // Respect users who have enabled Do Not Track
      },
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => process.env.NODE_ENV,
        env: {
          production: {
            policy: [{ userAgent: '*', allow: '/' }],
          },
          'branch-deploy': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
          'deploy-preview': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
        },
      },
    },
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        // The plugin order matters
        postCssPlugins: [
          require('postcss-extend-rule'),
          require('postcss-advanced-variables'),
          require('postcss-preset-env'), // Defaults to Stage 2
          require('postcss-atroot'),
          require('postcss-property-lookup'),
          require('tailwindcss')('./tailwind.config.js'),
          require('postcss-nested'),
          require('autoprefixer')(),
          require('stylelint'),
          require('postcss-reporter')({ clearReportedMessages: true }),
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-purgecss',
      options: { printRejected: true, tailwind: true },
    },
    {
      resolve: 'gatsby-plugin-transition-link',
      options: { layout: false },
    },
    {
      resolve: 'gatsby-source-prismic',
      options: {
        repositoryName: config.prismic.repository,
        accessToken: process.env.PRISMIC_TOKEN,
        schemas: {
          contact: require('./src/schemas/contact.json'),
          home: require('./src/schemas/home.json'),
          menu: require('./src/schemas/menu.json'),
          options: require('./src/schemas/options.json'),
          pages: require('./src/schemas/pages.json'),
          posts_categories: require('./src/schemas/posts_categories.json'),
          posts_index: require('./src/schemas/posts_index.json'),
          posts_tags: require('./src/schemas/posts_tags.json'),
          posts: require('./src/schemas/posts.json'),
        },
        // See: https://prismic.io/docs/javascript/query-the-api/link-resolving
        linkResolver: () => doc => `/${doc.uid}`,
        // See: https://prismic.io/docs/nodejs/beyond-the-api/html-serializer
        htmlSerializer: () => (type, element, content) => {
          switch (type) {
            // First differentiate between a label and a preformatted filed
            case Elements.label: {
              if (element.data.label === 'quote') {
                return `<blockquote><p>${content}</p></blockquote>`
              }
              return false
            }
            case Elements.preformatted: {
              return null
            }
            default:
              return null
          }
        },
      },
    },
    // 'gatsby-plugin-offline', // Use with care  
  ],
}
