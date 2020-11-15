const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const monk = require('monk')
const {nanoid} = require('nanoid');
const GetEmptyWorkspace = require('./emptyWorkspace');
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
  
class UserError extends Error {}

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '5mb' }));
// app.use(slowDown({
//     windowMs: 15 * 60 * 1000,
//     delayAfter: 100,
//     delayMs: 500
// }));

const port = process.env.PORT || 1337;

function createNewWorkspace() {
    return {
        wid: nanoid(12),
        files: GetEmptyWorkspace().files 
    };
}

app.get('/', async (req, res, next) => {
    try {
        const workspace = createNewWorkspace();
        await workspaces.insert(workspace);
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

app.get('/:wid', async (req, res, next) => {
    try {
        const { wid } = req.params;
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
        const body = req.body;
        const isValid = await workspaceSchema.isValid(body, schemaOptions);
        if (!isValid) {
            throw new UserError("invalid input");
        }
        const workspace = await workspaces.findOne({ wid: body.wid });
        if (!workspace) {
            throw new UserError("workspace not found");
        }
        await workspaces.update({_id: workspace._id}, {$set: {"files": body.files}});
        res.json({succeed: true});
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