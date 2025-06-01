const {GoogleGenAI} = require("@google/genai")
const { GEM_PROMPT, GEM_KEY } = process.env;

async function geminiTest(req, res) {
    console.log("request received");
    const ai = new GoogleGenAI({ apiKey: GEM_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: GEM_PROMPT,
        });
        console.log(response.text);
        res.status(200).send(response.text);
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).send(error.message);
    }
}

module.exports = geminiTest