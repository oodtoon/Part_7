import { useState } from 'react'

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [showBlogDetails, setBlogDetails] = useState(false)
  const buttonLabel = showBlogDetails ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const viewDetails = { display: showBlogDetails ? '' : 'none' }

  const toggleVisibility = () => {
    if (showBlogDetails === true) {
      setBlogDetails(false)
    } else {
      setBlogDetails(true)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
      removeBlog(blog.id)
    }
  }

  const deleteBlog = () => {
    return (
      <div>
        {user.name === blog.user.name && (
          <button id="delete-btn" onClick={handleDelete}>Delete</button>
        )}
      </div>
    )
  }

  const handleLike = () => {
    const blogObject = { ...blog, likes: blog.likes + 1 }
    addLike(blogObject)
  }

  return (
    <div style={blogStyle} className='blog'>
      <span>
        {blog.title} - {blog.author}{' '}
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </span>
      <div style={viewDetails} className='blog-details'>
        <span>{blog.url}</span>
        <div>
          {blog.likes} <button onClick={handleLike} id="like">like</button>
        </div>
        <div>{blog.user.name}</div>
        <div>{user !== null && deleteBlog()}</div>
      </div>
    </div>
  )
}

export default Blog
