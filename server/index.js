import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

// Map to store different states
// const stateMap = new Map();
//
// Map the initial states
// stateMap.set("sessions", []);

io.on("connection", (socket) => {
  // Send the latest states to newly connected clients from the map
  // socket.emit("getSessions", stateMap.get("sessions"));

  socket.on("updateSessions", (sessions) => {
    // stateMap.set("sessions", sessions); // Save the changed flag to State Map
    io.emit("sessionsUpdated", sessions);
  });

  socket.on("raceStarted", (updatedSessions) => {
    io.emit("removedSession", updatedSessions);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

io.listen(4000);
