let user_list = [];

//テスト用の場合は、URLを指定する。
const kv = await Deno.openKv();
//const kv = await Deno.openKv("https://api.deno.com/databases/64e34f27-ba27-470e-9131-96f2a83b27cc/connect");

Deno.serve({
    port: 443,
    handler: async (req) => {
        if (req.headers.get("upgrade") != "websocket") {
            return new Response(null, { status: 501 });
        }

        const { socket, response } = Deno.upgradeWebSocket(req);

        const sendToAllClient = (key, value) => {
            const data = { [key]: value };
            console.log(data);
            user_list.forEach(user => {
                user.send(JSON.stringify(data));
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
            const idIndex = user_list.indexOf(socket);
            user_list.splice(idIndex, 1);
            const n = user_list.length;
            sendToAllClient('connection', n);
            sendToAllClient('onclose', idIndex);
        };
        socket.onerror = (error) => console.error("ERROR:", error);

        return response;
    },
});