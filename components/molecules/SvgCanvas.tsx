import React, { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { BsArrowLeft, BsArrowRight, BsDownload, BsFillEraserFill, BsFillPencilFill } from "react-icons/bs";
import { tw } from "twind";
import Color from "../../libs/color";
import IconButton from "../atoms/IconButton";

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

type Line = {
  points: Point[];
  strokeColor: Color;
  strokeWidth: number;
};

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
  const d = line.points.reduce(
    (acc, point, i, a) => i === 0 ? `M ${point.x},${point.y}` : `${acc} ${bezierCommand(point, i, a)}`,
    "",
  );

  return (
    <path
      d={d}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={line.strokeColor.hexColor}
      strokeWidth={line.strokeWidth}
    />
  );
};

type LineProperty = {
  color: Color;
  width: number;
};

const SvgCanvas = ({}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [lineProperty, setLineProperty] = useState<LineProperty>({ color: Color.BLACK, width: 4 });
  const [, startTransition] = useTransition();

  const relativeCoordinatesForEvent = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const boundingRect = ref.current?.getBoundingClientRect();

    if (!boundingRect) {
      return { x: 0, y: 0 } as Point;
    }

    if (event.nativeEvent instanceof MouseEvent) {
      return {
        x: event.nativeEvent.clientX - boundingRect.left,
        y: event.nativeEvent.clientY - boundingRect.top,
      } as Point;
    } else if (event.nativeEvent instanceof TouchEvent) {
      return {
        x: event.nativeEvent.touches[0].clientX - boundingRect.left,
        y: event.nativeEvent.touches[0].clientY - boundingRect.top,
      } as Point;
    } else {
      throw "Unreacheable";
    }
  };

  // https://stackoverflow.com/questions/42101723/unable-to-preventdefault-inside-passive-event-listener
  // event.cancelable for unable-to-preventdefault-inside-passive-event-listener
  const handleStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    event.cancelable && event.preventDefault();
    isDrawing.current = true;

    const point = relativeCoordinatesForEvent(event);

    setLines([...lines, { strokeColor: lineProperty.color, strokeWidth: lineProperty.width, points: [point] }]);
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    event.cancelable && event.preventDefault();
    if (!isDrawing.current) {
      return;
    }

    const point = relativeCoordinatesForEvent(event);
    startTransition(() => {
      setLines((prev) => {
        prev[prev.length - 1].points.push(point);
        return [...prev];
      });
    });
  };

  const handleStop = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    event.cancelable && event.preventDefault();
    isDrawing.current = false;
  };

  return (
    <Suspense fallback={"loading..."}>
      {JSON.stringify(lineProperty)}
      <div>
        {[Color.BLACK, Color.RED, Color.BLUE].map((color, i) => (
          <IconButton
            key={i}
            onClick={() => setLineProperty({ ...lineProperty, color })}
            iconClassName={tw(`text-[${color.hexColor}]`)}
          >
            <BsFillPencilFill />
          </IconButton>
        ))}
        <input
          type="range"
          min={1}
          max={30}
          value={lineProperty.width}
          onChange={(e) => setLineProperty({ ...lineProperty, width: Number(e.target.value) })}
        />
      </div>

      <div
        ref={ref}
        className={tw("ring ring-black h-96")}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleStop}
        onMouseLeave={handleStop}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleStop}
        onTouchCancel={handleStop}
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
    </Suspense>
  );
};

export default SvgCanvas;
