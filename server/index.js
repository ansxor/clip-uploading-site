const uuid = require("uuid4");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const multer = require("multer");
const fs = require("fs");

const TOKEN_SECRET =
  "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611";

const app = express();
const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
const jwt = require("jsonwebtoken");
const port = 3001;

app.use(express.static("public"));
app.use(express.json());

const dbName = "clip-uploading-site";
const url = "mongodb://127.0.0.1:27017";

MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    let db = client.db(dbName);

    app.post("/api/user", (req, res) => {
      req.body.id = uuid();
      db.collection("users")
        .insertOne(req.body)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(401).json(err));
    });

    app.get("/api/user", (req, res) => {
      db.collection("users")
        .find(req.query)
        .toArray()
        .then((result) => {
          result.map((r) => (r._id = undefined));
          res.json(result);
        })
        .catch((err) => console.log(err));
    });

    app.delete("/api/user", (req, res) => {
      db.collection("users")
        .findOneAndDelete({ id: req.query.id })
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(404).json(err));
    });

    app.put("/api/user", (req, res) => {
      let user = db
        .collection("users")
        .findOneAndUpdate({ id: req.body.id }, req.body, { new: true });
      res.json(user);
    });

    app.post("/api/login", (req, res) => {
      if (req.query.username !== undefined && req.query.password !== undefined) {
        db.collection("users")
          .findOne({ username: req.query.username })
          .then((user) => {
            db.collection("user-identities")
              .findOne({id: user.id})
              .then((uauth) => {
                if (req.query.password === uauth.password) {
                  const token = jwt.sign({ uid: user.id }, TOKEN_SECRET, {
                   expiresIn: "1800s",
                 });
                 res.status(200).json({token: token})
                }
                else {
                  res.sendStatus(400)
                }
    
              })
              .catch(err => req.status(500).json(err))
          })
          .catch((err) => {
            res.status(404).json(err);
          });
      }
   });

    app.post("/api/register", (req, res) => {
      if (req.query.username !== undefined && req.query.password !== undefined) {
        const newUser = {
          username: req.query.username,
          avatarURL: "avatar/default.png",
          id: uuid()
        }
        const newUserIdentity = {
          id: newUser.id,
          password: req.query.password
        }
        db.collection("users")
          .insertOne(newUser)
          .then(doc => {
            db.collection("user-identities")
              .insertOne(newUserIdentity)
              .then(uauth => res.status(200).json(doc))
              .catch(err => res.status(400).json(err))
          })
          .error(err => res.status(400).json(err))
      }
      else {
        res.status(400).json({error: "Missing either username or password"})
      }
   })

    app.get("/api/self", (req, res) => {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (token == null) return res.sendStatus(401);

      jwt
        .verify(token, TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403)
          db
            .collection("users")
            .findOne({ id: user.uid })
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(404).json(err))
        })
    });

    app.post("/api/uploadavatar", upload.single("image"), (req, res) => {
      console.log(req.body);
      if (req.file !== undefined) {
        const filename = `${uuid()}.png`;
        fs.writeFileSync(
          `${__dirname}/public/avatar/${filename}`,
          req.file.buffer
        );
        let newUserInfo = { avatarURL: `avatar/${filename}` };
        db.collection("users")
          .findOneAndUpdate(
            { id: req.body.id },
            { $set: newUserInfo },
            { new: true }
          )
          .then((doc) => res.status(200).json(doc))
          .catch((err) => res.status(404).json(err));
      } else {
        return res.status(400).json({ error: "Please provide an image" });
      }
    });

    app.listen(port, () => console.log("listening"));
  })
  .catch((err) => console.log(err));
