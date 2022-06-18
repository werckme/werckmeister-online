const monk = require('monk')
const { listPresets, listExternalResources, listTemplates } = require('./resourcesScanner');
const { getSheetMetaData, getExternalResourceMetaData, getStyleTemplateMetaData } = require('./metaDataParser');

require('dotenv').config();

async function updatePreset(preset, docs) {
    console.log(`UPDATE ${preset.wid}`)
    await docs.update({wid: preset.wid}, {$set: preset}, {upsert: true});
}

async function updateExternalResource(externalResource, docs) {
    console.log(`UPDATE ${externalResource.eid}`)
    await docs.update({eid: externalResource.eid}, {$set: externalResource}, {upsert: true});
}

async function updateTemplate(template, docs) {
    const id = template.metaData.id;
    console.log(`UPDATE ${id}`)
    await docs.update({id: id}, {$set: template}, {upsert: true});
}


(async function main() {
    const db = monk(process.env.MONGODB_URI);
    const dbpresets = db.get('presets');
    await dbpresets.createIndex({ wid: 1 }, { unique: true });

    const dbexternal = db.get('externalResources');
    await dbexternal.createIndex({ eid: 1 }, { unique: true });

    const dbStyleTemplates = db.get('styleTemplates');
    await dbStyleTemplates.createIndex({ id: 1 }, { unique: true });

    let promises = listPresets() 
        .map(x => ({metaData: getSheetMetaData(`./presets/${x}/main.sheet`), wid: x}))
        .map(x => updatePreset(x, dbpresets));

    promises = promises.concat(listExternalResources()
        .map(x => ({metaData: getExternalResourceMetaData(`./externalResources/${x}`), eid: x}))
        .map(x => updateExternalResource(x, dbexternal))
    );

    promises = promises.concat(listTemplates()
        .map(x => ({metaData: getStyleTemplateMetaData(`./style-templates/${x}`)}))
        .map(x => updateTemplate(x, dbStyleTemplates))
    );

    try {
        x = await Promise.all(promises);
    } catch(ex) {
    } finally {
        await db.close();
    }
})();

