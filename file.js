let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let newBtn = document.querySelector("#newBtn");
let msg = document.querySelector("#msg");
let winBox = document.querySelector("#win");
let levelSelect = document.querySelector("#level");

let board = ["","","","","","","","",""];
let player = "O";
let ai = "X";
let gameOver = false;

const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];


// 🔊 Built-in Sound (NO FILES NEEDED)
function play(type){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    let freq;
    if(type === "click") freq = 500;
    else if(type === "win") freq = 900;
    else if(type === "draw") freq = 200;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = freq;
    osc.type = "sine";

    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
}


// Player click
boxes.forEach((box, i) => {
    box.addEventListener("click", () => {
        if(board[i] !== "" || gameOver) return;

        play("click");
        move(i, player);

        if(!gameOver) {
            setTimeout(aiMove, 400);
        }
    });
});


// Make move
function move(i, p){
    board[i] = p;
    boxes[i].innerText = p;
    boxes[i].disabled = true;

    // 🎨 Add color class
    boxes[i].classList.add(p === "X" ? "x" : "o");

    let winPattern = check(p);

    if(winPattern){
        highlight(winPattern);
        showWinner(p);
        gameOver = true;
        return;
    }

    if(!board.includes("")){
        showDraw();
        gameOver = true;
    }
}


// AI move
function aiMove(){
    let level = levelSelect.value;
    let moveIndex;

    if(level === "easy"){
        moveIndex = randomMove();
    }
    else if(level === "medium"){
        moveIndex = Math.random() < 0.5 ? bestMove() : randomMove();
    }
    else {
        moveIndex = bestMove();
    }

    move(moveIndex, ai);
}


// Random move
function randomMove(){
    let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
    return empty[Math.floor(Math.random()*empty.length)];
}


// Smart move
function bestMove(){
    // Win
    for(let p of patterns){
        let m = find(p, ai);
        if(m !== -1) return m;
    }

    // Block
    for(let p of patterns){
        let m = find(p, player);
        if(m !== -1) return m;
    }

    // Center
    if(board[4] === "") return 4;

    // Else random
    return randomMove();
}


// Find winning/blocking move
function find(p, pl){
    let [a,b,c] = p;
    let arr = [board[a], board[b], board[c]];

    if(arr.filter(v => v === pl).length === 2 && arr.includes("")){
        if(board[a] === "") return a;
        if(board[b] === "") return b;
        if(board[c] === "") return c;
    }
    return -1;
}


// Check winner
function check(p){
    for(let pat of patterns){
        let [a,b,c] = pat;
        if(board[a] === p && board[b] === p && board[c] === p){
            return pat;
        }
    }
    return null;
}


// Highlight winning boxes
function highlight(pat){
    pat.forEach(i => boxes[i].classList.add("win"));
}


// Show winner
function showWinner(p){
    msg.innerText = p === player ? "🎉 You Win!" : "🤖 AI Wins!";
    winBox.classList.add("show");
    play("win");
}


// Show draw
function showDraw(){
    msg.innerText = "😐 Draw!";
    winBox.classList.add("show");
    play("draw");
}


// Reset game
function resetGame(){
    board = ["","","","","","","","",""];
    gameOver = false;

    boxes.forEach(b => {
        b.innerText = "";
        b.disabled = false;
        b.classList.remove("win","x","o");
    });

    winBox.classList.remove("show");
}


// Events
resetBtn.addEventListener("click", resetGame);
newBtn.addEventListener("click", resetGame);
levelSelect.addEventListener("change", resetGame);