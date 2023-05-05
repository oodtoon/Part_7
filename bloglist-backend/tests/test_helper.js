const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "5 things you didn't know!",
        author: "cool guy",
        url: "www.wowzer.comzers",
        likes: 8,
        id: "64276cf46b58613484318b43",
      },
      {
        title: "Doctors hate him",
        author: "ripped guy",
        url: "www.swolzers.comzers",
        likes: 75,
        id: "642775cc2545bebcec7c470c",
      },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}