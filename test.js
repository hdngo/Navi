$(document).ready(function(){

//https://api.instagram.com/v1/tags/{snow}/media/recent?access_token=ACCESS-TOKEN
	$('#searchbar').on('submit', function(e){
		e.preventDefault();
		var path = "http://localhost:3000/api/v1/searches";
		var data = {"hashtag": "harveygotit", "start_date": "2015-09-29", "end_date": "2015-10-2"};
		data.start_date = Date.parse(data.start_date)/1000
		data.end_date = Date.parse(data.end_date)/1000
		console.log(data)
		// var formData = $(this).serializeArray();
		// var formJSON = {};
		// formattedData = formData.forEach(function(object){
		// 	formJSON[object.name] = object.value;
		// })
		// console.log(formJSON)
		// y = Date.parse(x)/1000
		//unix is in seconds, Date.parse gives you ms
		$.ajax({
		 		url: path,
		 		type:"POST",
		 		data: JSON.stringify(data),
		 		contentType:"application/json; charset=utf-8",
		 		dataType: "json"
		 	}).done(function(response){
		 		console.log(response)
		 		response.results.forEach(function(result){
		 			var myImage = new Image(258, 258);
		 			myImage.src = result["image_url"];
		 			$(document.body).append(myImage);
		 		})
		 		if(response.next_page === true){
		 			$(document.body).append('<button class="load" id=' + response.search_id + ' type="button">Load More</button>')
		 		}
		 	}).fail(function(response){
		 		console.log("failure")
		 	})
	})

	$(document).on('click', '.load', function(e){
		e.preventDefault();
		console.log('render me media minion');
		var resultOffset = $('img').length;
		console.log(resultOffset)
		var searchId = $(this).attr('id')
		$(this).fadeOut();
		$(this).remove();
		$.ajax({
			url: 'http://localhost:3000/api/v1/searches/' + searchId + '/results/page/' + resultOffset,
			type:"GET",
			dataType: "json"
		 	}).done(function(response){
		 		console.log('success')
		 		console.log(response);
		 		response.results.forEach(function(result){
		 			var myImage = new Image(258, 258);
		 			myImage.src = result["image_url"];
		 			$(document.body).append(myImage);
		 		})
		 		if(response.next_page === true){
		 			$(document.body).append('<button class="load" id=' + response.search_id + ' type="button">Load More</button>')
		 		}
		 	}).fail(function(response){
		 		console.log("failure")
		 	})
	})
})

