

var l_imageArray = [];
var key_gruop = "";
var key_item = 0;
var navPreview = false;

var getBackgroundImage = function (i_iItem) {
    if(i_iItem !== undefined)
        key_item = i_iItem;

    var l_iLoop = 1, l_iInx = 0;
    while(l_iLoop < 32) {
        if(key_gruop == Data.items._groupedItems[l_iLoop].groupKey) {
            if(l_iInx == key_item)
                break;
            ++l_iInx;
        }
        ++l_iLoop;
    }

    return Data.items._groupedItems[l_iLoop].data.backgroundImage;
}
var setBackgroundImage = function (i_src) {
    var l_iLoop = 1, l_iInx = 0;
    while (l_iLoop < 32) {
        if (key_gruop == Data.items._groupedItems[l_iLoop].groupKey) {
            if (l_iInx == key_item)
                break;
            ++l_iInx;
        }
        ++l_iLoop;
    }
    Data.items._groupedItems[l_iLoop].data.backgroundImage = i_src;
}


var g_items;
var dataURLarray = [];



var OriginalPixelData;
var NumStrokes;
var CanvasDimensions;

var Context;
// Namespace and API aliases
var Pickers = Windows.Storage.Pickers;
var Imaging = Windows.Graphics.Imaging;

function addtxt() {

        var mycanvas = document.getElementById("can1");
        var context = mycanvas.getContext("2d");

        //reset字幕
        var url_img = new Image();
        url_img.src = dataURLarray[key_item];

        context.drawImage(url_img, 0, 0, 400, 300);
        var txt = document.getElementById("inputtxt");

        context.fillStyle = "white";
        context.font = "32px 微軟正黑體 ";
        context.textAlign = "center";
        var w = mycanvas.width;
        var h = mycanvas.height;
        context.fillText(txt.value, w / 2, h - 32);
        //重設
        l_imageArray[key_item] = new Image();
        l_imageArray[key_item].src = can1.toDataURL();
        setBackgroundImage(l_imageArray[key_item].src);

    
}
function saveHandler() {
    id("buttonSave").disabled = true;
    //id("buttonRender").disabled = true;
    WinJS.log && WinJS.log("Saving to a new file...", "sample", "status");

    // Keep data in-scope across multiple asynchronous methods.
    var encoderId;
    var filename;
    var stream;

    Helpers.getFileFromSavePickerAsync().then(function (file) {
        filename = file.name;

        switch (file.fileType) {
            case ".jpg":
                encoderId = Imaging.BitmapEncoder.jpegEncoderId;
                break;
            case ".bmp":
                encoderId = Imaging.BitmapEncoder.bmpEncoderId;
                break;
            case ".png":
            default:
                encoderId = Imaging.BitmapEncoder.pngEncoderId;
                break;
        }

        return file.openAsync(Windows.Storage.FileAccessMode.readWrite);
    }).then(function (_stream) {
        stream = _stream;

        // BitmapEncoder expects an empty output stream; the user may have selected a
        // pre-existing file.
        stream.size = 0;
        return Imaging.BitmapEncoder.createAsync(encoderId, stream);
    }).then(function (encoder) {
        var width = id("previewcan").width;
        var height = id("previewcan").height;
        Context = previewcan.getContext("2d");
        var outputPixelData = Context.getImageData(0, 0, width, height);

        encoder.setPixelData(
            Imaging.BitmapPixelFormat.rgba8,
            Imaging.BitmapAlphaMode.straight,
            width,
            height,
            96, // Horizontal DPI
            96, // Vertical DPI
            outputPixelData.data
            );

        return encoder.flushAsync();
    }).then(function () {
        WinJS.log && WinJS.log("Saved new file: " + filename, "sample", "status");
        id("buttonSave").disabled = false;
        //id("buttonRender").disabled = false;
    }).then(null, function (error) {
        WinJS.log && WinJS.log("Failed to save file: " + error.message, "sample", "error");
    }).done(function () {
        stream && stream.close();
    });
}



function previewHandler() {

    navPreview = true;
    //setBackgroundImage(can1.toDataURL());
    WinJS.Navigation.navigate("/pages/preview/preview.html");
    
}

function id(elementId) {
    return document.getElementById(elementId);
}



function openHandler() {
    resetState();

    
    Helpers.getFileFromOpenPickerAsync().done(function (file) {
        var objectUrl = window.URL.createObjectURL(file, { oneTimeOnly: true });
        setBackgroundImage(objectUrl);
        dataURLarray[key_item] = objectUrl;
        WinJS.Navigation.navigate("/pages/split/split.html");
       
    }, function (error) {
        WinJS.log && WinJS.log("Failed to load file: " + error.message, "sample", "error");
        resetState();
    });
}


function resetState() {
    id("cmdOpen").disabled = false;

    // Triggers a reset of the canvas contents.
    id("can1").width = id("can1").width;

    Context = null;
    //OriginalPixelData = null;
    NumStrokes = 0;
    //CanvasDimensions = {};
}

function drawcanvas()
{
    //load 選擇要編輯的圖放入畫布中
    //從dataurlarray中拿出來
    var image = new Image();
    var mycanvas = document.getElementById("can1");
    var context = mycanvas.getContext("2d");
    //load image
    //var inx = items[0].index;

    //image.src = dataURLarray[inx];
    image.src = getBackgroundImage();
    //var w = image.width;
    //var h = image.height;
    mycanvas.width = 400;
    mycanvas.height = 300;
    context.drawImage(image, 0, 0, 400, 300);
    inputtxt.textContent = "";

}


var mergeImg = function()
{
    for (var i = 0 ; i < 3; ++i)
    {
        l_imageArray[i] = new Image();
        l_imageArray[i].src = getBackgroundImage(i);
    }
    var precan = id("previewcan");
    var context = precan.getContext("2d");
    var w = l_imageArray[0].width / 1.5;
    var h = l_imageArray[0].height / 1.5;
    precan.width = w;
    precan.height = h * 3;
    for (var i = 0; i < 3; ++i)
        context.drawImage(l_imageArray[i], 0, i * h, w, h);
};