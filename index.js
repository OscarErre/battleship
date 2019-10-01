var ships = document.querySelectorAll(".ships");
var cells = document.querySelectorAll(".cell");
var currentid, cellOrigen, cellDestino;
var dropable = false;
var currentPlayer=0;
var players = [];
var hundidos=[0,0];
var first=true;
var dispararOn=true;

players[0] = new Array(10).fill(0).map(() => new Array(10).fill(0));
players[1] = new Array(10).fill(0).map(() => new Array(10).fill(0));


for (var i=0; i<ships.length; i++) {
        ships[i].addEventListener("dragstart", arrastrar, false);
}

for (var i=0; i<cells.length; i++) {
    if (cells[i].className === "cell") {
        cells[i].addEventListener("dragenter", entrar, false);
        cells[i].addEventListener("dragover", comprovarCelda, false);
        cells[i].addEventListener("dragleave", salir, false);
        cells[i].addEventListener("drop", soltar, false);
    }
}

function arrastrar (e) {
    var shipElem = e.target;
    
    e.dataTransfer.setData("text/plain",shipElem.getAttribute("id"));
    currentid=shipElem.getAttribute("id");
    cellOrigen = document.getElementById(shipElem.id).parentElement;
}

function getSize (shipId) {
    var size=0;

    switch (shipId) {
        case "5": size=5; break;
        case "4": size=4; break;
        case "3A": size=3; break;
        case "3B": size=3; break;
        case "2": size=2; break;
    }

    return size;
}

function getBarcoSrc (size) {
    var src="";

    switch (size) {
        case 5: src="./img/5size.png"; break;
        case 4: src="./img/4size.png"; break;
        case 3: if (first) {
                    src="./img/3sizeA.png";
                    first=false;
                } else {
                    src="./img/3sizeB.png";
                    first=true;
                }
                break;
        case 2: src="./img/2size.png"; break;
    }

    return src;
}

function comprovarCelda (e) {
    e.preventDefault();
    var elem=e.target;
    var col=parseInt(elem.id[1]);
    var size=getSize(currentid);

    if ((col+size)<=10){
        dropable=true;
    } else {
        elem.style.background="rgba(255, 0, 0, 0.7)";
        dropable=false;
    }
}

function entrar (e) {
    e.preventDefault();

    var elem = e.target;
    elem.style.background="rgba(0, 255, 0, 0.7)";
}

function soltar (e) {
    var shipId=e.dataTransfer.getData("text/plain");
    var src=document.getElementById(shipId).src;

    e.preventDefault();
    if (dropable) {
        cellDestino=e.target;
        cellDestino.removeAttribute('style');
        cellDestino.removeEventListener('drop',soltar,false);
        if (cellDestino.id!=cellOrigen.id) {
            cellOrigen.addEventListener('drop',soltar,false);
        }

        document.getElementById(shipId).remove();//eliminamos el barco original para evitar duplicidad de IDs al 'pintar' el nuevo
        cellDestino.innerHTML="<img src='"+src+"' class='ships' id='"+shipId+"'>";
        cellDestino.addEventListener("dragstart", arrastrar, false);
        dropable=false;
    } else {
        e.target.style.removeProperty('background');
    }
}

function start () {
    document.getElementById("wellcome").style.display="none";
    document.getElementById("main").style.visibility="visible";
    document.getElementById("player").style.visibility="visible";
}
function salir (e) {
    e.preventDefault();
    var elem = e.target;
    elem.style.removeProperty('background');
}

function changePlayer () {
    
    document.getElementById("main").style.display="none";
    document.getElementById("player").style.visibility="hidden";
    if (currentPlayer===0) {
        document.getElementById("main").style.flexDirection="row-reverse";
        document.getElementById("numPlayer").innerHTML="2";
        document.getElementById("player").style.backgroundImage="url('./img/player2.png')";
    } else {
        document.getElementById("main").style.flexDirection="row";
        document.getElementById("numPlayer").innerHTML="1";
        document.getElementById("player").style.backgroundImage="url('./img/player1.png')";
    }
    currentPlayer=parseInt(document.getElementById("numPlayer").innerHTML)-1;
    startTime();
    
}

function setBarcos () {

    var todosBarcosOk = document.getElementById("shipsLand").getElementsByTagName("IMG").length;
    
    if(todosBarcosOk===0) {
        almacenarBarcosTablero();
        if (currentPlayer===0) {
            reiniciarShipsLand();
            changePlayer();
        } else {
            document.getElementById("setBarcos").remove();
            changePlayer();
            activarDisparos();
            rellenarCuadrículas();
            document.getElementById("msg").innerHTML='Fuego!';
        }
    }
}

function almacenarBarcosTablero () {
    var currentCells = document.querySelectorAll(".ships");
    var x,y;
    var size;

    for (let i=0; i<currentCells.length; i++) {
        x=currentCells[i].parentElement.id.charCodeAt(0)-65;
        y=parseInt(currentCells[i].parentElement.id[1]);
        size=getSize(currentCells[i].id);    
        players[currentPlayer][x].fill (1,y,y+size);
        currentCells[i].removeEventListener("dragstart", arrastrar, false);
        document.getElementById(currentCells[i].id).parentElement.addEventListener('drop',soltar,false);
        document.getElementById(currentCells[i].id).remove();
    }

    console.table(players[currentPlayer]);
}

function reiniciarShipsLand () {
    document.getElementById("shipsLand").innerHTML="<br>";
    for (let i=0; i<ships.length; i++) {
        document.getElementById("shipsLand").innerHTML=document.getElementById("shipsLand").innerHTML+"<img src='"+ships[i].src+"' class='ships' id='"+ships[i].getAttribute("id")+"'><br><br>";
    }
    ships = document.querySelectorAll(".ships");
    for (let i=0; i<ships.length; i++) {
        ships[i].addEventListener("dragstart", arrastrar, false);
    }
}

function startTime () {
    var counter=6;
    document.getElementById("countBack").innerHTML=counter;
    document.getElementById("changing").style.visibility="visible";
    document.getElementById("countBack").style.animation="waiting 1s infinite";
    var clock = setInterval(function(){
    counter--;
    document.getElementById("countBack").innerHTML=counter;
    if (counter<0) {
        clearInterval(clock);
        document.getElementById("changing").style.visibility="hidden";
        document.getElementById("countBack").style.removeProperty("animation");
        document.getElementById("main").style.display="flex";
        document.getElementById("player").style.visibility="visible";
    }
    },1000);
}

function pintarDisparos (tablero,e) {
    var cellId;
    
    for (let x=0; x<10; x++) {
        for (let y=0; y<10; y++) {
            if(e){
                cellId=String.fromCharCode(x+65)+y+e;
            } else {cellId=String.fromCharCode(x+65)+y}
            if (tablero[x][y]===-1) {
                document.getElementById(cellId).innerHTML=document.getElementById(cellId).innerHTML+"<img src='./img/tocado.png' class='disparo'>"
            } else if (tablero[x][y]===2) {
                document.getElementById(cellId).innerHTML=document.getElementById(cellId).innerHTML+"<img src='./img/agua.png' class='disparo'>"
            }
        }
    }
}
function rellenarCuadrículas () {
    var size,cellId,shipSrc;
    var enemy=(currentPlayer+1)%2;

    for (let x=0;x<10;x++){
        var y=0;
        size=0;
        while (y<10) {
            cellId=String.fromCharCode(x+65)+y;
            if(Math.abs(players[currentPlayer][x][y])===1){
                while ((Math.abs(players[currentPlayer][x][y])===1) && (y < 10)) {
                    size++;
                    y++;
                }
                if (size>0) {                    
                    shipSrc=getBarcoSrc(size);
                    document.getElementById(cellId).innerHTML="<img src='"+shipSrc+"' class='ships'>";
                }
                size=0;
            }
            y++;    
        }
    }
    pintarDisparos(players[currentPlayer]);
    pintarDisparos(players[enemy],"e");
}

function disparo (id) {
    var x=id.charCodeAt(0)-65;
    var y=parseInt(id[1]);
    var enemy=(currentPlayer+1)%2;
    var cellId, shipSrc;
    var tocadoSound = document.getElementById("tocado");
    var aguaSound = document.getElementById("agua");

    if (dispararOn) {
        if (players[enemy][x][y]===1) {
            players[enemy][x][y]=-1;
            tocadoSound.play();
            document.getElementById(id).innerHTML="<img src='./img/tocado.png' class='disparo'>";
            document.getElementById(id).removeAttribute("onclick");
            document.getElementById("msg").innerHTML="Tocado!!";
            cellId=comprobarHundido(x,y,players[enemy]);
            if (cellId) {
                document.getElementById("msg").innerHTML="Hundido!!";
                shipSrc=getBarcoSrc(cellId[1]);
                document.getElementById(cellId[0]).innerHTML="<img src='"+shipSrc+"' class='ships'>"+document.getElementById(cellId[0]).innerHTML;
                hundidos[currentPlayer]++;
                debugger
                if (hundidos[currentPlayer]===5) {
                    endGame();
                }
            }
        } else {
            players[enemy][x][y]=2;
            aguaSound.play();
            document.getElementById(id).innerHTML="<img src='./img/agua.png' class='disparo'>";
            document.getElementById("msg").innerHTML="Uups! Agua!";
            dispararOn=false;
            document.getElementById("buttons").innerHTML='<button id="nextTurn" onclick="nextTurn()" visibitlity="visible">Next Player</button>';
        }
    }
    console.table(players[0]);
    console.table(players[1]);
}

function borrar (clase) {
    var e = document.querySelectorAll(clase);

    for (let i=0; i<e.length; i++) {
        e[i].remove();
    }
}

function nextTurn () {
    
    dispararOn=true;

    borrar(".disparo");
    changePlayer();
    document.getElementById("nextTurn").style.visibility="hidden";
    borrar(".ships");
    rellenarCuadrículas();
    activarDisparos();
}

function activarDisparos () {
    var enemyCells=document.querySelectorAll(".enemy");

    for (let i=0; i<enemyCells.length; i++) {
        if (enemyCells[i].childElementCount === 0) {
            enemyCells[i].setAttribute("onclick", "disparo(this.id)");
        } else {
            enemyCells[i].removeAttribute("onclick");
        }
    }
}

function comprobarHundido (x,y,tablero) {
    var ini=y,fin=y;
    var endIni=false;
    var endFin=false;
    var cellId=["",0];

    if (y>0) { ini = y-1; }
    if (y<10) { fin = y; }

    while ((!endIni) || (!endFin)) {
        if ((Math.abs(tablero[x][ini])===1) && (ini>0)) {ini--;} else { endIni=true; }
        if ((Math.abs(tablero[x][fin])===1) && (fin<9)) {fin++;} else { endFin=true; }
    }
    if (Math.abs(tablero[x][ini])!=1) {ini++;}
    if (Math.abs(tablero[x][fin])!=1) {fin--;}

    cellId[0]=String.fromCharCode(x+65)+ini+"e";
    cellId[1]=(fin-ini)+1;

    for (let i=ini; i<=fin; i++){
        if(tablero[x][i]===1){ return false; }
    }
    
    return cellId;
}

function endGame () {

    var enemyCells=document.querySelectorAll(".enemy");

    for (let i=0; i<enemyCells.length; i++) {
        enemyCells[i].removeAttribute("onclick");
    }
    document.getElementById("nextTurn").style.visibility="hidden";
    document.getElementById("endGameMsg").innerHTML="PLAYER "+(currentPlayer+1)+", eres el Ganador!"
    document.getElementById("endGame").style.visibility="visible";
}