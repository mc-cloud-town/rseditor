import './style.css';
import p5 from 'p5';
import Controls from './utils/Controls';
import { BLOCK_NAMES } from './utils/Images';

const IMAGE_MAP = new Map();

const canvas = new p5((p5) => {
  p5.setup = () => {
    let firstIsDraw = false;
    let nowPressMoveBuffers: { [key: string]: boolean } = {};
    const gridContents: {
      [x: number]: { [y: number]: string | undefined } | undefined;
    } = {};
    const canvas = p5.createCanvas(400, 400);

    BLOCK_NAMES.forEach((e) => {
      IMAGE_MAP.set(e, p5.loadImage(`assets/${e}.webp`));
    });

    const getPos = () => {
      const x = Math.floor(p5.mouseX / 30);
      const y = Math.floor(p5.mouseY / 30);

      return { x, y, str: `${x}-${y}` };
    };

    // return false: erase, true: draw
    const setGridImage = (pos?: { x: number; y: number }, clear?: boolean) => {
      const { x, y } = pos ?? getPos();

      if (clear || gridContents[x]?.[y]) {
        if (gridContents[x]?.[y]) {
          delete gridContents[x][y];
        }

        p5.erase();
        p5.rect(x * 30, y * 30, 30, 30);
        p5.noErase();
        return false;
      }

      gridContents[x] ??= {};
      gridContents[x][y] = 'x';

      p5.image(IMAGE_MAP.get('arail'), x * 30, y * 30, 30, 30);
      return true;
    };

    p5.mousePressed = ({ button }: MouseEvent) => {
      if (button !== 0) return; // 0 is left click

      firstIsDraw = setGridImage();
    };

    p5.mouseDragged = ({ button }: MouseEvent) => {
      if (button !== 0) return; // 0 is left click

      const pos = getPos();
      if (nowPressMoveBuffers[pos.str]) return;

      setGridImage(pos, !firstIsDraw);

      nowPressMoveBuffers[pos.str] = true;
    };

    p5.mouseReleased = () => {
      nowPressMoveBuffers = {};
    };

    document.getElementById('save')!.addEventListener('click', () => {
      p5.save('grid.png');
    });

    document.getElementById('copy')!.addEventListener('click', () => {
      canvas.elt.toBlob((blob: Blob) => {
        const item = new ClipboardItem({ 'image/png': blob });

        navigator.clipboard.write([item]);
      });
    });
  };
}, document.getElementById('app')!);
