const express  = require("express");
const http     = require("http");
const socketio = require("socket.io");
const path     = require("path");
const Sockets  = require("./sockets");
const cors     = require("cors");
const { dbConnection } = require("../database/config");


class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // conect DB
    dbConnection();

    // http server
    this.server = http.createServer(this.app);

    // confi sockets
    this.io = socketio(this.server, {
      /* configuraciones*/
    });
  }

  middlewares(){
   this.app.use(express.static(path.resolve( __dirname ,"../public")) );
  
    // cors
    this.app.use(cors());

    // parseo del body
    this.app.use(express.json());

    // API ENDpoints
    this.app.use("/api/auth",require("../router/auth"));
    this.app.use("/api/mensajes",require("../router/mensajes"));
  }
  
  configurarSockets(){
      new Sockets(this.io);

  }

  execute() {
   // inicializar middlewares
    this.middlewares();

   // configurar sockets
   this.configurarSockets();

    // inicializar servidor
    this.server.listen(this.port, () => {
      console.log("server corriendo en el puerto :",this.port);
    });
  }
}

module.exports = Server;
