import { useParams } from 'react-router-dom'

const UserBlogs = (props) => {
  const id = useParams().id
  if (!props.users) {
    return <h2>User loading...</h2>
  }
  const user = props.users.find((u) => u.id === id)
  console.log(user)
  return (
    <>
      {user && (
        <>
          {' '}
          <h2>{user.name}</h2>
          <h4>added blogs</h4>
          {user.blogs.map((blog) => (
            <div key={blog.id}>{blog.title}</div>
          ))}
        </>
      )}
    </>
  )
}

export default UserBlogs
