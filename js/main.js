//Dataset for map, chapter names, numbers and zoom 
//Note the country code needs to be the ISO3 code

//-------------------------------------------- VARIABLES -------------------------------------------------

//colours for active and inactive countries
var colorNotActive = 'rgba(189, 182, 176, 0.8)'//'rgba(153, 0, 0, 0.7)';
var colorActive = 'rgba(238, 42, 36, 1)';//'rgba(204, 0, 0, 1)';
var listOfISO3 = ['SSD', 'SOM', 'NGA', 'YEM', 'KEN', 'ETH'];
var listCountryNames = ['South Sudan', 'Somalia', 'Nigeria', 'Yemen', 'Kenya', 'Ethiopia'];

// the following variables need to be in the same order as the country list above
var inNeed = [7.5, 6.2, 8.5, 18.8, 2.7, 9.7];
var foodNeed = [4.9, 2.9, 8.1, 14.1, 2.2, 0];       //ETH number not known yet
var peopleHelped = [390, 1100, 0, 0, 0, 0];
var foodHelped = [950, 380, 0, 210, 15, 0];
var cashTransferred = [0, 100, 160, 48, 4, 0];  //ETH and SSD not known
var idp = [1.8, 1.1, 1.9, 2.0, 0, 0 ];              //ETH not known - IDP = internally displaced people
var pitch = [45, 15, 35, 5, 50, 20];

// get viewport width and transform numbers
var center = [
    [30.585937, 14.562947],     //SSD
    [45.042969, 11.045813],    //SOM
    [9.843750, 14.978733],      //NGA
    [47.636719, 20.509905],   //YEM
    [39.023438, 9.449062],    //KEN
    [40.078125, 14.895893]];  //ETH

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

//------------------------------------------ CREATING OBJECTS -------------------------------------------


//adding other countries to the locations list 

for (var i = 0; i < listOfISO3.length; i++) {
    var tempCamera = Object.create(CameraObject);
    var temp = Object.create(CountryObject);
    tempCamera.init(4000, center[i], 3.5, pitch[i]);
    temp.init(tempCamera, inNeed[i], foodNeed[i], idp[i], peopleHelped[i], foodHelped[i], cashTransferred[i]);
    mapLocations[listOfISO3[i]] = temp;
}


//creating the layers for borders and name highlighting

var countryBorders = Object.create(LayerObject);
countryBorders.init('countryLine', 'line', 'countries', { 'visibility': 'visible' }, {'line-color': '#fff','line-width': 1}, layerName, ['in', 'iso_a3']);

var countryNameHighlight = Object.create(LayerObject);
countryNameHighlight.init('countryNames', 'symbol', 'countryNames', { 'visibility': 'visible', 'text-field': '{name_en}', 'text-size': 14 }, { 'text-color': '#3a3a3a'},//, 'text-halo-color': '#fff', 'text-halo-width': 1, 'text-halo-blur': 1  },
    'country_label', ['in', 'name_en', '']);

//adding list of countries to parameters of the layer objects

countryBorders.filter.push.apply(countryBorders.filter, listOfISO3);
countryNameHighlight.filter.push.apply(countryNameHighlight.filter, listCountryNames);


//----------------------------------- FUNCTIONS ------------------------------------------------------

// Function which checks if a given country chapter is on screen
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < (window.innerHeight/2) && bounds.bottom > 0;  //Returns true-false if element is in screen boundaries
}

// Function which looks for the section red-cross-work inside a given chapter ID
function isRedCrossWorkOnScreen(id) {
    var string = '#' + id + ' > .red-cross-work';
    var element = document.querySelector(string);
    if (element !== null) {
        var bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0; ////CHECK THIS FOR CHROME
    } else { return false; }
}

function countUp(decimals) {
    $('.count').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1500,
            easing: 'swing',
            step: function (now) {
                $(this).text(parseFloat((Math.ceil(now * decimals) / decimals).toFixed(1)));
            }
        });
    });
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

function setNumberCountUp(chapterName, needHtml, foodHtml, countDecimal) {
    $('.number-container').fadeOut(1000, function () {
        setTimeout(function () {

            // if the number of people in need is not null then add the numbers to the map
            if (mapLocations[chapterName].inNeed > 0) {
                $('#in-need').html(needHtml).fadeIn(1000, function () {
                });
            }

            if (mapLocations[chapterName].foodNeed > 0) {
                $('#food-need').css("visibility", "visible");
                $('#food-need').html(foodHtml).fadeIn(1000, function () {
                });
            }
             if (mapLocations[chapterName].idp > 0) {
                $('#i-d-p').css("visibility", "visible");
                $('#i-d-p').html(foodHtml).fadeIn(1000, function () {
                });
            }
            if (mapLocations[chapterName].foodNeed === 0) {
                $('#food-need').css("visibility", "hidden");
            }
            if (mapLocations[chapterName].idp === 0) {
                $('#i-d-p').css("visibility", "hidden");
            }

            // function to animate the numbers to count up 10 means 1 decimal place

                countUp(countDecimal);
            

        }, 500);
    }); // end fadedout of number container
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

    // fade out previous number and then fade in new number of in number of people in Need
    var needHtml = '<div class=\'count\'> ' + mapLocations[chapterName].inNeed + '</div><div class="number-text"> million people in need</div>';
    var foodHtml = '<div class=\'count\'> ' + mapLocations[chapterName].foodNeed + '</div><div class="number-text"> million malnourished</div>';
    var idpHtml = '<div class=\'count\'> ' + mapLocations[chapterName].idp + '</div><div class="number-text"> million internally displaced</div>';
    
    setNumberCountUp(chapterName, needHtml, foodHtml, idpHtml, 10);

    oldChapter = chapterName;
} //End function SetActive Chapter



/*This function will fade out overall country numbers and fade in Red Cross numbers
the function takes the country chapter name/id as a parameter. e.g.: "SSD" for South Sudan */


//------------------------------------ SETTING UP MAPBOX ----------------------------------------------


// Setting up the background map (grey basic map labelled east-africa-famine2 on mapbox)

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJjbWFwcyIsImEiOiJRZklIbXY0In0.SeDBAb72saeEJhTVDrVusg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/brcmaps/cj00w54pm00na2ro400gflm5j',
    center: [29.619141, 7.536764],
    zoom: 2.5,
    interactive: false
});

// ------------------------------ When the map loads add all the layers --------------------------------

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
                    var needHtml = '<div class=\'count\'> ' + mapLocations[chapterName].peopleHelped + '</div><div>&nbsp; thousand people helped</div>';
                    var foodHtml = '<div class=\'count\'>' + mapLocations[chapterName].foodHelped + '</div><div> thousand people are provided food</div>';
                    setNumberCountUp(chapterName, needHtml, foodHtml, 1);
                    activeRedCrossWork = chapterName;
                    break;
                }
                break;
            }
        }
    };

}); // END function on map load
