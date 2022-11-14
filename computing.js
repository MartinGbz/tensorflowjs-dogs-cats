let model;

var start;
var end;
var loadLayersModelTime;
var preprocessSimplifiedTime;
var predictTime;

var firstTime = true;
var firstLayersModelLoadingTime;
var firstImagePredictionLoadingTime;

/**
 * 
 * @param img image to predict
 * @returns array that contains : 
 * [0] => score
 * [1] => model loading time
 * [2] => preprocessing image time
 * [3] => predict time
 */
async function predictImg(img){
    // can't do that because of the image hasn't the time to be built. So the model loading enable the program to wait.
    // not optimal at all => need to fix it
    // if(!model) {
    //     model = await tf.loadLayersModel('./models/model4/model.json');
    // }
    // else {
    //     console.log("model already loaded");
    //     console.log(model);
    // }
    start = window.performance.now();
    model = await tf.loadLayersModel('./models/model4/model.json');
    end = window.performance.now();

    loadLayersModelTime = end - start;
    console.log('loadLayersModelTime')
    console.log(loadLayersModelTime)


    start = window.performance.now();
    const imgFormatted = preprocessSimplified(img);
    end = window.performance.now();

    preprocessSimplifiedTime = end - start;
    console.log('preprocessSimplifiedTime')
    console.log(preprocessSimplifiedTime)


    start = window.performance.now();
    const prediction = model.predict(imgFormatted).dataSync()
    end = window.performance.now();

    predictTime = end - start;
    console.log('predictTime')
    console.log(predictTime)


    const score = prediction[0]
    console.log('score')
    console.log(score)

    if(firstTime) {
        firstLayersModelLoadingTime = loadLayersModelTime;
        firstImagePredictionLoadingTime = predictTime;
        firstTime = false;
    }

    console.log('firstLayersModelLoadingTime');
    console.log(firstLayersModelLoadingTime);
    console.log('firstImagePredictionLoadingTime');
    console.log(firstImagePredictionLoadingTime);

    return [score, loadLayersModelTime, preprocessSimplifiedTime, predictTime];
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