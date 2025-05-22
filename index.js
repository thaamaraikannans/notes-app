const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ensure notes directory exists
const notesDir = path.join(__dirname, 'notes');
if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir);
}

// Routes
app.get('/', (req, res) => {
    const notes = fs.readdirSync(notesDir)
        .filter(file => file.endsWith('.txt'))
        .map(file => {
            const content = fs.readFileSync(path.join(notesDir, file), 'utf8');
            return {
                title: file.replace('.txt', ''),
                content: content,
                createdAt: fs.statSync(path.join(notesDir, file)).birthtime
            };
        });
    res.render('index', { notes });
});

app.post('/notes', (req, res) => {
    const { title, content } = req.body;
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    fs.writeFileSync(path.join(notesDir, fileName), content);
    res.redirect('/');
});

app.get('/notes/:title', (req, res) => {
    const fileName = `${req.params.title}.txt`;
    const content = fs.readFileSync(path.join(notesDir, fileName), 'utf8');
    res.render('note', { title: req.params.title, content });
});

app.delete('/notes/:title', (req, res) => {
    const fileName = `${req.params.title}.txt`;
    fs.unlinkSync(path.join(notesDir, fileName));
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});