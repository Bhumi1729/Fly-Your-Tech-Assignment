import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://fly-your-tech-assignment-1.onrender.com';
    this.socket = io(socketUrl);

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinAdminRoom() {
    if (this.socket) {
      this.socket.emit('join_admin');
    }
  }

  leaveAdminRoom() {
    if (this.socket) {
      this.socket.emit('leave_admin');
    }
  }

  onAttendanceUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('attendance_update', callback);
    }
  }

  offAttendanceUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('attendance_update', callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketService = new SocketService();
