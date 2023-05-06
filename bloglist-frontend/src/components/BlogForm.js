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
            type="title"
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
            type="author"
            value={author}
            name="author"
            onChange={(event) => setTitle(event.target.value)}
            size="small"
            sx={{ pb: '8px' }}
          />
        </div>
        <div>
          <TextField
            label="url"
            id="url"
            type="url"
            value={url}
            name="url"
            onChange={(event) => setTitle(event.target.value)}
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
