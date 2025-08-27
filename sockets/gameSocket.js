const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { toSafeUser } = require("../services/authService");

// Autenticación por token en el handshake de Socket.IO
module.exports = async (socket, io) => {
  try {
    // token puede venir en: socket.handshake.auth.token o query ?token=
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      socket.emit("auth_error", "Token requerido");
      return socket.disconnect(true);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.uid);
    if (!user) throw new Error("Usuario no encontrado");

    socket.data.user = toSafeUser(user);

    //player data
    socket.on("get_player_data" , () => {
        socket.emit("player_data" , socket.data.user);
    })

    // Unirse al lobby (ejemplo)
    socket.join("lobby");

    // Eventos de juego
    socket.on("join_game", (data) => {
      // lógica para unirse a partida
      io.to("lobby").emit("player_joined", { user: socket.data.user.nickname });
    });

    socket.on("disconnect", () => {
      // limpieza / notificar salida
    });
  } catch (err) {
    socket.emit("auth_error", "Token inválido");
    socket.disconnect(true);
  }
};