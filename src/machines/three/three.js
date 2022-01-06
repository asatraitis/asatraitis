import { createMachine, assign, spawn, send, actions } from 'xstate';
import sceneMachine from './scene/scene';
import cameraMachine from './camera/camera';
import rendererMachine from './renderer/renderer';
import rerenderQueueMachine from './rerenderQueue';

const { stop } = actions;

const actorInits = (cb, onReceive) => {
	const actorsReady = [];
	onReceive((e) => {
		if (e.type === 'DONE' && e.actor) {
			actorsReady.push(e.actor);
			if (actorsReady.length === 3) {
				cb('ACTORS_READY');
			}
		}
	});
};

const mouseMoveActor = (cb) => {
	const handleMouseMove = ({ x }) => {
		cb({ type: 'MOUSE_MOVE', x });
	};
	window.addEventListener('mousemove', handleMouseMove);

	return () => {
		window.removeEventListener('mousemove', handleMouseMove);
	};
};

const threeMachine = createMachine(
	{
		id: 'three',
		initial: 'idle',
		context: {
			canvas: null,
			sceneActor: null,
			cameraActor: null,
			rendererActor: null,
			initActor: null,
			mouseMoveActor: null,
		},
		states: {
			idle: {
				on: {
					INIT: {
						actions: 'setCanvasRef',
						target: 'init',
					},
				},
				exit: [
					'spawnInitActor',
					'initScene',
					'initCamera',
					'initRenderer',
					'sendCanvasRef',
				],
			},
			init: {
				on: {
					DONE: {
						actions: 'actorDone',
					},
					ACTORS_READY: {
						target: 'ready',
						actions: ['stopInitActor', 'spawnMouseMoveActor'],
					},
				},
				exit: ['requestCamera', 'requestScene'],
			},
			ready: {
				invoke: {
					id: 'rerender-queue',
					src: 'rerenderQueueMachine',
				},
				on: {
					CAMERA_REF: {
						actions: 'forwardForRerender',
					},
					SCENE_REF: {
						actions: 'forwardForRerender',
					},
					RERENDER: {
						actions: 'rerender',
						cond: 'withRefs',
					},
					MOUSE_MOVE: {
						actions: 'forwardToCameraActor',
					},
					REQ_RERENDER: {
						actions: ['requestCamera', 'requestScene'],
					},
				},
			},
		},
	},
	{
		guards: {
			withRefs: (_, { camera, scene }) => camera && scene,
		},
		actions: {
			setCanvasRef: assign({
				canvas: (_, { canvasRef }) => canvasRef,
			}),
			spawnInitActor: assign({
				initActor: () => spawn(actorInits),
			}),
			initScene: assign({
				sceneActor: () => spawn(sceneMachine),
			}),
			initCamera: assign({
				cameraActor: () => spawn(cameraMachine),
			}),
			initRenderer: assign({
				rendererActor: () => spawn(rendererMachine),
			}),
			sendCanvasRef: send(({ canvas }) => ({ type: 'INIT', canvas }), {
				to: ({ rendererActor }) => rendererActor,
			}),
			actorDone: send((_, e) => e, { to: ({ initActor }) => initActor }),
			stopInitActor: stop(({ initActor }) => initActor),
			spawnMouseMoveActor: assign({
				mouseMoveActor: () => spawn(mouseMoveActor),
			}),
			requestCamera: send(
				{ type: 'GET_CAMERA' },
				{ to: ({ cameraActor }) => cameraActor }
			),
			requestScene: send(
				{ type: 'GET_SCENE' },
				{ to: ({ sceneActor }) => sceneActor }
			),
			forwardForRerender: send((_, e) => e, { to: 'rerender-queue' }),
			rerender: send((_, e) => e, { to: ({ rendererActor }) => rendererActor }),
			forwardToCameraActor: send((_, e) => e, {
				to: ({ cameraActor }) => cameraActor,
			}),
		},
		services: {
			rerenderQueueMachine,
		},
	}
);

export default threeMachine;
