// Socket.io client singleton — connect on app load via providers.

import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/runtime';
import type { ServerToClientEvents } from '@/types/socket';

/** Typed socket instance (autoConnect disabled — providers call connectSocket). */
export const socket: Socket<ServerToClientEvents> = io(env.socketUrl, {
  withCredentials: true,
  autoConnect: false,
});

/** Open the socket connection (idempotent). */
export function connectSocket(): void {
  if (!socket.connected) {
    socket.connect();
  }
}

/** Close the socket connection. */
export function disconnectSocket(): void {
  if (socket.connected) {
    socket.disconnect();
  }
}
