// server.js

import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "*",
  },
});

const transactionUsers = {};

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("join-transaction", ({ transactionId, participant }) => {
    console.log("join-transaction", transactionId, participant);

    socket.join(transactionId);

    if (!transactionUsers[transactionId]) {
      transactionUsers[transactionId] = [];
    }

    // remove duplicates
    transactionUsers[transactionId] = transactionUsers[transactionId].filter(
      (user) => user._id !== participant._id,
    );

    // add current user
    transactionUsers[transactionId].push(participant);

    console.log("ACTIVE USERS", transactionUsers[transactionId]);

    // emit active users
    io.to(transactionId).emit("active-users", transactionUsers[transactionId]);

    socket.on("disconnect", () => {
      console.log("disconnect", socket.id);

      transactionUsers[transactionId] = transactionUsers[transactionId].filter(
        (user) => user._id !== participant._id,
      );

      io.to(transactionId).emit(
        "active-users",
        transactionUsers[transactionId],
      );
    });
  });

  socket.on("update-transaction", (data) => {
    socket.to(data.transactionId).emit("transaction-updated", data);
  });
});
