const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const monk = require('monk')
const {nanoid} = require('nanoid');
const { getWorkspace, listPresets, loadTemplate } = require('./resourcesScanner');
const yup = require('yup');
const { getSheetMetaDataFromText } = require('./metaDataParser');
var bodyParser = require('body-parser')

const templateFields =  [
    "id", 
    "metaData.tags", 
    "metaData.title", 
    "metaData.signature", 
    "metaData.tempo", 
    "metaData.instrument",
    "metaData.instrumentConfigs"
]

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

function handleError(error, next) {
    if (error instanceof UserError) {
        next(error.message)
    } else {
        console.log(error);
        next("failed");
    }
}

class UserError extends Error {}

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(express.json());

const presets = listPresets()
    .map(x => [x, x]);
const presetMap = Object.fromEntries(presets);

presetMap['default'] = 'autumnleaves';

const port = process.env.PORT || 1337;

async function createNewWorkspace(presetName) {
    return {
        wid: null,
        files: await getWorkspace(presetName).files 
    };
}

async function getWorkspaceOrPreset(wid) {
    if (wid in presetMap) {
        const workspace = await createNewWorkspace(presetMap[wid]);
        return workspace;
    }
    let workspace = await workspaces.findOne({wid});
    if (!workspace || workspaces.length === 0) {
        throw new UserError(`workspace ${wid} not found`);
    }
    delete workspace._id;
    return workspace;
}

app.get('/', async (req, res, next) => {
    try {
        const workspace = await createNewWorkspace(presetMap['default']);
        res.json(workspace);
    } catch(ex) {
        handleError(ex, next);
    }
});

app.get('/styleTemplates', async (req, res, next) => {
    try {
        const dbStyleTemplates = db.get('styleTemplates');
        const templates = await dbStyleTemplates.find({}, templateFields);
        for(const template of templates) {
            delete template._id;
        }
        return res.json(templates);
    } catch(ex) {
        handleError(ex, next);
    }
});

app.get('/styleTemplate/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await loadTemplate(id);
        return res.json({id, data});
    } catch(ex) {
        handleError(ex, next);
    }
});


app.get('/resources', async (req, res, next) => {
    try {
        const dbPresets = db.get('presets');
        let presets = await dbPresets.find({}, {sort: {'metaData.title': 1}});
        presets = presets
            .filter(x => !x.metaData.tags || x.metaData.tags.indexOf(NotListedTag) < 0)
            .map(x => { delete x._id; return x; });

        const dbExternalResources = db.get('externalResources');
        let externalResources = await dbExternalResources.find({}, {sort: {'metaData.title': 1}});
        externalResources.map(x => { delete x._id; return x; })
        
        presets = presets.concat(externalResources);
        
        res.json(presets);
    } catch(ex) {
        handleError(ex, next);
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
        handleError(ex, next);
    }
});

app.get('/clone/:wid', async (req, res, next) => {
    try {
        const { wid } = req.params;
        const workspace = await getWorkspaceOrPreset(wid);
        workspace.wid = nanoid(12);
        workspace.modifiedAt = undefined;
        const isValid = await workspaceSchema.isValid(workspace, schemaOptions);
        if (!isValid) {
            throw new UserError("workspace schema invalid");
        }        
        workspace.modifiedAt = new Date();
        await workspaces.insert(workspace);
        res.json(workspace);
    } catch(ex) {
        handleError(ex, next);
    }
});

app.get('/:wid', async (req, res, next) => {
    try {
        const { wid } = req.params;
        const workspace = await getWorkspaceOrPreset(wid);
        if (workspace.modifiedAt) {
            workspace.modifiedAt = workspace.modifiedAt.toUTCString();
        }     
        res.json(workspace);
    } catch(ex) {
        handleError(ex, next);
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
                const mainSheetText = mainSheet[0].data;
                const metaData = getSheetMetaDataFromText(mainSheetText);
                workspace.metaData = metaData;
            } catch(ex) {
                console.error(ex)
            }
        }
        await workspaces.update({wid: workspace.wid}, {$set: workspace}, {upsert: true});
        res.json({succeed: true, wid: workspace.wid});
    } catch (ex) {
        handleError(ex, next);
    }
});

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});