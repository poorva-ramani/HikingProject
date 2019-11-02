var modal = document.querySelector(".modal");
var closeBtn = document.querySelector("#close-btn");
var closeButton = document.querySelector(".close-button");
var modalText = document.querySelector("#modal-text");
var modalSubtext = document.querySelector("#modal-subtext");
var mymap= L.map('mapid').setView([43, -83], 12);
var i = 0;
$(document).ready(function () {
    var searchInput = $('#searchInp');
    var searchButton = $('#searchBtn');
    var trailLength = '';
    var stars = '1';
    var APIKEY = '200624582-ef03dfcbf90f2bd9243bdef3d1acb99b';
    $(".results").hide();
    $("#filterSearchBtn").on('click', function () {
        // ratingFilter()
        trailLength = document.getElementById("lengthSlider");
        if ($('#rating5').is(':checked')) {
            stars = '5';
        }
        else if ($('#rating4').is(':checked')) {
            stars = '4';
        }
        else if ($('#rating3').is(':checked')) {
            stars = '3';
        }
        else if ($('#rating2').is(':checked')) {
            stars = '2';
        }
        else if ($('#rating1').is(':checked')) {
            stars = '1';
        }

        searchResults(trailLength.value, stars);
    });

    //code for popupmodal toggle
    function toggleModal() {
        modal.classList.toggle("show-modal");
    }

    //geolocation and hiking api    
    function searchResults(address, trailLength, stars) {
        $('.searchResults').empty()
        console.log(address)
        if (address === '') {
            $('.searchResults').on("click", toggleModal());
            modalText.textContent = " Blank Search !!!";
            modalSubtext.textContent = 'Please Enter a valid city';
            closeButton.addEventListener("click", toggleModal);
            closeBtn.addEventListener("click", toggleModal);
            return;
        }
        $(".searchBox").hide();
        $(".results").show();
        var geoCodeApi = {
            "async": true,
            "crossDomain": true,
            "url": `https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php?location=${address}`,
            "method": "GET",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
                "x-rapidapi-key": "4fbf5f804emshb740f6dffabc9b7p106402jsnf97c633c941b"
            }
        }
        $.ajax(geoCodeApi).done(function (response) {
            var LATITUDE = response.Results[0].lat;
            var LONGITUDE = response.Results[0].lon;
            var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${LATITUDE}&lon=${LONGITUDE}&key=${APIKEY}&minStars=${stars}&minLength=${trailLength}`;
            var settings = {
                "url": queryURL,
                "method": "GET",
            }
            
             //setting map view point
            //  $.empty(mymap)
            mymap.invalidateSize();
            mymap = L.map('mapid').setView([LATITUDE, LONGITUDE], 12)
             
             //map
             L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                 attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                 maxZoom: 18,
                 id: 'mapbox.streets',
                 accessToken: 'pk.eyJ1IjoiZGVicmFzcGFyciIsImEiOiJjazJiNmJ2cDUwMHg5M2NxY29yeGQ0cWowIn0._VZcZvPTCyIjGPjjz3FG7w'
             }).addTo(mymap);
             var circle = L.circle([LATITUDE, LONGITUDE], {
                 color: 'red',
                 fillColor: '#f03',
                 fillOpacity: 0.5,
                 radius: 150
             }).addTo(mymap);
            $.ajax(settings).done(function (result) {
                var trails = result.trails;
                 //if no results are rendered - would form into a popup... Unless Poorva already did that
                 if (trails.length === 0) {
                    $('.results').hide()
                    $('#resultsError').text('City does not have any trails within a 30 mile radius. Please try again!')
                    console.log('werk')
                    return
                }
                for (i = 0; i < trails.length; i++) {
                    var card = $("<div class='card horizontal myCard'>");
                    var cardimage = $('<div class="card-image">');
                    var cardStacked = $('<div class="card-stacked">');
                    var cardContent = $('<div class="card-content">');
                    var cardAction = $('<div class="card-action center">');

                    card.append(cardimage);
                    card.append(cardStacked);
                    cardStacked.append(cardContent);
                    cardStacked.append(cardAction);
                    cardAction.append($("<a>").text("SHOW IN MAP")
                        .addClass('cardLinks')
                        .attr('data-lat', trails[i].latitude)
                        .attr('data-lon', trails[i].longitude)
                        .attr('data-locale', trails[i].location)
                        .attr('data-name', trails[i].name));


                    var image = $("<img>");
                    image.attr("src", trails[i].imgSmall);
                    image.attr('alt', trails[i].name);
                    cardimage.append(image);

                    var name = $("<p class='name'>").text(trails[i].name);
                    var difficulty = $("<p>").text("Difficulty: " + trails[i].difficulty);
                    var location = $("<p>").text("Location: " + trails[i].location);
                    var length = $("<p>").text("Length: " + trails[i].length);
                    var rating = $("<p>").text("Rating: " + trails[i].stars);
                    cardContent.append(name);
                    cardContent.append(location);
                    cardContent.append(length);
                    cardContent.append(difficulty);
                    cardContent.append(rating);

                    $('.searchResults').append(card);
                }
                 //showing in map on card click
                 $('.cardLinks').click(function() {
                    var cityLat = ($(this).attr('data-lat'))
                    var cityLon = ($(this).attr('data-lon'))
                    var trailName = ($(this).attr('data-name'));
                    var locale = ($(this).attr('data-locale'));
                    var temp = '';

                    $.ajax({
                        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + 
                        locale + '&apikey=df520520403dc5e0455758f5b172bc5e&units=imperial',
                        method: 'GET',
                    })
                    .then(function(data){
                        temp += data.list[0].main.temp
                        console.log(temp)
                    var myRenderer = L.canvas({ padding: 0.5 });
                    var circleMarker = L.circleMarker([cityLat, cityLon], {
                        renderer: myRenderer,
                        color: '#3388ff'
                    }).addTo(mymap)
                    .bindPopup("<b>" + trailName + '<p>Current temp is: ' + temp + '\xB0F').openPopup();
                    mymap.panTo([cityLat, cityLon], 13);
                    })

                    //scroll to map on click
                    $('html, body').animate({
                        scrollTop: $("#mapid").offset().top
                    }, 500);
                    
                })
            });
                //map
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoiZGVicmFzcGFyciIsImEiOiJjazJiNmJ2cDUwMHg5M2NxY29yeGQ0cWowIn0._VZcZvPTCyIjGPjjz3FG7w'
                }).addTo(mymap);
                var circle = L.circle([LATITUDE, LONGITUDE], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5,
                    radius: 150
                }).addTo(mymap);

        });
    }

    //localstorage methods
    var searchedCities = JSON.parse(localStorage.getItem('searchedCities')) || []

    function appendSearches() {
        $("#history").empty();
        for (i = 0; i < searchedCities.length; i++) {
            var li = $("<li>")
            li.addClass("center")
            li.attr("data-city", searchedCities[i].name)
            $("#history").prepend(li)
            li.click(function (e) {
                recall(e.target.innerText)
            });
            li.append(searchedCities[i].name);
        }
    }

    function recall(address) {
        console.log(1)
        closeNav();
        searchResults(address);
    }

    //code to trigget search action
    searchButton.click(function (e) {
        e.preventDefault();
        $('.searchResults').empty()
        address = searchInput.val();
        //code for popupmodal for blank searches
        searchResults(address);
        //storing in localstorage
        var cityObj = {
            name: address
        }
        searchedCities.push(cityObj)
        localStorage.setItem('searchedCities', JSON.stringify(searchedCities))
        if (searchedCities.length === 10) {
            searchedCities.shift();
        }
        appendSearches()
    });

});

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
