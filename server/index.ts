import * as express from 'express';
import * as mongodb from 'mongodb';
import * as multer from 'multer';

const app = express()
const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024
    }
})
const port = 3001
const MongoClient = mongodb.MongoClient

app.use(express.static('public'))
app.use(express.json())

const dbName = 'clip-uploading-site'
const url = 'mongodb://127.0.0.1:27017'

MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => {
        let db = client.db(dbName)
        app.get('/mytest', (req, res) => {
            db.collection('users').find().toArray()
                .then(result => res.json(result))
                .catch(err => console.log(err))
        })
        app.post('/registeruser', (req, res) => {
            db.collection('users').insertOne(req.body)
            res.json(req.body)
        })
        app.post('/uploadavatar', upload.single('image'), (req, res) => {
            if (!req.file) {

            }
        })
        app.listen(port, () => console.log('listening'))
    })
    .catch(err => console.log(err))
