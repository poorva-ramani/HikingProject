$(document).ready(function () {
    var searchInput = $('#searchInp');
    var searchButton = $('#searchBtn');
    var trailLength='';
    var stars='1';
    var APIKEY = '200624582-ef03dfcbf90f2bd9243bdef3d1acb99b';
    $(".results").hide();
    $("#filterSearchBtn").on('click', function(){
        // ratingFilter()
        trailLength =  document.getElementById("lengthSlider");
        console.log(trailLength.value);
        if ($('#rating5').is(':checked')) {
            stars = '5';
             console.log(stars)
         }
         else if ($('#rating4').is(':checked')) {
          stars = '4';
             console.log(stars)
         }
         else if ($('#rating3').is(':checked')) {
          stars = '3';
          console.log(stars)

         }
         else if ($('#rating2').is(':checked')) {
          stars = '2';
          console.log(stars)

         }
         else if ($('#rating1').is(':checked')) {
          stars = '1';
          console.log(stars)
         }
        searchResults(trailLength.value,stars);
    });
  
       function searchResults(trailLength,stars){
        $('.searchResults').empty()     
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
            var LATITUDE = response.Results[0].lat;
            var LONGITUDE = response.Results[0].lon;
            var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${LATITUDE}&lon=${LONGITUDE}&key=${APIKEY}&minStars=${stars}&minLength=${trailLength}`;
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
    }

    searchButton.click(function (e) {
        e.preventDefault();    
        searchResults();
    });
});