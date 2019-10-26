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
            console.log({ geoAPI: response });
            console.log("lat " + response.Results[0].lat + "long " + response.Results[0].lon)
            var LATITUDE = response.Results[0].lat;
            var LONGITUDE = response.Results[0].lon;
            var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${LATITUDE}&lon=${LONGITUDE}&key=${APIKEY}&minStars=4&minLength=10`;
            console.log(queryURL);
            var settings = {
                "url": queryURL,
                "method": "GET",
            }
            $.ajax(settings).done(function (result) {
                console.log(result);
                var trails = result.trails;
                // var resultsDiv = $(".card-content").eq(0);
                //     var rating = $("<p>").text("Star rating: " + trails[0].starVotes);
                //     var difficulty = $("<p>").text("difficulty: " + trails[0].difficulty);
                //     resultsDiv.append(image);
                //     resultsDiv.append(rating);
                //     resultsDiv.append(difficulty);
                //     // $(".results").append(resultsDiv);
                //     var image = $("<img>");
                //     console.log(trails[0].imgMedium);
                //     image.attr("src", trails[0].imgMedium);
                 //   $(".card-image").eq(0).append(image);
                for (var i = 1; i < trails.length; i++) { 
                    $('.myCard').clone().appendTo(".results");  
                    var image = $("<img>");
                    image.attr("src", trails[i].imgMedium);
                    $(".card-image").eq(i).append(image);

                    var resultsDiv = $(".card-content").eq(i);
                    var rating = $("<p>").text("Star rating: " + trails[i].starVotes);
                    var difficulty = $("<p>").text("difficulty: " + trails[i].difficulty);
                    resultsDiv.append(rating);
                    resultsDiv.append(difficulty);
                   
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