import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message, error }) => {
  const notificationStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  notificationStyle.color = (error) ? 'red' : 'green'

  if (message === null) {
    return null;
  }

  return (
    <div className='error' style={notificationStyle}>
      {message}
    </div>
  )
}

const Entry = ({ persons, setPersons, setMessage, setError }) => {

  const handleRemove = person => {
    return () => {
      if (window.confirm( `Delete ${person.name}?` )) {
        const id = person.id
        personService
          .remove(person.id)
          .then(setPersons( persons.filter(person => person.id !== id) ))
          .catch(() => {
            setError(true)
            setMessage(`${person.name} has already been removed from the server.`)
            setTimeout( () => setMessage(null), 5000 )
            setPersons (persons.filter(p => p.id !== person.id))
          })
          setError(false)
          setMessage(`${person.name} removed successfully!`)
      }
    }
  }

  return (
    persons.map( (person) => {
      return (
        <li key={person.id}>
          {person.name} {person.number} &nbsp;
          <button onClick={handleRemove(person)}>delete</button>
        </li>
      )
    })
  )
}

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>Filter Shown <input value={filter} onChange={handleFilter} /></div>
  )
}

const Entries = ({ persons, setPersons, filter, setMessage, setError }) => {
  if (filter) {
    const filtered = persons.filter( 
      (person) => person
                    .name
                    .toLowerCase()
                    .includes( filter.toLowerCase() )
    )
    return (
      <ul>
        <Entry persons={filtered} 
               setPersons={setPersons} 
               setMessage={setMessage}
               setError={setError} />
      </ul>
    ) 
  } else {
    return (
      <ul>
        <Entry persons={persons} 
               setPersons={setPersons} 
               setMessage={setMessage}
               setError={setError} />
      </ul>
    ) 
  }
}

const PersonForm = ({ handleSubmit,
                      newName,
                      newNumber,
                      handleNameChange,
                      handleNumberChange }) => {

  return (
    <form onSubmit={handleSubmit}>
    <div>Name: <input value={newName} onChange={handleNameChange} /></div>
    <div>Number: <input value={newNumber} onChange={handleNumberChange} /></div>
    <div><button type="submit">Add</button></div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(response => setPersons(response.data))
  },[])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = { id: (persons.length + 1),name: newName, number: newNumber }
    const person = persons.find(person => person.name === newName)

    // If name exists, option to change number
    if ( persons.find(person => person.name === newName) ) {
      if ( window.confirm(`${newName} is already added to phonebook. 
Replace the old number with a new one?`) ) {
        personService
          .updateNumber(person.id, newPerson)
          .then(resource => {
            setPersons(
              persons.filter( p => p.id !== person.id )
                     .concat(resource.data) )
          })
          .catch(() => {
            setError(true)
            setMessage(`${person.name} has already been removed from the server.`)
            setTimeout( () => setMessage(null), 5000 )
            setPersons(persons.filter(p => p.id !== person.id))
          })
          setError(false)
          setMessage('Number successfully changed!')
          setTimeout( () => setMessage(null), 5000 )
      }
    // Else add new person
    } else {
      personService
        .create(newPerson)
        .then(resource => {
          setPersons( persons.concat(resource.data) )
        })
        setError(false)
        setMessage('New person successfully added!')
        setTimeout( () => setMessage(null), 5000 )
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h2>Add New</h2>
      <PersonForm handleSubmit={handleSubmit}
                  handleNameChange={handleNameChange}
                  handleNumberChange={handleNumberChange}
                  newName={newName}
                  newNumber={newNumber} />
      <h2>Numbers</h2> 
      <Entries persons={persons} 
               filter={filter} 
               setPersons={setPersons} 
               setMessage={setMessage}
               setError={setError} />  
    </div>
  )
}

export default App