/**
 * General X and Y position interface.
 *
 * X and Y are between 0-100. 50 is in the middle.
 *
 * 0y means backwards, 100y means forwards
 * 0x means left, 100x means right
 */
export interface Position {
	x: number;
	y: number;
}

/**
 * All data sent from the controller
 */
export interface ControllerData {
	position: Position;
	yaw: number;
	view: number;
	throttle: number;
	buttons: {
		trigger: boolean;
		side_grip: boolean;
		side_panel: {
			bottom_left: boolean;
			top_left: boolean;
			bottom_middle: boolean;
			top_middle: boolean;
			bottom_right: boolean;
			top_right: boolean;
		};
		controller_buttons: {
			top_left: boolean;
			top_right: boolean;
			bottom_left: boolean;
			bottom_right: boolean;
		};
	};
}

export interface ServerToClientsMap {
	broadcaster: () => void;
	watcher: (id: string) => void;
	/** A peer has disconnected -- disconnect from them */
	disconnectPeer: (id: string) => void;
	offer: (id: string, message: RTCSessionDescription) => void;
	answer: (id: string, message: RTCSessionDescriptionInit) => void;
	candidate: (id: string, message: RTCIceCandidateInit) => void;
}

export interface ClientToServerMap {
	dataOverride: (data: Partial<ControllerData>) => void;
	clientControllerData: (data: ControllerData) => void;
	/** A broadcaster is ready to broadcast */
	broadcaster: () => void;
	watcher: () => void;
	offer: (id: string, message: RTCSessionDescription) => void;
	answer: (id: string, message: RTCSessionDescription) => void;
	candidate: (id: string, message: RTCIceCandidateInit) => void;
}
