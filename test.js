$(document).ready(function(){

	var now = new Date($.now())
	var tomorrow = now.setDate(now.getDate() + 1)
	tomorrow = new Date(tomorrow)
	tomorrow.setHours(0,0,0,0)
//https://api.instagram.com/v1/tags/{snow}/media/recent?access_token=ACCESS-TOKEN
	function formatDate(date){
		var dateObject = new Date(date)
		dateObject.setDate(dateObject.getDate() + 1)
		dateObject.setHours(0,0,0,0)
		return dateObject
	}
	$('#searchbar').on('submit', function(e){
		e.preventDefault();
		var path = "http://localhost:3000/api/v1/searches";
		// var data = {"hashtag": "harveygotit", "start_date": "2015-09-29", "end_date": "2015-10-2"};
		// data.start_date = Date.parse(data.start_date)/1000
		// data.end_date = Date.parse(data.end_date)/1000
		// console.log(data)
		var formData = $(this).serializeArray();
		var formJSON = {};
		formattedData = formData.forEach(function(object){
			formJSON[object.name] = object.value;
		})
		formJSON.hashtag = formJSON.hashtag.toLowerCase();
		formJSON.start_date = Date.parse(formatDate(formJSON.start_date))
		formJSON.end_date = Date.parse(formatDate(formJSON.end_date))

		// start date can't be after end date and dates can't be the same
		if(formJSON.start_date > formJSON.end_date || formJSON.start_date == formJSON.end_date){
			console.log('invalid range')
			return
		}
		//start date and can't be end date can't be after tomorrow midnight
		if(formJSON.start_date > $.now() || formJSON.end_date > tomorrow.getTime()){
			console.log('invalid range')
			return
		}
		console.log(formJSON)

		$.ajax({
		 		url: path,
		 		type:"POST",
		 		data: JSON.stringify(formJSON),
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

