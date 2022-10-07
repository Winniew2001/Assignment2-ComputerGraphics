class Metal {
    constructor(albedo, fuzz) {
        this.albedo = albedo;
        if (fuzz < 1) {
            this.fuzz = fuzz;
        } else {
            this.fuzz = 1;
        }
    }

    scatter(ray, record) {
        let scatterRecord = new ScatterRecord();
        let reflected = ray.direction.reflect(record.normal).unitVector();
        scatterRecord.rayScattered = new Ray(record.point, reflected.add(Vec3.randomInUnitSphere()
            .multiply(this.fuzz)));
        scatterRecord.attenuation = this.albedo;

        scatterRecord.isScattered = (scatterRecord.rayScattered.direction.dot(record.normal)) > 0;
        return scatterRecord;

    }
}