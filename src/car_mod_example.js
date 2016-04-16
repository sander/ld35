/// <reference path="../third-party/phaser.d.ts"/>

var DEBUG = true;

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
  preload: preload, 
  create: create,
  update: update, 
  render: render 
});

function preload(){
	//game.load.image('point', 'sprites/black1.png')
  game.load.image('smile', 'img/smile.png');
}

var poly;
var graphics;

var vertices = [
  [-100, -100],
  [-100, 100],
  [100, 100],
  [100, -100]
  /*
  [0, 0],
  [350, 100],
  [375, 200],
  [225, 325],
  [150, 200]
  */
];

function points(vertices) {
  return vertices.reduce(function(a, b) {
    return a.concat(b);
  }, []);
}

function addVertex(v) {
  var sprite = graphics.addChild(game.make.sprite(v[0]/*-375/2+48*/, v[1]/*-325/2+48*/, 'point'));
  
  function onDragUpdate(sprite, pointer, dragX, dragY, snapPoint) {
    v[0] = sprite.x;
    v[1] = sprite.y;
    poly = new Phaser.Polygon(points(vertices));
    setPolygon();
  }
  
  sprite.anchor.set(0.5);
  sprite.inputEnabled = true;
  sprite.input.enableDrag();
  sprite.events.onDragUpdate.add(onDragUpdate);
}

function setPolygon() {
  graphics.body.clearShapes();
  graphics.body.addPolygon({}, points(vertices));
}

function drawPolygon() {
  graphics.clear();
  if (poly.contains(game.input.x, game.input.y)) {
    graphics.beginFill(0xFF3300);
  } else {
    graphics.beginFill(0xFF33ff);
  }
  var translated = poly.points.map(function(p) {
    return p;
    return p.clone().subtract(
      graphics.body.x, //- graphics.position.x, 
      graphics.body.y //- graphics.position.y
    );
  });
  graphics.drawPolygon(translated);
  graphics.endFill();
}

function create() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  
  game.physics.p2.restitution = 0.9;
  game.physics.p2.gravity.y = 500;
  
  var balls = game.add.physicsGroup(Phaser.Physics.P2JS);
  
  //drawPolygon();
  /*
  var translated = poly.points.map(function(p) {
    return p.clone().subtract(graphics.body.x - graphics.position.x, graphics.body.y - graphics.position.y);
  });
  */
  //graphics.drawPolygon(translated);
  //graphics.endFill();
  /*
  for (var i = 0; i < 20; i++) {
    var ball = balls.create(Math.random() * 800, Math.random() * 600, 'smile');
    ball.body.setCircle(16);
  }
  */
  
   
  poly = new Phaser.Polygon(points(vertices));

  graphics = game.add.graphics(400, 400);
  game.physics.p2.enable(graphics, DEBUG);
  //graphics.body.offset.x = 200;
  graphics.body.static = true;
  setPolygon();

  drawPolygon();
  
  vertices.forEach(addVertex);
  

  
  //graphics.anchor.set(0);

  
}

function update() {
  drawPolygon();
  /*
  graphics.clear();

  if (poly.contains(game.input.x, game.input.y)) {
    graphics.beginFill(0xFF3300);
  } else {
    graphics.beginFill(0xFF33ff);
  }

  graphics.drawPolygon(poly.points);
  graphics.endFill();
  
  */

  //setPolygon();
}

function render() {
  game.debug.text(game.input.x + ' x ' + game.input.y, 32, 32);
	game.context.fillStyle = 'rgb(255,255,0)';
  vertices.forEach(function(v) {
    //game.context.fillRect(v[0], v[1], 4, 4);
  });
}