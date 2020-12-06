const fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {
  // get notes
  app.get('/api/notes', function (req, res) {
    //read the json data and returns it
    res.sendFile(path.join(__dirname, '../db/db.json'));
  });

  // post note
  app.post('/api/notes', (req, res) => {
    var noteid = uuidv4();

    var note = { id: noteid, title: req.body.title, text: req.body.text };

    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;
      var notes = JSON.parse(data);
      notes.push(note);
      console.log('This is after the read call');

      fs.writeFile('./db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if (err) throw err;
        console.log('This is after the write call');
        res.json(notes);
      });
    });
  });

  // delete note
  app.delete('/api/notes/:id', (req, res) => {
    console.log('deleting...........');

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
          console.log('Your Note has been deleted!!!');
        }
      );
    });
  });
};
