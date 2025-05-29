const FormData = require('form-data');
const axios = require('axios');

async function testUpload(req, res) {
    const {imgUrl} = req.body;
  const response = await fetch(imgUrl);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const imageBytes = new Uint8Array(arrayBuffer);
  console.log(imageBytes);

    const form = new FormData();
    form.append('file', Buffer.from(imageBytes), { filename: 'result2.png' }); // or base64 string
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
}
module.exports = testUpload