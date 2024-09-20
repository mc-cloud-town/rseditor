import './style.css';
import p5 from 'p5';
import Controls from './utils/Controls';
import { BLOCK_NAMES } from './utils/Images';

const IMAGE_MAP = new Map();

const canvas = new p5((p: p5) => {
  let firstIsDraw = false;
  let nowPressMoveBuffers: { [key: string]: boolean } = {};
  const gridContents: {
    [x: number]: { [y: number]: string | undefined } | undefined;
  } = {};

  BLOCK_NAMES.forEach((e) => IMAGE_MAP.set(e, p.loadImage(`assets/${e}.webp`)));

  p.setup = () => {
    p.createCanvas(400, 400);
  };

  const nowPos = () => {
    const x = Math.floor(p.mouseX / 30);
    const y = Math.floor(p.mouseY / 30);

    return { x, y, str: `${x}-${y}` };
  };

  // return false: erase, true: draw
  const setGridImage = (pos?: { x: number; y: number }, clear?: boolean) => {
    const { x, y } = pos ?? nowPos();

    if (clear === true) {
      if (gridContents[x]?.[y]) {
        delete gridContents[x][y];
      }

      canvas.erase();
      canvas.rect(x * 30, y * 30, 30, 30);
      canvas.noErase();
      return false;
    }

    gridContents[x] ??= {};
    gridContents[x][y] = 'x';

    canvas.image(IMAGE_MAP.get('arail'), x * 30, y * 30, 30, 30);
    return true;
  };

  p.mousePressed = () => {
    firstIsDraw = setGridImage();
  };

  p.mouseDragged = () => {
    const pos = nowPos();
    if (nowPressMoveBuffers[pos.str]) return;

    setGridImage(pos, !firstIsDraw);

    nowPressMoveBuffers[pos.str] = true;
  };

  p.mouseReleased = () => {
    nowPressMoveBuffers = {};
  };
}, document.getElementById('app')!);

// canvas.mouseWheel(e => p5.C)
const canvasControls = new Controls(canvas);
// canvasControls.worldZoom({ x: 200, y: 200, deltaY: -1, factor: 0.05 })
