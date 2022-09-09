import React, { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { BsArrowLeft, BsArrowRight, BsDownload, BsFillEraserFill, BsFillPencilFill } from "react-icons/bs";
import { tw } from "twind";
import Color from "../../../libs/color";
import IconButton from "../../atoms/IconButton";

import { DrawingMode, groupingLines, Line, Point } from "./domains";
import Path from "./Path";

/**
 * Please see
 * - library: https://github.com/vinothpandian/react-sketch-canvas
 * - basic free hand svg implementation: https://pspdfkit.com/blog/2017/how-to-build-free-hand-drawing-using-react/
 * - bezier curve: https://francoisromain.medium.com/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74
 * - Eraser Impl: https://stackoverflow.com/questions/7751993/how-can-i-implement-eraser-function-in-svg
 */

type LineProperty = {
  color: Color;
  width: number;
};

export type SvgCanvasProps = {
  className?: string;
};

const SvgCanvas = ({ className }: SvgCanvasProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const drawingMode = useRef<DrawingMode>("pen");
  const history = useRef<Line[]>([]);

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

    setLines((prev) => {
      if (drawingMode.current === "pen") {
        return [...prev, Line.newPenLine(lineProperty.color, lineProperty.width, [point])];
      } else {
        return [...prev, Line.newEraserLine(lineProperty.width, [point])];
      }
    });
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawing.current) {
      return;
    }

    event.cancelable && event.preventDefault();

    const point = relativeCoordinatesForEvent(event);
    startTransition(() => {
      setLines((prev) => {
        prev[prev.length - 1].pushPoint(point);

        return [...prev];
      });
    });
  };

  const handleStop = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    event.cancelable && event.preventDefault();
    isDrawing.current = false;
    history.current = [];
  };

  const undo = () => {
    const line = lines.pop();

    if (line) {
      history.current.push(line);
      setLines([...lines]);
    }
  };

  const redo = () => {
    const line = history.current.pop();

    if (line) {
      setLines([...lines, line]);
    }
  };

  const lineGroups = groupingLines(lines);

  // line(e1, e2) -> line(e1, e2) -> eraser1 -> line (e2) -> eraser2 -> line
  return (
    <Suspense fallback={"loading..."}>
      {JSON.stringify(lineProperty)}
      <div>
        {[Color.BLACK, Color.RED, Color.BLUE].map((color, i) => (
          <IconButton
            key={i}
            onClick={() => {
              drawingMode.current = "pen";
              setLineProperty({ ...lineProperty, color });
            }}
            iconClassName={tw(`text-[${color.hexColor}]`)}
          >
            <BsFillPencilFill />
          </IconButton>
        ))}
        <IconButton
          onClick={() => {
            drawingMode.current = "eraser";
          }}
        >
          <BsFillEraserFill />
        </IconButton>
        <input
          type="range"
          min={1}
          max={30}
          value={lineProperty.width}
          onChange={(e) => setLineProperty({ ...lineProperty, width: Number(e.target.value) })}
        />
        <IconButton onClick={undo}>
          <BsArrowLeft />
        </IconButton>
        <IconButton onClick={redo}>
          <BsArrowRight />
        </IconButton>
      </div>

      <div
        ref={ref}
        className={tw(className)}
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
          <defs>
            <symbol>
              <rect id="mask-background" width="100%" height="100%" fill="#fff"></rect>
              {lineGroups.map((lineGroup, i) => {
                const id = `eraser-group-${i}`;
                return (
                  <g id={id} key={id}>
                    {lineGroup.eraserLines.map((line, i) => {
                      return <Path key={`eraser-line-${i}`} {...line.property} strokeColor={Color.BLACK} />;
                    })}
                  </g>
                );
              })}
            </symbol>
          </defs>
          {lineGroups.map((lineGroup, i) => {
            return (
              <>
                <mask key={i} id={`mask-${i}`}>
                  <use href="#mask-background" />
                  {/* 自分のindexから最大まで */}
                  {Array.from(
                    { length: lineGroups.length },
                    (_, j) => j + i,
                  ).map((k) => {
                    return <use key={k} href={`#eraser-group-${k}`} />;
                  })}
                </mask>
                <g key={i} mask={`url(#mask-${i})`}>
                  {lineGroup.lines.map((line, i) => {
                    return <Path key={i} {...line.property} />;
                  })}
                </g>
              </>
            );
          })}
        </svg>
      </div>
    </Suspense>
  );
};

export default SvgCanvas;
