let button = document.querySelectorAll(".bn");
let reset = document.querySelector("#reset");
let newbn = document.querySelector("#new-bn");
let msg = document.querySelector("#msg");
let win = document.querySelector("#win");
let turn = "O";
let winner = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [3,4,5],
    [2,4,6],
    [6,7,8]
];
const enablebutton=()=>{
    for(let box of button){
        box.disabled=false;
        box.innerText="";
    }
}
const resetgame=()=>{
    turn="O";
    enablebutton();
    win.classList.add("msgbox")
}
button.forEach((bn)=>{
    bn.addEventListener("click",()=>{
        if (turn=="O"){
            bn.innerText = "O";
            turn = "X";
        }
        else {
            bn.innerText = "X";
            turn = "O";
        }
        bn.disabled = true;
        checkwinner();
    })
})
const showwinner = (winner)=>{
    msg.innerText=`congrutulations!\n Winner is ${winner}`;
    win.classList.remove("msgbox");
}
const checkwinner = ()=>{
    for ( let pattern of winner){
        let pos1 = button[pattern[0]].innerText;
        let pos2 = button[pattern[1]].innerText;
        let pos3 = button[pattern[2]].innerText;

        if(pos1 !=""&& pos2 != ""&& pos3!=""){
            if(pos1===pos2&& pos2===pos3){
                showwinner(pos1);
            }
        }
    }
}
document.querySelector("#reset").addEventListener("click",resetgame);
document.querySelector("#new-bn").addEventListener("click",resetgame);