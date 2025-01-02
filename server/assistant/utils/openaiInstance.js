// openaiInstance.js
const OpenAI = require('openai');
const config = require('../../config');

const openai = new OpenAI({
    apiKey: config.openAI.key
}).beta;

module.exports = openai;