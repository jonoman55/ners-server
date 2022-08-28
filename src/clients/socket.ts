// DOCS : https://github.com/socketio/socket.io
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from 'http';
import { v4 } from 'uuid';

import logger from "../utils/logger";
import { socketConfig } from "../config/socket.config";
import type { Users } from "../types";

/**
 * Create Socket IO Server
 * @param {http.Server} server 
 * @returns {Server} Socket IO Server Instance
 */
export const createSocketServer = (server: HttpServer): Server => {
    return new Server(server, socketConfig);
};

/**
 * Socket IO Server Instance Class
 */
export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;
    public isOnline: boolean;

    /** Master list of all connected users */
    public users: Users;

    constructor(server: HttpServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        });

        this.io.on('connect', this.startListeners);

        logger.info('Socket IO started...');

        this.isOnline = true;
    };

    /**
     * Start Socket IO Listener Events
     * @param {Socket} socket Socket 
     */
    startListeners = (socket: Socket): void => {
        logger.info(`Message received from ${socket.id}`);

        socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
            logger.info(`Handshake received from ${socket.id}`);
            /** Check if this is a reconnection */
            const reconnected: boolean = Object.values(this.users).includes(socket.id);

            if (reconnected) {
                logger.info('This user has reconnected');
                const uid = this.getUidFromSocketId(socket.id);
                const users = Object.values(this.users);

                if (uid) {
                    logger.info('Sending callback for reconnect...');
                    callback(uid, users);
                    return;
                }
            }

            /** Generate a new user */
            const uid: string = v4();
            this.users[uid] = socket.id;
            const users: string[] = Object.values(this.users);
            logger.info('Sending callback for handshake...');
            callback(uid, users);

            /** Send new user to all connected users */
            this.sendMessage(
                'user_connected',
                users.filter((id) => id !== socket.id),
                users
            );
        });

        socket.on('disconnect', () => {
            logger.info(`Disconnect received from ${socket.id}`);
            const uid: string | undefined = this.getUidFromSocketId(socket.id);
            if (uid) {
                delete this.users[uid];
                const users = Object.values(this.users);
                this.sendMessage('user_disconnected', users, socket.id);
            }
        });

        socket.on('disconnected', () => {
            logger.warn('Socket is disconnected...');
            this.isOnline = false;
        });
    };

    /**
     * Get User ID From Socket ID
     * @param {string} id Socket ID
     * @returns {string | undefined} User ID or undefined
     */
    getUidFromSocketId = (id: string): string | undefined => {
        return Object.keys(this.users).find((uid) => this.users[uid] === id);
    };

    /**
     * Send a message through the socket
     * @param {string} name The name of the event, e.g. handshake
     * @param {string[]} users List of socket id's
     * @param {Object} payload any information needed by the user for state updates
     */
    sendMessage = (name: string, users: string[], payload?: Object) => {
        logger.info(`Emitting event: ${name} to ${users}`);
        users.forEach((id) => (payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)));
    };
};