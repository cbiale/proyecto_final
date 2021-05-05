'use strict'

const crearFastify = require('../index')

const test = async () => {
  const app = inicio()
  
  const response = await app.inject({
    method: 'GET',
    url: '/'
  })

  console.log('status code: ', response.statusCode)
  console.log('body: ', response.body)
}

test()