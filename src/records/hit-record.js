class HitRecord {
    constructor() {
        this.point = new Vec3(0, 0, 0);
        this.normal = new Vec3(0, 0, 0);
        this.t = 0;
        this.material = {};
        this.hit = false;
    }
    
    setFaceNormal(ray, outwardNormal) {
        let front_face = ray.direction.dot(outwardNormal) < 0;
        this.normal = front_face ? outwardNormal : outwardNormal.multiply(-1);
    }
};