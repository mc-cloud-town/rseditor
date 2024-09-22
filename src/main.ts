import './style.css';
import p5 from 'p5';

import Controls from './utils/Controls';
import { BLOCK_NAMES, TBlockName } from './utils/Images';

const IMAGE_MAP = new Map();

new p5((p5: p5) => {
  let selectedBlock: TBlockName = BLOCK_NAMES[0];
  const gridContents: {
    [x: number]: { [y: number]: string | undefined } | undefined;
  } = {};
  const controls = new Controls(p5);
  const blockEl = document.getElementById('blocks')! as HTMLDivElement;

  p5.setup = () => {
    const size = getWindowSize();
    const canvas = p5.createCanvas(size.width, size.height);
    BLOCK_NAMES.forEach((block) => {
      const image = document.createElement('img');
      image.src = `assets/${block}.webp`;
      image.classList.add('block');
      image.addEventListener('click', () => (selectedBlock = block));
      blockEl.appendChild(image);
    });

    BLOCK_NAMES.forEach((e) => {
      IMAGE_MAP.set(e, p5.loadImage(`assets/${e}.webp`));
    });

    p5.mouseWheel = (e: WheelEvent) => {
      controls.worldZoom(e);
    };
    p5.mousePressed = (e: MouseEvent) => {
      e.preventDefault();
      controls.mousePressed(e);
    };
    p5.mouseDragged = (e: MouseEvent) => controls.mouseDragged(e);
    p5.mouseReleased = () => {
      if (!controls.viewPos.isDragged) {
        setGridImage();
      }
      controls.mouseReleased();
    };
    p5.windowResized = () => {
      const size = getWindowSize();
      p5.resizeCanvas(size.width, size.height);
      p5.draw();
    };
    p5.draw = () => {
      p5.clear();
      p5.translate(controls.view.x, controls.view.y);
      p5.scale(controls.view.zoom);
      renderScene();
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

  const getWindowSize = () => {
    return {
      width: p5.windowWidth * 0.8,
      height: p5.windowHeight * 0.8,
    };
  };

  const getPos = () => {
    const posX = (p5.mouseX - controls.view.x) / controls.view.zoom;
    const posY = (p5.mouseY - controls.view.y) / controls.view.zoom;
    const x = Math.floor(posX / 30);
    const y = Math.floor(posY / 30);

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
    gridContents[x][y] = selectedBlock;

    p5.image(IMAGE_MAP.get(selectedBlock), x * 30, y * 30, 30, 30);
    return true;
  };

  const renderScene = () => {
    for (const [x, dY] of Object.entries(gridContents)) {
      for (const [y, block] of Object.entries(dY ?? {})) {
        if (!block) continue;

        const image = IMAGE_MAP.get(block);
        if (!image) continue;

        p5.image(image, +x * 30, +y * 30, 30, 30);
      }
    }
  };
}, document.getElementById('app')!);
