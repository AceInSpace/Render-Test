import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const remove = personId => {
    return axios.delete(`${baseUrl}/${personId}`)
}

const updateNumber = (personId, updatedPerson) => {
    return axios.put(`${baseUrl}/${personId}`, updatedPerson)
}

export default { getAll, create, remove, updateNumber }