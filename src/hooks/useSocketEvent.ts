'use client';

// Subscribe to a Socket.io server event with automatic cleanup.

import { useEffect, useRef } from 'react';
import { connectSocket, getSocket } from '@/lib/socket';
import type { ServerToClientEvents } from '@/types/socket';

/**
 * Listen for a typed socket event while the component is mounted.
 * Connects the socket on first subscription.
 */
export function useSocketEvent<E extends keyof ServerToClientEvents>(
  event: E,
  handler: ServerToClientEvents[E],
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    const listener = ((...args: Parameters<ServerToClientEvents[E]>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (handlerRef.current as (...a: unknown[]) => void)(...args);
    }) as ServerToClientEvents[E];

    socket.on(event, listener);
    return () => {
      socket.off(event, listener);
    };
  }, [event]);
}
