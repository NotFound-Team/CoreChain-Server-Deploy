"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsService = void 0;
const common_1 = require("@nestjs/common");
let WsService = class WsService {
    constructor() {
        this.clients = new Map();
    }
    setServer(server) {
        this.server = server;
    }
    registerClient(client, namespace) {
        console.log('registerClient', client, namespace);
        if (!this.clients.has(namespace)) {
            this.clients.set(namespace, new Map());
        }
        this.clients.get(namespace).set(client.id, client);
        console.log({ clients: this.clients });
    }
    removeClient(client) {
        const namespace = client.nsp.name;
        if (this.clients.has(namespace)) {
            this.clients.get(namespace).delete(client.id);
            if (this.clients.get(namespace).size === 0) {
                this.clients.delete(namespace);
            }
        }
    }
    emitToClient(namespace, clientId, event, data) {
        const client = this.clients.get(namespace)?.get(clientId);
        if (client) {
            client.emit(event, data);
        }
    }
    broadcastToNamespace(namespace, event, data) {
        if (this.server) {
            this.server.of(namespace).emit(event, data);
        }
    }
    joinRoom(client, room) {
        client.join(room);
    }
    leaveRoom(client, room) {
        client.leave(room);
    }
    broadcastToRoom(namespace, room, event, data) {
        if (this.server) {
            this.server.of(namespace).to(room).emit(event, data);
        }
    }
};
exports.WsService = WsService;
exports.WsService = WsService = __decorate([
    (0, common_1.Injectable)()
], WsService);
//# sourceMappingURL=ws.service.js.map