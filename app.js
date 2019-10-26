$(document).ready(function () {
    var searchInput = $('#searchInp');
    var searchButton = $('#searchBtn');
    var APIKEY = '200624582-ef03dfcbf90f2bd9243bdef3d1acb99b';
    $(".results").hide();
    searchButton.click(function (e) {
        e.preventDefault();
        address = searchInput.val();
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
            // console.log({ geoAPI: response });
            // console.log("lat " + response.Results[0].lat + "long " + response.Results[0].lon)
            var LATITUDE = response.Results[0].lat;
            var LONGITUDE = response.Results[0].lon;
            var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${LATITUDE}&lon=${LONGITUDE}&key=${APIKEY}&minStars=4&maxResults=10`;
            console.log(queryURL);
            var settings = {
                "url": queryURL,
                "method": "GET",
            }
            $.ajax(settings).done(function (result) {
                console.log(result);
                var trails = result.trails;
                for (var i = 0; i < trails.length; i++) { 
                    var card =$("<div class='card horizontal myCard'>");
                    var cardimage=$('<div class="card-image">'); 
                    var cardStacked=$('<div class="card-stacked">');
                    var cardContent=$('<div class="card-content">');
                    var cardAction=$('<div class="card-action">');
                                       
                    card.append(cardimage);
                    card.append(cardStacked);
                    cardStacked.append(cardContent);
                    cardStacked.append(cardAction);
                    cardAction.append($("<a>").text("This is a link"));

                    var image = $("<img>");
                    image.attr("src", trails[i].imgSmall);
                    cardimage.append(image);

                    var rating = $("<p>").text("Star rating: " + trails[i].starVotes);
                    var difficulty = $("<p>").text("difficulty: " + trails[i].difficulty);
                    cardContent.append(rating);
                    cardContent.append(difficulty);

                    $('.searchResults').append(card);
                }
            });
        });
    });

//this click function only to test if statements!!!
   $("#filterSearchBtn").on('click', function(){
       ratingFilter()
   })
   //var ratings = result.trails.stars
   function ratingFilter() {
   if (!$('#rating5').is(':checked') && !$('#rating4').is(':checked') && !$('#rating3').is(':checked')
    && !$('#rating2').is(':checked') && !$('#rating1').is(':checked')) {
       $('#errorMsg').html('Please have at least one option checked')
       return;
   }
   if ($('#rating5').is(':checked')) {
      // minStars == 5
       console.log ('min5 checked')
   }
   if ($('#rating4').is(':checked')) {
      // minStars == 4
       console.log('min4 checked')
   }
   if ($('#rating3').is(':checked')) {
      // minStars == 3
   }
   if ($('#rating2').is(':checked')) {
      // minStars == 2
   }
   if ($('#rating1').is(':checked')) {
      // minStars == 1
   }
   }
});