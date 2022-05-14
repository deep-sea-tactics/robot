#top
=$(v4l2-ctl --list-devices 2>/dev/null  | tac | sed -n '/HD USB/q;p' | tail -1 | sed 's/\t//')

#front
variable=$(v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/mmal/q;p' | tail -1 | sed 's/\t//')

#bottom
variable=$(v4l2-ctl --list-devices 2>/dev/null | tac | sed -n '/H264/q;p' | tail -1 | sed 's/\t//')
