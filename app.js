// * DEPENDENCIES
require('dotenv').config();
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const yamljs = require('yamljs')
const swaggerUI = require('swagger-ui-express')
const morgan = require('morgan')
const mongoose = require('mongoose') 

// * YAML API Spec
const openAPISpec = yamljs.load('./utils/swagger.yaml')

// * PORTS
const PORT = process.env.PORT || 8889

// * ROUTES
const usersRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

// * APP ======================
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false, // disable content security policy
    hidePoweredBy: true, // hide X-Powered-By header
    hsts: false, // { maxAge: 31536000, includeSubDomains: true }, // enable HSTS with maxAge 1 year and includeSubDomains
    noCache: true, // enable noCache header
    referrerPolicy: { policy: 'no-referrer' } // set referrer policy to no-referrer
}))
// * logger middleware for console
const customLogFormat = ':date[iso] | :method | :url | :status | :res[content-length] - :response-time ms'
app.use(morgan(customLogFormat))

// * ROUTING SET
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPISpec))
app.use(authRoutes)
app.use('/users', usersRoutes)

// * GLOBAL ERROR HANDLING
app.use((err, req, res, next) => {
    console.log(err) // DEV: log error
    const status = err.statusCode || 500 
    const message = err.message 
    res.status(status).json({
        errors: true, 
        message: message
    })
})


// * ------ APP CONNECTIONS
async function startServer(){
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(PORT)
        console.log('Connected, see swagger documentation on http://localhost:' + process.env.PORT + '/api-docs')
    } catch (e){
        console.log(e)
    }
}
startServer()