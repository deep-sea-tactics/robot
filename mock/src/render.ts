import canvas from 'canvas';
import colorSpace from 'color-space';
import wrtc from "wrtc"

const { createCanvas } = canvas
const { hsv } = colorSpace
const { nonstandard } = wrtc
const { RTCVideoSource, rgbaToI420 } = nonstandard;

const width = 640;
const height = 480;

export function sink(peerConnection) {
  const source = new RTCVideoSource();
  const track = source.createTrack();

  peerConnection.addTrack(track)

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  let hue = 0;

  const interval = setInterval(() => {
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.fillRect(0, 0, width, height);

    hue = ++hue % 360;
    const [r, g, b] = hsv.rgb([hue, 100, 100]);

    context.font = '60px Sans-serif';
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 1)`;
    context.textAlign = 'center';
    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(hue / 1000);
    context.strokeText('node-webrtc', 0, 0);
    context.fillText('node-webrtc', 0, 0);
    context.restore();

    const rgbaFrame = context.getImageData(0, 0, width, height);
    const i420Frame = {
      width,
      height,
      data: new Uint8ClampedArray(1.5 * width * height)
    };
    rgbaToI420(rgbaFrame, i420Frame);
    source.onFrame(i420Frame);
  }, 100);

  const { close } = peerConnection;
  peerConnection.close = function() {
    clearInterval(interval);
    track.stop();
    return close.apply(this, arguments);
  };
}