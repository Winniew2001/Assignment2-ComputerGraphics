const ASPECT_RATIO = 16.0 / 9.0;
const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = IMAGE_WIDTH / ASPECT_RATIO;
const SAMPLES_PER_PIXEL = 100;
const MAX_DEPTH = 50;

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

function blueWhiteGradient() {
    function rayToColor(ray){
        return createGradient(ray);
    }
    display(rayToColor);
}

function redSphere() {
    function hitSphere(center, radius, ray){
         return getDiscriminant(center, radius, ray)[0] > 0;
    }

    function rayToColor(ray){
        if (hitSphere(new Vec3(0,0,-1), 0.5, ray)){
            return new Vec3(1,0,0);
        }
        return createGradient(ray);
    }
    display(rayToColor);
}

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
            let normal = (ray.at(t).subtract(new Vec3(0,0,-1))).unitVector();
            let normalColor = new Vec3(normal.x + 1, normal.y + 1, normal.z + 1);
            return normalColor.multiply(0.5);
        }
        let unitDirection = ray.direction.unitVector();
        t = 0.5*(unitDirection.y + 1.0);
        let color = new Vec3(1.0, 1.0, 1.0);
        let color2 = new Vec3(0.5, 0.7, 1.0);
        let gradient = color.multiply(1.0-t).add(color2.multiply(t));
        return new Vec3(gradient.x, gradient.y, gradient.z);
    }
    display(rayToColor);
}

function sphereAndGround() {
    function rayToColor(ray, world){
        let record = world.worldHit(ray, 0, Infinity);
        if (record.hit){
            return record.normal.add(new Vec3(1,1,1).multiply(0.5));
        }
        return createGradient(ray);
    }
    displayWorld(rayToColor);
}

function antialiasing() {
    function rayToColor(ray, world){
        let record = world.worldHit(ray, 0, Infinity);
        if (record.hit){
            return record.normal.add(new Vec3(1,1,1).multiply(0.5));
        }
        return createGradient(ray);
    }
    displayWorldAntialiasing(rayToColor);
}

function diffuseSphere() {
    function rayToColor(ray, world, maxDepth){
        if (maxDepth <= 0){
            return new Vec3(0,0,0);
        }

        let record = world.worldHit(ray, 0.001, Infinity);
        if (record.hit){
            let target = (record.point).add(record.normal).add(Vec3.randomInUnitVector());
            return rayToColor(new Ray(record.point, target.subtract(record.point)), world, maxDepth-1)
                .multiply(0.5);
        }

        return createGradient(ray);
    }

    displayMetalOrDiffuse(rayToColor, createDefaultWorld());
}

function metalSpheres() {
    function rayToColor(ray, world, maxDepth){
        if (maxDepth <= 0){
            return new Vec3(0,0,0);
        }

        let record = world.worldHit(ray, 0.001, Infinity);
        if (record.hit){
            let scatterRec = record.material.scatter(ray, record);
            if (scatterRec.isScattered){
                return rayToColor(scatterRec.rayScattered, world, maxDepth-1)
                    .multiplyByVector(scatterRec.attenuation);
            }
            return new Vec3(0,0,0);
        }
        return createGradient(ray);
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


function createDefaultWorld(){
    let world = new World;
    world.add(new Sphere(new Vec3(0,0,-1), 0.5));
    world.add(new Sphere(new Vec3(0,-100.5,-1), 100));
    return world;
}


function createGradient(ray){
    let unitDirection = ray.direction.unitVector();
    let t = 0.5*(unitDirection.y + 1.0);
    let color = new Vec3(1.0, 1.0, 1.0);
    let color2 = new Vec3(0.5, 0.7, 1.0);
    let gradient = color.multiply(1.0-t).add(color2.multiply(t));
    return new Vec3(gradient.x, gradient.y, gradient.z);
}


function display(rayToColor){
    //Image
    const image = [];

    //Camera
    let camera = new Camera();

    //Render
    for (let j = IMAGE_HEIGHT-1; j >= 0; --j) {
        //console.log("Scanlines remaining: " + j);
        for (let i = 0; i < IMAGE_WIDTH; ++i) {
            let u = i / (IMAGE_WIDTH-1);
            let v = j/ (IMAGE_HEIGHT-1);
            let ray = camera.getRay(u, v);

            image.push(rayToColor(ray).toList());
        }
    }

    displayImage(IMAGE_WIDTH, IMAGE_HEIGHT, image);
}


function displayWorld(rayToColor){
    //Image
    const image = [];

    //Camera
    let camera = new Camera();

    //World
    let world = createDefaultWorld()

    //Render
    for (let j = IMAGE_HEIGHT-1; j >= 0; --j) {
        //console.log("Scanlines remaining: " + j);
        for (let i = 0; i < IMAGE_WIDTH; ++i) {
            let u = i / (IMAGE_WIDTH-1);
            let v = j/ (IMAGE_HEIGHT-1);
            let ray = camera.getRay(u, v);

            image.push(rayToColor(ray, world).toList());
        }
    }

    displayImage(IMAGE_WIDTH, IMAGE_HEIGHT, image);
}


function displayWorldAntialiasing(rayToColor){
    //Image
    const image = [];

    //Camera
    let camera = new Camera();

    //World
    let world = createDefaultWorld()

    //Render
    for (let j = IMAGE_HEIGHT-1; j >= 0; --j) {
        //console.log("Scanlines remaining: " + j);
        for (let i = 0; i < IMAGE_WIDTH; ++i) {
            let pixelColor = new Vec3(0,0,0);
            for (let s = 0; s < SAMPLES_PER_PIXEL; s++){
                let u = (i + Math.random()) / (IMAGE_WIDTH-1);
                let v = (j + Math.random()) / (IMAGE_HEIGHT-1);
                let ray = camera.getRay(u, v);
                pixelColor = pixelColor.add(rayToColor(ray, world));
            }
            pixelColor = pixelColor.multiply(1/SAMPLES_PER_PIXEL);
            image.push(pixelColor.toList());
        }
    }
    displayImage(IMAGE_WIDTH, IMAGE_HEIGHT, image);
}


function displayMetal(rayToColor) {
    //World
    let world = new World;
    let materialGround = new Lambertian(new Vec3(0.8,0.8,0.0));
    let materialCenter = new Lambertian(new Vec3(0.7,0.3,0.3));
    let materialLeft = new Metal(new Vec3(0.8,0.8,0.8), 0.3);
    let materialRight = new Metal(new Vec3(0.8,0.6,0.2), 1.0);

    world.add(new Sphere(new Vec3(0, -100.5, -1), 100, materialGround));
    world.add(new Sphere(new Vec3(0, 0, -1), 0.5, materialCenter));
    world.add(new Sphere(new Vec3(-1, 0, -1), 0.5, materialLeft));
    world.add(new Sphere(new Vec3(1, 0, -1), 0.5, materialRight));

    displayMetalOrDiffuse(rayToColor, world);
}


function displayMetalOrDiffuse(rayToColor, world){
    //Image
    const image = [];

    //Camera
    let camera = new Camera();

    for (let j = IMAGE_HEIGHT-1; j >= 0; --j) {
        //console.log("Scanlines remaining: " + j);
        for (let i = 0; i < IMAGE_WIDTH; ++i) {
            let pixelColor = new Vec3(0,0,0);
            for (let s = 0; s < SAMPLES_PER_PIXEL; s++){
                let u = (i + Math.random()) / (IMAGE_WIDTH-1);
                let v = (j + Math.random()) / (IMAGE_HEIGHT-1);
                let ray = camera.getRay(u, v);
                pixelColor = pixelColor.add(rayToColor(ray, world, MAX_DEPTH));
            }
            pixelColor = pixelColor.multiply(1/SAMPLES_PER_PIXEL);
            pixelColor = pixelColor.squareRoot();
            image.push(pixelColor.toList());
        }
    }
    displayImage(IMAGE_WIDTH, IMAGE_HEIGHT, image);
}
