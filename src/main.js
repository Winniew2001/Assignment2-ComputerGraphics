//firstImage();
//blueWhiteGradient();
//redSphere();
//normalsSphere();
//sphereAndGround();
//antialiasing();
//diffuseSphere();
metalSpheres();

/**
 * Default image that came with the template.
 */
function firstImage() {
    //Image
    const imageWidth = 256;
    const imageHeight = 256;
    const image = [];

    for (let j = imageHeight-1; j >= 0; --j) {
        console.log("Scanlines remaining: " + j);
        for (let i = 0; i < imageWidth; ++i) {
            const pixel = [];
            pixel.push(i / (imageWidth-1));
            pixel.push(j / (imageHeight-1));
            pixel.push(0.25);

            image.push(pixel);
        }
    }

    displayImage(imageWidth, imageHeight, image);
}

/**
 * Displays an image with blue and white gradient.
 */
function blueWhiteGradient() {
    function rayToColor(ray){
        return gradient(ray);
    }
    display(rayToColor);
}

/**
 * Displays an image with a red sphere on a blue/white gradient.
 */
function redSphere() {
    function hitSphere(center, radius, ray){
         return getDiscriminant(center, radius, ray)[0] > 0;
    }

    function rayToColor(ray){
        if (hitSphere(new Vec3(0,0,-1), 0.5, ray)){
            return new Vec3(1,0,0);
        }
        return gradient(ray);
    }
    display(rayToColor);
}

/**
 * Displays an image with a sphere colored according to its normal vectors and a blue/white gradient.
 */
function normalsSphere() {
    function hitSphere(center, radius, ray){
        let discriminant = getDiscriminant(center, radius, ray);
        if (discriminant[0] > 0){
            return ((- discriminant[2] - Math.sqrt(discriminant[0]))) / (2 * discriminant[1]);
        } else {
            return -1;
        }
    }

    function rayToColor(ray){
        let t = hitSphere(new Vec3(0, 0, -1), 0.5, ray);
        if (t > 0.0){
            let N = (ray.at(t).subtract(new Vec3(0,0,-1))).unitVector();
            let n_color = new Vec3(N.x + 1, N.y + 1, N.z + 1);
            return n_color.multiply(0.5);
        }
        let unit_direction = ray.direction.unitVector();
        t = 0.5*(unit_direction.y + 1.0);
        let color = new Vec3(1.0, 1.0, 1.0);
        let color2 = new Vec3(0.5, 0.7, 1.0);
        let gradient = color.multiply(1.0-t).add(color2.multiply(t));
        return new Vec3(gradient.x, gradient.y, gradient.z);
    }
    display(rayToColor);
}

/**
 * Displays an image with the normalSphere and grass ground.
 */
function sphereAndGround() {
    function rayToColor(ray, world){
        let rec = world.worldHit(ray, 0, Infinity);
        if (rec.hit){
            return rec.normal.add(new Vec3(1,1,1).multiply(0.5));
        }
        return gradient(ray);
    }
    displayWorld(rayToColor);
}

/**
 * Displays previous image but smoother.
 */
function antialiasing() {
    function rayToColor(ray, world){
        let rec = world.worldHit(ray, 0, Infinity);
        if (rec.hit){
            return rec.normal.add(new Vec3(1,1,1).multiply(0.5));
        }
        return gradient(ray);
    }
    displayWorldAntialiasing(rayToColor);
}

/**
 * Displays previous image but with depth.
 */
function diffuseSphere() {
    function rayToColor(ray, world, max_depth){
        if (max_depth <= 0){
            return new Vec3(0,0,0);
        }

        let rec = world.worldHit(ray, 0.001, Infinity);
        if (rec.hit){
            let target = (rec.point).add(rec.normal).add(Vec3.random_in_unit_sphere());
            return rayToColor(new Ray(rec.point, target.subtract(rec.point)), world, max_depth-1).multiply(0.5)
        }

        return gradient(ray);
    }

    displayMetalOrDiffuse(rayToColor, defaultWorld());
}

/**
 * Displays the final image.
 */
function metalSpheres() {
    function rayToColor(ray, world, max_depth){
        if (max_depth <= 0){
            return new Vec3(0,0,0);
        }

        let rec = world.worldHit(ray, 0.001, Infinity);
        if (rec.hit){
            let s_rec = rec.material.scatter(ray, rec)
            if (s_rec.isScattered){
                return rayToColor(s_rec.rayScattered, world, max_depth-1).multiplyByVector(s_rec.attenuation);
            }
            return new Vec3(0,0,0);
        }
        return gradient(ray);
    }
    displayMetal(rayToColor);
}


////////////////////////////// Trying to remove code duplication //////////////////////////////

function getDiscriminant(center, radius, ray){
    let oc = ray.origin.subtract(center);
    let a = ray.direction.dot(ray.direction);
    let b = oc.dot(ray.direction) * 2.0;
    let c = oc.dot(oc) - radius*radius;
    let discriminant = b * b - 4 * a * c
    return [discriminant, a, b];
}


function defaultWorld(){
    let world = new World;
    world.add(new Sphere(new Vec3(0,0,-1), 0.5));
    world.add(new Sphere(new Vec3(0,-100.5,-1), 100));
    return world;
}


function gradient(ray){
    let unit_direction = ray.direction.unitVector();
    let t = 0.5*(unit_direction.y + 1.0);
    let color = new Vec3(1.0, 1.0, 1.0);
    let color2 = new Vec3(0.5, 0.7, 1.0);
    let gradient = color.multiply(1.0-t).add(color2.multiply(t));
    return new Vec3(gradient.x, gradient.y, gradient.z);
}


function display(rayToColor){
    //Image
    const aspect_ratio = 16.0 / 9.0;
    const imageWidth = 400;
    const imageHeight = (imageWidth / aspect_ratio);
    const image = [];

    //Camera
    let camera = new Camera();

    //Render
    for (let j = imageHeight-1; j >= 0; --j) {
        console.log("Scanlines remaining: " + j);
        for (let i = 0; i < imageWidth; ++i) {
            let u = i / (imageWidth-1);
            let v = j/ (imageHeight-1);
            let ray = camera.getRay(u, v);

            image.push(rayToColor(ray).toList());
        }
    }

    displayImage(imageWidth, imageHeight, image);
}


function displayWorld(rayToColor){
    //Image
    const aspect_ratio = 16.0 / 9.0;
    const imageWidth = 400;
    const imageHeight = imageWidth / aspect_ratio;
    const image = [];

    //Camera
    let camera = new Camera();

    //World
    let world = defaultWorld()

    //Render
    for (let j = imageHeight-1; j >= 0; --j) {
        console.log("Scanlines remaining: " + j);
        for (let i = 0; i < imageWidth; ++i) {
            let u = i / (imageWidth-1);
            let v = j/ (imageHeight-1);
            let ray = camera.getRay(u, v);

            image.push(rayToColor(ray, world).toList());
        }
    }

    displayImage(imageWidth, imageHeight, image);
}


function displayWorldAntialiasing(rayToColor){
    //Image
    const aspect_ratio = 16.0 / 9.0;
    const imageWidth = 400;
    const imageHeight = imageWidth / aspect_ratio;
    const samples_per_pixel = 100;
    const image = [];

    //Camera
    let camera = new Camera();

    //World
    let world = defaultWorld()

    //Render
    for (let j = imageHeight-1; j >= 0; --j) {
        //console.log("Scanlines remaining: " + j);
        for (let i = 0; i < imageWidth; ++i) {
            let pixel_color = new Vec3(0,0,0);
            for (let s = 0; s < samples_per_pixel; s++){
                let u = (i + Math.random()) / (imageWidth-1);
                let v = (j + Math.random()) / (imageHeight-1);
                let ray = camera.getRay(u, v);
                pixel_color = pixel_color.add(rayToColor(ray, world));
            }
            pixel_color = pixel_color.multiply(1/samples_per_pixel);
            image.push(pixel_color.toList());
        }
    }
    displayImage(imageWidth, imageHeight, image);
}


function displayMetal(rayToColor) {
    //World
    let world = new World;
    let material_ground = new Lambertian(new Vec3(0.8,0.8,0.0));
    let material_center = new Lambertian(new Vec3(0.7,0.3,0.3));
    let material_left = new Metal(new Vec3(0.8,0.8,0.8), 0.3);
    let material_right = new Metal(new Vec3(0.8,0.6,0.2), 1.0);

    world.add(new Sphere(new Vec3(0, -100.5, -1), 100, material_ground));
    world.add(new Sphere(new Vec3(0, 0, -1), 0.5, material_center));
    world.add(new Sphere(new Vec3(-1, 0, -1), 0.5, material_left));
    world.add(new Sphere(new Vec3(1, 0, -1), 0.5, material_right));

    displayMetalOrDiffuse(rayToColor, world);
}


function displayMetalOrDiffuse(rayToColor, world){
    //Image
    const aspect_ratio = 16.0 / 9.0;
    const imageWidth = 400;
    const imageHeight = imageWidth / aspect_ratio;
    const samples_per_pixel = 100;
    const max_depth = 50;

    const image = [];

    //Camera
    let camera = new Camera();

    for (let j = imageHeight-1; j >= 0; --j) {
        //console.log("Scanlines remaining: " + j);
        for (let i = 0; i < imageWidth; ++i) {
            let pixel_color = new Vec3(0,0,0);
            for (let s = 0; s < samples_per_pixel; s++){
                let u = (i + Math.random()) / (imageWidth-1);
                let v = (j + Math.random()) / (imageHeight-1);
                let ray = camera.getRay(u, v);
                pixel_color = pixel_color.add(rayToColor(ray, world, max_depth));
            }
            pixel_color = pixel_color.multiply(1/samples_per_pixel);
            pixel_color = pixel_color.squareRoot();
            image.push(pixel_color.toList());
        }
    }
    displayImage(imageWidth, imageHeight, image);
}
