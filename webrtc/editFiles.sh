#top
top=$(v4l2-ctl --list-devices 2>/dev/null  | tac | sed -n '/HD USB/q;p' | tail -1 | sed 's/\t//' | cut -c 6-)

#front
front=$(v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/mmal/q;p' | tail -1 | sed 's/\t//' | cut -c 6-)

#bottom
bottom=$(v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/H264/q;p' | tail -1 | sed 's/\t//' | cut -c 6-)

echo $top


#front
echo sudo uv4l --external-driver --device-name=$front --server-option '--port=8081' --server-option '--webrtc-video-format=5' > camera1.sh.test

#bottom
echo sudo uv4l --external-driver --device-name=$bottom --server-option '--port=8083' --server-option '--webrtc-video-format=5' > camera2.sh.test

#top
echo sudo uv4l --external-driver --device-name=$top --server-option '--port=8082' --server-option '--webrtc-video-format=5' > camera3.sh.test


/home/pi/2022_Code/Landstown-Robotics-Challenge/webrtc/restartCam.sh
