import Blog from '../Blog'
import BlogForm from '../BlogForm'
import Togglable from '../Togglable'

const IndexRoute = (props) => {
  return (
    <>
      {props.user !== null && (
        <Togglable buttonLabel="add blog entry" ref={props.blogFormRef}>
          <BlogForm createBlog={props.addBlog} user={props.user} />
        </Togglable>
      )}

      <h2>blogs</h2>
      {props.blogs === null && <div>No Blogs</div>}
      {props.blogs !== null &&
        props.blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={props.user}
            addLike={props.addLikeTo}
            removeBlog={() => props.deleteBlog(blog.id)}
          />
        ))}
    </>
  )
}

export default IndexRoute
