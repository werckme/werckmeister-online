const monk = require('monk')
const { listPresets, listExternalResources } = require('./presetScanner');
const { getSheetMetaData, getExternalResourceMetaData } = require('./metaDataParser');

require('dotenv').config();
const db = monk(process.env.MONGODB_URI);
const dbpresets = db.get('presets');
dbpresets.createIndex({ wid: 1 }, { unique: true });

const dbexternal = db.get('externalResources');
dbexternal.createIndex({ eid: 1 }, { unique: true });

async function updatePreset(preset) {
    console.log(`UPDATE ${preset.wid}`)
    await dbpresets.update({wid: preset.wid}, {$set: preset}, {upsert: true});
}

async function updateExternalResource(externalResource) {
    console.log(`UPDATE ${externalResource.eid}`)
    await dbexternal.update({eid: externalResource.eid}, {$set: externalResource}, {upsert: true});
}

const promises = listPresets() 
    .map(x => ({metaData: getSheetMetaData(`./presets/${x}/main.sheet`), wid: x}))
    .map(x => updatePreset(x));

promises.concat(listExternalResources()
    .map(x => ({metaData: getExternalResourceMetaData(`./externalResources/${x}`), eid: x}))
    .map(x => updateExternalResource(x))
);


Promise.all(promises).then(()=>{
    console.log("DONE")
    db.close()
});

