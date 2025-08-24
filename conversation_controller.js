import pool from "../config/db.js"
// Register all conversation-related socket events
export const registerConversationEvents = (socket, io) => {
  socket.on("start_conversation", async ({ participantIds, isGroup = false, name = null }) => {
    try {
      // 1-to-1 conversation check
      if (!isGroup && participantIds.length === 1) {
        const otherUserId = participantIds[0];
        const [existing] = await pool.query(
          `SELECT c.id FROM conversations c
           JOIN participants p1 ON c.id = p1.conversation_id AND p1.user_id = ?
           JOIN participants p2 ON c.id = p2.conversation_id AND p2.user_id = ?
           WHERE c.is_group = 0
           LIMIT 1`,
          [socket.user.id, otherUserId]
        );

        if (existing.length > 0) {
          return socket.emit("conversation_exists", { conversationId: existing[0].id });
        }
      }

      // Create new conversation
      const [result] = await pool.query(
        "INSERT INTO conversations (name, is_group) VALUES (?, ?)",
        [isGroup ? name : null, isGroup ? 1 : 0]
      );
      const conversationId = result.insertId;

      // Add participants
      const users = [...new Set([socket.user.id, ...participantIds])];
      const values = users.map(userId => [conversationId, userId]);
      await pool.query(
        "INSERT INTO participants (conversation_id, user_id) VALUES ?",
        [values]
      );

      socket.emit("conversation_created", { conversationId });

      // Notify other participants
      users.forEach(userId => {
        if (userId !== socket.user.id) {
          io.emit(`new_conversation_user_${userId}`, { conversationId, name });
        }
      });
    } catch (err) {
      console.error("start_conversation error:", err.message);
      socket.emit("error", "Could not start conversation");
    }
  });
};

