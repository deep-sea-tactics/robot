const restartPause = 2000;

export class Receiver {
	ws: WebSocket | null;
	pc: RTCPeerConnection | null;
	restartTimeout: number | null;
	terminated: boolean;
	streamerCallback: (stream: MediaStream) => void;

	constructor(streamerCallback: (stream: MediaStream) => void) {
		this.streamerCallback = streamerCallback;
		this.terminated = false;
		this.ws = null;
		this.pc = null;
		this.restartTimeout = null;
		this.start();
	}

	start() {
		console.log('connecting');

		this.ws = new WebSocket('ws://192.168.0.2:8889/cam/ws');

		this.ws.onerror = () => {
			console.log('ws error');
			if (this.ws === null) {
				return;
			}
			this.ws.close();
			this.ws = null;
		};

		this.ws.onclose = () => {
			console.log('ws closed');
			this.ws = null;
			this.scheduleRestart();
		};

		this.ws.onmessage = (msg) => this.onIceServers(msg);
	}

	onIceServers(msg: MessageEvent) {
		if (this.ws === null) {
			return;
		}

		const iceServers = JSON.parse(msg.data) as RTCIceServer[];

		this.pc = new RTCPeerConnection({
			iceServers,
		});

		this.ws.onmessage = (msg) => this.onRemoteDescription(msg);
		this.pc.onicecandidate = (evt) => this.onIceCandidate(evt);

		this.pc.oniceconnectionstatechange = () => {
			if (this.pc === null) {
				return;
			}

			console.log('peer connection state:', this.pc.iceConnectionState);

			switch (this.pc.iceConnectionState) {
				case 'disconnected':
					this.scheduleRestart();
			}
		};

		this.pc.ontrack = (evt) => {
			console.log('new track ' + evt.track.kind);
			this.streamerCallback(evt.streams[0]);
		};

		const direction = 'sendrecv';
		this.pc.addTransceiver('video', { direction });
		this.pc.addTransceiver('audio', { direction });

		this.pc.createOffer()
			.then((desc) => {
				if (this.pc === null || this.ws === null) {
					return;
				}

				this.pc.setLocalDescription(desc);

				console.log('sending offer');
				this.ws.send(JSON.stringify(desc));
			});
	}

	onRemoteDescription(msg) {
		if (this.pc === null || this.ws === null) {
			return;
		}

		this.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(msg.data)));
		this.ws.onmessage = (msg) => this.onRemoteCandidate(msg);
	}

	onIceCandidate(evt: RTCPeerConnectionIceEvent) {
		if (this.ws === null) {
			return;
		}

		if (evt.candidate !== null) {
			if (evt.candidate.candidate !== '') {
				this.ws.send(JSON.stringify(evt.candidate));
			}
		}
	}

	onRemoteCandidate(msg: MessageEvent) {
		if (this.pc === null) {
			return;
		}

		this.pc.addIceCandidate(JSON.parse(msg.data));
	}

	scheduleRestart() {
		if (this.terminated) {
			return;
		}

		if (this.ws !== null) {
			this.ws.close();
			this.ws = null;
		}

		if (this.pc !== null) {
			this.pc.close();
			this.pc = null;
		}

		this.restartTimeout = window.setTimeout(() => {
			this.restartTimeout = null;
			this.start();
		}, restartPause);
	}
}
