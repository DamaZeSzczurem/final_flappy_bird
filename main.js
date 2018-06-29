var mainState = {

	preload: function() {

		game.load.image('bird', 'bird.png'); 
		game.load.image('pipe', 'pipe.png');
		//game.load.image('cloud','assets/chmura.png')

	//tutaj obrazki	
	},

	create: function() {
		game.stage.backgroundColor = "#71c5cf";

		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.bird = game.add.sprite(100,245,'bird');

		game.physics.arcade.enable(this.bird);
		
		this.bird.body.gravity.y = 1000;

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		spaceKey.onDown.add(this.jump, this);
		//steup gry, wyświetlanie się sprajtów itp.

		this.pipes = game.add.group(); 
		//this.clouds = game.add.group();
		
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this); 

		this.score= 0;
		this.labelScore = game.add.text(20,20);
	},

	jump: function(){
		this.bird.body.velocity.y = -350;
	},

	restartGame: function() {
		game.state.start('main');
	},


	update: function() {
		if(this.bird.y <0 || this.bird.y > 490){
		this.restartGame();
		}

		game.physics.arcade.overlap(this.bird,this.pipes, this.restartGame, null, this);


		//zmiana co klatkę gry*/
	},
	/*addOneCloud: function(x, y){
		var cloud = game.add.sprite(x, y, 'pipe');
	},
	addCloud:function(){
		var placeCloud = Math.random(0,500);
		
	},
*/
	addOnePipe: function(x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe 
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200; 

    // Automatically kill the pipe when it's no longer visible 
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
	},

	addRowOfPipes: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes 
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 8; i++){
        if (i != hole && i != hole + 1) {
            this.addOnePipe(400, i * 60 + 20);   
       		 }
    	}

    this.score += 1;
    this.labelScore.text = this.score;

	},
};



var game = new Phaser.Game(450, 500); //tworzy obszar gry
game.state.add('main', mainState); //

game.state.start('main');
