/* eslint-disable no-undef */
const connecttomongo = require('./db')
const express = require('express')
const authRoutes = require('./routes/auth');
connecttomongo() //connect to mongodb

const app = express()
const port = 3000
app.use('/api/auth', authRoutes);

app.use(express.json()); //middleware

//routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.get('/',(req,res)=>{
    res.send('API is running')
})

//start server after the db connection
app.listen(port,()=>{
    console.log(`iNotebook backend listen at http://localhost:${port}`)  
})

