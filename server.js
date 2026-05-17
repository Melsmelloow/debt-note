// server.js

import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// transactionId -> users[]
const transactionUsers = {};

// socketId -> session info
const socketSessions = {};

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("join-transaction", ({ transactionId, participant }) => {
    socket.join(transactionId);

    if (!transactionUsers[transactionId]) {
      transactionUsers[transactionId] = [];
    }

    // remove existing same socket only
    transactionUsers[transactionId] = transactionUsers[transactionId].filter(
      (user) => user.socketId !== socket.id,
    );

    // add socket session
    transactionUsers[transactionId].push({
      socketId: socket.id,
      participant,
    });

    socketSessions[socket.id] = {
      transactionId,
    };

    io.to(transactionId).emit(
      "active-users",
      transactionUsers[transactionId].map((user) => user.participant),
    );
  });
  socket.on("disconnect", () => {
    const session = socketSessions[socket.id];

    if (!session) return;

    const { transactionId } = session;

    if (!transactionUsers[transactionId]) return;

    transactionUsers[transactionId] = transactionUsers[transactionId].filter(
      (user) => user.socketId !== socket.id,
    );

    io.to(transactionId).emit(
      "active-users",
      transactionUsers[transactionId].map((user) => user.participant),
    );

    delete socketSessions[socket.id];
  });
  socket.on("update-transaction", (data) => {
    socket.to(data.transactionId).emit("transaction-updated", data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});