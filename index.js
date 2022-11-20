const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
	collisionsMap.push(collisions.slice(i, i + 70));
}

class Boundary {
	static width = 48;
	static height = 48;
	constructor({ position }) {
		this.position = position;
		this.width = 48;
		this.height = 48;
	}

	draw() {
		c.fillStyle = 'rgba(255, 0, 0, 0)';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}
}

const boundaries = [];
const offset = {
	x: -740,
	y: -600,
};

collisionsMap.forEach((row, row_index) => {
	row.forEach((col, col_index) => {
		if (col === 1025) {
			boundaries.push(
				new Boundary({
					position: { x: col_index * Boundary.width + offset.x, y: row_index * Boundary.height + offset.y },
				})
			);
		}
	});
});

const bgImage = new Image();
bgImage.src = './images/Pellet Town.png';

const playerImage = new Image();
playerImage.src = './images/playerDown.png';

class Sprite {
	constructor({ position, image, frames = { max: 1 } }) {
		this.position = position;
		this.image = image;
		this.frames = frames;

		this.image.onload = () => {
			this.width = this.image.width / this.frames.max;
			this.height = this.image.height;
		};
	}

	draw() {
		c.drawImage(
			this.image,
			0,
			0,
			this.image.width / this.frames.max,
			this.image.height,
			this.position.x,
			this.position.y,
			this.image.width / this.frames.max,
			this.image.height
		);
	}
}

const backGround = new Sprite({ position: { x: offset.x, y: offset.y }, image: bgImage });
const player = new Sprite({
	position: { x: canvas.width / 2 - 192 / 8, y: canvas.height / 2 - 68 / 4 },
	image: playerImage,
	frames: { max: 4 },
});

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

const movables = [backGround, ...boundaries];

function detectCollisions({ rectangle1, rectangle2 }) {
	return (
		rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
		rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
		rectangle1.position.y <= rectangle2.position.y + rectangle2.height
	);
}

function animate() {
	window.requestAnimationFrame(animate);

	backGround.draw();
	boundaries.forEach((boundary) => {
		boundary.draw();
	});
	player.draw();

	let canMove = true;
	if (keys.w.pressed && lastKeyPressed === 'w') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				detectCollisions({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x,
							y: boundary.position.y + 3,
						},
					},
				})
			) {
				canMove = false;
				break;
			}
		}

		canMove && movables.forEach((movable) => (movable.position.y += 3));
	} else if (keys.a.pressed && lastKeyPressed === 'a') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				detectCollisions({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x + 3,
							y: boundary.position.y,
						},
					},
				})
			) {
				canMove = false;
				break;
			}
		}

		canMove && movables.forEach((movable) => (movable.position.x += 3));
	} else if (keys.s.pressed && lastKeyPressed === 's') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				detectCollisions({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x,
							y: boundary.position.y - 3,
						},
					},
				})
			) {
				canMove = false;
				break;
			}
		}

		canMove && movables.forEach((movable) => (movable.position.y -= 3));
	} else if (keys.d.pressed && lastKeyPressed === 'd') {
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i];
			if (
				detectCollisions({
					rectangle1: player,
					rectangle2: {
						...boundary,
						position: {
							x: boundary.position.x - 3,
							y: boundary.position.y,
						},
					},
				})
			) {
				canMove = false;
				break;
			}
		}

		canMove && movables.forEach((movable) => (movable.position.x -= 3));
	}
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
