// 如需頁面控制項範本的簡介，請參閱下列文件:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var imageFile;
    WinJS.UI.Pages.define("/pages/preview/preview.html", {
        // 每當使用者巡覽至此頁面時，就會呼叫這個函式。它
        // 會將應用程式的資料填入頁面項目。
        ready: function (element, options) {

            
            id("cmdSave").addEventListener("click", saveHandler, false);
            id("shareButton").addEventListener("click", showShareUI, false);
            mergeImg();
            imageFile = previewcan.toDataURL;
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.addEventListener("datarequested", dataRequested);

            WinJS.log && WinJS.log("To show the AppBar, swipe up from the bottom of the screen, right-click, or press Windows Logo + z. To dismiss the bar, tap in the application, swipe, right-click, or press Windows Logo + z again.", "sample", "status");

        },
        
        unload: function () {
            // TODO: 回應離開這個頁面的導覽。
            // AppBarSampleUtils.removeAppBars();
            var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
            dataTransferManager.removeEventListener("datarequested", dataRequested);
            
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: 回應 viewState 中的變更。
        }
    });
    function dataRequested(e) {
        var request = e.request;
        var dataPackage = new Windows.ApplicationModel.DataTransfer.DataPackage();
        dataPackage.properties.title = id("titleInputBox").value;
        dataPackage.properties.description = id("descriptionInputBox").value;

        var deferral = request.getDeferral();
        // create an html fragment
        var safeHtml = Windows.ApplicationModel.DataTransfer.HtmlFormatHelper.createHtmlFormat("<div><img src='shareImage.png' /></div>");
        var imgData = Windows.Security.Cryptography.CryptographicBuffer.decodeFromBase64String(getImageDataFromCanvas());

        var memoryStream = new Windows.Storage.Streams.InMemoryRandomAccessStream();
        var dataWriter = new Windows.Storage.Streams.DataWriter(memoryStream);
        dataWriter.writeBuffer(imgData);

        dataWriter.storeAsync().done(function () {
            dataWriter.flushAsync().done(function () {
                var imgStream = dataWriter.detachStream();
                imgStream.seek(0);
                var streamReference = Windows.Storage.Streams.RandomAccessStreamReference.createFromStream(imgStream);

                dataPackage.resourceMap["shareImage.png"] = streamReference;

                dataPackage.setHtmlFormat(safeHtml);
                request.data = dataPackage;
                deferral.complete();
            });
        });

    }

    // Get the data as an image.
    function getImageDataFromCanvas() {
        var canvas1 = document.getElementById("previewcan");
        var myImage = canvas1.toDataURL("image/png");      
        return myImage.substr(22);
    }


    function showShareUI() {
        Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI();
    }
})();
