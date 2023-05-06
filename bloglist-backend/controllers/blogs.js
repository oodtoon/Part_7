const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const Comment = require('../models/comment')
const jwt = require("jsonwebtoken")
const ObjectId = require('mongoose').Types.ObjectId;

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 }).populate('comments')
  response.json(blogs)
})

blogsRouter.post("/", async (request, response) => {
  const body = request.body
  const user = request.user

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id || decodedToken === "jwt malformed" ) {
    return response.status(401).json({ error: "token invalid" })
  } else {

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || "0",
      user: user.id,
    })
  
    if (blog.title && blog.url) {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog)
  
    } else { 
      response.status(400).end()
    }
  }
  

})

blogsRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id || !request.token || !decodedToken) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response
    .status(401)
    .json({ error: 'User unable to delete blog'})
  }
})

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    id: body.id,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  })
  response.status(200)
  response.json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body
  const blogId = request.params.id
  const blog = await Blog.findById(request.params.id)

  const blogComment = new Comment({
    comment: comment,
    blog: blogId 
  })

    const savedComment = await blogComment.save()
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()
    response.status(201).json(savedComment)
})

blogsRouter.get('/:id/comments', async (request, response) => {
  const blog = await Comment.find({ blog: new ObjectId(request.params.id) })
  
  response.status(201).json(blog)
})

module.exports = blogsRouter
