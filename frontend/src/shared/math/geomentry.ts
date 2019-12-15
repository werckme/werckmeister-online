export class Point {
    x:number = 0;
    y:number = 0;
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
    assign(other:Point): Point {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    add(other:Point): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }
    sub(other:Point) {
        return new Point(this.x - other.x, this.y - other.y);
    }
    mul(x: number) {
        return new Point(this.x * x, this.y * x);
    }
    abs() {
        return Math.sqrt( this.x**2 + this.y**2 );
    }
    distance(other:Point) {
        return other.sub(this).abs();
    }
    clone(): Point {
        return new Point().assign(this);
    }
}

export class ObservablePoint extends Point {
    private _x: number;
    private _y: number;
    onXChanged: (x: number) => number;
    onYChanged: (y: number) => number;
	get x(): number {
		return this._x;
	}
	set x(val: number) {
		if (this.onXChanged) {
            let n = this.onXChanged(val);
			this._x = n !== undefined ? n : val;
            return;
        }
        this._x = val;
    }
    get y(): number {
		return this._y;
	}
	set y(val: number) {
		if (this.onYChanged) {
            let n = this.onYChanged(val);
            this._y = n !== undefined ? n : val;
            return;
        }
        this._y = val;
	}
}

export class Rectangle {
    p0: Point;
    p1: Point;
    get width(): number { return this.p1.x - this.p0.x; }
    get height(): number { return this.p1.y - this.p0.y; }
    get x(): number { return this.p0.x; }
    get y(): number { return this.p0.y; }
    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.p0 = new Point(x,y);
        this.p1 = new Point(x + width, y + height);
    }
    contains(p: Point): boolean {
        return p.x >= this.x && p.y >= this.y && p.x <= this.p1.x && p.y <= this.p1.y;
    }
}