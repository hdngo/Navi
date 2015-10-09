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

		//clear page
		$('#results-container').empty()
		if($('.load')){
		$('.load').remove()

		}

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
			alert('Invalid time frame, choose valid dates!')
			return
		}
		//start date and can't be end date can't be after tomorrow midnight
		if(formJSON.start_date > $.now() || formJSON.end_date > tomorrow.getTime()){
			alert('Invalid time frame, choose valid dates!')
			return
		}

		//reset form
		$(this).trigger("reset")

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
		 			var resultLink = "<a class=thumbnail-link href=" + result.image_url + " data-result-data='" + resultData + "' ><img height=258 width=258 src="+ result["image_url"] + " </a>"
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
		 			var resultLink = "<a class=thumbnail-link href=" + result.image_url + " data-result-data='" + resultData + "' ><img height=258 width=258 src="+ result["image_url"] + " </a>"
		 			$('#results-container').append(resultLink);
		 		})
		 		if(response.next_page === true){
		 			$(document.body).append('<button class="load" id=' + response.search_id + ' type="button">Load More</button>')
		 		}
		 	}).fail(function(response){
		 		console.log("failure")
		 	})
	})

	$(document).on('click', '.thumbnail-link', function(e){
		e.preventDefault();
		console.log('render the page')
		var resultData = $(this).data('resultData')
		$('#results-container').empty();
		$('.load').remove();
		// console.log($(this).data('resultData')["description"])
		
		if(resultData["content_type"] == "video"){
			$('#results-container').append("<iframe width=560 height=315 class=video src=" + resultData["video_url"] + " frameboarder=0 allowfullscreen></iframe>")
		}
		else if(resultData["content_type"] == "image"){
			$('#results-container').append("<img src="+ resultData["image_url"] + " />")
		}

		$('#results-container').append("<h4>" + resultData["ig_username"] + "</h4>")
		$('#results-container').append("<p>" + resultData["description"] + "</p>")
		$('#results-container').append("<a class=ig-link href=" + resultData["ig_link"] + " >View it on Instagram</a>")
	})

	$(document).on('click', '.ig-link', function(e){
		e.preventDefault();
		console.log('open new tab')
		var ig_url = $(this).attr('href')
		window.open(ig_url)
	})

	function extractResultData(result){
	resultData = {content_type: result["content_type"], ig_username: result["ig_username"], ig_link: result["ig_link"], image_url: result["image_url"], video_url: result["video_url"], description: result["description"]}
	return resultData
	}
})

