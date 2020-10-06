//Here API KEY
window.apikey = 'd6P_iT9IijO82t-OTwt_mUpiFyIodK3JJqV9msKJuqk';

//----Creation of Map ----//
var platform = new H.service.Platform({
    apikey: window.apikey
});
var defaultLayers = platform.createDefaultLayers();

//Initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map, {
        center: {
            lat: 50,
            lng: 5
        },
        zoom: 10,
        pixelRatio: window.devicePixelRatio || 1
    });
// Add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

// Make the map interactive by enabling MapEvents
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);
//--End Creation of Map--//

var myItemLat;
var myItemLng;
var myItemtitle;

// The function to search for the location coordinates by typing location name in the search box
const autosuggest = (e) => {
    if (event.metaKey) {
        return
    }
    let searchString = e.value
    if (searchString != "") {
        fetch(
            `https://autosuggest.search.hereapi.com/v1/autosuggest?apiKey=${window.apikey}&at=33.738045,73.084488&limit=5&resultType=city&q=${searchString}&lang=en-US`
        )
            .then((res) => res.json())
            .then((hotels) => {
                if (hotels.length != 0) {
                    document.getElementById("list").innerHTML = ``;
                    hotels.items.map((item) => {
                        if ((item.position != undefined) & (item.position != "")){
                            myItemLat = item.position.lat;
                            myItemLng = item.position.lng;
                            myItemtitle = item.title;
                        }
                        document.getElementById("list").innerHTML += `<li onClick=" MarkOnMap(${item.position.lat},${item.position.lng},'${item.title}');">${item.title}</li>`;
                    });
                }
            });
    }
};

//Get Hotels within the Latitute and Longitude corrdinated
function getHotels(Lat, Long) {
    if (!Lat || !Long) {
        alert("Position not defined");
        return;
    }
    var locationValues = Lat + ',' + Long;
    var data = {
        alt: locationValues
    }
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/properties',
        contentType: 'application/JSON; charset=uft-8',
        data: data,
        success: funcSuccess,
        error: funcFail
    });

    function funcSuccess(res) {
        if (res.length != 0) {
            if(document.getElementsByClassName("con3")){
                $( ".con3" ).remove();
            }

            map.removeObjects(map.getObjects());
            document.getElementById("list").innerHTML = ``;

            //create Dynamically created list
            res.forEach(element => {
                let title = element.title;
                let lat = element.position.lat;
                let lng = element.position.lng;
                let contacts = element.contacts[0];

                let mydiv = document.createElement('div');
                mydiv.className = "con3";
                var tt = document.createElement("h1");
                tt.innerHTML = title + "<br/>";
                mydiv.appendChild(tt);
                let lt = document.createElement("p");
                lt.innerHTML = "Lat= " + lat + "<br/>";
                mydiv.appendChild(lt);
                let ln = document.createElement("p");
                ln.innerHTML = "Lng= " + lng + "<br/>";
                mydiv.appendChild(ln);
                if (contacts.www) {
                    let www = contacts.www[0].value;
                    let w = document.createElement("p");
                    w.innerHTML = "WebSite= " + www + "<br/>";
                    mydiv.appendChild(w);

                };
                if (contacts.phone) {
                    phone = contacts.phone[0].value;
                    let p = document.createElement("p");
                    p.innerHTML = "Phone= " + phone + "<br/>";
                    mydiv.appendChild(p);
                }

                document.getElementsByClassName("con")[0].appendChild(mydiv);
                MultiMarkOnMap(lat, lng, title);
            });
        }
    }
    function funcFail(res) {
        alert("Failed");
    }

}

//The function to mark the location in map
function MarkOnMap(lat, lng, title) {
    map.removeObjects(map.getObjects())
    var selectedLocationMarker = new H.map.Marker({
        lat,
        lng
    });
    map.addObject(selectedLocationMarker);
    map.setCenter({
        lat,
        lng
    }, true);
    map.setZoom(15);
};

//Add Multiple markers on the map
function MultiMarkOnMap(lat, lng, title) {
    var selectedLocationMarker = new H.map.Marker({
        lat,
        lng
    });
    map.addObject(selectedLocationMarker);
    map.setCenter({
        lat,
        lng
    }, true);

};