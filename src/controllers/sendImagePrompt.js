/*Body to be included in the request to the server:
{ 
"imageUrl1" : "https://www.catcarecenter.com/sites/default/files/inline-images/kittennutrition.jpeg",  
"imageUrl2" : "https://cdn.britannica.com/13/225313-050-3519547A/Lime-butterfly-Papilio-demoleus-feeding-on-flower.jpg",
"prompt": "create an image of an outdoor scene including the animals in the images",
"clientKey": "ZcYGI5kdc1ne-uSyobRhXt0IyWEYfL"
}
*/

const FormData = require('form-data');
const validateClientKey = require("/home/juanfer/Sthemma/gptPrompts/gptPromptsServer/src/controllers/validateClientKey.js")

//----------------------------------------------------------
const cloudinaryUpload = async (file, folder) => {
    const formData = new FormData();
    formData.append('file', file, { filename: 'result.png' });
    formData.append('upload_preset', 'sthemma_img_preset');
    formData.append('folder', folder);

    //const url = URL.createObjectURL(file);

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/sthemma/image/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      throw new Error(err.message || 'An error occurred during upload');
    }
  };

  //---------------------------------------------------------------
async function sendImagePrompt(req, res) {
    const { imageUrl1, imageUrl2, prompt, clientKey } = req.body;
    const clientAccess = validateClientKey(clientKey);

    if (clientAccess) {
        console.log("Client access allowed");
        const fs = require('fs');
        const OpenAI = require("openai");
        const { toFile } = require("openai");
        const streamifier = require("streamifier");
        const axios = require("axios");

        const { SKEY } = process.env;
        const client = new OpenAI({
            apiKey: SKEY,
        });

        let imageUrls = [];
        imageUrl1 && imageUrls.push(imageUrl1);
        imageUrl2 && imageUrls.push(imageUrl2);

        const images = await Promise.all(
            imageUrls.map(async (url) => {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                const stream = streamifier.createReadStream(response.data);

                return await toFile(stream, null, {
                    type: "image/jpeg",
                });
            })
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
        fs.writeFileSync("/home/juanfer/Sthemma/gptPrompts/gptPromptsServer/src/Assets/result.png", image_bytes);
console.log("uploading result to Cloudinary");

const cloudinaryUrl = await cloudinaryUpload(image_bytes, 'callisto/design');
console.log("cloudinary result url:", cloudinaryUrl);
        res.status(200).send(cloudinaryUrl);
    } else {
        console.log("Client access denied");
        res.status(500).send("Client access denied");
    }
    }

module.exports = sendImagePrompt
