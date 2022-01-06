import { createMachine, assign, sendParent, actions } from 'xstate';
import * as THREE from 'three';

const { respond } = actions;
const MOVE_BY = 0.001;

const cameraMachine = createMachine(
	{
		id: 'three-camera',
		initial: 'init',
		context: {
			camera: null,
			x: 0,
		},
		states: {
			init: {
				always: {
					target: 'idle',
					actions: 'initCamera',
				},
				exit: 'notifyDoneToParent',
			},
			idle: {
				on: {
					GET_CAMERA: {
						actions: 'respondWithCamera',
					},
					MOUSE_MOVE: {
						actions: ['handleMouseMove', 'requestRerender'],
					},
				},
			},
		},
	},
	{
		actions: {
			initCamera: assign({
				camera: () => {
					const camera = new THREE.PerspectiveCamera(
						75,
						window.innerWidth / window.innerHeight,
						0.1,
						1000
					);
					camera.position.z = 60;
					return camera;
				},
			}),
			notifyDoneToParent: sendParent({ type: 'DONE', actor: 'Camera' }),
			respondWithCamera: respond(({ camera }) => ({
				type: 'CAMERA_REF',
				camera,
			})),
			handleMouseMove: assign((c, { x }) => {
				if (c.x < x) {
					c.camera.position.y -= MOVE_BY;
					c.camera.position.x -= MOVE_BY;
					c.camera.position.y -= MOVE_BY;
					c.camera.rotation.y -= MOVE_BY * 0.1;
				} else if (c.x > x) {
					c.camera.position.y += MOVE_BY;
					c.camera.position.x += MOVE_BY;
					c.camera.position.z += MOVE_BY;
					c.camera.rotation.y += MOVE_BY * 0.1;
				}
				return { ...c, x };
			}),
			requestRerender: sendParent('REQ_RERENDER'),
		},
	}
);

export default cameraMachine;
