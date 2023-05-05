import { Link } from 'react-router-dom'

import '../app.css'


const User = (props) => {
  return (
    <>
      <div className="container">
        <Link className="userBlogs" to={`/users/${props.user.id}`}>
          {props.user.name}
        </Link>{' '}
        <strong>{props.user.blogs.length}</strong>
      </div>
    </>
  )
}

export default User
