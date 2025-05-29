const { Router } = require("express");
const router = Router();

//------------------------Controllers-----------------------
const sendTextPrompt = require("../controllers/sendTextPrompt");
const sendImagePrompt = require("../controllers/sendImagePrompt");
const testUpload = require("../controllers/testUpload");

//-------------------------Routes----------------------------
router.post("/sendTextPrompt", sendTextPrompt);
router.post("/sendImagePrompt", sendImagePrompt);
router.post("/testUpload", testUpload);


module.exports = router;