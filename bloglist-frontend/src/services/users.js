import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/users'

//let token = null

//const setToken = (newToken) => {
//token = `Bearer ${newToken}`
//}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const getBlogTotal = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data.blogs.length)
}

export default {
  getAll,
  getBlogTotal
}
