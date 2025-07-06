import { Server } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join admin room for dashboard users
    socket.on('join_admin', () => {
      socket.join('admin_room');
      console.log('User joined admin room:', socket.id);
    });

    // Leave admin room
    socket.on('leave_admin', () => {
      socket.leave('admin_room');
      console.log('User left admin room:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Function to emit attendance updates to admin room
  const emitAttendanceUpdate = (data: any) => {
    io.to('admin_room').emit('attendance_update', data);
  };

  return { emitAttendanceUpdate };
};
