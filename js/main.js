//Dataset for map, chapter names, numbers and zoom 
//Note the country code needs to be the ISO3 code

var mapLocations = {
    'africa': {
        'camera': {
            'duration': '4000',
            'center': [-28.200195, 5.441022],
            'zoom': '2.5',
            'pitch': '0'
        },
        'inNeed': 70
    },

    'SSD': {
        'camera': {
            'duration': '4000',
            'center': [1.472168, 7.231699],
            'zoom': '3.5',
            'pitch': '45'
        },
        'inNeed': 7.5
    },

    'SOM': {
        'camera': {
            'duration': '4000',
            'center': [13.908691, 5.441022],
            'zoom': '3.5',
            'pitch': '15'
        },
        'inNeed': 6.2
    },

    'NGA': {
        'camera': {
            'duration': '4000',
            'center': [-20.544434, 14.434680],
            'zoom': '3.5',
            'pitch': '35'
        },
        'inNeed': 8.5
    },

    'YEM': {
        'camera': {
            'duration': '4000',
            'center': [18.830566, 15.114553],
            'zoom': '3.5',
            'pitch': '5'
        },
        'inNeed': 18.8
    },

    'KEN': {
        'camera': {
            'duration': '4000',
            'center': [19.808350, 6.315299],
            'zoom': '3.5',
            'pitch': '50'
        },
        'inNeed': 2.7
    },
    'ETH': {
        'camera': {
            'duration': '4000',
            'center': [27.059326, 8.037473],
            'zoom': '3.5',
            'pitch': '20'
        },
        'inNeed': 9.7
    },
};

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

//color for active and inactive countries
var colorNotActive = 'rgba(153, 0, 0, 0.7)';
var colorActive = 'rgba(204, 0, 0, 1)';

//creating the layers for borders and name highlighting

var countryBorders = Object.create(LayerObject);
countryBorders.init('countryLine', 'line', 'countries', { 'visibility': 'visible' }, {'line-color': '#cccccc','line-width': 3}, 'ne_10m_admin_0_countries-99cdmu', ['in', 'ISO_A3']);

var countryNameHighlight = Object.create(LayerObject);
countryNameHighlight.init('countryNames', 'symbol', 'countryNames', {
    'visibility': 'visible',
    'text-field': '{name_en}',
    'text-size': 14
}, { 'text-color': '#000000' }, 'country_label', ['in', 'name_en', '']);
console.log(countryNameHighlight);

//adding list of countries to parameters of the layer objects

var listOfISO3 = ['SSD', 'SOM', 'NGA', 'KEN', 'ETH', 'YEM'];
var listCountryNames = ['South Sudan', 'Somalia', 'Nigeria', 'Kenya', 'Ethiopia', 'Yemen'];
countryBorders.filter.push.apply(countryBorders.filter, listOfISO3);
countryNameHighlight.filter.push.apply(countryNameHighlight.filter, listCountryNames);


// Setting up the background map (grey basic map labelled east-africa-famine2 on mapbox)

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJjbWFwcyIsImEiOiJRZklIbXY0In0.SeDBAb72saeEJhTVDrVusg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/brcmaps/cj00w54pm00na2ro400gflm5j',
    center: [-28.200195, 5.441022],
    zoom: 2.5
});


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


    function isElementOnScreen(id) {
        var element = document.getElementById(id);
        var bounds = element.getBoundingClientRect();
        return bounds.top < window.innerHeight && bounds.bottom > 0;
    }


    // setting the "active" label to chapter on screen

    var activeChapterName = 'africa';
    var oldChapter = 'africa';

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
        html = '<div class=\'count\'> ' + mapLocations[chapterName].inNeed + '</div><div>&nbsp; million people in need</div>';
        $('.number-container').fadeOut(1000, function () {
            setTimeout(function () {
                $('.number-container').html(html).fadeIn(1000, function () {
                });
                $('.count').each(function () {
                    $(this).prop('Counter', 0).animate({
                        Counter: $(this).text()
                    }, {
                        duration: 4000,
                        easing: 'swing',
                        step: function (now) {
                            $(this).text(Math.ceil(now * 10) / 10);
                        }
                    });
                });
            }, 500)
        })
        oldChapter = chapterName;
    }

});



