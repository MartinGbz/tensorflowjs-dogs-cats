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
    let uploadBtn = document.getElementById("directory-upload");
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


    let uploadCatBtn = document.getElementById("directory-upload-cat");
    uploadCatBtn.addEventListener("change", async (e) => {
        for (const image of e.target.files) {
            console.log(image);
            cur = document.createElement('img')
            cur.src = URL.createObjectURL(image);
            data = await predictImg(cur);

            // score = 1 - score;

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

function computeAccuracy1(){
    var returnedArray = [];
    
    var sum = 0;

    console.log("computeAccuracy1")
    console.log(scores)
    console.log(loadModelTimes)
    console.log(preprocessImageTimes)
    console.log(predictTimes)
    console.log(preprocessImageAndloadModelTimes)

    scores.forEach(score => {
        sum = sum + score;
    });
    returnedArray.push(sum/scores.length);
    sum = 0;

    loadModelTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/loadModelTimes.length);
    sum = 0;

    preprocessImageTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/preprocessImageTimes.length);
    sum = 0;

    predictTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/predictTimes.length);
    sum = 0;

    preprocessImageAndloadModelTimes.forEach(time => {
        sum = sum + time;
    });
    returnedArray.push(sum/preprocessImageAndloadModelTimes.length);
    sum = 0;

    console.log(returnedArray);

    return returnedArray;
}

function computeAccuracy2(){
    var sum = 0;
    scores.forEach(score => {
        if(score >= 0.5) {
            sum = sum + 1;
        }
    });
    return sum/scores.length;
}

function runAccuracy() {
    // CAT
    // var accuracyCat1 = computeAccuracy1(scores, "cat");
    // console.log("accuracyCat1")
    // console.log(accuracyCat1)
    // var accuracyCat2 = computeAccuracy2(scores, "cat");
    // console.log("accuracyCat2")
    // console.log(accuracyCat2)

    // DOG
    var accuracy = computeAccuracy1();
    console.log("accuracy")
    console.log(accuracy)
    var accuracy2 = computeAccuracy2();
    console.log("accuracy2")
    console.log(accuracy2)
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