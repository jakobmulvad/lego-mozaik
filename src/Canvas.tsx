import { FC, useEffect, useRef } from 'react';
import { BrickPlacement } from './brick-optimizer';
import { mozaikHeight, mozaikWidth } from './constants';
import { Dot } from './dots';

export type PlateLayer = {
  type: 'PLATE';
  placements: BrickPlacement[];
};

export type DotLayer = {
  type: 'DOT';
  dots: Dot[];
};

export type Layer = PlateLayer | DotLayer;

const renderPlateLayer = (ctx: CanvasRenderingContext2D, layer: PlateLayer, idx: number) => {
  const { placements } = layer;
  ctx.fillStyle = ['#000', '#600', '#060'][idx];
  for (const placement of placements) {
    ctx.fillRect(placement.x * 10, placement.y * 10, placement.brick.width * 10, placement.brick.length * 10);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(placement.x * 10, placement.y * 10, placement.brick.width * 10, placement.brick.length * 10);
    for (let dy = 0; dy < placement.brick.length; dy++) {
      for (let dx = 0; dx < placement.brick.width; dx++) {
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        ctx.ellipse((placement.x + dx + 0.5) * 10, (placement.y + dy + 0.5) * 10, 2, 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  const totalPrice = placements.reduce((acc, val) => (acc += val.brick.price), 0);

  ctx.fillStyle = '#fff';
  ctx.fillText(`layer ${idx} Plates used: ${placements.length}  Total price: DKK ${totalPrice.toFixed(2)}`, 0, 20);
};

const renderDotLayer = (ctx: CanvasRenderingContext2D, layer: DotLayer) => {
  for (let y = 0; y < mozaikHeight; y++) {
    for (let x = 0; x < mozaikWidth; x++) {
      const dot = layer.dots[x + y * mozaikWidth];
      ctx.fillStyle = `#${dot.color.code}`;
      ctx.beginPath();
      ctx.ellipse((x + 0.5) * 10, (y + 0.5) * 10, 5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const Canvas: FC<{ layers: Layer[] }> = ({ layers }) => {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, mozaikWidth * 10, mozaikHeight * 10);

    let i = 0;
    for (const layer of layers) {
      switch (layer.type) {
        case 'PLATE':
          renderPlateLayer(ctx, layer, i++);
          break;
        case 'DOT':
          renderDotLayer(ctx, layer);
          break;
      }
    }
  }, [layers]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  return <canvas width={mozaikWidth * 10} height={mozaikHeight * 10} ref={canvasRef} />;
};
