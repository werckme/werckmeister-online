const express = require('express');
const helmet = require('helmet');
const monk = require('monk')
const {nanoid} = require('nanoid');
const { getWorkspace, listPresets } = require('./localWorkspaceBuilder');
const yup = require('yup');
const { getMetaDataFromText } = require('./sheetParser');
var bodyParser = require('body-parser')

const NotListedTag = 'not-listed';

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
    files: yup.array().of(fileSchema).optional(),
    metaData: yup.object().optional(),
    modifiedAt: yup.string()
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
app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.json());

const presets = listPresets()
    .map(x => [x, x]);
const presetMap = Object.fromEntries(presets);

presetMap['default'] = 'autumnleaves';

const port = process.env.PORT || 1337;

function createNewWorkspace(presetName) {
    return {
        wid: null,
        files: getWorkspace(presetName).files 
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

app.get('/songs', async (req, res, next) => {
    try {
        const dbPresets = db.get('presets');
        let presets = await dbPresets.find({}, {sort: {'metaData.title': 1}});
        presets = presets
            .filter(x => !x.metaData.tags || x.metaData.tags.indexOf(NotListedTag) < 0)
            .map(x => { delete x._id; return x; });
        res.json(presets);
    } catch(ex) {
        console.error(ex);
        next(Error());
    }
});

app.get('/creator/:creatorid', async (req, res, next) => {
    try {
        const { creatorid } = req.params;
        let creatorWorkspaces = await workspaces.find({'metaData.creatorid': creatorid});
        for (const workspace of creatorWorkspaces) {
            delete workspace.files;
            delete workspace._id;
        }
        res.json(creatorWorkspaces);
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
        if (!workspace || workspaces.length === 0) {
            res.json([]);
            return;
        }
        delete workspace._id;
        if (workspace.modifiedAt) {
            workspace.modifiedAt = workspace.modifiedAt.toUTCString();
        }
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
        workspace.modifiedAt = new Date();
        const mainSheet = workspace.files.filter(x => x.path === 'main.sheet');
        if (mainSheet && mainSheet.length > 0) {
            try {
                const metaData = getMetaDataFromText(mainSheet[0].data);
                workspace.metaData = metaData;
            } catch {}
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