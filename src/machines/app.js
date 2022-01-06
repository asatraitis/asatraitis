import { createMachine, assign, spawn } from 'xstate';
import threeMachine from './three/three';

const appMachine = createMachine(
	{
		id: 'app',
		initial: 'init',
		context: {
			threeActor: null,
		},
		states: {
			init: {
				entry: 'initActors',
			},
			idle: {},
		},
	},
	{
		actions: {
			initActors: assign({
				threeActor: () => spawn(threeMachine),
			}),
		},
	}
);

export default appMachine;
