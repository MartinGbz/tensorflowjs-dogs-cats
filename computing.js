//import * as ort from './node_modules/onnxruntime-web/lib/onnxjs/model.js';
const MAX_SIGNED_VALUE = 255.0;
const WIDTH = 180;
const DIMS = [1, WIDTH, WIDTH, 3];
const MAX_LENGTH = DIMS[0] * DIMS[1] * DIMS[2] * DIMS[3];



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
    console.log(batched);
    return batched
}

async function predictOnnx(img){
    console.log("predictOnnx");
    try {
        // create a new session and load the specific model.
        console.time('loadLayersModelOnnx');
        const session = await ort.InferenceSession.create('./models/model_tf.onnx');
        console.timeEnd('loadLayersModelOnnx');

        // prepare image to be interpreted by the model
        console.time('preprocessSimplifiedOnnx');
        const imgFormatted = preprocessSimplifiedOnnx(img);
        console.timeEnd('preprocessSimplifiedOnnx');

        
        // prepare input and output of the model.
        //input_name = session.get_inputs()[0].name
        const input_name = "input_1";
        //output_name = session.get_outputs()[0].name
        output_name = "dense";
       // const input_data = new Float32Array(imgFormatted);
        // convert to float32
  
        const inputTensor = imageDataToTensor(imgFormatted, DIMS);
        // return ort.Tensor
        
        const feeds = {input_1: inputTensor};
    
        // run the model
        console.time('predict');
        //const results = await session.run([output_name], feeds)[0]
        const results = await session.run(feeds);
        console.timeEnd('predict');
        console.log(results);
        const [maxValue, maxIndex] = argMax(results.dense.data);
        console.log(maxValue);
        console.log(maxIndex);
        
        // read from results
        
        displayResult(maxValue)

    } catch (e) {
        document.write(`failed to inference ONNX model: ${e}.`);
    }
    
}

function preprocessSimplifiedOnnx(img)
{
    //convert the image data to a tensor 
    let tensor = tf.browser.fromPixels(img);
    //resize to 180 X 180
    const resized = tf.image.resizeBilinear(tensor, [180, 180]).toFloat();
    // //We add a dimension to get a batch shape 
    const batched = resized.expandDims(0);
    console.log(batched);
    // Transform the image in numpy array for onnx treatment
    //img_numpy_array = np.array(batched)
    //utilisation de la bibliothèque numjs, numpy n'existe pas en js
    const img_numpy_array = nj.float32(batched);
    const img_float32_array = Float32Array.from(img_numpy_array);

    return img_float32_array;
}

function imageDataToTensor(data, dims) {
    // 1. filter out alpha
    // 2. transpose from [224, 224, 3] -> [3, 224, 224]
    /*const [R, G, B] = [[], [], []];
    for (let i = 0; i < data.length; i += 4) {
      R.push(data[i]);
      G.push(data[i + 1]);
      B.push(data[i + 2]);
      // here we skip data[i + 3] because it's the alpha channel
    }
    const transposedData = R.concat(G).concat(B);
  */
    const transposedData = data;
    // convert to float32
    let i,
      l = transposedData.size; // length, we need this for the loop
    
    const float32Data = new Float32Array(MAX_LENGTH); // create the Float32Array for output
    for (i = 0; i < l; i++) {
      float32Data[i] = transposedData[i] / MAX_SIGNED_VALUE; // convert to float
    }

    // return ort.Tensor
    const inputTensor = new ort.Tensor("float32", float32Data, dims);
    console.log(inputTensor);
    return inputTensor;
}

function argMax(arr) {
    let max = arr[0];
    let maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }
    return [max, maxIndex];
  }