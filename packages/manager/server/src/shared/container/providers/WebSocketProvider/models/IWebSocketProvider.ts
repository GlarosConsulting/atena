import IEmitDTO from '@shared/container/providers/WebSocketProvider/dtos/IEmitDTO';

import IConnections from './IConnections';

export default interface IWebSocketProvider {
  create(...data: any): Promise<any>;
  getConnections(): Promise<IConnections>;
  connect(user_id: string, socket_id: string): Promise<void>;
  disconnect(user_id: string): Promise<void>;
  emit(data: IEmitDTO): Promise<void>;
  isConnected(user_id: string): Promise<boolean>;
}
