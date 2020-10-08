import { container } from 'tsyringe';

import webSocketConfig from '@config/websocket';

import SocketIOWebSocketProvider from './implementations/SocketIOWebSocketProvider';
import IWebSocketProvider from './models/IWebSocketProvider';

const providers = {
  socketio: container.resolve(SocketIOWebSocketProvider),
};

container.registerInstance<IWebSocketProvider>(
  'WebSocketProvider',
  providers[webSocketConfig.driver],
);
