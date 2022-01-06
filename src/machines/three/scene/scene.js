import { createMachine, assign, sendParent, actions } from 'xstate';
import * as THREE from 'three';
import createPointCloud from './utils/pointCloud';

const { respond } = actions;

const sceneMachine = createMachine(
	{
		id: 'three-scene',
		initial: 'init',
		context: {
			scene: null,
		},
		states: {
			init: {
				always: {
					target: 'idle',
					actions: 'initScene',
				},
				exit: 'notifyDoneToParent',
			},
			idle: {
				on: {
					GET_SCENE: {
						actions: 'respondWithScene',
					},
				},
			},
		},
	},
	{
		actions: {
			initScene: assign({
				scene: () => {
					const scene = new THREE.Scene();
					scene.background = null;

					const pointCloud = createPointCloud();
					scene.add(pointCloud);

					return scene;
				},
			}),
			notifyDoneToParent: sendParent({ type: 'DONE', actor: 'Scene' }),
			respondWithScene: respond(({ scene }) => ({ type: 'SCENE_REF', scene })),
		},
	}
);

export default sceneMachine;
