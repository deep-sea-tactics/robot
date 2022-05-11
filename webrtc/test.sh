rm -f log.txt

# front
v4l2-ctl --list-devices 2>/dev/null  | tac | sed -n '/HD USB/q;p' | tail -1 | sed 's/\t//'
# top
v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/mmal/q;p' | tail -1 | sed 's/\t//'
# bottom
v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/H264/q;p' | tail -1 | sed 's/\t//'

