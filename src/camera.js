class Camera {
    aspectRatio = 16.0 / 9.0;
    viewportHeight = 2.0;
    viewportWidth = this.aspectRatio * this.viewportHeight;
    focalLength = 1.0;
    origin = new Vec3(0, 0, 0);
    horizontal = new Vec3(this.viewportWidth, 0.0, 0.0);
    vertical = new Vec3(0.0, this.viewportHeight, 0.0);
    lowerLeftCorner = this.origin.subtract(this.horizontal.multiply(0.5)).subtract(this.vertical.multiply(0.5)).subtract(new Vec3(0, 0, this.focalLength));

    getRay(u, v) {
        let s1 = this.horizontal.multiply(u);
        let s2 = this.vertical.multiply(v);
        return new Ray(this.origin, this.lowerLeftCorner.add(s1).add(s2).subtract(this.origin));
    }
}