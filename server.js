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
    console.log("join-transaction", transactionId, participant);

    socket.join(transactionId);

    if (!transactionUsers[transactionId]) {
      transactionUsers[transactionId] = [];
    }

    // remove duplicate participant ids
    transactionUsers[transactionId] = transactionUsers[transactionId].filter(
      (user) => user.id !== participant.id,
    );

    // add current participant
    transactionUsers[transactionId].push(participant);

    // store socket session
    socketSessions[socket.id] = {
      transactionId,
      participantId: participant.id,
    };

    console.log("ACTIVE USERS", transactionUsers[transactionId]);

    io.to(transactionId).emit("active-users", transactionUsers[transactionId]);
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);

    const session = socketSessions[socket.id];

    if (!session) return;

    const { transactionId, participantId } = session;

    if (!transactionUsers[transactionId]) return;

    transactionUsers[transactionId] = transactionUsers[transactionId].filter(
      (user) => user.id !== participantId,
    );

    io.to(transactionId).emit("active-users", transactionUsers[transactionId]);

    delete socketSessions[socket.id];
  });

  socket.on("update-transaction", (data) => {
    socket.to(data.transactionId).emit("transaction-updated", data);
  });
});
