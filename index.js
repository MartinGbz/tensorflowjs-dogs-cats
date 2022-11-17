window.onload = function afterWebPageLoad() {
    let curImg = document.getElementById('cur-img');
    let uploadBtn = document.getElementById("file-upload");
    uploadBtn.addEventListener("change", (e) => {
        curImg.src = URL.createObjectURL(e.target.files[0]);
        //predictImg(curImg);
        predictOnnx(curImg);
    }, false);
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