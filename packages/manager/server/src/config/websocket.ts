interface IWebSocketConfig {
  driver: 'socketio';
  cacheKey: string;
}

export default {
  driver: 'socketio',
  cacheKey: 'websocket-connections',
} as IWebSocketConfig;
