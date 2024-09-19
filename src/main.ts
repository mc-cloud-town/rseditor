import './style.css';
import p5 from 'p5';

const canvas = new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  };
}, document.getElementById('app')!);

// canvas.mouseWheel(e => p5.C)
