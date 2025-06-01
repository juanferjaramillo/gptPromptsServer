const { Router } = require("express");
const router = Router();

//------------------------Controllers-----------------------
const sendTextPrompt = require("../controllers/sendTextPrompt");
const sendImagePrompt = require("../controllers/sendImagePrompt");
const geminiTest = require("../controllers/geminiTest");
const geminiImageTest = require("../controllers/geminiImageTest");

//-------------------------Routes----------------------------
router.post("/sendTextPrompt", sendTextPrompt);
router.post("/sendImagePrompt", sendImagePrompt);
router.get("/geminiTest", geminiTest);
router.get("/geminiImageTest", geminiImageTest);

module.exports = router;