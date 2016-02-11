// Global variables
var board;
var selectedPiece;
var $selectedSquare;
var $antSquare;
var pieceColor;
var firstClick = true;
const dark = "dark", light = "light", empty = "empty"; 
var TURN = dark;
var darkPieces = 12;
var lightPieces = 12;
var jid_send;
var move_send = true; // controlar envío de movimiento
var can_move = true; // permitir movimientos

$(document).ready(function(){
	
	//Initializers
	initializeArrays();
    setUpBoard();
    setUpPieces();
    $('#turno').css('color', '#848484');

    // onclick function & game logic
    $('div.square_dark').bind("click", function() {
    	if (can_move) {
    		$selectedSquare = $(this);
		    var x = $selectedSquare.attr('data-positionX');
		    var y = $selectedSquare.attr('data-positionY');
		    console.log("selectedSquare:" +x + "," + y);

	    	if (firstClick) {
		    	if (isPiece(x, y)) {
		    		if (TURN == pieceColor) {
			    		selectedPiece = board[x][y];
			    		console.log("selectedPiece:" + selectedPiece.positionX + "," + selectedPiece.positionY);
			    		$antSquare = $selectedSquare;
			    		$selectedSquare.css('background-color','yellow');
			    		firstClick = false;
		    		}
		    	}
	    	}
	    	else { 
	    		if (isPiece(x, y)) { // Reeligir ficha
	    			if (TURN == pieceColor) {
	    				selectedPiece = board[x][y];
		    			$antSquare.css('background-color','black');
		    			$antSquare = $selectedSquare;
		    			$selectedSquare.css('background-color','yellow');
		    			firstClick = false;
	    			} else {
	    				pieceColor = TURN;
	    			}
	    		} else { // Mover ficha
		    		selectedPiece.move(x, y);	
	    		}
	    	}
		}
	});
});

function setUpBoard() {

	// Crear tablero y colores
    var color = true;
    
    for (i=0; i<8; i++) {

		color = !color;

		for (j=0; j<8; j++){
			if(color){
				$('div#board').append($('<div data-positionX='+i+' data-positionY='+j+'/>').addClass('square_dark'));
				color = false;
			} else{
				$('div#board').append($('<div data-positionX='+i+' data-positionY='+j+'/>').addClass('square_light'));	
				color = true;
			}
		}
	}
};

function setUpPieces() {
	
	// Añadir piezas light
	var pieces = 12;
    for (var i=0;i<pieces;i++) {
        $square = $(".square_dark:eq("+i+")");
        $square.css('background-image', 'url(images/piece_light.gif)');
       	$square.css('background-position', 'center');
       	$square.css('background-repeat', 'no-repeat');
    }

    // Añadir piezas dark
    var pieces = 32;
    for (var i=20;i<pieces;i++) {   
        $square = $(".square_dark:eq("+i+")");
        $square.css('background-image', 'url(images/piece_dark.gif)');
        $square.css('background-position', 'center');
        $square.css('background-repeat', 'no-repeat');
    }
}

function Piece(team, positionX, positionY) {
    this.team = team;
    this.positionX = positionX;
    this.positionY = positionY;
    this.move = function(x, y) {

    	if (isValidMove()) {
    		board[this.positionX][this.positionY] = empty;
    		board[x][y] = this;
    		var old_positionX = this.positionX;
    		var old_positionY = this.positionY;
    		this.positionX = x;
    		this.positionY = y;
 
    		if (this.team === 'light'){
    			$selectedSquare.css('background-image', 'url(images/piece_light.gif)');
    		} else {
    			$selectedSquare.css('background-image', 'url(images/piece_dark.gif)');
    		}
    		$selectedSquare.css('background-position', 'center');
    		$selectedSquare.css('background-repeat', 'no-repeat');
    		$antSquare.css('background-image', 'none');
    		$antSquare.css('background-color', 'black');

    		console.log(board);

    		if (move_send) { // enviar movimiento ficha
	    		var message = $msg({to: jid_send,
	    			"type": "chat"})
	    			.c('body').t('{'+old_positionX+old_positionY+this.positionX+this.positionY+'}').up()
	    			.c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
	    		Gab.connection.send(message);
	    		can_move = false;
    		}

    		if (TURN == dark) {
    			TURN = light;
    			pieceColor = light;
    			$('#turno').text("Rojas");
    			$('#turno').css('color', 'red');
    		} else if (TURN == light) {
    			TURN = dark;
    			pieceColor = dark;
    			$('#turno').text("Negras");
    			$('#turno').css('color', '#848484');
    		}

    		firstClick = true;
    	}
    };
};

function initializeArrays() {

	// Guarrada
	var piece1 = new Piece(light, 0, 1);
	var piece2 = new Piece(light, 0, 3);
	var piece3 = new Piece(light, 0, 5);
	var piece4 = new Piece(light, 0, 7);
	var piece5 = new Piece(light, 1, 0);
	var piece6 = new Piece(light, 1, 2);
	var piece7 = new Piece(light, 1, 4);
	var piece8 = new Piece(light, 1, 6);
	var piece9 = new Piece(light, 2, 1);
	var piece10 = new Piece(light, 2, 3);
	var piece11 = new Piece(light, 2, 5);
	var piece12 = new Piece(light, 2, 7);
	var piece13 = new Piece(dark, 5, 0);
	var piece14 = new Piece(dark, 5, 2);
	var piece15 = new Piece(dark, 5, 4);
	var piece16 = new Piece(dark, 5, 6);
	var piece17 = new Piece(dark, 6, 1);
	var piece18 = new Piece(dark, 6, 3);
	var piece19 = new Piece(dark, 6, 5);
	var piece20 = new Piece(dark, 6, 7);
	var piece21 = new Piece(dark, 7, 0);
	var piece22 = new Piece(dark, 7, 2);
	var piece23 = new Piece(dark, 7, 4);
	var piece24 = new Piece(dark, 7, 6);

	board = [
		[empty, piece1, empty, piece2, empty, piece3, empty, piece4],
		[piece5, empty, piece6, empty, piece7, empty, piece8, empty],
		[empty, piece9, empty, piece10, empty, piece11, empty, piece12],
		[empty, empty, empty, empty, empty, empty, empty, empty],
		[empty, empty, empty, empty, empty, empty, empty, empty],
		[piece13, empty, piece14, empty, piece15, empty, piece16, empty],
		[empty, piece17, empty, piece18, empty, piece19, empty, piece20],
		[piece21, empty, piece22, empty, piece23, empty, piece24, empty],
	];
}

function isPiece(x, y) {
	var piece = false;
	if (board[x][y] != empty) {
	 	pieceColor = board[x][y].team;
	 	console.log(pieceColor + " clicked");
		piece=true;
	}

	return piece;
}

function isValidMove() {
	var move = false;
	var x = $selectedSquare.attr("data-positionX");
	var y = $selectedSquare.attr("data-positionY");

	if (selectedPiece.team === dark) {
		// Forward
		if (x < selectedPiece.positionX) {
			// Diagonal 1 row
			if (((parseInt(selectedPiece.positionY) - 1) == y) ||
				(parseInt(selectedPiece.positionY) + 1) == y) {
				console.log("move 1 row");
				move = true;
			}

			// Diagonal 2 row
			if (((parseInt(selectedPiece.positionY) - 2) == y) ||
					(parseInt(selectedPiece.positionY) + 2) == y) {
					if (isRivalPiece()) {
						console.log("move 2 row");
						move = true;
					}
			}
		}
	}


	if (selectedPiece.team === light) {
		// Forward
		if (x > selectedPiece.positionX) {
			// Diagonal 1 row
			if (((parseInt(selectedPiece.positionY) - 1) == y) ||
				(parseInt(selectedPiece.positionY) + 1) == y) {
				console.log("move 1 row");
				move = true;
			}

			// Diagonal 2 row
			if (((parseInt(selectedPiece.positionY) - 2) == y) ||
				(parseInt(selectedPiece.positionY) + 2) == y) {
				if (isRivalPiece()) {
					console.log("move 2 row");
					move = true;
				}
			}
		}
	}
	

	return move;
}

// Comprueba si hay ficha rival en diagonal y la mata si la hay
function isRivalPiece() {
	var isRival = false;

	var y_minus = parseInt(selectedPiece.positionY) - 1;
	var y_more = parseInt(selectedPiece.positionY) + 1;

	if (TURN == dark) {
		var x = parseInt(selectedPiece.positionX) - 1;

		if ($selectedSquare.attr('data-positionY') < parseInt(selectedPiece.positionY)) {
			if (board[x][y_minus] != empty) {
				if (board[x][y_minus].team != TURN) {
					board[x][y_minus] = empty;
					$('div.square_dark[data-positionX="'+x+'"][data-positionY="'+y_minus+'"]')
						.css('background-image', 'none');
					lightPieces--;
					$('#rojas').text(lightPieces);
					checkForWinner();
					isRival = true;
					console.log("isRival");
					return isRival;
				}	
			}
		}

		if ($selectedSquare.attr('data-positionY') > parseInt(selectedPiece.positionY)) {
			if (board[x][y_more] != empty) {
				if (board[x][y_more].team != TURN) {
					board[x][y_more] = empty;
					$('div.square_dark[data-positionX="'+x+'"][data-positionY="'+y_more+'"]')
						.css('background-image', 'none');
					lightPieces--;
					$('#rojas').text(lightPieces);
					checkForWinner();
					isRival = true;
					console.log("isRival");
					return isRival;
				}
			}
		}
	}

	if (TURN == light) {
		var x = parseInt(selectedPiece.positionX) + 1;

		if ($selectedSquare.attr('data-positionY') < parseInt(selectedPiece.positionY)) {
			if (board[x][y_minus] != empty) {
				if (board[x][y_minus].team != TURN) {
					board[x][y_minus] = empty;
					$('div.square_dark[data-positionX="'+x+'"][data-positionY="'+y_minus+'"]')
						.css('background-image', 'none');
					darkPieces--;
					$('#negras').text(darkPieces);
					checkForWinner(); 
					isRival = true;
					console.log("isRival");
					return isRival;
				}
			}
		}
		
		if ($selectedSquare.attr('data-positionY') > parseInt(selectedPiece.positionY)) {
			if (board[x][y_more] != empty) {
				if (board[x][y_more].team != TURN) {
					board[x][y_more] = empty;
					$('div.square_dark[data-positionX="'+x+'"][data-positionY="'+y_more+'"]')
						.css('background-image', 'none');
					darkPieces--;
					$('#negras').text(darkPieces);
					checkForWinner();  
					isRival = true;
					console.log("isRival");
					return isRival;
				}
			}
		}	
	}

	return isRival;
}

function checkForWinner() {
	if (darkPieces == 0) {
		alert("Piezas rojas GANAN!");
		location.reload();
	}

	if (lightPieces == 0) {
		alert("Piezas negras GANAN!");
		location.reload();
	}
}