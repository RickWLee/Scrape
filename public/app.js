$.getJSON('/articles', function(data){

	for (var i=0; i<data.length; i++){

		$("#articles").append("<p data-id='" + data[i]._id+"'>"+data[i].title+"<br />"+data[i].link+"</p>");
	}
});



$(document).on("click", "p", function() {
  // empty notes in notes section
  $("#notes").empty();
  // save id from p tag
  var thisId = $(this).attr("data-id");
  // ajax call the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // add note information to the page
    .done(function(data) {
      console.log("line 26", data);
      // title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      // textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // button to submit a new note, with article id saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
     if(data.note){
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
     }
  });
});




$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
 
  // console.log(thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + $(this).attr("data-id"),
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});