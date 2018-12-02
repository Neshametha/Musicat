var request = require('request-promise');
var azure  =  require('azure-storage');

module.exports = function (context, myBlob) {

context.log("Analyzing uploaded image " + context.bindingData.name + " for human emotions...");
var options = getAnalysisOptions(myBlob, process.env.SubscriptionKey, process.env.FaceEndpoint);
var emotions = analyzeAndProcessImage(context, options);
getFittingSongs(emotions);

function getAnalysisOptions(image, subscriptionKey, endpoint) {
    return  {
        uri:endpoint + "/detect?returnFaceAttributes=emotion",
        method: 'POST',
        body: image,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    }
};

function getFittingSongs(emotions) {
    var 
}

function analyzeAndProcessImage(context, options) {
    request(options)
    .then((response) => {

        response = JSON.parse(response);
        emotions = response[0]["faceAttributes"].emotion;

        context.log("Anger: "+emotions.anger);
        context.log("Contempt: "+emotions.contempt);
        context.log("Disgust: "+emotions.disgust);
        context.log("Fear: "+emotions.fear);
        context.log("Happiness: "+emotions.happiness);
        context.log("Neutral: "+emotions.neutral);
        context.log("Sadness: "+emotions.sadness);
        context.log("Surprise: "+emotions.surprise);
        
        var fileName = context.bindingData.name;
        var targetContainer = "processed";
        var blobService = azure.createBlobService(process.env.AzureWebJobsStorage);

        blobService.startCopyBlob(getStoragePath("uploaded", fileName), targetContainer, fileName, function (error, s, r) {
                        
            if(error) context.log(error);
            context.log(fileName + " created in " + targetContainer + ".");

            blobService.setBlobMetadata(targetContainer, fileName, 
            {
                "anger" : emotions.anger,
                "contempt" : emotions.contempt,
                "disgust" : emotions.disgust,
                "fear" : emotions.fear,
                "happiness" : emotions.happiness,
                "neutral" : emotions.neutral,
                "sadness" : emotions.sadness,
                "surprise" : emotions.surprise
            }, 

            function(error,s,r) {
                 if(error) context.log(error);
                 context.log(fileName + " metadata added successfully.");
            });
        });
        return emotions;
    })
    .catch((error) => context.log(error))
    .finally(() => context.done());
};

function getStoragePath(container,fileName) {
    var storageConnection = (process.env.WEBSITE_CONTENTAZUREFILECONNECTIONSTRING).split(';');
    var accountName = storageConnection[1].split('=')[1];
    return "https://" + accountName + ".blob.core.windows.net/" + container + "/" + fileName + ".jpg";
};
};