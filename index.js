const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
morgan.token('req-body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(express.json())
app.use(express.static('dist'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const timeSent = Date()
  response.send(`<p>There are currently ${persons.length} entries in the phonebook.</p>
                 <p>${timeSent}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id != id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body
  
  if (!newPerson.name) {
    response.status(400).json({error: 'Name field not provided'})
  } else if (!newPerson.number) {
    response.status(400).json({error: 'Number field not provided'})
  } else if (persons.find(person => person.name === newPerson.name)) {
    response.status(400).json({error: 'Name already exists'})
  } else {
    persons = persons.concat(newPerson)
    response.json(newPerson)
  }
  
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})