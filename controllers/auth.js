const {request, response} = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/JWT");


const login = async(req = request, res = response) =>{
  
  const {email, password } = req.body; 

  try {
    // verificar el email
    const usuarioDB = await Usuario.findOne({email});
    if(!usuarioDB){
        return res.status(400).json({
            ok:false,
            msg:"Email o password no son correctos"
        });
    };
    // verificar el password
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if(!validPassword){
        return res.status(400).json({
            ok:false,
            msg:"Email o password no son correctos"
        });
    };
    // generar el jwt
    const token = await generarJWT(usuarioDB.id);

    res.status(200).json({
        ok:true,
        usuario:usuarioDB,
        token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
        ok:false,
        msg:"Hable con el administrador"
    });
  }
};

const register = async(req = request, res = response) =>{

  try {
    
    const {email, password} = req.body;
    const existeEmail = await Usuario.findOne({email});
    
    if(existeEmail){
      return res.status(400).json({
        ok:false,
        msg:"El correo ya existe"
      })
    }

    const usuario = new Usuario(req.body);
    // encriptar password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    // save usuario
    await usuario.save();


    res.status(200).json({
      ok:true,
      msg:"Usuario creado",
      usuario
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg:"Hable con el administrador"
    })
  }

};

const renewToken = async(req = request, res = response) =>{

  const uid = req.uid;

  // generar jwt
  const token = await generarJWT(uid);

  const usuario = await Usuario.findById(uid);

 res.json({
   ok:true,
   msg:"token revalidado",
   usuario,
   token
 });

};

module.exports = {
  login,
  register,
  renewToken
}