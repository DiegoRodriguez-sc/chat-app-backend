const { Router } = require("express");
const { check } =  require("express-validator");
const {login, register, renewToken} = require("../controllers/auth");
const { getChat } = require("../controllers/mensajes");
const { validarJWT } = require("../middlewares/validar-jwt");


const router = Router();

router.get("/:de",validarJWT,getChat)


module.exports = router;