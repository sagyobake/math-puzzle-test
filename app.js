let user_list = [];

await Deno.openKv();

Deno.serve({
    port: 443,
    handler: async (req) => {
        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        const sendToAllClient = async (key, value) => {
            user_list.forEach(user => {
                user.send(`${key}: ${value}`);
            });
        }


        socket.onopen = () => {
            user_list.push(socket);
            const n = user_list.length;
            sendToAllClient('connection', n);
        };
        socket.onmessage = (e) => {
            console.log(`RECEIVED: ${e.data}`);
        };
        socket.onclose = (e) => {
            const closeIndex = user_list.indexOf(socket);
            user_list.splice(closeIndex, 1);
            const n = user_list.length;
            sendToAllClient('connection', n);
            sendToAllClient('id', closeIndex);
        };
        socket.onerror = (error) => console.error("ERROR:", error);

        return response;
    },
});