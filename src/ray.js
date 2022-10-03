class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    
    at(t) {
        const point = this.origin.add(this.direction.multiply(t));
        return new Vec3(point.x, point.y, point.z);
    }
}