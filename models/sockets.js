const { usuarioconectado, usuarioDesconectado, getUsuarios, guardarChat } = require("../controllers/socket");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;
    this.SocketEvents();
  }

  SocketEvents() {
    this.io.on("connection", async(socket) => {

      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);

      if(!valido){
        console.log("socket no identificado");
        return socket.disconnect();
      }
      await  usuarioconectado(uid);

      //unir al usuario a una sala de socket.io
      socket.join(uid);
      
      // emitir todos los usuarios
      this.io.emit("lista-usuarios",await getUsuarios());


      // escuchar mensaje
      socket.on("mensaje-personal",async(payload) =>{
          const mensaje = await guardarChat(payload);
          this.io.to(payload.para).emit("mensaje-personal", mensaje);
          this.io.to(payload.de).emit("mensaje-personal", mensaje);
      });



      socket.on("disconnect",async() =>{
        await usuarioDesconectado(uid);
        this.io.emit("lista-usuarios",await getUsuarios());
      });

    });
  }
}

module.exports = Sockets;
