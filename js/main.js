//var windowHeight = $(window).height();
//var width = $(window).width();
//var mapCreated = false;

//$(document).delegate('*[data-toggle='lightbox']', 'click', function (event) {
//    event.preventDefault();
//    $(this).ekkoLightbox();
//});

//$(window).resize(function () {
//    windowHeight = $(window).height();
//    var newWidth = $(window).width();
//    if (newWidth >= 768 && mapCreated === false) {
//        fullSetup();
//    }
//});

//function callImageModal(item) {
//    var imgUrl = $(item).find('img').attr('src').slice(0, -9) + 'large.jpg';
//    var img_maxHeight = (windowHeight * 0.85).toString() + 'px';
//    $('.modal-img').css('max-height', img_maxHeight);
//    $('.modal-img').attr('src', imgUrl);
//    $('#myImageModal').modal();
//}


//function fullSetup() {

//    width = $(window).width();
//    if (width >= 768) {
//        mapCreated = true;


//        $('.quickNav').html('<div class='btn-group hidden-xs'>' +
//            '<button type='button' class='btn btn-xs dropdown-toggle btn-quickNav' data-toggle='dropdown'>' +
//              '<span style='font-size:18px; color:#f5f5f5;'> ☰ </span></button>' +
//              '<ul class='dropdown-menu' role='menu'>' +
//                '<li><a href='#'>Home</a></li>' +
//                '<li><a href='#emergency-01'><span class='glyphicon glyphicon-picture color-green'></span>&nbsp; Emergency phase</a></li>' +
//                '<li><a href='#icrc-recovery-guiuan'><span class='glyphicon glyphicon-picture color-green'></span>&nbsp; Recovery phase</a></li>' +
//                '<li><a href='#livelihoods'>Livelihood Profiles</a></li>' +
//                '<li><a href='#liporada'><span class='glyphicon glyphicon-user color-blue'></span>&nbsp; Maria Liporada</a></li>' +
//                '<li><a href='#martinez'><span class='glyphicon glyphicon-user color-blue'></span>&nbsp; Gaspar Martinez</a></li>' +
//                '<li><a href='#cabujoc'><span class='glyphicon glyphicon-user color-blue'></span>&nbsp; Joel Cabujoc</a></li>' +
//                '<li><a href='#coconutlady'><span class='glyphicon glyphicon-picture color-green'></span>&nbsp; Coconut Lady</a></li>' +
//                '<li><a href='#sheltergallery1'><span class='glyphicon glyphicon-picture color-green'></span>&nbsp; To build a home</a></li>' +
//                '<li><a href='#films'><span class='glyphicon glyphicon-film color-khaki'></span>&nbsp; Films</a></li>' +
//                '<li><a href='#palawangallery'><span class='glyphicon glyphicon-picture color-green'></span>&nbsp; Reaching out</a></li>' +
//                '<li><a href='#manila'><span class='glyphicon glyphicon-info-sign color-red'></span>&nbsp; Philippine Red Cross</a></li>' +
//                '<li><a href='#movement'><span class='glyphicon glyphicon-info-sign color-red'></span>&nbsp; International Red Cross and Red Crescent Movement</a></li></ul></div>');
//        $('.quickNav').tooltip();


//        $('body').css('padding-top', '0px');


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
        };

        mapboxgl.accessToken = 'pk.eyJ1IjoiYnJjbWFwcyIsImEiOiJRZklIbXY0In0.SeDBAb72saeEJhTVDrVusg';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/brcmaps/cj00w54pm00na2ro400gflm5j',
            //'mapbox://styles/brcmaps/cizzog3yu00bq2smrhbrmuw7d', //'mapbox://styles/mapbox/dark-v9' ,
            center: [-28.200195, 5.441022],//[30.201416, 7.275292],
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

            //Adding layers:
            //adding country fill for targeted countries

            map.addLayer({
                'id': 'countryFill',
                'type': 'fill',
                'source': 'countries',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'fill-color': 'rgba(153, 0, 0, 0.8)'
                },
                'source-layer': 'ne_10m_admin_0_countries-99cdmu', 'filter': ['in', 'ISO_A3', 'SSD', 'YEM', 'NGA', 'SOM']
            });

            //adding Lines around the country to make it prettier

            map.addLayer({
                'id': 'CountryLine',
                'type': 'line',
                'source': 'countries',
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'line-color': '#cccccc',
                    'line-width': 3
                },
                'source-layer': 'ne_10m_admin_0_countries-99cdmu', 'filter': ['in', 'ISO_A3', 'SSD', 'YEM', 'NGA', 'SOM']
            });

            // highlighting country names

            map.addLayer({
                'id': 'CountryNames',
                'type': 'symbol',
                'source': 'countryNames',
                'layout': {
                    'visibility': 'visible',
                    'text-field': '{name_en}',
                    'text-size': 14
                },
                'paint': {
                    'text-color': '#000000'
                },
                'source-layer': 'country_label', 'filter': ['in', 'name_en', 'South Sudan', 'Yemen', 'Nigeria', 'Somalia']
            });
            map.scrollZoom.disable();
        });


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
                

        var activeChapterName = 'africa';

        function setActiveChapter(chapterName) {
            console.log('inside=', chapterName);
            if (chapterName === activeChapterName) return;
            map.flyTo(mapLocations[chapterName].camera);

            document.getElementById(chapterName).setAttribute('class', 'active');
            document.getElementById(activeChapterName).setAttribute('class', '');

            activeChapterName = chapterName;

            html = '<div class=\'text\'><span class=\'count\'>'+ mapLocations[chapterName].inNeed + '</span>&nbsp; million people in need</div>';
            $('#number-container').fadeOut(1000, function () {
                setTimeout(function () {
                    $('#number-container').html(html).fadeIn(1000, function () {
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
               
        }

        function isElementOnScreen(id) {
            var element = document.getElementById(id);
            var bounds = element.getBoundingClientRect();
            return bounds.top < window.innerHeight && bounds.bottom > 0;
        }



        //DAN's code

//        // Array of story section elements.
//        var sections = document.getElementsByTagName('section');

//        // Helper to set the active section.
//        var previousActive = 0;
//        var setActive = function (index, ease) {
//            var activeSpotId = sections[index].id;
//            // Set active class on sections
//            _(sections).each(function (s) { s.className = s.className.replace(' active', '') });
//            sections[index].className += ' active';

//            // if sections[index].id == cover || movement || etc. then add a class for display:none for all the markers

//            // Set active class on markers
//            $.each($('.spot'), function (index, spotDiv) {
//                if ($(spotDiv).hasClass(activeSpotId)) {
//                    $(spotDiv).addClass('active');
//                } else {
//                    $(spotDiv).removeClass('active');
//                }
//            });

//            // Set a body class for the active section.
//            document.body.className = 'section-' + index;

//            // Ease map to active marker.
//            if (ease && previousActive !== index && markerMap[activeSpotId] !== undefined) {
//                var storyWidth = $(window).width() * 0.6;
//                var padding = L.point(storyWidth, 0)
//                map.fitBounds(markerMap[activeSpotId].feature.properties.view_bounds, {
//                    paddingTopLeft: padding,
//                    // zoom: {
//                    //   animate: true,
//                    //   duration: 6
//                    // },
//                    pan: {
//                        animate: true,
//                        duration: 2.5
//                    }
//                });

//                previousActive = index;
//            }
//            return true;
//        };

//        // Bind to scroll events to find the active section.
//        window.onscroll = _(function () {
//            // IE 8
//            if (window.pageYOffset === undefined) {
//                var y = document.documentElement.scrollTop;
//                var h = document.documentElement.clientHeight;
//            } else {
//                var y = window.pageYOffset;
//                var h = window.innerHeight;
//            }

//            // If scrolled to the very top of the page set the first section active.
//            if (y === 0) return setActive(0, true);

//            // Otherwise, conditionally determine the extent to which page must be
//            // scrolled for each section. The first section that matches the current
//            // scroll position wins and exits the loop early.
//            var memo = 0;
//            var buffer = (h * 0.3333);
//            var active = _(sections).any(function (el, index) {
//                memo += el.offsetHeight;
//                return y < (memo - buffer) ? setActive(index, true) : false;
//            });

//            // If no section was set active the user has scrolled past the last section.
//            // Set the last section active.
//            if (!active) setActive(sections.length - 1, true);
//        }).debounce(10);

//        // Set map to first section.
//        setActive(0, false);



//    }
//}

//// show disclaimer text on click of disclaimer link
//function showDisclaimer() {
//    window.alert('The maps used do not imply the expression of any opinion on the part of the International Federation of Red Cross and Red Crescent Societies or National Societies concerning the legal status of a territory or of its authorities.');
//}

//fullSetup();