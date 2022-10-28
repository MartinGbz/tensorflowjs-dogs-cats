let model;

async function predictImg(img){
    console.log('gang');
    console.log(model);
    // const img = document.createElement('img');
    // img.src = './image-tests/906.jpg'
    // const img = document.getElementById('cur-img');
    console.time('loadLayersModel');
    model = await tf.loadLayersModel('./models/model3/model.json');
    console.timeEnd('loadLayersModel');
    console.time('preprocessSimplified');
    const imgFormatted = preprocessSimplified(img);
    console.timeEnd('preprocessSimplified');
    console.time('predict');
    const prediction = model.predict(imgFormatted).dataSync()
    console.timeEnd('predict');
    const score = prediction[0]
    displayResult(score)
}

function preprocess(img)
{
    //convert the image data to a tensor 
    // let tensor = tf.fromPixels(img)
    let tensor = tf.browser.fromPixels(img);
    //resize to 50 X 50
    const resized = tf.image.resizeBilinear(tensor, [180, 180]).toFloat()
    // Normalize the image 
    const offset = tf.scalar(255.0);
    const normalized = tf.scalar(1.0).sub(resized.div(offset));
    //We add a dimension to get a batch shape 
    const batched = normalized.expandDims(0)
    console.log('batched.shape')
    console.log(batched.shape)
    return batched
}

function preprocessSimplified(img)
{
    //convert the image data to a tensor 
    let tensor = tf.browser.fromPixels(img);
    //resize to 180 X 180
    const resized = tf.image.resizeBilinear(tensor, [180, 180]).toFloat()
    // //We add a dimension to get a batch shape 
    const batched = resized.expandDims(0)
    return batched
}