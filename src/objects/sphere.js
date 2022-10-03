class Sphere{
    constructor(center, radius, material){
        this.center = center;
        this.radius = radius;
        this.material = material;
    }

    hit(ray, t_min, t_max){
        let rec = new HitRecord();
        rec.hit = true;

        let oc = ray.origin.subtract(this.center);
        let a = ray.direction.squaredLength();
        let half_b = ray.direction.dot(oc);
        let c = oc.squaredLength() - (this.radius**2);

        let discriminant = (half_b**2) - (a * c);
        if(discriminant < 0){
            rec.hit = false;
        }

        let sqrt = Math.sqrt(discriminant);
        let root = (-half_b - sqrt) / a;
        if (root < t_min || t_max < root){
            root = (-half_b + sqrt) / a;
            if (root < t_min || t_max < root){
                rec.hit = false
            }
        }

        rec.t = root;
        rec.point = ray.at(rec.t);
        let outwardNormal = rec.point.subtract(this.center).multiply(1/this.radius);
        rec.setFaceNormal(ray, outwardNormal);
        rec.material = this.material;
        return rec;
    }
}