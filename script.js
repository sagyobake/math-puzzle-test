//テスト、本番用に応じてURLを切り替える
const socket = new WebSocket("wss://sagyobake-math-puzzle-47.deno.dev");

// 接続が開いたときのイベント
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
});

// メッセージの待ち受け
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    const n = event.data;
    const connections = document.getElementById('connections');
    connections.innerText = `同時接続数 ${event.data}`;
});
