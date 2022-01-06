import { createMachine, assign, sendParent } from 'xstate';
import * as THREE from 'three';

const rendererMachine = createMachine(
	{
		id: 'three-renderer',
		initial: 'init',
		context: {
			renderer: null,
		},
		states: {
			init: {
				on: {
					INIT: {
						target: 'idle',
						actions: 'initRenderer',
					},
				},
				exit: 'notifyDoneToParent',
			},
			idle: {
				on: {
					RERENDER: {
						actions: 'rerender',
					},
				},
			},
		},
	},
	{
		actions: {
			initRenderer: assign({
				renderer: (_, { canvas }) => {
					const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
					renderer.setPixelRatio(window.devicePixelRatio);
					renderer.setClearColor(0x000000, 0);
					// renderer.setSize(window.innerWidth, window.innerHeight);

					renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
					return renderer;
				},
			}),
			notifyDoneToParent: sendParent({ type: 'DONE', actor: 'Renderer' }),
			rerender: ({ renderer }, { camera, scene }) => {
				renderer.render(scene, camera);
			},
		},
	}
);

export default rendererMachine;
