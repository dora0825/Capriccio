// Provides shared imaging functionality to all scenarios, focusing on
// EXIF orientation, GPS, and rating metadata.
(function () {
    "use strict";

    WinJS.Namespace.define("Helpers", {
        // Converts a failure HRESULT (Windows error code) to a number which can be compared to the
        // WinRTError.number parameter. This allows us to define error codes in terms of well-known
        // Windows HRESULTs, found in winerror.h.
        "convertHResultToNumber": function (hresult) {
            if ((hresult > 0xFFFFFFFF) || (hresult < 0x80000000)) {
                throw new Error("Value is not a failure HRESULT.");
            }

            return hresult - 0xFFFFFFFF - 1;
        },

        "getAppData": function () {
            var file = Windows.ApplicationModel.Package.current.installedLocation;

            Windows.Storage.ApplicationData.current.localFolder.getFolderAsync;
            return file;
            //StorageFolder
        },



        // Opens a file picker with appropriate settings and asynchronously returns the selected file
        // Throws an exception if the user clicks cancel (there is no file).
        "getFileFromOpenPickerAsync": function () {
            // Attempt to ensure that the view is not snapped, otherwise the picker will not display.
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
                !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                throw new Error("File picker cannot display in snapped view.");
            }

            WinJS.log && WinJS.log("Loading image from picker...", "sample", "status");
            var picker = new Windows.Storage.Pickers.FileOpenPicker();
            picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.desktop;
            //picker.suggestedStartLocation = Windows.ApplicationModel.Package.current.installedLocation;

            //var file = Windows.Storage.StorageFile.getFileFromApplicationUriAsync("ms-appdata:///images");
            Helpers.fillDecoderExtensions(picker.fileTypeFilter);
            return picker.pickSingleFileAsync().then(function (file) {
                if (!file) {
                    throw new Error("User did not select a file.");
                }

                return file;
            });
        },

        // Opens a file picker with appropriate settings and asynchronously returns all of the
        // selected files. Throws an exception if the user clicks cancel (there is no file).
        /*"getFilesFromOpenPickerAsync": function () {
            // Attempt to ensure that the view is not snapped, otherwise the picker will not display.
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
                !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                throw new Error("File picker cannot display in snapped view.");
            }

            WinJS.log && WinJS.log("Loading images from picker...", "sample", "status");
            var picker = new Windows.Storage.Pickers.FileOpenPicker();
            picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
            Helpers.fillDecoderExtensions(picker.fileTypeFilter);
            return picker.pickMultipleFilesAsync().then(function (files) {
                if (files.size === 0) {
                    throw new Error("User did not select a file.");
                }

                return files;
            });
        },*/

        // Opens a file picker with appropriate settings and asynchronously returns a file
        // that the user has selected as the encode destination. Selects a few common
        // encoding formats.
        "getFileFromSavePickerAsync": function () {
            // Attempt to ensure that the view is not snapped, otherwise the picker will not display.
            var viewState = Windows.UI.ViewManagement.ApplicationView.value;
            if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
                !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                throw new Error("File picker cannot display in snapped view.");
            }

            var picker = new Windows.Storage.Pickers.FileSavePicker();

            // Restrict the user to a fixed list of file formats that support encoding.
            picker.fileTypeChoices.insert("PNG file", [".png"]);
            picker.fileTypeChoices.insert("BMP file", [".bmp"]);
            picker.fileTypeChoices.insert("JPEG file", [".jpg"]);
            picker.defaultFileExtension = ".png";
            picker.suggestedFileName = "Output file";
            picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;

            return picker.pickSaveFileAsync().then(function (file) {
                if (!file) {
                    throw new Error("User did not select a file.");
                }

                return file;
            });
        },

        // Gets the file extensions supported by all of the bitmap codecs installed on the system.
        // The "collection" argument is of type IVector and implements the append method. The
        // function does not return a value; instead, it populates the collection argument with
        // the file extensions.
        "fillDecoderExtensions": function (collection) {
            var enumerator = Windows.Graphics.Imaging.BitmapDecoder.getDecoderInformationEnumerator();

            enumerator.forEach(function (decoderInfo) {
                // Each bitmap codec contains a list of file extensions it supports; get this list
                // and append every element in the list to "collection".
                decoderInfo.fileExtensions.forEach(function (fileExtension) {
                    collection.append(fileExtension);
                });
            });
        },


        //
        //  ***** Rating helpers (System.Rating property and WinJS rating control) *****
        //


        // ImageProperties.Latitude and ImageProperties.Longitude are returned
        // as double precision numbers. This function converts them to a 
        // degrees/minutes/seconds/reference ("N/E/W/S") format.
        // latLong is either a signed latitude or longitude value.
        // isLatitude is a boolean indicating whether latLong is latitude or longitude.
        
        // Converts a PhotoOrientation value into a human readable string.
        // The text is adapted from the EXIF specification.
        // Note that PhotoOrientation uses a counterclockwise convention,
        // while the EXIF spec uses a clockwise convention.
        "getOrientationString": function (photoOrientation) {
            switch (photoOrientation) {
                case Windows.Storage.FileProperties.PhotoOrientation.normal:
                    return "No rotation";
                case Windows.Storage.FileProperties.PhotoOrientation.flipHorizontal:
                    return "Flip horizontally";
                case Windows.Storage.FileProperties.PhotoOrientation.rotate180:
                    return "Rotate 180° clockwise";
                case Windows.Storage.FileProperties.PhotoOrientation.flipVertical:
                    return "Flip vertically";
                case Windows.Storage.FileProperties.PhotoOrientation.transpose:
                    return "Rotate 270° clockwise, then flip horizontally";
                case Windows.Storage.FileProperties.PhotoOrientation.rotate270:
                    return "Rotate 90° clockwise";
                case Windows.Storage.FileProperties.PhotoOrientation.transverse:
                    return "Rotate 90° clockwise, then flip horizontally";
                case Windows.Storage.FileProperties.PhotoOrientation.rotate90:
                    return "Rotate 270° clockwise";
                case Windows.Storage.FileProperties.PhotoOrientation.unspecified:
                default:
                    return "Unspecified";
            }
        },

        // Converts a Windows.Storage.FileProperties.PhotoOrientation value into a
        // Windows.Graphics.Imaging.BitmapRotation value.
        // For PhotoOrientation values reflecting a flip/mirroring operation, returns "None";
        // therefore this is a potentially lossy transformation.
        // Note that PhotoOrientation uses a counterclockwise convention,
        // while BitmapRotation uses a clockwise convention.
        "convertToBitmapRotation": function (photoOrientation) {
            switch (photoOrientation) {
                case Windows.Storage.FileProperties.PhotoOrientation.normal:
                    return Windows.Graphics.Imaging.BitmapRotation.none;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate270:
                    return Windows.Graphics.Imaging.BitmapRotation.clockwise90Degrees;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate180:
                    return Windows.Graphics.Imaging.BitmapRotation.clockwise180Degrees;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate90:
                    return Windows.Graphics.Imaging.BitmapRotation.clockwise270Degrees;
                default:
                    // Ignore any flip/mirrored values.
                    return BitmapRotation.none;
            }
        },

        // Converts a Windows.Graphics.Imaging.BitmapRotation value into a
        // Windows.Storage.FileProperties.PhotoOrientation value.
        // Note that PhotoOrientation uses a counterclockwise convention,
        // while BitmapRotation uses a clockwise convention.
        "convertToPhotoOrientation": function (bitmapRotation) {
            switch (bitmapRotation) {
                case Windows.Graphics.Imaging.BitmapRotation.none:
                    return Windows.Storage.FileProperties.PhotoOrientation.normal;
                case Windows.Graphics.Imaging.BitmapRotation.clockwise90Degrees:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate270;
                case Windows.Graphics.Imaging.BitmapRotation.clockwise180Degrees:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate180;
                case Windows.Graphics.Imaging.BitmapRotation.clockwise270Degrees:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate90;
                default:
                    return PhotoOrientation.normal;
            }
        },

        // "Adds" two PhotoOrientation values. For simplicity, does not handle any values with
        // flip/mirroring; therefore this is a potentially lossy transformation.
        // Note that PhotoOrientation uses a counterclockwise convention.
        "addPhotoOrientation": function (photoOrientation1, photoOrientation2) {
            switch (photoOrientation2) {
                case Windows.Storage.FileProperties.PhotoOrientation.rotate90:
                    return Helpers.add90DegreesCCW(photoOrientation1);
                case Windows.Storage.FileProperties.PhotoOrientation.rotate180:
                    return Helpers.add90DegreesCCW(Helpers.add90DegreesCCW(photoOrientation1));
                case Windows.Storage.FileProperties.PhotoOrientation.rotate270:
                    return Helpers.add90DegreesCW(photoOrientation1);
                case Windows.Storage.FileProperties.PhotoOrientation.normal:
                default:
                    // Ignore any values with flip/mirroring.
                    return photoOrientation1;
            }
        },

        // "Add" 90 degrees clockwise rotation to a PhotoOrientation value.
        // For simplicity, does not handle any values with flip/mirroring; therefore this is a potentially
        // lossy transformation.
        // Note that PhotoOrientation uses a counterclockwise convention.
        "add90DegreesCW": function (photoOrientation) {
            switch (photoOrientation) {
                case Windows.Storage.FileProperties.PhotoOrientation.normal:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate270;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate90:
                    return Windows.Storage.FileProperties.PhotoOrientation.normal;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate180:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate90;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate270:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate180;
                default:
                    // Ignore any values with flip/mirroring.
                    return Windows.Storage.FileProperties.PhotoOrientation.unspecified;
            }
        },

        // "Add" 90 degrees counter-clockwise rotation to a PhotoOrientation value.
        // For simplicity, does not handle any values with flip/mirroring; therefore this is a potentially
        // lossy transformation.
        // Note that PhotoOrientation uses a counterclockwise convention.
        "add90DegreesCCW": function (photoOrientation) {
            switch (photoOrientation) {
                case Windows.Storage.FileProperties.PhotoOrientation.normal:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate90;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate90:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate180;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate180:
                    return Windows.Storage.FileProperties.PhotoOrientation.rotate270;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate270:
                    return Windows.Storage.FileProperties.PhotoOrientation.normal;
                default:
                    // Ignore any values with flip/mirroring.
                    return Windows.Storage.FileProperties.PhotoOrientation.unspecified;
            }
        },

        // Modifies the style of an HTML element to reflect the specified PhotoOrientation.
        // Ignores any values with flip/mirroring.
        // Note that PhotoOrientation uses a counterclockwise convention.
        "applyRotationStyle": function (photoOrientation, htmlElement) {
            var style = htmlElement.style;
            switch (photoOrientation) {
                case Windows.Storage.FileProperties.PhotoOrientation.rotate270:
                    style.transform = "rotate(90deg)";
                    break;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate180:
                    style.transform = "rotate(180deg)";
                    break;
                case Windows.Storage.FileProperties.PhotoOrientation.rotate90:
                    style.transform = "rotate(270deg)";
                    break;
                case Windows.Storage.FileProperties.PhotoOrientation.normal:
                default:
                    // Ignore any values with flip/mirroring.
                    style.transform = "";
                    break;
            }
        }
    });
})();
//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved

