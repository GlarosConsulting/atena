import { Server } from 'http';
import socketio from 'socket.io';
import { injectable, inject } from 'tsyringe';

import webSocketConfig from '@config/websocket';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IEmitDTO from '@shared/container/providers/WebSocketProvider/dtos/IEmitDTO';

import IConnections from '../models/IConnections';
import IWebSocketProvider from '../models/IWebSocketProvider';

@injectable()
class SocketIOWebSocketProvider implements IWebSocketProvider {
  private client: socketio.Server;

  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async create(server: Server) {
    this.client = socketio(server);

    return this.client;
  }

  public async getConnections(): Promise<IConnections> {
    let connections = await this.cacheProvider.recover<IConnections>(
      webSocketConfig.cacheKey,
    );

    if (!connections) {
      connections = {};
    }

    return connections;
  }

  public async connect(user_id: string, socket_id: string): Promise<void> {
    const connections = await this.getConnections();

    connections[user_id] = socket_id;

    await this.cacheProvider.save(webSocketConfig.cacheKey, connections);

    // console.log('\nNew connection in the channel, socket:', socket_id);
    // console.log('Connections: ', connections);
  }

  public async disconnect(user_id: string): Promise<void> {
    const connections = await this.getConnections();

    const connection = connections[user_id];

    if (!connection) {
      return;
    }

    const isConnected = await this.isConnected(user_id);

    if (isConnected) {
      this.client.sockets.connected[connection].disconnect();
    }

    delete connections[user_id];

    await this.cacheProvider.save(webSocketConfig.cacheKey, connections);

    // console.log('\nDisconnected socket:', connection);
    // console.log('Connections: ', connections);
  }

  public async emit({ to, event, args }: IEmitDTO): Promise<void> {
    if (to) {
      const isConnected = await this.isConnected(to);

      if (isConnected) {
        this.client.sockets.connected[to].emit(event, args);
        return;
      }

      this.client.to(to).emit(event, args);
      return;
    }

    this.client.emit(event, args);
  }

  public async isConnected(user_id: string): Promise<boolean> {
    const connections = await this.getConnections();

    const connection = connections[user_id];

    return !!connection && !!this.client.sockets.connected[connection];
  }
}

export default SocketIOWebSocketProvider;
