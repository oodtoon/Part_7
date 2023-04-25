import { useState } from 'react'
import { useField } from './hooks/index'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom'

const Menu = ({ anecdotes, addNew, notification }) => {
  const padding = {
    paddingRight: 5,
  }
  return (
    <>
      <div>
        <Link style={padding} to="/">
          anecdotes
        </Link>
        <Link style={padding} to="/create">
          create new
        </Link>
        <Link style={padding} to="/about">
          about
        </Link>
      </div>
      <Routes>
        <Route
          path="/anecdotes/:id"
          element={<Anecdote anecdotes={anecdotes} />}
        />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/"
          element={
            <AnecdoteList anecdotes={anecdotes} notification={notification} />
          }
        />
      </Routes>
    </>
  )
}

const AnecdoteList = ({ anecdotes, notification }) => (
  <div>
    <Notification notification={notification} />
    <h2>Anecdotes</h2>
    <ul>
      {!anecdotes && <div>No anecdotes</div>}
      {anecdotes &&
        anecdotes.map((anecdote) => (
          <li key={anecdote.id}>
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
          </li>
        ))}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{' '}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{' '}
    for the source code.
  </div>
)

const CreateNew = (props) => {
  const navigate = useNavigate()
  const { onReset: resetContent, ...content } = useField('text')
  const { onReset: resetAuthor, ...author } = useField('text')
  const { onReset: resetInfo, ...info } = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(props)
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    })
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form>
        <div>
          content
          <input {...content} name="content" />
        </div>
        <div>
          author
          <input {...author} name="author" />
        </div>
        <div>
          url for more info
          <input {...info} name="info" />
        </div>
        <button onClick={handleSubmit}>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find((a) => a.id === Number(id))
  return (
    <div>
      <h2>{anecdote.content}</h2>
    </div>
  )
}

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }
  return <div className="success">{notification}</div>
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1,
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2,
    },
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    setNotification(`a new anecdote "${anecdote.content}" created!`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)))
  }

  return (
    <div>
      <Router>
        <div>
          <h1>Software anecdotes</h1>
          <Menu
            anecdotes={anecdotes}
            addNew={addNew}
            notification={notification}
          />
        </div>
      </Router>
      <Footer />
    </div>
  )
}

export default App
