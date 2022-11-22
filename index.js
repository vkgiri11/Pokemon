const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
	collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
	battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const boundaries = [];
const battleZones = [];

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

battleZonesMap.forEach((row, row_index) => {
	row.forEach((col, col_index) => {
		if (col === 1025) {
			battleZones.push(
				new Boundary({
					position: { x: col_index * Boundary.width + offset.x, y: row_index * Boundary.height + offset.y },
				})
			);
		}
	});
});

const bgImage = new Image();
bgImage.src = './images/Pellet-Town.png';

const foregroundImage = new Image();
foregroundImage.src = './images/Foreground-Objects.png';

const playerDownImage = new Image();
playerDownImage.src = './images/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './images/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './images/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './images/playerRight.png';

const player = new Sprite({
	position: { x: canvas.width / 2 - 192 / 8, y: canvas.height / 2 - 68 / 4 },
	image: playerDownImage,
	frames: { max: 4 },
	sprites: {
		up: playerUpImage,
		down: playerDownImage,
		left: playerLeftImage,
		right: playerRightImage,
	},
});

const backGround = new Sprite({ position: { x: offset.x, y: offset.y }, image: bgImage });

const foreground = new Sprite({ position: { x: offset.x, y: offset.y }, image: foregroundImage });

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

const movables = [backGround, ...boundaries, foreground, ...battleZones];

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
	boundaries.forEach((boundary) => boundary.draw());
	battleZones.forEach((battleZone) => battleZone.draw());
	player.draw();
	foreground.draw();

	if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
		for (let i = 0; i < battleZones.length; i++) {
			const battleZone = battleZones[i];
			const overlappingArea =
				(Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
					Math.max(player.position.x, battleZone.position.x)) *
				(Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
					Math.max(player.position.y, battleZone.position.y));

			if (
				detectCollisions({ rectangle1: player, rectangle2: battleZone }) &&
				overlappingArea > (player.width * player.height) / 2 &&
				Math.random() < 0.03
			) {
				console.log('Start Fight');
				break;
			}
		}
	}

	let canMove = true;
	player.isMoving = false;

	if (keys.w.pressed && lastKeyPressed === 'w') {
		player.isMoving = true;
		player.image = player.sprites.up;

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
		player.isMoving = true;
		player.image = player.sprites.left;

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
		player.isMoving = true;
		player.image = player.sprites.down;

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
			player.isMoving = true;
			player.image = player.sprites.right;

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
