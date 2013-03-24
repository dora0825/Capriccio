// 如需頁面控制項範本的簡介，請參閱下列文件:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    var dataArray = [
    { picture: "/images/ch/ch1.jpg" },
    { picture: "/images/ch/ch2.jpg" },
    { picture: "/images/ch/ch3.jpg" },
    { picture: "/images/ch/ch4.png" },
    { picture: "/images/ch/ch5.png" },
    { picture: "/images/ch/ch6.png" },
    { picture: "/images/ch/ch7.jpg" },
    { picture: "/images/ch/ch8.jpg" },
    { picture: "/images/ch/ch9.png" },
    { picture: "/images/ch/ch10.png" },
    { picture: "/images/ch/ch12.png" },
    { picture: "/images/ch/ch13.png" },
    { picture: "/images/ch/ch14.png" },
    { picture: "/images/ch/ch15.png" },
    { picture: "/images/ch/ch16.jpg" }
    ];
    var dataList = new WinJS.Binding.List(dataArray);

    var publicMembers ={itemList: dataList};
    WinJS.Namespace.define("DataExample", publicMembers);

    WinJS.UI.Pages.define("/pages/imageview/imageview.html", {
        // 每當使用者巡覽至此頁面時，就會呼叫這個函式。它
        // 會將應用程式的資料填入頁面項目。
        ready: function (element, options) {

            
            function itemInvokedHandler(e) {

                var e_inx = e.detail.itemIndex;
                setBackgroundImage(dataArray[e_inx].picture);
                dataURLarray[key_item] = dataArray[e_inx].picture;
                //drawcanvas();
                WinJS.Navigation.navigate("/pages/split/split.html");

            }
            document.getElementById("basicListView").addEventListener("iteminvoked", itemInvokedHandler);


        },


        unload: function () {
            // TODO: 回應離開這個頁面的導覽。
           
        },

        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            // TODO: 回應 viewState 中的變更。
        },


    });
})();
