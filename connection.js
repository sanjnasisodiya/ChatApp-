import { registerConversationEvents } from "../controller/conversation_controller.js";
import { socketValidateToken } from "../middleware/varifytoken.js";
export const connection = (io) => {
  io.use(socketValidateToken);

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    console.log("User:", socket.user);

    //Join user room for private messaging
    socket.on("join-room", (userId) => {
      socket.join(userId); // join their own room
      console.log(`User ${userId} joined room`);
    });

    //Send message to target user room
    socket.on("User-message", ({ to, message }) => {
      console.log(`Message from ${socket.id} to ${to}: ${message}`);

      // Send to receiver
      io.to(to).emit("message", { text: message, self: false });

      // Echo back to sender (so it appears on their chat too)
      socket.emit("message", { text: message, self: true });
    });

    // Optional: Register conversation-related events
    registerConversationEvents(socket);
  });
};
