import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Link from '../TransitionLink'

const MenuItem = ({ title, link }) => (
  <Link
    classSpan="text-white no-underline inline-block hover:underline focus:underline mr-6"
    cover
    direction="right"
    to={link}
  >
    {title}
  </Link>
)

const Menu = ({ menuList }) => (
  <StaticQuery
    query={graphql`
      query {
        allPrismicMenu(sort: { fields: [data___order], order: ASC }) {
          totalCount
          edges {
            node {
              id
              uid
              data {
                title
                link {
                  isBroken
                  document {
                    ... on PrismicPages {
                      uid
                    }
                    ... on PrismicPostsIndex {
                      uid
                    }
                    ... on PrismicContact {
                      uid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={data => {
      const { allPrismicMenu } = data

      if (allPrismicMenu.totalCount && allPrismicMenu.totalCount > 0) {
        menuList = menuList.concat(allPrismicMenu.edges)
      }
      return (
        <div className="text-sm flex items-center">
          {menuList.map(({ node }) => {
            // If no relationship filed or Relationship link is broken, return null
            if (!node.data.link || node.data.link.isBroken) return null
            // Slug is page's slug, relationship filed
            const slug = node.data.link.document.uid
            return (
              <MenuItem
                title={node.data.title}
                link={`/${slug}`}
                key={node.id}
              />
            )
          })}
        </div>
      )
    }}
  />
)

Menu.defaultProps = {
  menuList: [
    {
      node: {
        id: 'home-index',
        data: {
          title: 'Home',
          link: {
            isBroken: false,
            document: [{ uid: '' }],
          },
        },
      },
    },
  ],
}

Menu.propTypes = {
  menuList: PropTypes.array.isRequired,
}

export default Menu
