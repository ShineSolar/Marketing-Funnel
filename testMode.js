// this JS is suppose to differ whether we are in testing mode, so we can test the zap call, without having to interfere with production

// start off with testMode = false;
let testMode = false;
// set a status param, useful for when it hits luminary
let statusParam;
// get url parameters
const testModeUrlParams = new URLSearchParams(window.location.search);

// if we are in testMode
if (testModeUrlParams.get('testMode')) {
    // set testMode to true
    testMode = true;
    // get the status param
    statusParam = testModeUrlParams.get('status');
    // set the status param
    // default it to 77 (dev test)
    if (statusParam === null || !statusParam) statusParam = 77;
} else {
    // if not in testMode, make sure testMode is set to false
    testMode = false;
}

// if testMode is true, then we will call this zap
// pass in the leadSource
async function testZap(questionAnswerObj) {
    let ajax = new XMLHttpRequest();

    // prep the object, add in leadTrackingId and the status
    // parse the onject so we can add those values
    let inputValues = typeof questionAnswerObj == 'string' ? JSON.parse(questionAnswerObj) : questionAnswerObj;
    
    // ZAP: "15 Dollar Solar Savings . COM to Luminary" Test Mode
    ajax.open("POST", "https://hooks.zapier.com/hooks/catch/1681335/bsrajk1/");
    // send the object, make sure to stringify it
    ajax.send(JSON.stringify(inputValues));
}