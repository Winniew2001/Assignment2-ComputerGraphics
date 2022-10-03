const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

function displayImage(imageWidth, imageHeight, image)
{
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    for (let i=0; i<image.length; i++) {
        image[i][0] = clamp(image[i][0], 0, 1);
        image[i][1] = clamp(image[i][1], 0, 1);
        image[i][2] = clamp(image[i][2], 0, 1);
    }

    const imageData = context.createImageData(imageWidth, imageHeight);
    const data = imageData.data;
    for (let i=0; i<image.length; i++) {
        data[4 * i] = image[i][0] * 255;
        data[4 * i + 1] = image[i][1] * 255;
        data[4 * i + 2] = image[i][2] * 255;
        data[4 * i + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);
}

function clamp(x, min, max) {
    if (x < min) {
        return min;
    } else if (x > max) {
        return max;
    } else {
        return x;
    }
}