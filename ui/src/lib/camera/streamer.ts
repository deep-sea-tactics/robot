export class WebRtcStreamer {

	mediaStreamCallback: (stream: MediaStream | undefined) => void;
	srvurl: string;
	pc: RTCPeerConnection | null;
	mediaConstraints: { offerToReceiveAudio: boolean; offerToReceiveVideo: boolean; };
	iceServers: any;
	earlyCandidates: RTCIceCandidate[];
	peerid: string;

	/** 
	 * Interface with WebRTC-streamer API
	 * @constructor
	 * @param mediaStreamCallback - the callback to listen to the stream
	 * @param srvurl -  url of webrtc-streamer (default is current location)
	*/
	constructor(mediaStreamCallback: (stream: MediaStream | undefined) => void, srvurl: string) {
		this.mediaStreamCallback = mediaStreamCallback;
		this.srvurl           = srvurl || location.protocol+"//"+window.location.hostname+":"+window.location.port;
		this.pc               = null;    
	
		this.mediaConstraints = { offerToReceiveAudio: true, offerToReceiveVideo: true };
	
		this.iceServers = null;
		this.earlyCandidates = [];
	}
	
	_handleHttpErrors(response: Response) {
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return response;
	}
	
	/** 
	 * Connect a WebRTC Stream to a media stream 
	 * @param videourl - id of WebRTC video stream
	 * @param audiourl - id of WebRTC audio stream
	 * @param options -  options of WebRTC call
	 * @param localstream  -  local stream to send
	*/
	connect(videourl: string, audiourl: string | undefined, options: string, localstream: string) {
		this.disconnect();
		
		// getIceServers is not already received
		if (!this.iceServers) {
			console.log("Get IceServers");
			
			fetch(this.srvurl + "/api/getIceServers")
				.then(this._handleHttpErrors)
				.then( (response) => (response.json()) )
				.then( (response) =>  this.onReceiveGetIceServers.call(this,response, videourl, audiourl, options, localstream))
				.catch( (error) => this.onError("getIceServers " + error ))
					
		} else {
			this.onReceiveGetIceServers(this.iceServers, videourl, audiourl, options, localstream);
		}
	}
	
	/** 
	 * Disconnect a WebRTC Stream and clear media source
	*/
	disconnect() {		
		this.mediaStreamCallback(undefined);
		if (this.pc) {
			fetch(this.srvurl + "/api/hangup?peerid="+this.peerid)
				.then(this._handleHttpErrors)
				.catch( (error) => this.onError("hangup " + error ))
	
			
			try {
				this.pc.close();
			}
			catch (e) {
				console.log ("Failure close peer connection:" + e);
			}
			this.pc = null;
		}
	}    
	
	/*
	* GetIceServers callback
	*/
	onReceiveGetIceServers(iceServers, videourl: string, audiourl: string | undefined, options, stream) {
		this.iceServers       = iceServers;
		this.pcConfig         = iceServers || {"iceServers": [] };
		try {            
			this.createPeerConnection();
	
			var callurl = this.srvurl + "/api/call?peerid="+ this.peerid+"&url="+encodeURIComponent(videourl);
			if (audiourl) {
				callurl += "&audiourl="+encodeURIComponent(audiourl);
			}
			if (options) {
				callurl += "&options="+encodeURIComponent(options);
			}
			
			if (stream) {
				this.pc.addTrack(stream);
			}
	
					// clear early candidates
			this.earlyCandidates.length = 0;
			
			// create Offer
			var bind = this;
			this.pc.createOffer(this.mediaConstraints).then((sessionDescription) => {
				console.log("Create offer:" + JSON.stringify(sessionDescription));
				
				this.pc.setLocalDescription(sessionDescription
					, function() {
						fetch(callurl, { method: "POST", body: JSON.stringify(sessionDescription) })
							.then(bind._handleHttpErrors)
							.then( (response) => (response.json()) )
							.catch( (error) => bind.onError("call " + error ))
							.then( (response) =>  bind.onReceiveCall.call(bind,response) )
							.catch( (error) => bind.onError("call " + error ))
					
					}
					, function(error) {
						console.log ("setLocalDescription error:" + JSON.stringify(error)); 
					} );
				
			}, function(error) { 
				alert("Create offer error:" + JSON.stringify(error));
			});
	
		} catch (e) {
			this.disconnect();
			alert("connect error: " + e);
		}	    
	}
	
	
	getIceCandidate() {
		fetch(this.srvurl + "/api/getIceCandidate?peerid=" + this.peerid)
			.then(this._handleHttpErrors)
			.then( (response) => (response.json()) )
			.then( (response) =>  this.onReceiveCandidate.call(this, response))
			.catch( (error) => bind.onError("getIceCandidate " + error ))
	}
						
	/*
	* create RTCPeerConnection 
	*/
	createPeerConnection() {
		console.log("createPeerConnection  config: " + JSON.stringify(this.pcConfig));
		this.pc = new RTCPeerConnection(this.pcConfig);
		var pc = this.pc;
		this.peerid = Math.random().toString();		
		
		var bind = this;
		pc.onicecandidate = function(evt) { bind.onIceCandidate.call(bind, evt); };
		pc.addEventListener("track", evt => bind.onAddStream.call(bind,evt));
		pc.oniceconnectionstatechange = function(evt) {  
			console.log("oniceconnectionstatechange  state: " + pc.iceConnectionState);
			bind.getIceCandidate.call(bind)
		}
		pc.ondatachannel = function(evt) {  
			console.log("remote datachannel created:"+JSON.stringify(evt));
			
			evt.channel.onopen = function () {
				console.log("remote datachannel open");
				this.send("remote channel openned");
			}
			evt.channel.onmessage = function (event) {
				console.log("remote datachannel recv:"+JSON.stringify(event.data));
			}
		}
		pc.onicegatheringstatechange = function() {
			if (pc.iceGatheringState === "complete") {
				const recvs = pc.getReceivers();
			
				recvs.forEach((recv) => {
				  if (recv.track && recv.track.kind === "video") {
					console.log("codecs:" + JSON.stringify(recv.getParameters().codecs))
				  }
				});
			  }
		}
	
		try {
			var dataChannel = pc.createDataChannel("ClientDataChannel");
			dataChannel.onopen = function() {
				console.log("local datachannel open");
				this.send("local channel openned");
			}
			dataChannel.onmessage = function(evt) {
				console.log("local datachannel recv:"+JSON.stringify(evt.data));
			}
		} catch (e) {
			console.log("Cannor create datachannel error: " + e);
		}	
		
		console.log("Created RTCPeerConnnection with config: " + JSON.stringify(this.pcConfig) );
		return pc;
	}
	
	
	/*
	* RTCPeerConnection IceCandidate callback
	*/
	onIceCandidate(event) {
		if (event.candidate) {
			if (this.pc?.currentRemoteDescription)  {
				this.addIceCandidate(this.peerid, event.candidate);					
			} else {
				this.earlyCandidates.push(event.candidate);
			}
		} 
		else {
			console.log("End of candidates.");
		}
	}
	
	
	addIceCandidate(peerid: string, candidate) {
		fetch(this.srvurl + "/api/addIceCandidate?peerid="+peerid, { method: "POST", body: JSON.stringify(candidate) })
			.then(this._handleHttpErrors)
			.then( (response) => (response.json()) )
			.then( (response) =>  {console.log("addIceCandidate ok:" + response)})
			.catch( (error) => this.onError("addIceCandidate " + error ))
	}
					
	/*
	* RTCPeerConnection AddTrack callback
	*/
	onAddStream(event) {
		console.log("Remote track added:" +  JSON.stringify(event));
		
		this.mediaStreamCallback(event.streams[0]);
	}
			
	/*
	* AJAX /call callback
	*/
	onReceiveCall(dataJson) {
		var bind = this;
		console.log("offer: " + JSON.stringify(dataJson));
		var descr = new RTCSessionDescription(dataJson);
		this.pc?.setRemoteDescription(descr
			, function()      { 
				console.log ("setRemoteDescription ok");
				while (bind.earlyCandidates.length) {
					var candidate = bind.earlyCandidates.shift();
					bind.addIceCandidate.call(bind, bind.peerid, candidate);				
				}
			
				bind.getIceCandidate.call(bind)
			}
			, function(error) { 
				console.log ("setRemoteDescription error:" + JSON.stringify(error)); 
			});
	}	
	
	/*
	* AJAX /getIceCandidate callback
	*/
	onReceiveCandidate(dataJson) {
		console.log("candidate: " + JSON.stringify(dataJson));
		if (dataJson) {
			for (var i=0; i<dataJson.length; i++) {
				var candidate = new RTCIceCandidate(dataJson[i]);
				
				console.log("Adding ICE candidate :" + JSON.stringify(candidate) );
				this.pc.addIceCandidate(candidate
					, function()      { console.log ("addIceCandidate OK"); }
					, function(error) { console.log ("addIceCandidate error:" + JSON.stringify(error)); } );
			}
			this.pc.addIceCandidate();
		}
	}
	
	
	/*
	* AJAX callback for Error
	*/
	onError = function(status) {
		console.log("onError:" + status);
	}
};
