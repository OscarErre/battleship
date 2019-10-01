var player1 = {
    name : "",
    tablero : new Array(10).fill(0).map(() => new Array(10).fill(0))
}

var player2 = {
    name : "",
    tablero : new Array(10).fill(0).map(() => new Array(10).fill(0))
}

var barcos = [
    {size:5, status:0},
    {size:4, status:0},
    {size:3, status:0},
    {size:3, status:0},
    {size:2, status:0}];

console.table(player1.tablero);

function posicionValida (x,y,size,tablero) {
    var posValida=true;
    
    for (i=(y-1); i<=(size+2); i++) {
        if ((i>=0)&&(i<=10)) {
            if (tablero[x][i]!=0){
                posValida=false;
            }
        }
    }
    return posValida;    
}

function comprovarPosicion (x,y,size,tablero) {
    var posValida=true;
    posValida=posicionValida(x,y,size,tablero);
    if (posValida){
        if (x===0){
            posValida=posicionValida(x+1,y,size,tablero);
        } else if (x===9) {
            posValida=posicionValida(x-1,y,size,tablero);
        } else {
            posValida=posicionValida(x+1,y,size,tablero);
            if (posValida) {
                posValida=posicionValida(x-1,y,size,tablero);
            }
        }
    }
    return posValida;
}

function colocarBarco (x,y,size,tablero) {
    if (comprovarPosicion(x,y,size,tablero)) {
        tablero[x].fill (1,y,y+size);
    } else alert("El Barco "+size+", no puede ir en la fila "+x+" columna "+y+". Comprueba si hay barcos alrededor.");
    
}

function getBarco (x,y,tablero) {
    var ini, fin;

    if (y>0){
        for (let i=y; i>0; i--){
            if (tablero[x][i]!=0){
                ini=i;
            } else break;
        }
    } else ini=y;
    for (let i=y; i<10;i++){
        if (tablero[x][i]!=0){
            fin=i;
        } else break;
    }
    return {row: x, ini: ini, fin: fin, size: ((fin-ini)+1)};
}

function comprovarHundido (x,y,tablero) {
    let barco = getBarco(x,y,tablero);
    let hundido =true;

    for (let i=barco.ini; i<=barco.fin; i++) {
        if (tablero[barco.row][i] === 1) {
            hundido=false;
        }
    }

    if (hundido) {
        switch (barco.size) {
            case 5 : barcos[0].status=1;
                    return true;
            case 4 : barcos[1].status=1;
                    return true;
            case 3 : if (barcos[2].status===0) {barcos[2].status===1} else {barcos[3].status===1}
                    return true;
            case 2 : barcos[4].status=1;
                    return true;
        }
    }
}

function disparo (x,y,tablero) {
    if (tablero[x][y]===2){
        alert("Ya has disparado aquí antes");
    } else {
        if (tablero[x][y]===1) {
            tablero[x][y]=-1;
            console.table(tablero);
            if (comprovarHundido(x,y,tablero)){
                alert("HUNDIDO!");
            }
        } else {
            tablero[x][y]=2; 
            alert ("AGUA!");
        }
    }
}




colocarBarco(4,5,barcos[3].size,player1.tablero);
colocarBarco(2,2,barcos[0].size,player1.tablero);
colocarBarco(6,4,barcos[1].size,player1.tablero);
colocarBarco(8,7,barcos[2].size,player1.tablero);
colocarBarco(3,5,barcos[4].size,player1.tablero);
console.table(player1.tablero);
disparo(4,5,player1.tablero);
disparo(4,6,player1.tablero);
disparo(2,3,player1.tablero);
disparo(8,7,player1.tablero);
disparo(4,7,player1.tablero);
disparo(5,5,player1.tablero);
console.table(player1.tablero);