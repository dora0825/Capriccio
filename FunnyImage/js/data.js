(function () {
    "use strict";

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    generateSampleData().forEach(function (item) {
        list.push(item);
    });

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    // Returns an array of sample data that can be added to the application's
    // data list. 
    function generateSampleData() {
       
        // These three strings encode placeholder images. You will want to set the
        // backgroundImage property in your real data to be URLs to images.
        var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
        var lightGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
        var mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";

        var itemDescription = "";
        var itemContent = "";
        // Each of these sample groups must have a unique key to be displayed
        // separately.
        var sampleGroups = [
            { key: "group1", title: "犀利人妻", subtitle: "", backgroundImage: "/images/NoWayBack/NoWayBack.jpg" },
            { key: "group2", title: "少年pi", subtitle: "", backgroundImage: "/images/pi/pi.jpg" },
            { key: "group3", title: "綺夢是一顆痣", subtitle: "", backgroundImage: "/images/ch/ch.jpg" },
            { key: "group4", title: "荊軻噴血", subtitle: "", backgroundImage: "/images/t/tt.jpg" },
            { key: "group5", title: "後宮甄環傳", subtitle: "", backgroundImage: "/images/s/ss.png" },
            { key: "group6", title: "比爾蓋茲賈伯斯", subtitle: "", backgroundImage: "/images/bj/bj.png" },
            { key: "group7", title: "", subtitle: "", backgroundImage: "" }
        ];

        // Each of these sample items should have a reference to a particular
        // group.
        var sampleItems = [
            
            { group: sampleGroups[0], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/NoWayBack/NoWayBack1.jpg" },
            { group: sampleGroups[0], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/NoWayBack/NoWayBack2.jpg" },
            { group: sampleGroups[0], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/NoWayBack/NoWayBack3.jpg" },
            

            { group: sampleGroups[1], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/pi/pi_1.jpg" },
            { group: sampleGroups[1], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/pi/pi_2.jpg" },
            { group: sampleGroups[1], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/pi/pi_3.jpg" },
            

            { group: sampleGroups[2], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/ch/ch13.png" },
            { group: sampleGroups[2], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/ch/ch2.jpg" },
            { group: sampleGroups[2], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/ch/ch3.jpg" },
            

            { group: sampleGroups[3], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/t/t2.png" },
            { group: sampleGroups[3], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/t/t3.png" },
            { group: sampleGroups[3], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/t/t4.png" },
            

            { group: sampleGroups[4], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/s/s1.png" },
            { group: sampleGroups[4], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/s/s2.png" },
            { group: sampleGroups[4], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/s/s3.jpg" },
            

            { group: sampleGroups[5], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/bj/bj1.png" },
            { group: sampleGroups[5], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/bj/bj1.png" },
            { group: sampleGroups[5], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: "/images/bj/bj3.png" },

            { group: sampleGroups[6], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[6], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[6], title: "", subtitle: "", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[6], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[6], title: "Item Title: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[6], title: "Item Title: 7", subtitle: "Item Subtitle: 7", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[6], title: "Item Title: 8", subtitle: "Item Subtitle: 8", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[6], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[5], title: "Item Title: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[5], title: "Item Title: 7", subtitle: "Item Subtitle: 7", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[5], title: "Item Title: 8", subtitle: "Item Subtitle: 8", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[5], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[5], title: "Item Title: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[5], title: "Item Title: 7", subtitle: "Item Subtitle: 7", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[5], title: "Item Title: 8", subtitle: "Item Subtitle: 8", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[5], title: "Item Title: 5", subtitle: "Item Subtitle: 5", description: itemDescription, content: itemContent, backgroundImage: lightGray },
            { group: sampleGroups[5], title: "Item Title: 6", subtitle: "Item Subtitle: 6", description: itemDescription, content: itemContent, backgroundImage: mediumGray },
            { group: sampleGroups[5], title: "Item Title: 7", subtitle: "Item Subtitle: 7", description: itemDescription, content: itemContent, backgroundImage: darkGray },
            { group: sampleGroups[5], title: "Item Title: 8", subtitle: "Item Subtitle: 8", description: itemDescription, content: itemContent, backgroundImage: lightGray }
            
        ];

        return sampleItems;
    }
})();
