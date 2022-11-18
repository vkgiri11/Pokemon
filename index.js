const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = '#fff';
c.fillRect(0, 0, canvas.width, canvas.height);

const bgImage = new Image();
bgImage.src = './images/Pellet Town.png';

const playerImage = new Image();
playerImage.src = './images/playerDown.png';

class Sprite {
	constructor({ position, image }) {
		this.position = position;
		this.image = image;
	}

	draw() {
		c.drawImage(this.image, this.position.x, this.position.y);
	}
}

const backGround = new Sprite({ position: { x: -740, y: -590 }, image: bgImage });

const keys = {
	w: {
		pressed: false,
	},
	a: {
		pressed: false,
	},
	s: {
		pressed: false,
	},
	d: {
		pressed: false,
	},
};

function animate() {
	window.requestAnimationFrame(animate);

	backGround.draw();
	c.drawImage(
		playerImage,
		0,
		0,
		playerImage.width / 4,
		playerImage.height,
		canvas.width / 2 - playerImage.width / 8,
		canvas.height / 2 - playerImage.height / 4,
		playerImage.width / 4,
		playerImage.height
	);

	if (keys.w.pressed && lastKeyPressed === 'w') backGround.position.y += 3;
	else if (keys.a.pressed && lastKeyPressed === 'a') backGround.position.x += 3;
	else if (keys.s.pressed && lastKeyPressed === 's') backGround.position.y -= 3;
	else if (keys.d.pressed && lastKeyPressed === 'd') backGround.position.x -= 3;
}
animate();

let lastKeyPressed = '';
window.addEventListener('keydown', (e) => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = true;
			lastKeyPressed = 'w';
			break;
		case 'a':
			keys.a.pressed = true;
			lastKeyPressed = 'a';
			break;
		case 's':
			keys.s.pressed = true;
			lastKeyPressed = 's';
			break;
		case 'd':
			keys.d.pressed = true;
			lastKeyPressed = 'd';
			break;
	}
});

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'w':
			keys.w.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 's':
			keys.s.pressed = false;
			break;
		case 'd':
			keys.d.pressed = false;
			break;
	}
});
