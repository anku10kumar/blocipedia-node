const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");


router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", wikiController.create);
router.post("/wikis/createPrivate", wikiController.createPrivateWikis);
router.post("/wikis/:id/makePrivate", wikiController.makePrivate);
router.post("/wikis/:id/makePublic", wikiController.makePublic);
router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit",  wikiController.edit);
router.post("/wikis/:id/update",  wikiController.update);

module.exports = router;
