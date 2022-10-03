class Lambertian {
    constructor(albedo) {
        this.albedo = albedo;
    }

    scatter(ray, rec) {
        let scatterRecord = new ScatterRecord();
        let scatter_direction = rec.normal.add(Vec3.random_in_unit_sphere());
        if (scatter_direction.nearZero()){
            scatter_direction = rec.normal;
        }

        scatterRecord.rayScattered = new Ray(rec.point, scatter_direction);
        scatterRecord.attenuation = this.albedo;
        scatterRecord.isScattered = true;

        return scatterRecord;
    }
}