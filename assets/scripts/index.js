
var map;
var markers = [];
var infoWindow;
var foundStores = [];

const startJs = function () {

  function clearDisplaySearchResult() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }

  function displayStores(stores) {
    var storesHtml = "";

    stores.forEach(function (store, index) {
      var address = store.addressLines;
      var phone = store.phoneNumber;
      storesHtml += `
        <div class="store-container">
          <div class="store-info-container">
            <div class="store-address">
                <span>${address[0]}<span>
                <span>${address[1]}<span>
            </div>
            <div class="store-phone-number">
              <i class="fas fa-phone">
              ${phone}
              </i>
            </div>
          </div>
          <div class="store-number-container">
            <div class="store-number">
            ${index + 1}						
            </div>
          </div>
        </div>
        `
    });
    document.querySelector(".stores-list").innerHTML = storesHtml;
  }

  function displaySearchResult() {
    clearDisplaySearchResult();
    displayStores(foundStores);
    showStoresMarker(foundStores);
    setOnClickListener();
  }


  function displayAllStores() {
    foundStores = stores;
    displaySearchResult();
  }

  function createMarker(latlng, name, status, address, phone, index) {
    var html = `
    <div class="store-info-window">
      <div class="store-info-name">
      ${name}
      </div>
      <div class="store-info-status">
      ${status}
      </div>
      <div class="store-info-address">
        <i class="fas fa-location-arrow"></i>
      ${address}
      </div>
      <div class="store-info-phone">
        <i class="fas fa-phone"></i>
      ${phone}
      </div>
    </div>`;


    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: `${index + 1}`,
      icon: {
        url: 'assets/images/starbuck.png',
        scaledSize: new google.maps.Size(40, 50),
      }
    }
    );

    google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
  }

  function showStoresMarker(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function (store, index) {
      var latlng = new google.maps.LatLng(
        store.coordinates.latitude, store.coordinates.longitude);
      bounds.extend(latlng);
      createMarker(latlng, store.name, store.openStatusText, store.addressLines[0], store.phoneNumber, index);
    })
    map.fitBounds(bounds);
  }


  function setOnClickListener() {
    var storeElements = document.querySelectorAll(".store-container");
    storeElements.forEach(function (elem, index) {
      elem.addEventListener("mouseover", function () {
        google.maps.event.trigger(markers[index], 'click');
      })
    })
  }

  function onTypingSearchAction(){
    document.querySelector("input[name='search-form']").addEventListener("keyup", function(event){
      searchAction();
    })
  }


  return {
    displayAllStores: displayAllStores,
    displaySearchResult: displaySearchResult,
    onTypingSearchAction: onTypingSearchAction
  }
}();


function initMap() {
  var losAngeles = {
    lat: 34.063380,
    lng: -118.358080
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 8
  });
  infoWindow = new google.maps.InfoWindow();
  startJs.displayAllStores();
  startJs.onTypingSearchAction();
}

function searchAction() {
  foundStores = [];
  var input = document.querySelector("input[name='search-form']").value;
  if (input) {
    stores.forEach(function (store) {
      if (store.address.postalCode.substring(0, 5).includes(input)){
        foundStores.push(store);
      }
    })
  }else{
    foundStores = stores;
  }
  startJs.displaySearchResult();
}