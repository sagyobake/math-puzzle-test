//テスト、本番用に応じてURLを切り替える
const socket = new WebSocket("wss://sagyobake-math-puzzle-47.deno.dev");
//const socket = new WebSocket("ws://0.0.0.0:8000/");
let square = [];
let x = 0;
let y = 0;

// 接続が開いたときのイベント
socket.addEventListener("open", (event) => {
    socket.send("Hello Server!");
});

const discrimination = (v) => {
    const data = JSON.parse(v);
    const key = Object.keys(data).join(',');
    const value = Object.values(data).join(',');
    console.log(key, value);
    const connections = document.getElementById('connections');
    const log = document.getElementById('log');
    switch (key) {
        case 'onclose':
            log.innerText += `ID${value}番さんが退出しました。\n`;
            break;
        case 'connection':
            connections.innerText = `同時接続数${value}\n`;
            break;
    }

}

// メッセージの待ち受け
socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    discrimination(event.data);
});


function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 上限を含み、下限も含む
}

const pushSquare = (tr_array) => {
    const n = getRandomIntInclusive(1, 3);

    if (tr_array.includes(n) === false) {
        tr_array.push(n);
    } else {
        pushSquare(tr_array);
    }
}

for (let i = 0; i < 3; i++) {
    const tr_array = [];
    for (let j = 0; j < 3; j++) {
        const td = document.getElementById(`id_${i}`);

        pushSquare(tr_array);
        console.log(tr_array);
    }

}

console.log(square);