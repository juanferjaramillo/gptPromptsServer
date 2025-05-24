async function sendImagePrompt(req, res) {
const fs = require('fs');
const OpenAI = require("openai");
const { toFile } = require("openai");

const { imageUrl1, imageUrl2, prompt } = req.body;
const { SKEY } = process.env;
const client = new OpenAI({
  apiKey: SKEY, 
});

const imageFiles = [
    "/home/juanfer/Sthemma/gptText/gptPromptsServer/src/Assets/photo1.jpg",
    "/home/juanfer/Sthemma/gptText/gptPromptsServer/src/Assets/photo2.jpg",
];

const images = await Promise.all(
    imageFiles.map(async (file) =>
        await toFile(fs.createReadStream(file), null, {
            type: "image/jpeg",
        })
    ),
);

console.log("sending request to OpenAI");
const rsp = await client.images.edit({
    model: "gpt-image-1",
    image: images,
    prompt: prompt,
});

console.log("Response received");
// Save the image to a file
const image_base64 = rsp.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");
fs.writeFileSync("/home/juanfer/Sthemma/gptText/gptPromptsServer/src/Assets/result.png", image_bytes);
res.status(200).send("Image is ready!");
}

module.exports = sendImagePrompt
