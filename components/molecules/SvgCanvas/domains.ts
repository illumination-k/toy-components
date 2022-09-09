import Color from "../../../libs/color";

export type Point = {
  x: number;
  y: number;
};

export type Line = {
  strokeColor: Color;
  strokeWidth: number;
  points: Point[];
};

export type EraserLine = {
  strokeWidth: number;
  points: Point[];
};

export class LineGroup {
  eraserLines: EraserLine[];
  lines: Line[];

  constructor(lines: Line[] = [], eraserLines: EraserLine[] = []) {
    this.eraserLines = eraserLines;
    this.lines = lines;
  }

  pushLinePoint(point: Point) {
    this.lines[this.lines.length - 1].points.push(point);
  }

  pushEraserPoint(point: Point) {
    this.eraserLines[this.eraserLines.length - 1].points.push(point);
  }
}

export class LineGroups {
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

  pushNewEraserLine(eraserLine: EraserLine) {
    this.lastLineGroup.eraserLines.push(eraserLine);
  }

  pushLinePoint(point: Point) {
    this.lastLineGroup.pushLinePoint(point);
  }

  pushEraserPoint(point: Point) {
    this.lastLineGroup.pushEraserPoint(point);
  }

  clone() {
    const c = { ...this };
    Object.setPrototypeOf(c, Object.getPrototypeOf(this));

    return c;
  }
}
