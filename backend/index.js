const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const monk = require('monk')
const {nanoid} = require('nanoid');
const GetWorkspace = require('./localWorkspaceBuilder');
const slowDown = require("express-slow-down");
const yup = require('yup');
var bodyParser = require('body-parser')

require('dotenv').config();
const db = monk(process.env.MONGODB_URI);
const workspaces = db.get('workspaces');
workspaces.createIndex({ wid: 1 }, { unique: true });

const fileSchema = yup.object().noUnknown().shape({
    path: yup.string().trim().required(),
    data: yup.string()
});

const workspaceSchema = yup.object().noUnknown().shape({
    wid: yup.string().trim().matches(/^[0-9A-Z_-]+$/i),
    files: yup.array().of(fileSchema).optional()
});

function AllowedOrigins() {
    const urls = process.env.ALLOWED_ORIGIN
        .split(',')
        .map(url => url.trim());
    return urls;
}

class UserError extends Error {}

const app = express();
app.use(helmet());
app.use(cors({origin: AllowedOrigins()}));
app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.json());

// app.use(slowDown({
//     windowMs: 15 * 60 * 1000,
//     delayAfter: 100,
//     delayMs: 500
// }));

const presetMap = {
    'autumnleaves': 'autumnleaves',
    'firstmelody': 'firstmelody',
    'default': 'autumnleaves'
};


const port = process.env.PORT || 1337;

function createNewWorkspace(presetName) {
    return {
        wid: null,
        files: GetWorkspace(presetName).files 
    };
}

app.get('/', async (req, res, next) => {
    try {
        const workspace = createNewWorkspace(presetMap['default']);
        res.json(workspace);
    } catch(ex) {
        console.error(ex);
        next(Error());
    }
});

app.get('/:wid', async (req, res, next) => {
    try {
        const { wid } = req.params;
        if (wid in presetMap) {
            const workspace = createNewWorkspace(presetMap[wid]);
            res.json(workspace);
            return;
        }
        let workspace = await workspaces.findOne({wid});
        delete workspace._id;
        const isValid = await workspaceSchema.isValid(workspace, schemaOptions);
        if (!isValid) {
            throw new Error();
        }        
        res.json(workspace);
    } catch(ex) {
        console.error(ex);
        next(Error());
    }
});

const schemaOptions = {
    abortEarly: false,
    strict: true,
  };

app.post('/', async (req, res, next) => {
    try {
        const workspace = req.body;
        workspace.wid = workspace.wid || nanoid(12);
        const isValid = await workspaceSchema.isValid(workspace, schemaOptions);
        if (!isValid) {
            throw new UserError("invalid input");
        }
        await workspaces.update({wid: workspace.wid}, {$set: workspace}, {upsert: true});
        res.json({succeed: true, wid: workspace.wid});
    } catch (ex) {
        if (ex instanceof UserError) {
            next(ex);
        } else {
            console.log(ex);
            next(Error());
        }
    }
});

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});