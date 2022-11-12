// window.onload = function afterWebPageLoad() {
//     let curImg = document.getElementById('cur-img');
//     let uploadBtn = document.getElementById("file-upload");
//     uploadBtn.addEventListener("change", (e) => {
//         curImg.src = URL.createObjectURL(e.target.files[0]);
//         predictImg(curImg);
//     }, false);
// }

var scores = [];

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
            score = await predictImg(cur);
            console.log("avant : score")
            console.log(score)

            console.log("après : score")
            console.log(score)
            // console.log("score");
            // console.log(score);
            scores.push(score);
        }
        console.log("scores")
        console.log(scores)
    }, false);


    let uploadCatBtn = document.getElementById("directory-upload-cat");
    uploadCatBtn.addEventListener("change", async (e) => {
        for (const image of e.target.files) {
            console.log(image);
            cur = document.createElement('img')
            cur.src = URL.createObjectURL(image);
            score = await predictImg(cur);
            console.log("avant : score")
            console.log(score)

            score = 1 - score;

            console.log("après : score")
            console.log(score)

            scores.push(score);
        }
        console.log("scores")
        console.log(scores)
    }, false);
}
function computeAccuracy1(scores){
    var sum = 0;
    scores.forEach(score => {
        sum = sum + score;
    });
    return sum/scores.length;
}

function computeAccuracy2(scores){
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
    var accuracy = computeAccuracy1(scores, "dog");
    console.log("accuracy")
    console.log(accuracy)
    var accuracy2 = computeAccuracy2(scores, "dog");
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