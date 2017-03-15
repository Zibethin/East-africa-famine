//Dataset for map, chapter names, numbers and zoom 
//Note the country code needs to be the ISO3 code

//-------------------------------------------- VARIABLES -------------------------------------------------

//colours for active and inactive countries
var colorNotActive = 'rgba(153, 0, 0, 0.7)';
var colorActive = 'rgba(204, 0, 0, 1)';
var listOfISO3 = ['SSD', 'SOM', 'NGA', 'YEM', 'KEN', 'ETH'];
var listCountryNames = ['South Sudan', 'Somalia', 'Nigeria', 'Yemen', 'Kenya', 'Ethiopia'];

// the following variables need to be in the same order as the country list above
var inNeed = [7.5, 6.2, 8.5, 18.8, 2.7, 9.7];
var foodNeed = [4.9, 2.9, 8.1, 14.1, 2.2, 0];       //ETH number not known yet
var idp = [1.8, 1.1, 1.9, 2.0, 0, 0 ];              //ETH not known - IDP = internally displaced people
var pitch = [45, 15, 35, 5, 50, 20];

var center = [
    [1.472168, 7.231699],     //SSD
    [13.908691, 5.441022],    //SOM
    [-20.544434, 14.434680],  //NGA
    [18.830566, 15.114553],   //YEM
    [19.808350, 6.315299],    //KEN
    [18.676758, 12.039321]];  //ETH

var activeChapterName = 'africa';
var oldChapter = 'africa';

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
    init: function (camera, inNeed, foodNeed, idp) {
        this.camera = camera;
        this.inNeed = inNeed;
        this.foodNeed = foodNeed;
        this.idp = idp;
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
//initialising the locations list

var mapLocations = {
    'africa': {
        'camera': {
            'duration': '4000',
            'center': [-28.200195, 5.441022],
            'zoom': '2.5',
            'pitch': '0'
        },
        'inNeed': 70,
        'foodNeed': 0,
        'idp': 0
    }
};

//adding other countries to the locations list 

for (var i = 0; i < listOfISO3.length; i++) {
    var tempCamera = Object.create(CameraObject);
    var temp = Object.create(CountryObject);
    tempCamera.init(4000, center[i], 3.5, pitch[i]);
    temp.init(tempCamera, inNeed[i], foodNeed[i], idp[i]);
    mapLocations[listOfISO3[i]] = temp;
}

//creating the layers for borders and name highlighting

var countryBorders = Object.create(LayerObject);
countryBorders.init('countryLine', 'line', 'countries', { 'visibility': 'visible' }, {'line-color': '#cccccc','line-width': 3}, 'ne_10m_admin_0_countries-99cdmu', ['in', 'ISO_A3']);

var countryNameHighlight = Object.create(LayerObject);
countryNameHighlight.init('countryNames', 'symbol', 'countryNames', { 'visibility': 'visible', 'text-field': '{name_en}', 'text-size': 14 }, { 'text-color': '#000000' },
    'country_label', ['in', 'name_en', '']);

//adding list of countries to parameters of the layer objects

countryBorders.filter.push.apply(countryBorders.filter, listOfISO3);
countryNameHighlight.filter.push.apply(countryNameHighlight.filter, listCountryNames);


//----------------------------------- FUNCTIONS ------------------------------------------------------


function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return bounds.top < window.innerHeight && bounds.bottom > 0;
}

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

    document.getElementById(chapterName).setAttribute('class', 'active');
    document.getElementById(activeChapterName).setAttribute('class', '');

    activeChapterName = chapterName;

    // fade out previous number and then fade in new number of in number of people in Need
    var needHtml = '<div class=\'count\'> ' + mapLocations[chapterName].inNeed + '</div><div>&nbsp; million people in need</div>';
    var foodHtml = '<div class=\'count\'> ' + mapLocations[chapterName].foodNeed + '</div><div>&nbsp; million malnourished</div>';
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
            if (mapLocations[chapterName].foodNeed === 0) {
                $('#food-need').css("visibility", "hidden");
            }

            // function to animate the numbers to count up
            $('.count').each(function () {
                $(this).prop('Counter', 0).animate({
                    Counter: $(this).text()
                }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(Math.ceil(now * 10) / 10);
                    }
                });
            });

        }, 500);
    }); // end fadedout of number container


    oldChapter = chapterName;
} //End function SetActive Chapter


//------------------------------------ SETTING UP MAPBOX ----------------------------------------------


// Setting up the background map (grey basic map labelled east-africa-famine2 on mapbox)

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJjbWFwcyIsImEiOiJRZklIbXY0In0.SeDBAb72saeEJhTVDrVusg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/brcmaps/cj00w54pm00na2ro400gflm5j',
    center: [-28.200195, 5.441022],
    zoom: 2.5,
    interactive: false
});

// ------------------------------ When the map loads add all the layers --------------------------------

map.on('load', function () {

    //Adding Map Sources: 
    //adding the natural earth boundaries

    map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://brcmaps.1sx9x8yc'
    });

    //adding the country names from mapbox street default
    map.addSource('countryNames', {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v7'
    });

    // creating and adding a layer of fill per country for targeted countries using the layer object

    for (var i = 0; i < listOfISO3.length; i++) {
        var temp = Object.create(LayerObject);
        temp.init(listOfISO3[i], 'fill', 'countries', { 'visibility': 'visible' }, { 'fill-color': colorNotActive }, 'ne_10m_admin_0_countries-99cdmu', ['in', 'ISO_A3', listOfISO3[i]]);
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
                break;
            }
        }
    };

}); // END function on map load
