import { Server } from 'socket.io';

let io;
//create Socket.IO singleton
export const initializeIo = (httpServer) => {
  // Handle WebSocket connections
  io = new Server(httpServer, {
    cors: {
      origin: [process.env.frontendURL, 'http://localhost:4000'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Websocket connected, socket ID: ${socket.id}`);

    socket.on('disconnect', (reason) => {
      console.log(`Websocket disconnected, socket ID: ${socket.id}, reason: ${reason}`);
    });

    socket.on('error', (error) => {
      console.log('Websocket error: ', error);
    });
  });
};

//Call Socket.io after initialized
export const socketIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
