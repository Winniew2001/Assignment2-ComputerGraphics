class Sphere{
    constructor(center, radius, material){
        this.center = center;
        this.radius = radius;
        this.material = material;
    }

    hit(ray, tMin, tMax){
        let record = new HitRecord();
        record.hit = true;

        let oc = ray.origin.subtract(this.center);
        let a = ray.direction.squaredLength();
        let halfOfB = ray.direction.dot(oc);
        let c = oc.squaredLength() - (this.radius**2);

        let discriminant = (halfOfB**2) - (a * c);
        if(discriminant < 0){
            record.hit = false;
        }

        let sqrt = Math.sqrt(discriminant);
        let root = (-halfOfB - sqrt) / a;
        if (root < tMin || tMax < root){
            root = (-halfOfB + sqrt) / a;
            if (root < tMin || tMax < root){
                record.hit = false
            }
        }

        record.t = root;
        record.point = ray.at(record.t);
        let outwardNormal = record.point.subtract(this.center).multiply(1/this.radius);
        record.setFaceNormal(ray, outwardNormal);
        record.material = this.material;
        return record;
    }
}