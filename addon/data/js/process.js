self.port.on("videoUrl", function onReceiveData(videoUrl) {
    document.getElementById("download").href = videoUrl;
});

self.port.on("videoImage", function onReceiveData(videoImage) {
    document.getElementById("video-image").src = videoImage;
});