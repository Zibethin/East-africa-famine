var windowHeight = $(window).height();
var width = $(window).width(); 
var mapCreated = false;

$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox();
}); 

$(window).resize(function(){     
    windowHeight = $(window).height();
    var newWidth = $(window).width();
    if(newWidth >= 768 && mapCreated === false){
      fullSetup();
    }
});

function callImageModal(item) {
  var imgUrl = $(item).find('img').attr("src").slice(0,-9) + 'large.jpg';
  var img_maxHeight = (windowHeight*0.85).toString() + "px";
  $(".modal-img").css('max-height', img_maxHeight);
  $(".modal-img").attr('src', imgUrl);
  $("#myImageModal").modal();    
}


function fullSetup(){

width = $(window).width(); 
if(width >= 768){
      mapCreated = true;

      
      $(".quickNav").html('<div class="btn-group hidden-xs">'+
          '<button type="button" class="btn btn-xs dropdown-toggle btn-quickNav" data-toggle="dropdown">'+ 
            '<span style="font-size:18px; color:#f5f5f5;"> ☰ </span></button>'+
            '<ul class="dropdown-menu" role="menu">'+
              '<li><a href="#">Home</a></li>'+
              '<li><a href="#emergency-01"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; Emergency phase</a></li>'+
              '<li><a href="#icrc-recovery-guiuan"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; Recovery phase</a></li>'+
              '<li><a href="#livelihoods">Livelihood Profiles</a></li>'+
              '<li><a href="#liporada"><span class="glyphicon glyphicon-user color-blue"></span>&nbsp; Maria Liporada</a></li>'+
              '<li><a href="#martinez"><span class="glyphicon glyphicon-user color-blue"></span>&nbsp; Gaspar Martinez</a></li>'+
              '<li><a href="#cabujoc"><span class="glyphicon glyphicon-user color-blue"></span>&nbsp; Joel Cabujoc</a></li>'+
              '<li><a href="#coconutlady"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; Coconut Lady</a></li>'+
              '<li><a href="#sheltergallery1"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; To build a home</a></li>'+
              '<li><a href="#films"><span class="glyphicon glyphicon-film color-khaki"></span>&nbsp; Films</a></li>'+
              '<li><a href="#palawangallery"><span class="glyphicon glyphicon-picture color-green"></span>&nbsp; Reaching out</a></li>'+
              '<li><a href="#manila"><span class="glyphicon glyphicon-info-sign color-red"></span>&nbsp; Philippine Red Cross</a></li>'+
              '<li><a href="#movement"><span class="glyphicon glyphicon-info-sign color-red"></span>&nbsp; International Red Cross and Red Crescent Movement</a></li></ul></div>');
      $(".quickNav").tooltip(); 
 

      $('body').css("padding-top","0px");


      // geojson points for each story piece
      var storyPoints = [
      {
        "type": "Feature",
        "properties": {
          "id": "emergency-01",
          "place_name": "isabel leyte",
          "view_bounds": [
          [10.6947680272049, 124.237861633301], [11.2305364118092, 124.634742736816] 
          ]
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          124.43939208984375,
          10.927371109008824
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "emergency-02",
          "place_name": "palo leyte",
          "view_bounds": [
          [10.9188527937218, 124.795589447022], [11.4546211783261, 125.192470550537]  
          ]
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          124.99711990356445,
          11.151455875525723
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "emergency-03",
          "place_name": "carles iloilo",
          "view_bounds": [
          [11.3215999635837, 122.928943634034], [11.857368348188, 123.325824737549]  
          ]
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          123.13047409057616,
          11.554203045387684
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "emergency-04",
          "place_name": "brgy 25 tacloban",
          "view_bounds": [
          [11.0122478540281, 124.807026386261], [11.5480162386324, 125.203907489776] 
          ]
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          125.00855684280397,
          11.244850935832064
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "id": "emergency-05",
          "place_name": "burauen leyte",
          "view_bounds": [
          [10.7500468952595, 124.687957763672], [11.2858152798638, 125.084838867187]  
          ]
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
          124.88948822021484,
          10.982649977063492
          ]
        }
      },
      {
          "type": "Feature",
          "properties": {
            "id": "cover",
            "place_name": "PHL",
            "view_bounds": [
            [7.667441482726068, 118.564453125], 
            [18.375379094031814, 127.06787109374999]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.8833,
            10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-emergency-guiuan",
            "place_name": "guiuan",
            "view_bounds": [
              [10.8036305527031, 125.52978515625], [11.3393989373074, 125.926666259765]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.73131561279297,
            11.036233634507
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-emergency-homohon",
            "place_name": "homohon island",
            "view_bounds": [
              [10.528319677756, 125.510559082031], [11.0640880623603, 125.907440185546]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.72032928466795,
            10.73786205512162
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-emergency-basey",
            "place_name": "basey",
            "view_bounds": [
              [11.0679074298266, 124.881591796875], [11.6036758144309, 125.27847290039]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.06372451782227,
            11.28599242692106
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-emergency-balangiga",
            "place_name": "balangiga",
            "view_bounds": [
              [10.9142240069443, 125.194702148437], [11.4499923915486, 125.591583251952]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.38713455200195,
            11.11023208709613
            ]
          }
        },{
          "type": "Feature",
          "properties": {
            "id": "icrc-emergency-abuyog",
            "place_name": "abuyog",
            "view_bounds": [
              [10.5688221516269, 124.854125976562], [11.1045905362312, 125.251007080077]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.00990867614746,
            10.744945505898663
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-recovery-guiuan",
            "place_name": "guiuan",
            "view_bounds": [
              [10.8036305527031, 125.52978515625], [11.3393989373074, 125.926666259765]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.73131561279297,
            11.036233634507
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-recovery-salcedo",
            "place_name": "salcedo",
            "view_bounds": [
              [10.9142240069443, 125.472106933593], [11.4499923915486, 125.868988037108]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.66024780273438,
            11.155497934661474
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-recovery-homohon",
            "place_name": "homohon island",
            "view_bounds": [
              [10.528319677756, 125.510559082031], [11.0640880623603, 125.907440185546]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.72032928466795,
            10.73786205512162
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-recovery-random",
            "place_name": "marabut",
            "view_bounds": [
              [11.1504453519578, 125.521545410156], [11.6862137365621, 125.918426513671]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.52154541015625,
            11.150445351957863
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-recovery-marabut",
            "place_name": "marabut",
            "view_bounds": [
              [10.9088301557221, 125.018920898437], [11.4445985403264, 125.415802001952]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.21598815917967,
            11.117769865203444
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "icrc-recovery-basey",
            "place_name": "basey",
            "view_bounds": [
              [11.0679074298266, 124.881591796875], [11.6036758144309, 125.27847290039]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.06372451782227,
            11.28599242692106
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "livelihoods",
            "place_name": "PHL",
            "view_bounds": [
            [7.667441482726068, 118.564453125], 
            [18.375379094031814, 127.06787109374999]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.8833,
            10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "liporada",
            "place_name": "Anonang, Burauen, Leyte",
            "view_bounds": [
            [10.7928387592471, 124.722290039062], [11.3286071438514, 125.119171142577]  
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.8833,
            10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "martinez",
            "place_name": "Villa Corazon, Burauen, Leyte",
            "view_bounds": [
            [10.7145866909815, 124.576721191406], [11.2503550755858, 124.973602294921]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.78842258453368,
            10.93659901550848
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "cabujoc",
            "place_name": "Santol, San Miguel, Leyte",
            "view_bounds": [
            [11.081384602413, 124.626159667968], [11.6171529870173, 125.023040771483]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.82698202133177,
            11.34642079068341
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "coconutlady",
            "place_name": "Candahug, Palo, Leyte",
            "view_bounds": [
            [10.9142240069443, 124.810180664062], [11.4499923915486, 125.207061767577]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            125.01407146453856,
            11.17861237947222
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "shelter",
            "place_name": "",
            "view_bounds": [
            [7.667441482726068, 118.564453125], [18.375379094031814, 127.06787109374999]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              124.8833,
              10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "sheltergallery1",
            "place_name":"Tabontabon, Leyte",
            "view_bounds": [
            [10.8710704594996, 124.826660156249], [11.4068388441039, 125.223541259764]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            124.96398925781249,
            11.049038346537106
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "palawangallery",
            "place_name":"calamian islands",
            "view_bounds": [
            [11.8108996502773, 120.031127929687], [12.3466680348816, 120.428009033202]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            120.19935607910156,
            12.013129123340724
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "films",
            "place_name": "",
            "view_bounds": [
            [7.667441482726068, 118.564453125], [18.375379094031814, 127.06787109374999]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              124.8833,
              10.9833
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "manila",
            "view_bounds": [
            [14.3894576807687, 120.750732421875], [14.925226065373, 121.14761352539]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            120.96999764442444,
            14.59133954466318
            ]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "movement",
            "view_bounds": [
            [-37.71859032558814, 42.890625], [71.74643171904148, 158.90625]
            ]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
            122.6953125,
            11.953349393643416
            ]
          }
        }
        ];
      // define tile layer for base map
      // var tileLayerUrl = 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      var tileLayerUrl = 'http://{s}.tiles.mapbox.com/v3/americanredcross.hcji22de/{z}/{x}/{y}.png';
      var tileLayer = L.tileLayer(tileLayerUrl);

      // setup leaflet map with desired options
      
      var storyWidth = $(window).width() * 0.60;
      var padding = L.point(storyWidth, 0);
      var map = L.map('map', { 
          dragging: false,
          touchZoom: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          zoomControl: false,
          attributionControl: false,  
          // zoom: 6,
          // center: [11, 125.7],     
          layers: [tileLayer]
      }).fitBounds([[7.667441482726068, 118.564453125], [18.375379094031814, 127.06787109374999]], {
        paddingTopLeft: padding
      });

 

      //add markers to map
      var markerMap = {};
      var spots = L.geoJson(storyPoints, {
        pointToLayer: function (feature, latlng) {
            var thisIcon = L.divIcon({
              className: feature.properties.id +' spot spot-' + feature.properties.id,
              iconAnchor: [60,60]
            });
            var thisMarker = L.marker(latlng, {
              icon: thisIcon, 
              clickable: false
            });
            markerMap[feature.properties.id] = thisMarker;
            return thisMarker;
        }
      }).addTo(map);

      // Array of story section elements.
      var sections = document.getElementsByTagName('section');      

      // Helper to set the active section.
      var previousActive = 0;
      var setActive = function(index, ease) {
          var activeSpotId = sections[index].id;
          // Set active class on sections
          _(sections).each(function(s) { s.className = s.className.replace(' active', '') });
          sections[index].className += ' active';

          // if sections[index].id == cover || movement || etc. then add a class for display:none for all the markers

          // Set active class on markers
          $.each($('.spot'), function(index, spotDiv) {     
            if($(spotDiv).hasClass(activeSpotId)){
              $(spotDiv).addClass('active');
            } else {
              $(spotDiv).removeClass('active');
            }
          });
          
          // Set a body class for the active section.
          document.body.className = 'section-' + index;

          // Ease map to active marker.
          if (ease && previousActive !== index && markerMap[activeSpotId] !== undefined) {
            var storyWidth = $(window).width() * 0.6;
            var padding = L.point(storyWidth, 0)
            map.fitBounds(markerMap[activeSpotId].feature.properties.view_bounds, {
              paddingTopLeft: padding,
              // zoom: {
              //   animate: true,
              //   duration: 6
              // },
              pan: {
                animate: true,
                duration: 2.5
              }
            });

            previousActive = index;
          } 
          return true;
      };

      // Bind to scroll events to find the active section.
      window.onscroll = _(function() {
        // IE 8
        if (window.pageYOffset === undefined) {
          var y = document.documentElement.scrollTop;
          var h = document.documentElement.clientHeight;
        } else {
          var y = window.pageYOffset;
          var h = window.innerHeight;
        }

        // If scrolled to the very top of the page set the first section active.
        if (y === 0) return setActive(0, true);

        // Otherwise, conditionally determine the extent to which page must be
        // scrolled for each section. The first section that matches the current
        // scroll position wins and exits the loop early.
        var memo = 0;
        var buffer = (h * 0.3333);
        var active = _(sections).any(function(el, index) {
          memo += el.offsetHeight;
          return y < (memo-buffer) ? setActive(index, true) : false;
        });

        // If no section was set active the user has scrolled past the last section.
        // Set the last section active.
        if (!active) setActive(sections.length - 1, true);
      }).debounce(10);

      // Set map to first section.
      setActive(0, false);

      

}
}

// show disclaimer text on click of dislcaimer link
      function showDisclaimer() {
          window.alert("The maps used do not imply the expression of any opinion on the part of the International Federation of Red Cross and Red Crescent Societies or National Societies concerning the legal status of a territory or of its authorities.");
      }

fullSetup();