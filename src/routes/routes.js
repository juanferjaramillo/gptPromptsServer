const { Router } = require("express");
const router = Router();

//------------------------Controllers-----------------------
const sendTextPrompt = require("../controllers/sendTextPrompt");
const sendImagePrompt = require("../controllers/sendImagePrompt");

//-------------------------Routes----------------------------
router.post("/sendTextPrompt", sendTextPrompt);
router.post("/sendImagePrompt", sendImagePrompt);

module.exports = router;