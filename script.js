//HTML ELEMENTS
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

//Game settings 
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
}
//Game variables
let snake;
let score;
let direction;
let boardSquares; 
let emptySquares;
let moveInterval;

const drawSnake = () => {
    //Por cada valor que contiene el Array snake, se pintan los cuadros correspondientes del tipo snakeSquare
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}


//Rellenar cada Cuadrado  
//@params
//square: posicion del cuadro 
//type: tipo de cuadrado (emptySquare, snakeSquarem foodSquare )
const drawSquare = (square, type) => {
    //separamos la row de la colum definidas en el square 
    const [row, column] = square.split('');
    //se busca el cuadro seleccionado en el tablero para definir de que tipo es
    boardSquares[row][column] = squareTypes[type];
    //se busca el cuadrado en el HTML por medio de su id/posicion
    const squareElement = document.getElementById(square);
    //Se setea la clase de square para definirle su tipo 
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        //se le agrega el square obtenido a la Array emptySquares si este esta vacio
        emptySquares.push(square);
    } else {
        //Si emptySquares ya contiene tiene el elemento
        if (emptySquares.indexOf(square !== -1)) {
            //Saca el square seleccionado del Array emptySquares porque ya no esta vacio
            emptySquares.splice(emptySquares.indexOf(square), 1); 
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length -1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');


    if (newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direction == 'ArrowRight' && column == 0) ||
        (direction == 'ArrowLeft' && column == 9 || 
        boardSquare[row][column] === squareTypes.snakeSquare)) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = 'block'
    clearInterval(moveInterval)
    startButton.disabled = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown': 
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

//Se le da el valor 
const updateScore = () => {
    scoreBoard.innerHTML = score;
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)]
    drawSquare(randomEmptySquare, 'foodSquare')
}

const createBoard = () => {
    //Itera cada espacio de la primera array para contar sus filas
    boardSquares.forEach((row, rowIndex) => {
        //Itera cada espacio del array anidado para contar sus columnas
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);

        })
    });
}

const setGame = () => {
    snake = ['00','01','02','03'];
    score = snake.length;
    direction = 'ArrowRight';
    //Genera un Array dentro de otro Array para la generacion del tablero 
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = ` `;
    emptySquares = [];
    createBoard();
}

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    //Nos permite llamar la funcion MoveSnake cada cierto tiempo definido (En este caso cada 100 ml)
    moveInterval = setInterval(() => moveSnake(), gameSpeed )
}    

startButton.addEventListener('click',  startGame)