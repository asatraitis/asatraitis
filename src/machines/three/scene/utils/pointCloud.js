import * as THREE from 'three';

export default function createPointCloud() {
	const particles = 1000;

	const geometry = new THREE.BufferGeometry();

	const positions = [];
	const colors = [];

	const color = new THREE.Color();

	const n = 200,
		n2 = n / 2; // particles spread

	for (let i = 0; i < particles; i++) {
		// positions

		const x = Math.random() * n - n2;
		const y = Math.random() * n - n2;
		const z = Math.random() * n - n2;

		positions.push(x, y, z);

		// colors

		const vx = x / n + 0.5;
		const vy = y / n + 0.5;
		const vz = z / n + 0.5;

		color.setRGB(vx, vy, vz);

		colors.push(color.r, color.g, color.b);
	}

	geometry.setAttribute(
		'position',
		new THREE.Float32BufferAttribute(positions, 3)
	);
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	var dotMaterial = new THREE.PointsMaterial({
		size: 0.3,
		vertexColors: true,
	});
	return new THREE.Points(geometry, dotMaterial);
}
