const { request, response } = require("express");
const Mensaje = require("../models/mensaje");


const getChat = async(req = request, res = response) => {

    const miId = req.uid;
    const mensajesDe = req.params.de;

    const last30 = await Mensaje.find({
        $or: [
            { de: miId, para: mensajesDe },
            { de: mensajesDe, para: miId },
        ]
    })
    .sort({ createdAt: 'asc' })
    .limit(30);


    res.status(200).json({
      ok:true,
      msg:last30
    });



}

module.exports = {
 getChat
}