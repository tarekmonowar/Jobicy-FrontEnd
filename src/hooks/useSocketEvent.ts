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

    const listener = (...args: unknown[]) => {
      (handlerRef.current as (...a: unknown[]) => void)(...args);
    };

    // Socket.io generic listener typing is narrower than our event map.
    socket.on(event, listener as never);
    return () => {
      socket.off(event, listener as never);
    };
  }, [event]);
}
