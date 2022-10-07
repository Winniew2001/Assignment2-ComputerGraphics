class Lambertian {
    constructor(albedo) {
        this.albedo = albedo;
    }

    scatter(ray, record) {
        let scatterRecord = new ScatterRecord();
        let scatterDirection = record.normal.add(Vec3.randomInUnitVector());
        if (scatterDirection.nearZero()){
            scatterDirection = record.normal;
        }

        scatterRecord.rayScattered = new Ray(record.point, scatterDirection);
        scatterRecord.attenuation = this.albedo;
        scatterRecord.isScattered = true;

        return scatterRecord;
    }
}