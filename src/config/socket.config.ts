import { ServerOptions } from "socket.io";

/**
 * Socket IO Config Options
 */
export const socketConfig: Partial<ServerOptions> = {
    serveClient: false,
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    cors: {
        origin: "*",
        allowedHeaders: "*",
        credentials: false
    }
}; 