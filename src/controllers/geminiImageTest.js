const { GoogleGenAI, Modality } = require("@google/genai")
const fs = require('fs');
//import { GoogleGenAI, Modality } from "@google/genai";
//import * as fs from "node:fs";

const { GEM_PROMPT, GEM_KEY } = process.env;


async function geminiImageTest(req, res) {

    const ai = new GoogleGenAI({ apiKey: GEM_KEY });

    // Load the image from the local file system
    const spaceImagePath = "/home/juanfer/Sthemma/gptPrompts/gptPromptsServer/src/Assets/LivingRoom.png";
    const tileImagePath = "/home/juanfer/Sthemma/gptPrompts/gptPromptsServer/src/Assets/GrayTile.jpeg"
    const image1Data = fs.readFileSync(spaceImagePath);
    const image2Data = fs.readFileSync(tileImagePath)
    const base64Image1 = image1Data.toString("base64");
    const base64Image2 = image2Data.toString("base64");

    // Prepare the content parts
    console.log("Defining model");
    const contents = [
        { text: "Replace the floor in the first image with the pattern/texture from the second image. Ensure all existing furniture, room distribution, and any rugs present in the first image remain unchanged and are seamlessly integrated with the new floor." },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image1,
            },
        },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image2,
            },
        },
    ];

    // Set responseModalities to include "Image" so the model can generate an image
    console.log("sending request to Google");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: contents,
            config: {
                responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
        });
        console.log("response received");
        for (const part of response.candidates[0].content.parts) {
            // Based on the part type, either show the text or save the image
            if (part.text) {
                console.log(part.text);
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, "base64");
                fs.writeFileSync("gemini-native-image.png", buffer);
                console.log("Image saved as gemini-native-image.png");
            }
        }
        res.status(200).send("Image created successfuly");
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = geminiImageTest
