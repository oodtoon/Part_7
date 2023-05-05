const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://blogs:${password}@blogs.8fpas72.mongodb.net/?retryWrites=true&w=majority`