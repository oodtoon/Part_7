import { useParams } from 'react-router-dom'
import { useState } from 'react'

//const dummyComments = [
//  'awesome blog',
//  'amazing read',
//  'why didnt David think of this?',
//]

const BlogDetails = (props) => {
  const [comment, setComment] = useState('')

  const id = useParams().id
  if (!props.blogs) {
    return <h2>blog loading...</h2>
  }
  const blog = props.blogs.find((b) => b.id === id)

  const handleLike = () => {
    const blogObject = { ...blog, likes: blog.likes + 1 }
    props.addLike(blogObject)
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${blog.title}?`)) {
      props.removeBlog(blog.id)
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    props.addComment({
      ...blog,
      comment: comment
    })
    console.log(comment)
    console.log(blog)
    setComment('')
  }

  const deleteBlog = () => {
    return (
      <div>
        {props.user.name === blog.user.name && (
          <button id="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {!blog && <h2>No blog or blog deleted</h2>}
      {blog && (
        <>
          <h2>blog app</h2>
          <h2>{blog.title}</h2>
          <div>{blog.url}</div>
          <div>
            {blog.likes} likes<button onClick={handleLike}>like</button>
          </div>
          <div>added by {blog.user.name}</div>
          <div>{props.user !== null && deleteBlog()}</div> <h3>comments</h3>
          <form onSubmit={handleComment}>
            <input
              id="comment"
              type="text"
              value={comment}
              name="comment"
              onChange={(event) => setComment(event.target.value)}
              placeholder="comment..."
            />{' '}
            <button type="submit">add comment</button>
          </form>
          {blog.comments.length > 0 && (
            <>
              <ul>
                {blog.comments.map((comment) => (
                  <li key={comment.id}>{comment.comment}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  )
}

export default BlogDetails
