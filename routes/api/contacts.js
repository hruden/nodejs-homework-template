const express = require("express");

const ctrl  = require('../../controllers/contacts')

const {validateBody, authenticate} = require('../../middlewares')

const schemas = require('../../schemas/contacts')

const router = express.Router();

router.get("/", authenticate, ctrl.listContacts)

router.get("/:contactId", authenticate, ctrl.getContactById)

router.post("/", authenticate, validateBody(schemas.addSchema), ctrl.addContact)

router.delete("/:contactId", authenticate, ctrl.removeContact)

router.put("/:contactId", authenticate, validateBody(schemas.updateSchema), ctrl.updateContact)

router.patch("/:contactId/favorite", authenticate, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
