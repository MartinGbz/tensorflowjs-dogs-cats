let model;

async function predictImg(img){
    console.time('loadLayersModel');
    // can't do that because of the image hasn't the time to be built. So the model loading enable the program to wait.
    // not optimal at all => need to fix it
    // if(!model) {
    //     model = await tf.loadLayersModel('./models/model4/model.json');
    // }
    // else {
    //     console.log("model already loaded");
    //     console.log(model);
    // }
    model = await tf.loadLayersModel('./models/model4/model.json');
    console.timeEnd('loadLayersModel');
    console.time('preprocessSimplified');
    const imgFormatted = preprocessSimplified(img);
    console.timeEnd('preprocessSimplified');
    console.time('predict');
    const prediction = model.predict(imgFormatted).dataSync()
    console.timeEnd('predict');
    const score = prediction[0]
    return score;
    // displayResult(score)
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