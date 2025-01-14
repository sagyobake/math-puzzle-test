// WebSocket 接続を作成
const socket = new WebSocket("ws://0.0.0.0:8000");

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
