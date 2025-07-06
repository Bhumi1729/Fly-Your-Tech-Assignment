import { Server } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join admin room for receiving updates
    socket.on('join_admin', () => {
      socket.join('admin_room');
      console.log(`Admin joined: ${socket.id}`);
    });

    // Leave admin room
    socket.on('leave_admin', () => {
      socket.leave('admin_room');
      console.log(`Admin left: ${socket.id}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
