import { NextApiRequest, NextApiResponse } from "next";
import { WebSocketServer, WebSocket } from "ws";

const rooms: Record<string, Set<WebSocket>> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { roomId } = req.query;

    if (typeof roomId !== "string") {
        res.status(400).send("Invalid roomId");
        return;
    }

    if (!(res.socket as any).server.wss) {
        console.log("Setting up WebSocket server...");
        const wss = new WebSocketServer({ noServer: true });

        (res.socket as any).server.on("upgrade", (request: any, socket: any, head: any) => {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit("connection", ws, request);
            });
        });

        wss.on("connection", (ws, request) => {
            const url = new URL(request.url!, `http://${request.headers.host}`);
            const id = url.pathname.split("/").pop()!;

            if (!rooms[id]) rooms[id] = new Set();
            rooms[id].add(ws);

            console.log(`Connection established in room ${id}. Total peers: ${rooms[id].size}`);

            ws.on("message", (message) => {
                // Broadcast to other peers in the room
                rooms[id].forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message.toString());
                    }
                });
            });

            ws.on("close", () => {
                rooms[id].delete(ws);
                if (rooms[id].size === 0) delete rooms[id];
                console.log(`Connection closed in room ${id}`);
            });
        });

        (res.socket as any).server.wss = wss;
    }

    res.end();
}

export const config = {
    api: {
        bodyParser: false,
    },
};
