import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
} from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import '../app.css'

const Blog = ({ blog, addLike, removeBlog, user }) => {
  const [showBlogDetails, setBlogDetails] = useState(false)
  const buttonLabel = showBlogDetails ? 'hide' : 'view'

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
          <button id="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    )
  }

  const handleLike = () => {
    const blogObject = { ...blog, likes: blog.likes + 1 }
    addLike(blogObject)
  }

  return (
    <TableContainer compnent={Paper}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell align="left" sx={{ width: 450 }}>
              <div className="blog">
                <span>
                  <Link className="blog" to={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </span>
                <div style={viewDetails} className="blog-details">
                  <span>{blog.url}</span>
                  <div>
                    {blog.likes}{' '}
                    <Button variant="contained" color="primary" onClick={handleLike} id="like">like</Button>
                  </div>
                  <div>{blog.user.name}</div>
                  <div>{user !== null && deleteBlog()}</div>
                </div>
              </div>
            </TableCell>
            <TableCell align="left" className='author-cell' sx={{ with: 100 }}>{blog.author}</TableCell>
            <TableCell align="right" sx={{ width: 150 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={toggleVisibility}
              >
                {buttonLabel}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Blog
