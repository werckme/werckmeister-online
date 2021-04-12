const monk = require('monk')
const { listPresets } = require('./localWorkspaceBuilder');
const { getMetaData } = require('./sheetParser');

require('dotenv').config();
const db = monk(process.env.MONGODB_URI);
const dbpresets = db.get('presets');
dbpresets.createIndex({ wid: 1 }, { unique: true });

async function updatePreset(preset) {
    console.log(`UPDATE ${preset.wid}`)
    await dbpresets.update({wid: preset.wid}, {$set: preset}, {upsert: true});
}
const promises = listPresets() 
    .map(x => ({metaData: getMetaData(`./presets/${x}/main.sheet`), wid: x}))
    .map(x => updatePreset(x));

Promise.all(promises).then(()=>{
    console.log("DONE")
    db.close()
});

