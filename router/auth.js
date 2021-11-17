const { Router } = require("express");
const { check } = require("express-validator");
const {login, register, renewToken} = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validarCampos");

const router = Router();

router.post("/login",[
 check("email","El correo es obligatorio").isEmail(),
 check("password","El password es obligatorio").notEmpty(),
 validarCampos
], login);

router.post("/register",[
 check("nombre","El nombre es obligatorio").not().isEmpty().isString(),
 check("email","El email es obligatorio").isEmail(),
 check("password","El password es obligatorio").not().isEmpty(),
 validarCampos
], register);
 
router.get("/renew", validarJWT, renewToken);


module.exports = router;