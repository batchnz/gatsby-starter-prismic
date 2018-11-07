const _ = require('lodash')
const chalk = require('chalk')
const PurgeCssPlugin = require('purgecss-webpack-plugin')
const path = require('path')
const glob = require('glob')
const { paginate } = require('gatsby-awesome-pagination')

const log = console.log

const PATHS = {
  src: path.join(__dirname, 'src'),
}

const purgeCssConfig = {
  paths: glob.sync(`${PATHS.src}/**/*.js`, { nodir: true }),
  extractors: [
    {
      extractor: class {
        static extract(content) {
          return content.match(/[A-Za-z0-9-_:/]+/g) || []
        }
      },
      extensions: ['js'],
    },
  ],
  // Adjust for each project
  whitelist: ['class-to-whitelist'],
  // Adjust for each project
  whitelistPatterns: [/body/, /headroom/, /ReactModal/, /ril/],
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  try {
    // ! ↓ needs to be updated per project
    const graphqlResult = await graphql(`
      {
        allPrismicPosts {
          totalCount
        }
        allPrismicPostsTags {
          totalCount
        }
        allPrismicPostsCategories {
          totalCount
        }
        allPrismicMenu {
          totalCount
        }
        allPrismicPages {
          totalCount
        }
        allPrismicContact {
          totalCount
        }
      }
    `)
    const promisePostCategories = graphql(`
      {
        allPrismicPostsCategories {
          totalCount
          edges {
            node {
              id
              uid
              data {
                title
              }
            }
          }
        }
      }
    `)
    const promisePosts = graphql(`
      {
        allPrismicPosts(sort: { fields: data___date, order: DESC }) {
          edges {
            node {
              uid
              data {
                title
                image {
                  url
                }
              }
            }
          }
        }
      }
    `)
    const promisePostTags = graphql(`
      {
        allPrismicPostsTags {
          edges {
            node {
              uid
              data {
                title
              }
            }
          }
        }
      }
    `)
    const promisePages = graphql(`
      {
        allPrismicPages {
          edges {
            node {
              uid
            }
          }
        }
      }
    `)
    const promiseContact = graphql(`
      {
        prismicContact {
          uid
        }
      }
    `)
    const {
      allPrismicPosts,
      allPrismicPostsTags,
      allPrismicPostsCategories,
      allPrismicPages,
      allPrismicContact,
    } = graphqlResult.data

    // ! Posts ↓ needs to be updated per project
    if (
      allPrismicPosts &&
      allPrismicPosts.totalCount &&
      allPrismicPosts.totalCount > 0
    ) {
      const graphqlPosts = await promisePosts
      const posts = graphqlPosts.data.allPrismicPosts.edges
      paginate({
        createPage,
        items: posts,
        itemsPerPage: 6,
        pathPrefix: '/posts',
        component: path.resolve('./src/templates/page-posts.js'),
      })
      posts.forEach(({ node }, index) => {
        const previous =
          index === posts.length - 1 ? null : posts[index + 1].node
        const next = index === 0 ? null : posts[index - 1].node
        createPage({
          path: `posts/${node.uid}`,
          component: path.resolve('./src/templates/posts.js'),
          context: {
            uid: node.uid,
            previous,
            next,
          },
        })
      })
    }
    // ! Tags ↓ needs to be updated per project
    if (
      allPrismicPostsTags &&
      allPrismicPostsTags.totalCount &&
      allPrismicPostsTags.totalCount > 0
    ) {
      const graphqlPostTags = await promisePostTags
      graphqlPostTags.data.allPrismicPostsTags.edges.forEach(({ node }) => {
        createPage({
          path: `tags/${node.uid}`,
          component: path.resolve('./src/templates/posts-tags.js'),
          context: {
            uid: node.uid,
            title: node.data.title,
          },
        })
      })
    }
    // ! Categories ↓ Needs to be updated per project
    if (
      allPrismicPostsCategories &&
      allPrismicPostsCategories.totalCount &&
      allPrismicPostsCategories.totalCount > 0
    ) {
      const graphqlPostCategories = await promisePostCategories
      graphqlPostCategories.data.allPrismicPostsCategories.edges.forEach(
        ({ node }) => {
          createPage({
            path: `categories/${node.uid}`,
            component: path.resolve('./src/templates/posts-categories.js'),
            context: {
              uid: node.uid,
              title: node.data.title,
            },
          })
        }
      )
    }

    // page - repeatable page - repeat
    if (
      allPrismicPages &&
      allPrismicPages.totalCount &&
      allPrismicPages.totalCount > 0
    ) {
      const graphqlPages = await promisePages
      graphqlPages.data.allPrismicPages.edges.forEach(({ node }) => {
        createPage({
          path: node.uid,
          component: path.resolve('./src/templates/page.js'),
          context: {
            uid: node.uid,
          },
        })
      })
    }
    // page - contact page - single
    if (
      allPrismicContact &&
      allPrismicContact.totalCount &&
      allPrismicContact.totalCount === 1
    ) {
      const graphqlPagesContact = await promiseContact
      const pageContactUid = graphqlPagesContact.data.prismicContact.uid
      createPage({
        path: pageContactUid,
        component: path.resolve('./src/templates/page-contact.js'),
        context: {
          uid: pageContactUid,
        },
      })
    }
  } catch (error) {
    if (error instanceof Error) {
      log(chalk.yellow.bgBlue(`❌  Error at CreatePages: ${error.message}`))
    } else {
      log(chalk.yellow.bgBlue(`❌ Error at CreatePages: ${error}`))
    }
  }
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage.includes('develop')) {
    actions.setWebpackConfig({
      devtool: 'cheap-module-source-map',
    })
    return true
  }

  // Add PurgeCSS in production
  // See: https://github.com/gatsbyjs/gatsby/issues/5778#issuecomment-402481270
  if (stage.includes('build')) {
    actions.setWebpackConfig({
      plugins: [new PurgeCssPlugin(purgeCssConfig)],
    })
  }
}
/* END */
