//Dataset for map, chapter names, numbers and zoom 
//Note the country code needs to be the ISO3 code

//-------------------------------------------- VARIABLES -------------------------------------------------

//if the order of columns is changed in the spreadsheet, just change the numbers here
//e.g. if ISO3 has now been switched with Helped, then replace 1 with 7, and 7 with 1, leaving the comments
var orderOfVariables = [0, //Country, 
                        1, //ISO3, 
                        2, //In need,
                        3, //malnourished, 
                        4, //children malnourished 
                        5, //need safe drinking water
                        6, //idp
                        7, //helped
                        8, //food provided
                        9, //cash transferred
                        10, //safe drinking water
                        11, // centre map Longitude
                        12 //centre map latitude
];


var colorNotActive = 'rgba(189, 182, 176, 0.8)'//'rgba(153, 0, 0, 0.7)';
var colorActive = 'rgba(238, 42, 36, 1)';//'rgba(204, 0, 0, 1)';
var listOfISO3 = [];
var listCountryNames = [];
var description = [];
var inNeed = [];
var foodNeed = [];
var childFoodNeed = [];
var waterNeed = [];
var idp = [];
var peopleHelped = [];
var foodHelped = [];
var cashTransferred = [];
var waterSafe = [];
var pitch = [45, 15, 35, 5, 50, 20];


//text on the map
var needText = '</div><div class="number-text"> million people in need</div>';
var foodText = '</div><div class="number-text"> million malnourished</div>';
var idpText = '</div><div class="number-text"> million internally displaced</div>';
var helpedHtml = '</div><div>&nbsp; thousand people helped</div>';
var foodHtml = '</div><div> thousand people are provided food</div>';
var cashTransfer = '</div><div> thousand people have been transferred cash</div>';
var countDiv = '<div class=\'count\'> ';

// get viewport width and transform numbers
var center = [];

var activeChapterName = 'ETH';
var activeRedCrossWork = 'ETH';
var oldChapter = 'africa';

//initialising the locations list

var mapLocations = {
    'africa': {
        'camera': {
            'duration': '4000',
            'center': [29.619141, 7.536764],
            'zoom': '2.5',
            'pitch': '0'
        },
        'inNeed': 70.1,
        'foodNeed': 0,
        'idp': 0
    }
};

var layerName = 'admin0-4r2su7';

//call to google sheet
//googleSheet Link
var gLink = "https://proxy.hxlstandard.org/data.json?force=on&url=https%3A//docs.google.com/spreadsheets/d/13dT082rHZEm7-HT8YBVypsi7rGGaQooKJCyJ_1HTfys/edit%23gid%3D454209612&force=on";

var sheetCall = $.ajax({
    type: 'GET',
    url: gLink,
    dataType: 'json',
});

$.when(sheetCall).then(function (dataArgs) {
    var index = 0;
    function checkZeros(number) {
        if (isNaN(parseFloat(number))) {
            return 0;
        } else {
            return parseFloat(number);
        }
    };
    try {
        dataArgs.forEach(function (c, i) {
            if (i === 0) {
                description = c;
            }
            else if (i === 1) { }
            else {
                listCountryNames[index] = c[orderOfVariables[0]].trim();
                listOfISO3[index] = c[orderOfVariables[1]].trim();
                inNeed[index] = checkZeros(c[orderOfVariables[2]]);
                foodNeed[index] = checkZeros(c[orderOfVariables[3]]);
                childFoodNeed[index] = checkZeros(c[orderOfVariables[4]]);
                waterNeed[index] = checkZeros(c[orderOfVariables[5]]);
                idp[index] = checkZeros(c[orderOfVariables[6]]);
                peopleHelped[index] = checkZeros(c[orderOfVariables[7]]);
                foodHelped[index] = checkZeros(c[orderOfVariables[8]]);
                cashTransferred[index] = checkZeros(c[orderOfVariables[9]]);
                waterSafe[index] = checkZeros(c[orderOfVariables[10]]);
                center[index] = [];
                center[index][0] = checkZeros(c[orderOfVariables[11]].trim());
                center[index][1] = checkZeros(c[orderOfVariables[12]].trim());

                index++;
            }
        }); //End data args for each
    } catch (e) { console.log("Please check the spreadsheet with the data.");}

    createObjects();
    setMapbox();

})


//---------------------------------------- OBJECT DEFINITIONS -------------------------------------------

//creating the layer object for map layers

var LayerObject = {
    //initialising the object
    init: function (id, type, source, layout, paint, sourceLayer, filter) {
        this.id = id;
        this.type = type;
        this.source = source;
        this.layout = layout;
        this.paint = paint;
        this['source-layer'] = sourceLayer;
        this.filter = filter;
    }
};

//creating the layer object for country camera parameters and overall numbers

var CountryObject = {
    //initialising the object
    init: function (camera, inNeed, foodNeed, idp, peopleHelped, foodHelped, cashTransferred) {
        this.camera = camera;
        this.inNeed = inNeed;
        this.foodNeed = foodNeed;
        this.idp = idp;
        this.peopleHelped = peopleHelped;
        this.foodHelped = foodHelped;
        this.cashTransferred = cashTransferred;
    }
};

var CameraObject = {
    //camera 
    init: function (duration, center, zoom, pitch) {
        this.duration = duration;
        this.center = center;
        this.zoom = zoom;
        this.pitch = pitch;
    }
};

var countryBorders = Object.create(LayerObject);
var countryNameHighlight = Object.create(LayerObject);

//------------------------------------------ CREATING OBJECTS -------------------------------------------

function createObjects() {
    //adding other countries to the locations list 

    for (var i = 0; i < listOfISO3.length; i++) {
        var tempCamera = Object.create(CameraObject);
        var temp = Object.create(CountryObject);
        tempCamera.init(4000, center[i], 3.5, pitch[i]);
        temp.init(tempCamera, inNeed[i], foodNeed[i], idp[i], peopleHelped[i], foodHelped[i], cashTransferred[i]);
        mapLocations[listOfISO3[i]] = temp;
    }


    //creating the layers for borders and name highlighting

    countryBorders.init('countryLine', 'line', 'countries', { 'visibility': 'visible' }, { 'line-color': '#fff', 'line-width': 1 }, layerName, ['in', 'iso_a3']);

    countryNameHighlight.init('countryNames', 'symbol', 'countryNames', { 'visibility': 'visible', 'text-field': '{name_en}', 'text-size': 14 }, { 'text-color': '#3a3a3a' },//, 'text-halo-color': '#fff', 'text-halo-width': 1, 'text-halo-blur': 1  },
        'country_label', ['in', 'name_en', '']);

    //adding list of countries to parameters of the layer objects

    countryBorders.filter.push.apply(countryBorders.filter, listOfISO3);
    countryNameHighlight.filter.push.apply(countryNameHighlight.filter, listCountryNames);

}

//----------------------------------- FUNCTIONS ------------------------------------------------------

// Function which checks if a given country chapter is on screen
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    //console.log("bounds.top=",bounds.top, "bounds.bottom=", bounds.bottom, ", id=", id);
    return bounds.top < window.innerHeight && bounds.bottom > 50;  //Returns true-false if element is in screen boundaries 
}

// Function which looks for the section red-cross-work inside a given chapter ID
function isRedCrossWorkOnScreen(id) {
    var string = '#' + id + ' > section > .red-cross-work';
    var element = document.querySelector(string);
    if (element !== null) {
        var bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 50; ////CHECK THIS FOR CHROME
    } else { return false; }
}

function countUp(decimals) {
    //$('.count').each(function () {
    //    $(this).prop('Counter', 0).animate({
    //        Counter: $(this).text()
    //    }, {
    //        duration: 1500,
    //        easing: 'swing',
    //        step: function (now) {
    //            $(this).text(parseFloat((Math.ceil(now * decimals) / decimals).toFixed(1)));
    //        }
    //    });
    //});
}


/* setNumberCountUp: function which fades existing numbers out and fades in new numbers
takes the following parameters: 
    - name of the current chapter/country, 
    - the text for the first line
    - the text for the second line
    - and how many decimals the function should count up e.g.: 
        if the number of people affected are 91.9 million, 
        a value of countDecimal = 10 will count up from 0.1 to 91.9 fo instance
        whereas a value of 1 will count up from 1 to 91*/
function changeAndAnimateNumbers(id, html) {
    //$(id).animate({ "opacity": 0 }, 1000, "linear", function(){
    //    var tm1 = setTimeout(function () {
    $(id).html(html);
    $(id).addClass("fadeIn");
            //$(id).css("display", "flex");
    //    }, 1000);
    //    var tm2 = setTimeout(function () {
    //        $(id).animate({ "opacity": 1 }, 1000)
    //    }, 1500);
    //})
}
function setNumberCountUp(chapterName, html1, var1, foodHtml, var2, idpHtml, var3, countDecimal) {
    //$('#in-need').stop();
    //$('#in-need').css("opacity", 0);
            // if the number of people in need is not null then add the numbers to the map
    if (mapLocations[chapterName][var1] > 0) {
        changeAndAnimateNumbers('#in-need', html1);
    };
    if (mapLocations[chapterName][var2] > 0) {
        changeAndAnimateNumbers('#number1', foodHtml);
    }
    if (mapLocations[chapterName][var3] > 0) {
        changeAndAnimateNumbers('#number2', idpHtml);
    }
    if (mapLocations[chapterName][var1] === 0) {

        $('#in-need').removeClass("fadeIn");
    }
    if (mapLocations[chapterName][var2] === 0) {

        $('#number1').removeClass("fadeIn");
    }
    if (mapLocations[chapterName][var3] === 0) {

        $('#number2').removeClass("fadeIn");
    }
    //// function to animate the numbers to count up 10 means 1 decimal place

    countUp(countDecimal);

} //end setNumberCountUp


// setting the "active" label to chapter on screen

function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;

    // setting the new active country to the active color
    if (chapterName !== 'africa') {
        map.setPaintProperty(chapterName, 'fill-color', colorActive);
    }
    if (oldChapter !== 'africa') {
        //setting the previous country to the inactive color
        map.setPaintProperty(oldChapter, 'fill-color', colorNotActive);
    }

    //Moving camera to new country
    map.flyTo(mapLocations[chapterName].camera);

    //document.getElementById(chapterName).setAttribute('class', 'active');
    //document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;
    activeRedCrossWork = ''; // setting this so that when you scroll backwards red cross work numbers still appear

    // fade out previous number and then fade in new numbers
    var needHtml = countDiv + mapLocations[chapterName].inNeed + needText;
    var foodHtml = countDiv + mapLocations[chapterName].foodNeed + foodText;
    var idpHtml = countDiv + mapLocations[chapterName].idp + idpText;

    setNumberCountUp(chapterName, needHtml, 'inNeed', foodHtml, 'foodNeed', idpHtml, 'idp', 10);

    oldChapter = chapterName;
} //End function SetActive Chapter



/*This function will fade out overall country numbers and fade in Red Cross numbers
the function takes the country chapter name/id as a parameter. e.g.: "SSD" for South Sudan */


//------------------------------------ SETTING UP MAPBOX ----------------------------------------------


//------------- Setting up the background map (grey basic map labelled east-africa-famine2 on mapbox)

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJjbWFwcyIsImEiOiJRZklIbXY0In0.SeDBAb72saeEJhTVDrVusg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/brcmaps/cj00w54pm00na2ro400gflm5j',
    center: [29.619141, 7.536764],
    zoom: 2.5,
    interactive: false
});

// ------------------------------ When the map loads add all the layers --------------------------------

function setMapbox() {

    map.on('load', function () {

        //Adding Map Sources: 
        //adding the natural earth boundaries

        map.addSource('countries', {
            type: 'vector',
            url: 'mapbox://brcmaps.4a5g1ou7'
        });

        //adding the country names from mapbox street default
        map.addSource('countryNames', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v7'
        });

        // creating and adding a layer of fill per country for targeted countries using the layer object

        for (var i = 0; i < listOfISO3.length; i++) {
            var temp = Object.create(LayerObject);
            temp.init(listOfISO3[i], 'fill', 'countries', { 'visibility': 'visible' }, { 'fill-color': colorNotActive }, layerName, ['in', 'iso_a3', listOfISO3[i]]);
            map.addLayer(temp);
        }

        //adding Lines around the country to make it prettier

        map.addLayer(countryBorders);

        // highlighting country names

        map.addLayer(countryNameHighlight);
        map.scrollZoom.disable();

        // Figuring out what chapter is on the screen

        window.onscroll = function () {
            var chapterNames = Object.keys(mapLocations);
            for (var i = 0; i < chapterNames.length; i++) {
                var chapterName = chapterNames[i];
                if (isElementOnScreen(chapterName)) {
                    setActiveChapter(chapterName);
                    if (isRedCrossWorkOnScreen(chapterName)) {
                        if (activeRedCrossWork === chapterName) { break; }  // setting this so that the numbers don't go in a loop while we stay on the section
                        // fade out previous number and then fade in new number of in number of people in Need
                        var rc_var1 = "peopleHelped";
                        var rc_var2 = "foodHelped";
                        var rc_var3 = "cashTransferred";
                        var rc_work_line1 = countDiv + mapLocations[chapterName][rc_var1] + helpedHtml;
                        var rc_work_line2 = countDiv + mapLocations[chapterName][rc_var2] + foodHtml;
                        var rc_work_line3 = countDiv + mapLocations[chapterName][rc_var3] + cashTransfer;
                        setNumberCountUp(chapterName, rc_work_line1, rc_var1, rc_work_line2, rc_var2, rc_work_line3, rc_var3, 1);
                        activeRedCrossWork = chapterName;
                        break;
                    }
                    break;
                }
            }
        };
    }); // END function on map load

}
