const mongoose = require('mongoose')

const password = process.argv[2]

const url = 
  `mongodb+srv://fullstacktest:${password}@fsotest.by1zyvv.mongodb.net/?
retryWrites=true&w=majority&appName=FSOTest`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(result => {
        console.log(`Added ${result.name} number: ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

