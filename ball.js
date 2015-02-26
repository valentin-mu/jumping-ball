function Game(){
    var self = this;
    // game constants
    this.gameLevel = 2;
    this.score = 0;

    // blocks
    this.container = document.getElementsByClassName('container')[0];
    this.ball = this.container.getElementsByClassName('ball')[0];
    this.score = this.container.getElementsByClassName('score')[0];
    this.badBlocks = [];
    
    //sizes
    this.containerHeight = parseFloat(window.getComputedStyle(self.container).height);
    this.containerWidth = parseFloat(window.getComputedStyle(self.container).width);
    this.ballSize = parseFloat(window.getComputedStyle(self.ball).height);
    this.blockSize = 15;
    this.ball.style.right = 0.5*(this.containerWidth - this.ballSize) + 'px';

    // init game vars
    this.accel = 980;
    this.framestep = 10; // ms
    this.time = 0;
    this.blockSpawned = 0;
    this.speed = 0;
    this.jumpImpulse = 200;

    
    // jump on space
    window.onkeydown = function(key){
	if (key.keyCode == 32){
	    self.speed = -self.jumpImpulse;
	}
    };
    this.gameOver = function(){
	console.log('game over!');
	alert('game over!');
	clearInterval(self.gameLoop);
	self.ball.remove();
	self.ball= null;
    };
    // create bad block and append it to badBlocks array
    this.spawnBadBlock = function(){
	var block = document.createElement('div');
	block.className = 'bad-block';
	block.style.height = self.blockSize + 'px';
	block.style.width = self.blockSize + 'px';
	block.style.top = Math.random()*(self.containerHeight - parseInt(block.style.height)) + 'px'; 
	block.style.right = '0';
	self.container.appendChild(block);
	self.badBlocks.push(block);
	self.blockSpawned = self.time;
    };
    // move all bad blocks in loop, checking collision with each one
    this.moveBadBlocks = function(){
	for (var i=0; i<self.badBlocks.length; i++){
	    var block = self.badBlocks[i];
	    var right = parseFloat(window.getComputedStyle(block).right);

	    self.ballCollision(self.badBlocks[i]);

	    if (right > (self.containerWidth - parseInt(block.style.width) )){
		block.remove();
		self.badBlocks.shift(self.badBlocks[i]);
	    }
	    right += 1;
	    block.style.right = right + 'px';
	}
    };
    
    this.ballCollision = function(block){
	var ballY = parseFloat(window.getComputedStyle(self.ball).top) - 0.5*self.ballSize ;
	var ballX = parseFloat(window.getComputedStyle(self.ball).right) - 0.5*self.ballSize;

	var blockY = parseFloat(window.getComputedStyle(block).top) - 0.5*self.blockSize;
	var blockX = parseFloat(window.getComputedStyle(block).right) - 0.5*self.blockSize;
	var minDistance = 0.5*(self.blockSize + self.ballSize);
	var distanceY = Math.abs(ballY - blockY);
	var distanceX = Math.abs(ballX - blockX);

	if (distanceY <= minDistance && distanceX <= minDistance) {
	    self.gameOver();
	}

    };

    this.renderBall = function(){
	var ballPosition = parseFloat(window.getComputedStyle(self.ball).top) || 0;
	var timeInterval = self.framestep / 1000;
	self.speed += timeInterval*self.accel;
	ballPosition += self.speed * timeInterval;
	self.ball.style['background-color'] = '#'+Math.abs(self.speed).toString(16);
	if ( ballPosition >= parseInt(self.containerHeight - self.ballSize) ) {
	    // console.log('out!');
	    self.speed = -self.speed;
	    ballPosition = self.containerHeight - self.ballSize;
	}
	if ( ballPosition < 0 ) {
	    self.gameOver();
	}

	self.ball.style.top = ballPosition + 'px';
    };

    this.gameLoop = setInterval(function(){
	var timeInterval = self.framestep / 1000;
	self.time += timeInterval;

	if (self.time - self.blockSpawned >= self.gameLevel){
	    self.spawnBadBlock();
	}
	self.moveBadBlocks();
	self.renderBall();
	self.score.innerHTML = self.time.toFixed();
    }, self.framestep);

}

var game = new Game();
