import { useState } from 'react'
import { TextField, Button } from '@mui/material'

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
          <TextField
            label="title"
            id="title"
            type="text"
            value={title}
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            size="small"
            sx={{ pb: '8px' }}
          />
        </div>
        <div>
          <TextField
            label="author"
            id="author"
            type="text"
            value={author}
            name="author"
            onChange={(event) => setAuthor(event.target.value)}
            size="small"
            sx={{ pb: '8px' }}
          />
        </div>
        <div>
          <TextField
            label="url"
            id="url"
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)}
            size="small"
            sx={{ pb: '8px' }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          id="create-blog"
          type="submit"
        >
          create
        </Button>
      </form>
    </>
  )
}

export default BlogForm
