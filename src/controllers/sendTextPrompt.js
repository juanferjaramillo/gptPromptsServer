const axios = require("axios");
//validateClientKey()
require("dotenv").config();

async function sendTextPrompt(req, res) {
    console.log("Text Prompt Request ");
    const { SKEY } = process.env;
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4.1-nano",
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SKEY}`,
                },
            }
        );
        /*
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SKEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1-nano",
                messages: [{ role: "user", content: prompt }],
            }),
        });    
        */
        const data = await response.data  //.json() when using fetch
        const promptResponse = data.choices?.[0]?.message?.content || "No response";
        res.status(200).json(promptResponse);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = sendTextPrompt