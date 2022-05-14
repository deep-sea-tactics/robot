#top
top=$(v4l2-ctl --list-devices 2>/dev/null  | tac | sed -n '/HD USB/q;p' | tail -1 | sed 's/\t//')

#front
front=$(v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/mmal/q;p' | tail -1 | sed 's/\t//')

#bottom
bottom=$(v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/H264/q;p' | tail -1 | sed 's/\t//')

#front
echo "sudo uv4l --external-driver --device-name=video6 --server-option '--port=8081' --server-option '--webrtc-video-format=5'" > camera1.sh.test

#front
echo "sudo uv4l --external-driver --device-name=video6 --server-option '--port=8081' --server-option '--webrtc-video-format=5'" > camera2.sh.test

#front
echo "sudo uv4l --external-driver --device-name=video6 --server-option '--port=8081' --server-option '--webrtc-video-format=5'" > camera3.sh.test
