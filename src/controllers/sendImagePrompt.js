/*Body to be included in the request to the server:
{ 
"imageUrl1" : "https://www.catcarecenter.com/sites/default/files/inline-images/kittennutrition.jpeg",  
"imageUrl2" : "https://cdn.britannica.com/13/225313-050-3519547A/Lime-butterfly-Papilio-demoleus-feeding-on-flower.jpg",
"prompt": "create an image of an outdoor scene including the animals in the images",
"clientKey": "ZcYGI5kdc1ne-uSyobRhXt0IyWEYfL"
}
*/

const FormData = require('form-data');
const validateClientKey = require("./validateClientKey.js")

//----------------------------------------------------------
const cloudinaryUpload = async (file) => {
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
    // Save the image to a sthemma_img_preset
    const image_base64 = rsp.data[0].b64_json;
    const imageBytes = Buffer.from(image_base64, "base64");
    //fs.writeFileSync("/home/juanfer/Sthemma/gptPrompts/gptPromptsServer/src/Assets/result.png", imageBytes);
  
    console.log("uploading result to Cloudinary");
    const now = new Date();
    const form = new FormData();
    form.append('file', Buffer.from(imageBytes), { filename: `result${now}.png` }); // or base64 string
    form.append('upload_preset', 'sthemma_img_preset'); // must match Cloudinary
    form.append('folder', 'callisto/design'); // optional

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/sthemma/image/upload',
        form,
        { headers: form.getHeaders() }
      );

      console.log('✅ Cloudinary URL:', response.data.secure_url);
      res.status(200).send(response.data.secure_url);

    } catch (error) {
      console.error('❌ Cloudinary upload failed:', error.response?.data || error.message);
      res.status(500).send(error.response?.data || error.message)
    }


  } else {
    console.log("Client access denied");
    res.status(500).send("Client access denied");
  }
}

module.exports = sendImagePrompt
