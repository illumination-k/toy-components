import Color from "../../../libs/color";

export type Point = {
  x: number;
  y: number;
};

export type DrawingMode = "pen" | "eraser";

export class Line {
  drawingMode: DrawingMode;
  private strokeColor: Color;
  private strokeWidth: number;
  private points: Point[];

  private constructor(strokeColor: Color, strokeWidth: number, points: Point[], drawingMode: DrawingMode) {
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.points = points;
    this.drawingMode = drawingMode;
  }

  static newEraserLine(strokeWidth: number, points: Point[] = []) {
    return new Line(Color.BLACK, strokeWidth, points, "eraser");
  }

  static newPenLine(strokeColor: Color, strokeWidth: number, points: Point[] = []) {
    return new Line(strokeColor, strokeWidth, points, "pen");
  }

  pushPoint(point: Point) {
    this.points.push(point);
  }

  get property() {
    return {
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      points: this.points,
    };
  }
}

export class LineGroup {
  eraserLines: Line[];
  lines: Line[];

  constructor(lines: Line[] = [], eraserLines: Line[] = []) {
    this.eraserLines = eraserLines;
    this.lines = lines;
  }
}

class LineGroups {
  lineGroups: LineGroup[];

  constructor(lineGroups: LineGroup[] = [new LineGroup()]) {
    this.lineGroups = lineGroups;
  }

  get lastLineGroup() {
    return this.lineGroups[this.lineGroups.length - 1];
  }

  pushNewLine(line: Line) {
    if (this.lastLineGroup.eraserLines.length !== 0) {
      this.lineGroups.push(new LineGroup([line]));
    } else {
      this.lastLineGroup.lines.push(line);
    }
  }

  pushNewEraserLine(eraserLine: Line) {
    this.lastLineGroup.eraserLines.push(eraserLine);
  }
}

export function groupingLines(lines: Line[]) {
  const lineGroups = new LineGroups();

  for (const line of lines) {
    switch (line.drawingMode) {
      case "pen":
        lineGroups.pushNewLine(line);
        break;
      case "eraser":
        lineGroups.pushNewEraserLine(line);
        break;
    }
  }

  return lineGroups.lineGroups;
}
