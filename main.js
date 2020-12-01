var game = new Phaser.Game(450, 500);
//add some fonts from google
WebFontConfig = {
    google: {
      families: ['Press Start 2P']
    }

};

var startState = {
	preload: function(){
		game.load.image('cloud','assets/cloud.png');
		game.load.image('bulding','assets/bulding.png');
		game.load.image('tree','assets/tree.png');
		game.load.image('ground','assets/ground.png');
		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	},

	create: function(){
		game.stage.backgroundColor = "#71c5cf";
		game.add.sprite(0,500-15,'ground');
		game.add.sprite(35, 35, 'cloud');
		game.add.sprite(50, 375, 'tree');
		game.add.sprite(300, 95, 'bulding');
		//add text information how to start game
		game.time.events.add(Phaser.Timer.SECOND*0.5,
			function (){
				text = game.add.text( 80,  250, "Bird in the city\nPress Space To Start");
				text.font = 'Press Start 2P';
				text.fontSize = 16;
				text.align = 'center';}
			, this);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
	},

	update: function() {
		//game start
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		game.state.start('main')
		}

	},
};

var score;

var mainState = {


	preload: function() {
			//loading assets
			game.load.image('bird','assets/bird.png');
			game.load.image('pipe', 'assets/pipe.png');
			game.load.image('cloud','assets/cloud.png');
			game.load.image('bulding','assets/bulding.png');
			game.load.image('tree','assets/tree.png');
			game.load.image('ground','assets/ground.png');
			game.load.audio('jumpSound', 'assets/jump.wav');

	},

	create: function() {

		//background
			game.stage.backgroundColor = "#71c5cf";
			game.add.sprite(0,500-15,'ground');
		  this.background = game.add.group();
			this.randomCloud = game.time.events.loop(Phaser.Timer.SECOND*5*Math.random(), this.addCloud, this);
			this.randomBulding = game.time.events.loop(Phaser.Timer.SECOND*50*Math.random(), this.addBulding, this);
			this.randomTree = game.time.events.loop(Phaser.Timer.SECOND*25*Math.random(), this.addTree, this);
		//physics for the bird
			game.physics.startSystem(Phaser.Physics.ARCADE);
			this.bird = game.add.sprite(100,245,'bird');
			game.physics.arcade.enable(this.bird);
			this.bird.body.gravity.y = 1000;

		//jumping
			this.jumpSound = game.add.audio('jumpSound');
			this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			this.spaceKey.onDown.add(this.jump, this);

		//obstacles
			this.pipes = game.add.group();
			this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

		//score
			score= 0;
			this.labelScore = game.add.text(20,20);


	},

	jump: function(){
		this.jumpSound.play();
		this.bird.body.velocity.y = -350;
	},

	restartGame: function() {
		game.state.start('restart');
	},

	update: function() {

		//game restart
		if(this.bird.y <0 || this.bird.y > 490){
		this.restartGame();
		}

		//hit obstacle
		game.physics.arcade.overlap(this.bird,this.pipes, this.restartGame, null, this);

	},

//The mighty background team, adding some stuff in the background
addCloud: function(){
	var cloud = game.add.sprite(400, Math.random() * 250, 'cloud');
	let scale = 0.5 + Math.random();
	cloud.scale.setTo(scale, scale);
	this.background.add(cloud);
	game.physics.arcade.enable(cloud);
	cloud.body.velocity.x= -200;
	cloud.checkWorldBounds = true;
	cloud.outOfBoundsKill = true;
},

addTree: function(){
	let scale = 1.5 + Math.random();
	var tree = game.add.sprite(400, 490-(123*scale), 'tree');
	tree.scale.setTo(scale, scale);
	this.background.add(tree);
	game.physics.arcade.enable(tree);
	tree.body.velocity.x= -200;
	tree.checkWorldBounds = true;
	tree.outOfBoundsKill = true;
},

addBulding: function(){
	var bulding = game.add.sprite(400, 90, 'bulding');
	this.background.add(bulding);
	game.physics.arcade.enable(bulding);
	bulding.body.velocity.x= -200;
	bulding.checkWorldBounds = true;
	bulding.outOfBoundsKill = true;
},

//Add obstacles, move it left, kill when out of the world
addOnePipe: function(x, y) {
    var pipe = game.add.sprite(x, y, 'pipe');
    this.pipes.add(pipe);
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
	},

addRowOfPipes: function() {

    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes
    // With one big hole at position 'hole', 'hole -1' and 'hole + 1'
    for (var i = 0; i < 10; i++){
        if (i != hole && i != hole - 1 && i != hole + 1 ) {
            this.addOnePipe(400, i * 50);
       		 }
    	}
		//score update
    score += 1;
    this.labelScore.text = score;
	},
};


var restartState = {
	preload: function(){
		game.load.image('dead','assets/deadbird.png');
	},

	create: function(){
		game.stage.backgroundColor = "#71c5cf";
		game.add.sprite(225-32,350,'dead');

		//add text information how to restart game
		game.time.events.add(Phaser.Timer.SECOND*0.5,
			function (){
				text = game.add.text( 45,  250, "Your Score Is: " + score +"\nPress Space To Restart");
				text.font = 'Press Start 2P';
				text.fontSize = 16;
				text.align = 'center';}
			, this);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
	},

	update: function() {
		//game start
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		game.state.start('main')
		}

	},
}

//create and start game

game.state.add('start', startState);
game.state.add('main', mainState);
game.state.add('restart', restartState);
game.state.start('start');
