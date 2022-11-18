const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = '#fff';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './images/Pellet Town.png';

const playerImage = new Image();
playerImage.src = './images/playerDown.png';

image.onload = () => {
	c.drawImage(image, -740, -600);
	c.drawImage(
		playerImage,
		0,
		0,
		playerImage.width / 4,
		playerImage.height,
		canvas.width / 2 - playerImage.width / 8,
		canvas.height / 2 - playerImage.height / 4,
    playerImage.width / 4,
		playerImage.height,
	);
};
