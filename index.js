// implement your API here
const express = require("express");

const db = require("./data/db");

const server = express();

server.use(express.json());

const port = 8000;
server.listen(port, () => console.log(`Server Started on Port ${port}`));

server.get("/api", (req, res) => {
  res.send("it's working!");
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => res.send(users))
    .catch(error => res.status(500).json({ error: "Error retrieving users" }));
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(foundUser => {
      if (foundUser) {
        res.send(foundUser);
      } else {
        res.status(404).json({
          message: "User does not exist"
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "Error loading user" });
    });
});

server.post("/api/users", (req, res) => {
  const body = req.body;
  if (!body.name || !body.bio) {
    res
      .status(400)
      .json({ errorMessage: "You are missing a name or bio for the user" });
  } else {
    db.insert(body)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
  }
});

server.put("/api/users/:id", (req, res) => {
  const updates = req.body;
  const id = req.params.id;
  if (!updates.name || !updates.bio) {
    res
      .status(400)
      .json({ errorMessage: "You are missing a name or bio for the user" });
  } else {
    db.update(id, updates)
      .then(user => {
        res.status(200).json(updates);
      })
      .catch(error => {
        res.status(500).json({
          error: "there was an error processing your request"
        });
      });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  const id = req.params.id;

  db.remove(id)
    .then(dbItem => {
      if (dbItem) {
        res.json({ message: "user deleted!" });
      } else {
        res.status(404).json({ message: "the user does not exist" });
      }
    })
    .catch(error =>
      res.status(500).json({ error: "the user could not be removed" })
    );
});
