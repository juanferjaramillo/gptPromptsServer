const axios = require("axios");
require("dotenv").config();
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

async function sendImagePrompt(req, res) {
    console.log("Image Modification Request");
    const { imageUrl1, imageUrl2, prompt } = req.body;

    if (!imageUrl1 || !imageUrl2 || !prompt) {
        return res.status(400).json({
            error: 'Debes enviar imageUrl1, imageUrl2 y prompt en el cuerpo del request.',
        })
    }

    try {
        const image1Path = await downloadImage(imageUrl1);
        const image2Path = await downloadImage(imageUrl2);

        const modifiedImage1 = await editImageWithOpenAI(image1Path, prompt);
        const modifiedImage2 = await editImageWithOpenAI(image2Path, prompt);

        // Eliminar imágenes temporales
        fs.unlinkSync(image1Path);
        fs.unlinkSync(image2Path);

        res.json({
            modifiedImage1: modifiedImage1.data.data[0].url,
            modifiedImage2: modifiedImage2.data.data[0].url,
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Error al modificar las imágenes.' });
    }
};

//======================================================
// Descarga imagen desde URL y la guarda localmente
async function downloadImage(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join(__dirname, `${uuid.v4()}.png`);
    console.log("Downloading image");
    fs.writeFileSync(filePath, response.data);
    return filePath;
}

//===============================================================
// Envía imagen a la API de OpenAI para editarla con el prompt
async function editImageWithOpenAI(imagePath, prompt) {
    console.log("Sending Image to OpenAI");
    const { SKEY } = process.env;
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('prompt', prompt);
    form.append('n', 1);
    form.append('size', '512x512');

    console.log("Form", form.getHeaders());

    const response = await axios.post('https://api.openai.com/v1/images/edits', form, {
        headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${SKEY}`,
        },
    });

    return response;
}

module.exports = sendImagePrompt