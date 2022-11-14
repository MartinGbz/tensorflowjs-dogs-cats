// window.onload = function afterWebPageLoad() {
//     let curImg = document.getElementById('cur-img');
//     let uploadBtn = document.getElementById("file-upload");
//     uploadBtn.addEventListener("change", (e) => {
//         curImg.src = URL.createObjectURL(e.target.files[0]);
//         predictImg(curImg);
//     }, false);
// }

var scores = [];
var loadModelTimes = [];
var preprocessImageTimes = [];
var predictTimes = [];
var preprocessImageAndloadModelTimes = [];
var data = [];

window.onload = function afterWebPageLoad() {
    let uploadBtn = document.getElementById("dogs-upload-folder");
    uploadBtn.addEventListener("change", async (e) => {
        // => parallel
        // e.target.files.forEach(async image => {
        //     console.log(image);
        //     score = await predictImg(image);
        //     console.log("score");
        //     console.log(score);
        //     scores.push(score);
        // });

        // => sequenciel
        for (const image of e.target.files) {
            console.log(image);
            cur = document.createElement('img')
            cur.src = URL.createObjectURL(image);
            data = await predictImg(cur);

            scores.push(data[0]);
            loadModelTimes.push(data[1]);
            preprocessImageTimes.push(data[2]);
            predictTimes.push(data[3]);
            preprocessImageAndloadModelTimes.push(data[2]+data[3]);

        }
        console.log("scores")
        console.log(scores)
        console.log(loadModelTimes)
        console.log(preprocessImageTimes)
        console.log(predictTimes)
        console.log(preprocessImageAndloadModelTimes)
    }, false);


    let uploadCatBtn = document.getElementById("cats-upload-folder");
    uploadCatBtn.addEventListener("change", async (e) => {
        firstTime = true;
        for (const image of e.target.files) {
            console.log(image);
            cur = document.createElement('img')
            cur.src = URL.createObjectURL(image);
            data = await predictImg(cur);

            scores.push(1-data[0]);
            loadModelTimes.push(data[1]);
            preprocessImageTimes.push(data[2]);
            predictTimes.push(data[3]);
            preprocessImageAndloadModelTimes.push(data[2]+data[3]);
        }
        console.log("scores")
        console.log(scores)
    }, false);
}


/**
 * 
 * @returns
 * [0] => scores
 * [1] => model loading time average
 * [2] => preprocessing image time average
 * [3] => predict time average
 * [4] => preprocessing image time average + predict time average
 * [5] => first model loading time
 * [5] => first image prediction time
 */
function computeAverage1(){
    console.log("computeAverage1")

    var returnedArray = [];
    
    var sum = 0;

    // scores
    scores.forEach(score => {
        sum = sum + score;
    });
    returnedArray.push(sum/scores.length);
    sum = 0;

    // model loading
    loadModelTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/loadModelTimes.length);
    sum = 0;

    // preprocessing
    preprocessImageTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/preprocessImageTimes.length);
    sum = 0;

    // predict
    predictTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/predictTimes.length);
    sum = 0;

    // preprocessing + predict
    preprocessImageAndloadModelTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/preprocessImageAndloadModelTimes.length);
    sum = 0;

    returnedArray.push(firstLayersModelLoadingTime);
    returnedArray.push(firstImagePredictionLoadingTime);

    return returnedArray;
}

function computeAverage2(){
    var sum = 0;
    scores.forEach(score => {
        if(score >= 0.5) {
            sum = sum + 1;
        }
    });
    return sum/scores.length;
}

function runAverage() {
    var average = computeAverage1();
    console.log("average")
    console.log(average)

    document.getElementById("scoreAverage").innerHTML = average[0]
    document.getElementById("loadModelAverage").innerHTML = average[1]
    document.getElementById("preprocessImageTimeAverage").innerHTML = average[2]
    document.getElementById("predictTimeAverage").innerHTML = average[3]
    document.getElementById("preprocessImageAndloadModelTimeAverage").innerHTML = average[4]
    document.getElementById("firstModelLoadingTime").innerHTML = average[5]
    document.getElementById("firstImagePredictionLoadingTime").innerHTML = average[6]

    var average2 = computeAverage2();
    console.log("average2")
    console.log(average2)
}

function displayResult(score){
    let result = document.getElementById('result');

    console.log(score)
    console.log('cat:')
    console.log(100 * (1 - score))
    console.log('dog:')
    console.log(100 * score)
    console.log("This image is "+ (100 * (1 - score)) +"% cat and "+ 100 * score +"% dog.");

    if(score < 0.5){
        //cat
        result.innerHTML = "It's a cat! (" + 100 * (1-score) + "%)"
    }
    else {
        //dog
        result.innerHTML = "It's a dog! (" + 100 * score + "%)"
    }
}

function startScoreScript() {
    let curImg = document.getElementById('cur-img');
    let uploadBtn = document.getElementById("file-upload");
    uploadBtn.addEventListener("change", (e) => {
        // for (let i = 0; i < e.target.files; i++) {
        //     const element = array[i];
        // }
        e.target.files.forEach(image => {
            console.log(image);
        });
        console.log("end");
        // curImg.src = URL.createObjectURL(e.target.files[0]);
        // predictImg(curImg);
    }, false);
}