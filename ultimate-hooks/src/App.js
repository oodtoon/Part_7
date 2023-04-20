import { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = async () => {
    try {
      const request = await axios.get(baseUrl)
      setResources(request.data)
    } catch (error) {
      console.log(error)
    }
  }

  const create = async (resource) => {
    try {
      const request = await axios.post(baseUrl, resource)
      setResources([...resources, request.data])

    } catch (error) {
      console.log(error)
    }
    
  }

  const service = {
    getAll, create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const baseUrl='http://localhost:3005'

  const [notes, noteService] = useResource(`${baseUrl}/notes`)
  const [persons, personService] = useResource(`${baseUrl}/persons`)

  useEffect(() => {
    noteService.getAll()
    personService.getAll()
  }, [])

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }
 
  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value})
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App