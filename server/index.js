const uuid = require('uuid4')
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer');
const fs = require('fs')

const app = express()
const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024
    }
})
const port = 3001

app.use(express.static('public'))
app.use(express.json())

const dbName = 'clip-uploading-site'
const url = 'mongodb://127.0.0.1:27017'

MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        let db = client.db(dbName)
        app.get('/?', (req, res) => {})
        app.get('/mytest', (req, res) => {
            db.collection('users').find().toArray()
                .then(result => res.json(result))
                .catch(err => console.log(err))
        })
        app.post('/registeruser', (req, res) => {
            req.body.id = uuid()
            db.collection('users').insertOne(req.body)
                .then()
            res.json(req.body)
        })
        app.put('/updateuser', (req, res) => {
            db.collection('users').findOneAndUpdate({id: req.body.id}, req.body)
                .then()
            res.send() 
        })
        app.post('/uploadavatar', upload.single('image'), (req, res) => {
            if (!req.file) {
                return res.status(401).json({error: 'Please provide an image'})
            }
            const filename = uuid()
            fs.writeFileSync(`public/avatar/${filename}`, req.file.buffer)
            return res.status(200).json({ name: filename })
        })
        app.listen(port, () => console.log('listening'))
    })
    .catch(err => console.log(err))
