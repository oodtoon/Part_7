const mongoose = require("mongoose")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const Blog = require("../models/blog")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken")

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

describe("there are initially blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/)
  })

  test("identifier property of the blog posts is named id:", async () => {
    const response = await api.get("/api/blogs").expect(200)
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe("adding notes to blog", () => {
  let token = null
  beforeAll(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("12345", 10)
    const user = await new User({ username: "name", passwordHash }).save()

    const testToken = { username: "name", id: user.id }
    return (token = jwt.sign(testToken, process.env.SECRET))
  })

  test("new blog has been added", async () => {
    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      id: "5a422b3a1b54a676234d17f9",
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((b) => b.title)
    expect(titles).toContain("Canonical string reduction")
  })

  test("likes do not exist returns likes equal to 0", async () => {
    const zeroLikesBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      id: "5a422b3a1b54a676234d17f9",
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(zeroLikesBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const response = await api.get("/api/blogs")

    const addedLikes = response.body.map((r) => r.likes)

    expect(addedLikes).toContain(0)
  })

  test("blog without title is not added", async () => {
    const missingTitleBlog = {
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      id: "5a422b3a1b54a676234d17f9",
    }
    await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(missingTitleBlog)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test("blog without url is not added", async () => {
    const missingUrlBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
      id: "5a422b3a1b54a676234d17f9",
    }

    await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(missingUrlBlog)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test("Status code 401 if token is not provided", async () => {

    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      id: "5a422b3a1b54a676234d17f9",
    }

    token = 'badtoken'

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe("a blog is deleted", () => {
  let token = null
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("12345", 10)
    const user = await new User({ username: "name", passwordHash }).save()

    const testToken = { username: "name", id: user.id }
    token = jwt.sign(testToken, process.env.SECRET)

    const newBlog = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      id: "5a422b3a1b54a676234d17f9",
    }
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    return token
  })
  test("succeeds with status code 204 when blog with valid id is deleted", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map((t) => t.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe("when notes content is updated", () => {
  test("number of likes change", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = {
      ...blogsAtStart[0],
      likes: 88,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const blog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id)
    expect(blog.likes).toBe(blogToUpdate.likes)
  })
})

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", passwordHash })

    await user.save()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("expected `username` to be unique")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test("creation fails with proper statuscode and message if username is less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "ro",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    expect(result.body.error).toContain("username or password is too short")

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
