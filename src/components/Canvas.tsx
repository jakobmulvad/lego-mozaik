import { FC, useEffect, useRef, useCallback, MouseEvent, useState, WheelEvent } from 'react';
import { BrickPlacement } from '../brick-optimizer';
import { Dot } from '../dots';
import { LegoColor } from '../lego-colors';

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
};

const renderDotLayer = (ctx: CanvasRenderingContext2D, colors: LegoColor[], width: number, height: number) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const color = colors[x + y * width];
      ctx.fillStyle = `#${color.code.toString(16).padStart(6, '0')}`;
      ctx.beginPath();
      ctx.ellipse((x + 0.5) * 10, (y + 0.5) * 10, 5, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

export const Canvas: FC<{ legoColors: LegoColor[]; width: number; height: number }> = ({
  legoColors,
  width,
  height,
}) => {
  const [offscreenBuffer, setOffscreenBuffer] = useState<HTMLCanvasElement | undefined>();
  const [transform, setTransform] = useState<DOMMatrix>(new DOMMatrix());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep canvas fullscreen
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
  }, [canvasRef.current]);

  const render = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current || !offscreenBuffer) {
      return;
    }

    ctx.resetTransform();
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.setTransform(transform);
    ctx.drawImage(offscreenBuffer, 0, 0);
  }, [offscreenBuffer, transform]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 10;
    canvas.height = height * 10;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    /*let i = 0;
    for (const layer of layers) {
      switch (layer.type) {
        case 'PLATE':
          renderPlateLayer(ctx, layer, i++);
          break;
        case 'DOT':
          renderDotLayer(ctx, layer);
          break;
      }
    }*/

    renderDotLayer(ctx, legoColors, width, height);

    setOffscreenBuffer(canvas);
  }, [legoColors, width, height]);

  useEffect(() => {
    render();
  }, [render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  }, []);

  const onMouseMove = useCallback(
    (evt: MouseEvent<HTMLCanvasElement>) => {
      if (evt.buttons !== 1) {
        return;
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) {
        return;
      }

      setTransform((current) => {
        const trans = new DOMMatrix().translate(evt.movementX, evt.movementY);
        return current.multiply(trans);
      });
      //transform.translate(evt.movementX, evt.movementY);
      render();
    },
    [render, setTransform]
  );

  const onWheel = useCallback(
    (evt: WheelEvent<HTMLCanvasElement>) => {
      console.log(evt.deltaY);

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) {
        return;
      }

      setTransform((current) => current.scale(1 + evt.deltaY * 0.001));
      render();
    },
    [render, setTransform]
  );

  return <canvas ref={canvasRef} onMouseMove={onMouseMove} onWheel={onWheel} />;
};
