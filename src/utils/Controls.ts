import p5 from 'p5';

export default class Controls {
  view = { x: 0, y: 0, zoom: 1 };
  viewPos: IViewPos = {
    prevX: null,
    prevY: null,
    isDragged: false,
    isDragging: false,
  };

  constructor(public el: p5) {}

  mousePressed({ clientX, clientY }: MouseEvent) {
    this.viewPos.isDragging = true;
    this.viewPos.prevX = clientX;
    this.viewPos.prevY = clientY;
  }

  mouseDragged({ clientX, clientY }: MouseEvent) {
    const { prevX, prevY, isDragging, isDragged } = this.viewPos;
    if (!isDragging) return;
    if (!isDragged) {
      this.viewPos.isDragged = true;
    }

    const dx = clientX - (prevX ?? 0);
    const dy = clientY - (prevY ?? 0);

    if (prevX || prevY) {
      this.view.x += dx;
      this.view.y += dy;
      this.viewPos.prevX = clientX;
      this.viewPos.prevY = clientY;
    }
  }

  mouseReleased() {
    this.viewPos.prevX = null;
    this.viewPos.prevY = null;
    this.viewPos.isDragged = false;
    this.viewPos.isDragging = false;
  }

  worldZoom({ x, y, deltaY, factor = 0.05 }: IZoomInfo) {
    const wx = (x - this.view.x) / (this.el.width * this.view.zoom);
    const wy = (y - this.view.y) / (this.el.height * this.view.zoom);
    const direction = deltaY > 0 ? -1 : 1;
    const zoom = direction * factor;

    this.view.x -= wx * this.el.width * zoom;
    this.view.y -= wy * this.el.height * zoom;
    this.view.zoom += zoom;
  }
}

export interface IZoomInfo {
  x: number;
  y: number;
  deltaY: number;
  factor?: number;
}

export interface IViewPos {
  prevX: number | null;
  prevY: number | null;
  isDragging: boolean;
  isDragged: boolean;
}
