import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            placeholder='title'
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="title"
            onChange={(event) => setAuthor(event.target.value)}
            placeholder='author'
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)}
            placeholder='url'
          />
        </div>
        <button id="create-blog" type="submit">create</button>
      </form>
    </>
  )
}

export default BlogForm
