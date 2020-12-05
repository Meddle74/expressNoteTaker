const db = require('../db/db.json');

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


module.exports = function (app) {
  app.get('/api/notes', function (req, res) {
    res.send(db);
  });
  // post
  app.post('/api/notes', function (req, res) {
    var noteid = uuidv4();
    var note = {
      id: noteid,
      title: req.body.title,
      text: req.body.text,
    };
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) throw err;
      var totalNotes = JSON.parse(data);
      totalNotes.push(note);
      fs.writeFile(
        './db/db.json',
        JSON.stringify(totalNotes, null, 2),
        (err, data) => {
          if (err) throw err;
          res.json(totalNotes);
          console.log('note created');
        }
      );
    });
    res.json(note)
  });
  // delete
  app.delete('/api/notes/:id', function (req, res) {
    console.log('deleting');
    // console.log(req.params.id);
    var noteid = req.params.id;
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
      if (err) throw err;
      var totalNotes = JSON.parse(data);
      var newTotalNotes = totalNotes.filter((note) => note.id !== noteid);
      fs.writeFile(
        './db/db.json',
        JSON.stringify(newTotalNotes, null, 2),
        (err, data) => {
          if (err) throw err;
          res.send(newTotalNotes);
          console.log('note deleted');
        }
      );
    });
  });
};
