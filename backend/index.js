const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const monk = require('monk')
const {nanoid} = require('nanoid');
const EmptyWorkspace = require('./emptyWorkspace');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 1337;

function createNewWorkspace() {
    return {
        wid: nanoid(12),
        files: EmptyWorkspace.files 
    };
}

app.get('/', (req, res) => {
    const workspace = createNewWorkspace();
    res.json(workspace);
});

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});