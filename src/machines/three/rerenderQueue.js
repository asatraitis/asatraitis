import { createMachine, assign, sendParent } from 'xstate';

const rerenderQueueMachine = createMachine(
	{
		id: 'rerender-queue',
		initial: 'idle',
		context: {
			camera: null,
			scene: null,
		},
		states: {
			idle: {
				on: {
					CAMERA_REF: {
						target: 'waitForScene',
						actions: 'setCamera',
					},
					SCENE_REF: {
						target: 'waitForCamera',
						actions: 'setScene',
					},
				},
			},
			waitForCamera: {
				on: {
					CAMERA_REF: {
						target: 'idle',
						actions: ['setCamera', 'sendRerender'],
					},
				},
			},
			waitForScene: {
				on: {
					SCENE_REF: {
						target: 'idle',
						actions: ['setScene', 'sendRerender'],
					},
				},
			},
		},
	},
	{
		actions: {
			setCamera: assign({
				camera: (_, { camera }) => camera,
			}),
			setScene: assign({
				scene: (_, { scene }) => scene,
			}),
			sendRerender: sendParent(({ camera, scene }) => {
				return { type: 'RERENDER', camera, scene };
			}),
			resetContext: assign({ camera: null, scene: null }),
		},
	}
);

export default rerenderQueueMachine;
