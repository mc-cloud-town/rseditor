import p5 from 'p5';

export default class Controls {
  view = { x: 0, y: 0, zoom: 1 };
  viewPos: IViewPos = {
    prevX: null,
    prevY: null,
    isDragging: false,
  };

  constructor(public el: p5) {}

  mousePressed(e: MouseEvent) {
    this.viewPos.isDragging = true;
    this.viewPos.prevX = e.clientX;
    this.viewPos.prevY = e.clientY;
  }

  mouseDragged(e: MouseEvent) {
    const { prevX, prevY, isDragging } = this.viewPos;
    if (!isDragging) return;

    const pos = { x: e.clientX, y: e.clientY };
    const dx = pos.x - (prevX ?? 0);
    const dy = pos.y - (prevY ?? 0);

    if (prevX || prevY) {
      this.view.x += dx;
      this.view.y += dy;
      this.viewPos.prevX = pos.x;
      this.viewPos.prevY = pos.y;
    }
  }

  mouseReleased() {
    this.viewPos.isDragging = false;
    this.viewPos.prevX = null;
    this.viewPos.prevY = null;
  }

  worldZoom({ x, y, deltaY }: IZoomInfo) {
    const direction = deltaY > 0 ? -1 : 1;
    const factor = 0.05;
    const zoom = 1 * direction * factor;

    const wx = (x - this.view.x) / (this.el.width * this.view.zoom);
    const wy = (y - this.view.y) / (this.el.height * this.view.zoom);

    this.view.x -= wx * this.el.width * zoom;
    this.view.y -= wy * this.el.height * zoom;
    this.view.zoom += zoom;
  }
}

export interface IZoomInfo {
  x: number;
  y: number;
  deltaY: number;
}

export interface IViewPos {
  prevX: number | null;
  prevY: number | null;
  isDragging: boolean;
}
