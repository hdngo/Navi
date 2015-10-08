$(document).ready(function(){
	// $('.start').on('click', function(){
	// 	$(location).attr('href', "https://instagram.com/oauth/authorize/?client_id=4080341888cb4239bbae9b7b67f3240c&redirect_uri=http://localhost:8000&response_type=token");
	// 	// $(location).attr('href', "http://localhost:8000/home.html")
	// })

//https://api.instagram.com/v1/tags/{snow}/media/recent?access_token=ACCESS-TOKEN
	$('#searchbar').on('submit', function(e){
		e.preventDefault();
		var path = "http://localhost:3000/api/v1/searches";
		var data = {"hashtag": "harveygotit", "start_date": "2015-09-29", "end_date": "2015-10-2"};
		data.start_date = Date.parse(data.start_date)/1000
		data.end_date = Date.parse(data.end_date)/1000
		console.log(data)
		// var formData = $(this).serialize();
		// y = Date.parse(x)/1000
		//unix is in seconds, Date.parse gives you ms
		$.ajax({
		 		url: path,
		 		type:"POST",
		 		data: JSON.stringify(data),
		 		contentType:"application/json; charset=utf-8",
		 		dataType: "json"
		 	}).done(function(response){
		 		console.log("success")
		 		console.log(response)
		 	}).fail(function(response){
		 		console.log("failure")
		 	})
	})

})

