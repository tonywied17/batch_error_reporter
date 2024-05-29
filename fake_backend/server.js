const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 8444;

const errorDumpsDir = path.join(__dirname, 'error_dumps');
if (!fs.existsSync(errorDumpsDir)) {
    fs.mkdirSync(errorDumpsDir);
}

const upload = multer({ dest: errorDumpsDir });

app.post('/api/error', upload.fields([{ name: 'game_log' }, { name: 'client_dmp' }]), (req, res) => {
    console.log(`Test: ${new Date().toISOString()}`);
    console.log(req.body);
    console.log(req.headers);
    console.log(req.files);

    const gameLog = req.files['game_log'][0];
    const clientDump = req.files['client_dmp'][0];

    const timestamp = new Date().toISOString().replace(/:/g, "-"); 
    const dumpDir = path.join(errorDumpsDir, timestamp);
    if (!fs.existsSync(dumpDir)) {
        fs.mkdirSync(dumpDir, { recursive: true });
    }

    const additionalInfo = [];
    if (req.body.email) {
        additionalInfo.push(`Email: ${req.body.email}`);
    }
    if (req.body.description) {
        additionalInfo.push(`Description: ${req.body.description}`);
    }
    fs.writeFileSync(path.join(dumpDir, 'AdditionalInfo.txt'), additionalInfo.join('\n'));

    fs.renameSync(gameLog.path, path.join(dumpDir, gameLog.originalname));
    fs.renameSync(clientDump.path, path.join(dumpDir, clientDump.originalname));

    res.send('Files uploaded successfully!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
