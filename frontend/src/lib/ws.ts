export interface WebSocketOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
}

export interface WebSocketConnection {
  close: () => void;
}

export function connectWebSocket(
  url: string,
  onMessage: (data: any) => void,
  onOpen?: () => void,
  onClose?: () => void,
  options: WebSocketOptions = {}
): WebSocketConnection {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 10000 } = options;
  
  let ws: WebSocket | null = null;
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout | null = null;
  let isClosedByUser = false;

  const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const connect = () => {
    const token = getAuthToken();
    const wsUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url;
    
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      retryCount = 0;
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        onMessage(event.data);
      }
    };

    ws.onclose = (event) => {
      onClose?.();
      
      if (!isClosedByUser && !event.wasClean && retryCount < maxRetries) {
        retryCount++;
        const delay = Math.min(initialDelay * Math.pow(2, retryCount - 1), maxDelay);
        retryTimeout = setTimeout(connect, delay);
      }
    };

    ws.onerror = () => {
      ws?.close();
    };
  };

  connect();

  return {
    close: () => {
      isClosedByUser = true;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (ws) {
        ws.close();
        ws = null;
      }
    },
  };
}
