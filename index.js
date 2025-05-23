const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const notesFile = path.join(__dirname, 'notes.json');

// Ensure notes.json exists
if (!fs.existsSync(notesFile)) {
    fs.writeFileSync(notesFile, JSON.stringify([]));
}

// Helper to read notes
function readNotes() {
    return JSON.parse(fs.readFileSync(notesFile, 'utf8'));
}

// Helper to write notes
function writeNotes(notes) {
    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 2));
}

// Routes
app.get('/', (req, res) => {
    const notes = readNotes();
    res.render('index', { notes });
});

app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    const notes = readNotes();
    const note = {
        title,
        content,
        createdAt: new Date()
    };
    notes.push(note);
    writeNotes(notes);
    res.redirect('/');
});

app.get('/notes/:title', (req, res) => {
    const notes = readNotes();
    const note = notes.find(n => n.title === req.params.title);
    if (!note) return res.status(404).send('Note not found');
    res.render('note', note);
});

app.delete('/notes/:title', (req, res) => {
    let notes = readNotes();
    notes = notes.filter(n => n.title !== req.params.title);
    writeNotes(notes);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});