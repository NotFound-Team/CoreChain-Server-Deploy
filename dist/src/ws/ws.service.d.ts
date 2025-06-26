import { Server, Socket } from 'socket.io';
export declare class WsService {
    private server;
    private clients;
    setServer(server: Server): void;
    registerClient(client: Socket, namespace: string): void;
    removeClient(client: Socket): void;
    emitToClient(namespace: string, clientId: string, event: string, data: any): void;
    broadcastToNamespace(namespace: string, event: string, data: any): void;
    joinRoom(client: Socket, room: string): void;
    leaveRoom(client: Socket, room: string): void;
    broadcastToRoom(namespace: string, room: string, event: string, data: any): void;
}
