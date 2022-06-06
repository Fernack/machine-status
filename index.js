import express from 'express';
import Util from './utils/util.js';
import bodyParser from 'body-parser';
import multer from "multer";
import cros from 'cors';

const port = process.env.PORT || 3000;
const app = express()
app.use(cros()); 
app.use(bodyParser.json()); 
app.use(express.static('./public'));
const upload = multer({ dest: "uploads/" });

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});


app.post('/', upload.single('file'), async (req, res) => {
    const data = await Util.getStates(req.file);

    res.send(data);
})