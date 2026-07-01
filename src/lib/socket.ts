// Socket.io client singleton — lazy-init in the browser only (safe for SSR).

import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/runtime';
import type { ServerToClientEvents } from '@/types/socket';

let socketInstance: Socket<ServerToClientEvents> | null = null;

/** Return the typed socket singleton (created on first use in the browser). */
export function getSocket(): Socket<ServerToClientEvents> {
  if (typeof window === 'undefined') {
    throw new Error('getSocket() must only be called in the browser');
  }

  if (!socketInstance) {
    socketInstance = io(env.socketUrl, {
      withCredentials: true,
      autoConnect: false,
    });
  }

  return socketInstance;
}

/** Open the socket connection (idempotent). */
export function connectSocket(): void {
  if (typeof window === 'undefined') return;

  const socket = getSocket();
  if (!socket.connected) {
    socket.connect();
  }
}

/** Close the socket connection. */
export function disconnectSocket(): void {
  if (!socketInstance?.connected) return;
  socketInstance.disconnect();
}
