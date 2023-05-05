import User from '../Users'

const UserRoute = (props) => {
  return (
    <>
      <h2>Users</h2>
      {!props.users && <div>No users</div>}
      {props.users && <h4 className="userBlogs-head">blogs created</h4>}
      {props.users && props.users.map((user) => <User key={user.id} user={user} />)}
    </>
  )
}

export default UserRoute
