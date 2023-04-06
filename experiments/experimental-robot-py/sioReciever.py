import socketio
import json

global joystickX,joystickY,yaw,view,throttle,trigger,side_grip,joystickUL,joystickUR,joystickLL,joystickLR,baseUL,baseUR,baseML,baseMR,baseLL,baseLR

def start():
	sio = socketio.Client()

	@sio.event
	def connect():
		print('Robot connected. SID: ', sio.sid)

	@sio.event
	def connect_error(data):
		print("Robot connection error: ", data)

	@sio.event
	def disconnect():
		print("Robot disconnected.")

	sio.connect("http://192.168.1.202:9000")

	@sio.on('controllerData')
	def on_message(data):
		parsed_data = json.loads(data)
		joystickX = parsed_data["position"]["x"]
		joystickY = parsed_data["position"]["y"]
		yaw = parsed_data["yaw"]
		view = parsed_data["view"]
		throttle = parsed_data["throttle"]
		trigger = parsed_data["buttons"]["trigger"]
		side_grip = parsed_data["buttons"]["side_grip"]
		joystickUL = parsed_data["buttons"]["controller_buttons"]["top_left"]
		joystickUR = parsed_data["buttons"]["controller_buttons"]["top_right"]
		joystickLL = parsed_data["buttons"]["controller_buttons"]["bottom_left"]
		joystickLR = parsed_data["buttons"]["controller_buttons"]["bottom_right"]
		baseUL = parsed_data["buttons"]["side_panel"]["top_left"]
		baseUR = parsed_data["buttons"]["side_panel"]["top_right"]
		baseML = parsed_data["buttons"]["side_panel"]["middle_left"]
		baseMR = parsed_data["buttons"]["side_panel"]["middle_right"]
		baseLL = parsed_data["buttons"]["side_panel"]["bottom_left"]
		baseLR = parsed_data["buttons"]["side_panel"]["bottom_right"]