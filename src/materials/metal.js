class Metal {
    constructor(albedo, fuzz) {
        this.albedo = albedo;
        if (fuzz < 1) {
            this.fuzz = fuzz;
        } else {
            this.fuzz = 1;
        }
    }

    scatter(ray, rec) {
        let scatterRecord = new ScatterRecord();
        let reflected = ray.direction.reflect(rec.normal).unitVector();
        scatterRecord.rayScattered = new Ray(rec.point, reflected.add(Vec3.randomInUnitSphere().multiply(this.fuzz)));
        scatterRecord.attenuation = this.albedo;

        scatterRecord.isScattered = (scatterRecord.rayScattered.direction.dot(rec.normal)) > 0;
        return scatterRecord;

    }
}