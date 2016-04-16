/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = false;
var WIDTH = 1280;
var HEIGHT = 720;

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, '', {
  preload: preload,
  create: create,
  update: update
});

var stage;
var border;
var player;
var recepticle;
var target;

var editing = false;
var won = false;

function preload() { 
  game.load.image('water', 'sprites/water_molecule_small.png');
  game.load.image('recepticle', 'sprites/recepticle_small.png');
  game.load.image('background', 'sprites/background.png');
  
  game.load.audio('music', 'sfx/bg_music.ogg');
  game.load.audio('finish', 'sfx/finish.wav');
  
  game.load.physics('water-data', 'sprites/water_molecule_small.json');
  game.load.physics('recepticle-data', 'sprites/recepticle_small.json');
  
  Membrane.preload(game);
}

function create() {
  var level = LEVEL.ONE;
  var image = game.make.image(0, 0, 'background');
  var win = game.add.audio('finish');

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;

  stage = game.add.group();

  stage.add(image);

  Membrane.create(game, stage, level);

  // Add main 'player' molecule
  player = stage.create(level.start.x, level.start.y, 'water');
  game.physics.p2.enableBody(player, DEBUG);
  player.body.clearShapes();
  player.body.loadPolygon('water-data', 'water_molecule_small');

  // Add recepticle
  recepticle = stage.create(level.end.x, level.end.y, 'recepticle');
  game.physics.p2.enableBody(recepticle, DEBUG);
  recepticle.body.clearShapes();
  recepticle.body.loadPolygon('recepticle-data', 'recepticle_small');
  recepticle.body.static = true;

  // Add final target
  target = game.add.graphics(level.end.x - 10, level.end.y);
  game.physics.p2.enableBody(target, DEBUG);
  target.body.addCircle(10);
  target.body.static = true;

  // Add border for scaled mode
  border = game.make.graphics();
  border.lineStyle(4, 0xffffff, 1);
  border.drawRect(0, 0, WIDTH, HEIGHT);
  border.alpha = 0;

  stage.addChild(border);

  // Add music
  var music = game.add.audio('music');
  music.volume = 1.0;
  music.play();

  // Handle special collisions
  game.physics.p2.setPostBroadphaseCallback(function (a, b) {
    if (utils.equalPairs(a, b, player.body, target.body)) {
      if (!won) {
        win.play();
        won = true;
      }
      return false;
    }
    return true;
  }, this);
}

function update() {

  // Accelerate player to recepticle
  var factor = 60;
  var angle = Math.atan2(recepticle.y - player.y, recepticle.x - player.x);
  player.body.rotation = angle + game.math.degToRad(90);
  player.body.force.x = Math.cos(angle) * factor;
  player.body.force.y = Math.sin(angle) * factor;

  if (game.input.keyboard.isDown(Phaser.Keyboard.E)) {
    scale(0.75);
    editing = true;
  } else {
    scale(1);
    editing = false;
  }
}

function scale(s) {
  stage.scale.set(s);
  stage.position.set((1 - s) * WIDTH / 2, (1 - s) * HEIGHT / 2);
  if (s < 1) {
    border.alpha = 1;
  }
}