const uuid = require("uuid4");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const multer = require("multer");
const fs = require("fs");

const app = express();
const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
});
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
      db.collection("users").insertOne(req.body).then();
      res.json(req.body);
    });
    app.get("/api/user", (req, res) => {
      db.collection("users")
        .find(req.body)
        .toArray()
        .then((result) => res.json(result))
        .catch((err) => console.log(err));
    });
    app.delete("/api/user", (req, res) => {
      let { id } = req.body;
      db.collection("users").findOneAndDelete({ id: id }, (err, docs) => {
        res.status(200).json({ result: "Success!" });
      });
    });
    app.put("/api/user", (req, res) => {
      let user = db
        .collection("users")
        .findOneAndUpdate({ id: req.body.id }, req.body, { new: true });
      res.json(user);
    });
    app.post("/api/uploadavatar", upload.single("image"), (req, res) => {
      if (req.file !== undefined) {
        const filename = uuid();
        fs.writeFileSync(
          `${__dirname}/public/avatar/${filename}`,
          req.file.buffer
        );
        return res.status(200).json({ name: filename });
      } else {
        console.log("AAAAAAAAAAAAA");
        return res.status(401).json({ error: "Please provide an image" });
      }
    });
    app.listen(port, () => console.log("listening"));
  })
  .catch((err) => console.log(err));
