const monk = require('monk')
const { listPresets, listExternalResources, listTemplates } = require('./resourcesScanner');
const { getSheetMetaData, getExternalResourceMetaData, getStyleTemplateMetaData } = require('./metaDataParser');

require('dotenv').config();

function updatePreset(preset, docs) {
    console.log(`UPDATE ${preset.wid}`)
    return docs.update({wid: preset.wid}, {$set: preset}, {upsert: true});
}

function updateExternalResource(externalResource, docs) {
    console.log(`UPDATE ${externalResource.eid}`)
    return docs.update({eid: externalResource.eid}, {$set: externalResource}, {upsert: true});
}

function updateTemplate(template, docs) {
    const id = template.metaData.id;
    console.log(`UPDATE ${id}`)
    return docs.update({id: id}, {$set: template}, {upsert: true});
}


async function main() {
    const db = monk(process.env.MONGODB_URI);
    const dbpresets = db.get('presets');
    await dbpresets.createIndex({ wid: 1 }, { unique: true });

    const dbexternal = db.get('externalResources');
    await dbexternal.createIndex({ eid: 1 }, { unique: true });

    const dbStyleTemplates = db.get('styleTemplates');
    await dbStyleTemplates.createIndex({ id: 1 }, { unique: true });


    try {
        let promises = listPresets() 
            .map(x => ({metaData: getSheetMetaData(`./presets/${x}/main.sheet`), wid: x}))
            .map(x => updatePreset(x, dbpresets));
        await Promise.all(promises);

        promises = listExternalResources()
            .map(x => ({metaData: getExternalResourceMetaData(`./externalResources/${x}`), eid: x}))
            .map(x => updateExternalResource(x, dbexternal));
        await Promise.all(promises);

        promises = listTemplates()
            .map(x => ({metaData: getStyleTemplateMetaData(`./style-templates/${x}`)}))
            .map(x => updateTemplate(x, dbStyleTemplates));
        await Promise.all(promises);
        
    } catch(ex) {
    } finally {
        await db.close();
    }
}

main();

