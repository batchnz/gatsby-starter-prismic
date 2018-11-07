import React from 'react'
import { Link, graphql } from 'gatsby'
import PropTypes from 'prop-types'

const PostListItem = ({ uid, title, date, subheading }) => (
  <div className="mb-10">
    <h2 className="text-2xl leading-tight mb-1">
      <Link
        className="no-underline hover:underline focus:underline"
        to={`/posts/${uid}`}
      >
        {title}
      </Link>
    </h2>
    {date && <div className="text-xl text-grey-dark mb-4">{date}</div>}
    {subheading && <div dangerouslySetInnerHTML={{ __html: subheading }} />}
  </div>
)

PostListItem.propTypes = {
  uid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  subheading: PropTypes.string,
}

export const PostsItemFragment = graphql`
  fragment PostsItem on PrismicPost {
    uid
    id
    data {
      title
      subheading
      date(formatString: "dddd DD MMMM YYYY")
    }
  }
`
export default PostListItem
