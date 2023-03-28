import express, { response } from 'express'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt-nodejs'
import cors from 'cors'
import knex from 'knex'
import { handleProfile } from './controls/profile.js'
import { handleImage } from './controls/image.js'
import { handleSignin } from './controls/signin.js'
import { handleRegister } from './controls/register.js'

const DB = process.env.DB

let db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        port : 5432,
        user : 'postgres',
        password : 'root',
        database : 'smart-brain'
    }
})

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
    db.select('*').from('users')
    .then(data => res.send(data))
})
app.post('/signin', handleSignin(db, bcrypt))
app.post('/register', handleRegister(db, bcrypt))
app.get('/profile/:id', handleProfile(db))
app.put('/image', handleImage(db))

const PORT = process.env.PORT
app.listen(3000, () => {
    console.log(`server running on port 3000`)
})

// const DB = process.env.DB
// console.log(DB)

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });