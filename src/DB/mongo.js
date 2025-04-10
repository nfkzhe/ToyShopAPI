const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECT)

mongoose.connection.on('error', (err) => {
    console.log('err', err)
  })
  mongoose.connection.on('connected', (err, res) => {
    console.log('mongoose is connected')
  })