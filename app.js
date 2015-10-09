$(document).ready(function(){

	var now = new Date($.now())
	var tomorrow = now.setDate(now.getDate() + 1)
	tomorrow = new Date(tomorrow)
	tomorrow.setHours(0,0,0,0)
	
	function formatDate(date){
		var dateObject = new Date(date)
		dateObject.setDate(dateObject.getDate() + 1)
		dateObject.setHours(0,0,0,0)
		return dateObject
	}
	$('#searchbar').on('submit', function(e){
		e.preventDefault();
		var path = "http://localhost:3000/api/v1/searches";
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

		$.ajax({
		 		url: path,
		 		type:"POST",
		 		data: JSON.stringify(formJSON),
		 		contentType:"application/json; charset=utf-8",
		 		dataType: "json"
		 	}).done(function(response){
		 		console.log(response)
		 		response.results.forEach(function(result){
		 			var resultData = JSON.stringify(extractResultData(result))
		 			var resultLink = "<a href=" + result.image_url + " data-result-data='" + resultData + "' ><img height=258 width=258 src="+ result["image_url"] + " </a>"
		 			$('#results-container').append(resultLink);
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
		 		response.results.forEach(function(result){
		 			var resultData = JSON.stringify(extractResultData(result))
		 			var resultLink = "<a href=" + result.image_url + " data-result-data='" + resultData + "' ><img height=258 width=258 src="+ result["image_url"] + " </a>"
		 			$('#results-container').append(resultLink);
		 		})
		 		if(response.next_page === true){
		 			$(document.body).append('<button class="load" id=' + response.search_id + ' type="button">Load More</button>')
		 		}
		 	}).fail(function(response){
		 		console.log("failure")
		 	})
	})

	function extractResultData(result){
	resultData = {content_type: result["content_type"], ig_username: result["ig_username"], ig_link: result["ig_link"], image_url: result["image_url"], video_url: result["video_url"], description: result["description"]}
	return resultData
	}
})

