import Color from "../../../libs/color";

export type Point = {
  x: number;
  y: number;
};

export type DrawingMode = "pen" | "eraser";

export class Line {
  drawingMode: DrawingMode;
  strokeColor: Color;
  strokeWidth: number;
  points: Point[];

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
      strokeWdith: this.strokeWidth,
      points: this.points,
    };
  }
}

export function* groupingLines() {
}
