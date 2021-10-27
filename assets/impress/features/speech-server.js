const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sha256 = require('sha256');
require('dotenv').config();
const port = process.env.PORT || 8889;
const speechCacheDir = process.env.SPEECH_CHACHE_DIR || '.speechcache';
if (!fs.existsSync(speechCacheDir)) {
    fs.mkdirSync(speechCacheDir);
}

const IbmAppId = process.env.IBM_APP_ID;
const IbmTextToSpeechInstance = process.env.IBM_TEXT_TO_SPEECH_INSTANCE
const IbmTextToSpeechVoice = process.env.IBM_TEXT_TO_SPEECH_VOICE || 'en-GB_KateV3Voice';
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const { response } = require('express');



async function synthesize(id, text, format='audio/wav') {
    const filename = `${id}.wav`;
    const filePath = path.join(speechCacheDir, filename);
    if (fs.existsSync(filePath)) {
        return filePath;
    }
    const textToSpeech = new TextToSpeechV1({
        authenticator: new IamAuthenticator({
            apikey: IbmAppId,
        }),
        serviceUrl: IbmTextToSpeechInstance,
    });
    const response = await textToSpeech.synthesize({text, accept: format, voice: IbmTextToSpeechVoice});
    const buffer = await textToSpeech.repairWavHeaderStream(response.result);
    fs.writeFileSync(filePath, buffer);
    return filePath;
}


const app = express();
app.use(cors());


function textToId(text) {
    text = text.replace(/\s+/g, ' ').trim();
    const id = sha256(text+IbmTextToSpeechVoice);
    return id;
}

app.get('/:text', async (req, res, next) => {
    const { text } = req.params;
    const id = textToId(text);
    try {
        const filePath = await synthesize(id, text);
        const absPath = path.resolve(filePath);
        res.sendFile(absPath);
    } catch(ex) {
        console.error(ex);
        res.statusCode = 500;
        res.send("FAILED");
    }
});

app.listen(port, () => {
    console.log(`listening at port ${port}`);
});