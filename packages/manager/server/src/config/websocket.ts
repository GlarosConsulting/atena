interface IWebSocketConfig {
  driver: 'socketio';
  cache_key: string;
}

export default {
  driver: 'socketio',
  cache_key: 'websocket-connections',
} as IWebSocketConfig;
