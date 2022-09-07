import { PointerEvent, useEffect, useRef, useState } from "react";
import { tw } from "twind";

/**
 * Please see
 * - https://github.com/vinothpandian/react-sketch-canvas
 * - https://pspdfkit.com/blog/2017/how-to-build-free-hand-drawing-using-react/
 * - https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
 */

type Point = {
  x: number;
  y: number;
};

type Line = Point[];

type ControlPoints = {
  current: Point;
  previous?: Point;
  next?: Point;
  reverse?: boolean;
};

const line = (pointA: Point, pointB: Point) => {
  const lengthX = pointB.x - pointA.x;
  const lengthY = pointB.y - pointA.y;

  return {
    length: Math.sqrt(lengthX ** 2 + lengthY ** 2),
    angle: Math.atan2(lengthY, lengthX),
  };
};

const controlPoint = (controlPoints: ControlPoints): [number, number] => {
  const { current, next, previous, reverse } = controlPoints;

  const p = previous || current;
  const n = next || current;

  const smoothing = 0.2;

  const o = line(p, n);

  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;

  const x = current.x + Math.cos(angle) * length;
  const y = current.y + Math.sin(angle) * length;

  return [x, y];
};

const bezierCommand = (point: Point, i: number, a: Point[]): string => {
  let cpsX = null;
  let cpsY = null;

  switch (i) {
    case 0:
      [cpsX, cpsY] = controlPoint({
        current: point,
      });
      break;
    case 1:
      [cpsX, cpsY] = controlPoint({
        current: a[i - 1],
        next: point,
      });
      break;
    default:
      [cpsX, cpsY] = controlPoint({
        current: a[i - 1],
        previous: a[i - 2],
        next: point,
      });
      break;
  }

  const [cpeX, cpeY] = controlPoint({
    current: point,
    previous: a[i - 1],
    next: a[i + 1],
    reverse: true,
  });

  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x}, ${point.y}`;
};

const Path = ({ line }: { line: Line }) => {
  const d = line.reduce(
    (acc, point, i, a) => i === 0 ? `M ${point.x},${point.y}` : `${acc} ${bezierCommand(point, i, a)}`,
    "",
  );

  return (
    <path
      d={d}
      fill="none"
      strokeLinecap="round"
      stroke="#0000ff"
      strokeWidth={10}
    />
  );
};

const SvgCanvas = ({}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const [lines, setLines] = useState<Line[]>([]);

  const relativeCoordinatesForEvent = (event: PointerEvent<HTMLDivElement>) => {
    const boundingRect = ref.current?.getBoundingClientRect();
    return {
      x: event.clientX - boundingRect!.left,
      y: event.clientY - boundingRect!.top,
    } as Point;
  };

  const handleStart = (event: PointerEvent<HTMLDivElement>) => {
    isDrawing.current = true;

    const point = relativeCoordinatesForEvent(event);

    setLines([...lines, [point]]);
  };

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDrawing.current) {
      return;
    }

    const point = relativeCoordinatesForEvent(event);

    setLines((prev) => {
      prev[prev.length - 1].push(point);
      return [...prev];
    });
  };

  const handleStop = () => {
    isDrawing.current = false;
  };

  useEffect(() => {
    document.addEventListener("pointerup", handleStop);
    return () => {
      document.removeEventListener("pointerup", handleStop);
    };
  }, [handleStop]);

  return (
    <div
      ref={ref}
      className={tw("ring ring-black")}
      onPointerUp={() => {
        handleStop();
      }}
      onPointerDown={(event) => handleStart(event)}
      onPointerMove={(event) => handleMove(event)}
    >
      <svg
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {lines.map((line, i) => <Path key={i} line={line} />)}
      </svg>
    </div>
  );
};

export default SvgCanvas;
