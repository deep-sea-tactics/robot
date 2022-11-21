export const config: RTCConfiguration = {
	iceServers: [
		{
			urls: ['stun:stun.l.google.com:19302', 'stun:openrelay.metered.ca:80'],
		},
		// OpenRelay TURN servers. Used to make stun/turn work in gitpod and github codespaces
		// In the actual robot, `coturn` is needed.
		{
			urls: 'turn:openrelay.metered.ca:80',
			username: 'openrelayproject',
			credential: 'openrelayproject',
		},
		{
			urls: 'turn:openrelay.metered.ca:443',
			username: 'openrelayproject',
			credential: 'openrelayproject',
		},
		{
			urls: 'turn:openrelay.metered.ca:443?transport=tcp',
			username: 'openrelayproject',
			credential: 'openrelayproject',
		},
	],
};
