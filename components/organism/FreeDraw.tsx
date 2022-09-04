import { useRef, useState } from "react";

import Konva from "konva";
import { Layer, Line, Stage } from "react-konva";
import { apply, tw } from "twind";
import IconButton from "../atoms/IconButton";

import { BsDownload, BsFillEraserFill, BsFillPencilFill } from "react-icons/bs";

type Tool = "pen" | "eraser";

type LineConfig = {
  tool: Tool;
  color: string;
  width: number;
};

type LineProperty = {
  tool: Tool;
  color: string;
  width: number;
  points: number[];
};

export type FreeDrawProps = {
  height?: number;
  width?: number;
};

// function from https://stackoverflow.com/a/15832662/512042
function downloadURI(uri: string, name: string) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// https://konvajs.org/docs/react/Free_Drawing.html

const FreeDraw = ({ height = 1600, width = 2000 }: FreeDrawProps) => {
  const [lineConfig, setLineConfig] = useState<LineConfig>({
    tool: "pen",
    color: "#000000",
    width: 10,
  });

  const [lines, setLines] = useState<LineProperty[]>([]);
  const isDrawing = useRef(false);

  // https://github.com/konvajs/react-konva/blob/950925060d5fd9cca748f570f8edc9f5f3cbfb91/src/ReactKonvaCore.tsx#L45-L49
  const stageRef = useRef<Konva.Stage | null>(null);

  const handleStart = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    isDrawing.current = true;
    const pos = e.target.getStage()?.getPointerPosition();
    setLines([...lines, { ...lineConfig, points: [pos?.x!, pos?.y!] }]);
  };

  const handleMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    e.target.preventDefault();
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point?.x!, point?.y!]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleStop = () => {
    isDrawing.current = false;
    // setHistory([]);
  };

  const pencilButtons = ["#000000", "#ff0000", "#0000ff"].map((color, key) => {
    return (
      <IconButton
        key={key}
        iconClassName={tw(`text-[${color}]`)}
        onClick={() => setLineConfig({ ...lineConfig, color, tool: "pen" })}
      >
        <BsFillPencilFill />
      </IconButton>
    );
  });

  return (
    <div>
      {JSON.stringify(lineConfig)}
      <div>
        {pencilButtons}
        <IconButton onClick={() => setLineConfig({ ...lineConfig, tool: "eraser" })}>
          <BsFillEraserFill />
        </IconButton>
        <input
          type="range"
          min={1}
          max={30}
          value={lineConfig.width}
          onChange={(e) => setLineConfig({ ...lineConfig, width: Number(e.target.value) })}
        />
        <IconButton
          onClick={() => {
            const uri = stageRef.current?.toDataURL();
            if (uri) {
              downloadURI(uri, "sample.png");
            }
          }}
        >
          <BsDownload />
        </IconButton>
      </div>
      <Stage
        className={tw("ring ring-black")}
        ref={stageRef}
        width={width}
        height={height}
        onMouseDown={handleStart}
        onMousemove={handleMove}
        onMouseup={handleStop}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleStop}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default FreeDraw;
