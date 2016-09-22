$(document).ready(function() {
	//Variables
	var routes = {};
	var route = null;
	var points = {};
	var raw_image = false;
	var blurred_image = false;
	var highlighted_image = false;
	var r_objects = [];
	var finished = false;
	var point = {
		raw_image_url: null,
		route_id: null,
        raw_image_size: null,
        date_captured: null,
        processed_blurred_image_url: null,
        processed_blurred_image_size: null,
        processed_highlighted_image_url: null,
        processed_highlighted_image_size: null,
        device_captured_with: null,
        geometry: null
	};
	var spinner = $('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>')
	var uploadicon = $('<span class="glyphicon glyphicon-upload" aria-hidden="true"></span>');
	var $fileInputRaw = $('#fileInputRaw');
	var $fileSubmitRaw = $('#fileSubmitRaw');
	var $uploadFormRaw = $('#uploadFormRaw');
	var $fileInputBlurred = $('#fileInputBlurred');
	var $fileSubmitBlurred = $('#fileSubmitBlurred');
	var $uploadFormBlurred = $('#uploadFormBlurred');
	var $fileInputHighlighted = $('#fileInputHighlighted');
	var $fileSubmitHighlighted = $('#fileSubmitHighlighted');
	var $uploadFormHighlighted = $('#uploadFormHighlighted');


	//Events
	$("#myNavbar ul li a").on('click',function(e) {
	    e.preventDefault(); // stops link form loading
	    $("#myNavbar").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	    $('.cont').hide(); // hides all content divs
	    $('#' + $(this).attr('href') ).show(); //get the href and use it find which div to show
	    if($(this).parent().text() == "Images") {
	    	$('.sidenav').hide();
	    	$middle = $('.col-sm-10');
	    	$middle.removeClass('col-sm-10');
	    	$middle.addClass('col-sm-12');
	    } else {
	    	$('.sidenav').show();
	    	$middle = $('.col-sm-12');
	    	$middle.removeClass('col-sm-12');
	    	$middle.addClass('col-sm-10');
	    }
	});

	$('#btn-submit').click(function (e) {
		if(finished) {
			data = {
				origin: route.origin_point_name,
				destination: route.destination_point_name,
				purpose: route.primary_route_purposes,
				id: route.route_id
			}
			$.ajax({
			    type: "POST",
			    url: "http://giv-oct.uni-muenster.de:8083/api/routes/update",
			    processData: false,
			    contentType: 'application/json',
			    data: JSON.stringify(data),
			    success: function(r) {
			    	console.log(r);
			    	console.log(JSON.stringify(point))
			    	$.ajax({
					    type: "POST",
					    url: "http://giv-oct.uni-muenster.de:8083/api/point/insert",
					    processData: false,
					    contentType: 'application/json',
					    data: JSON.stringify(point),
					    success: function(r) {
					    	console.log(r);
					 		point_id = r.data.point_id;
					    	for(i in r_objects) {
					    		console.log(i)
						    	data = {
						    		name: $('#reference-object-name'+i).val(),
						    		desc: $('#reference-object-desc'+i).val(),
						    		point_id: point_id
						    	}
						    	console.log(data);
					    		if (data.name == "" && data.desc == "") {
					    			location.reload();
					    		} else {
					    			$.ajax({
									    type: "POST",
									    url: "http://giv-oct.uni-muenster.de:8083/api/reference/add",
									    processData: false,
									    contentType: 'application/json',
									    data: JSON.stringify(data),
									    success: function(r) {
									    	console.log(r);
									    	location.reload();
									    },
									    error: function (er) {
									    	location.reload();
									    }
									});
					    		}
					    	}
						}
					});
				}
			});
		}
		else{
			alert("First Fill in all data");
		}
	});

	$('#btn-add-row').click(function (e) {
		addRObject();
	});

	$fileInputRaw.change(function (e){
		$fileSubmitRaw.click();
		uploadicon.remove();
		$('.btn.file.raw').append(spinner);
    });
    $fileInputBlurred.change(function (e){
		$fileSubmitBlurred.click();
		uploadicon.remove();
		$('.btn.file.blurred').append(spinner);
    });
    $fileInputHighlighted.change(function (e){
		$fileSubmitHighlighted.click();
		uploadicon.remove();
		$('.btn.file.highlighted').append(spinner);
    });

	$('.file.raw').click(function (e) {		
		$fileInputRaw.click();	
	});
	$('.file.blurred').click(function (e) {		
		$fileInputBlurred.click();	
	});
	$('.file.highlighted').click(function (e) {		
		$fileInputHighlighted.click();	
	});

	$uploadFormRaw.submit(function (e) {
		e.preventDefault;
		$(this).ajaxSubmit({
            error: function(xhr) {
        		console.log(xhr);
            },
            success: function(response) {
            	console.log(response)
            	spinner.remove();
            	raw_image = true;
            	$('#imagetab2').attr("src",response.url);
            	$('.btn.file.raw').append(uploadicon);
            	$('.btn.file.raw').removeClass('btn-danger');
				$('.btn.file.raw').addClass('btn-primary');
            	$('#latitude').val(response.latitude)
            	$('#longitude').val(response.longitude)
            	$('#data-captured').val(response.data_captured)
            	$('#device').val(response.device)
            	$('#raw-image-size').val(response.raw_image_size)
            },
            error: function(err) {
            	spinner.remove();
            	$('.btn.file.raw').append(uploadicon);
            }
    	});
    	return false;
	});
	$uploadFormBlurred.submit(function (e) {
		e.preventDefault;
		$(this).ajaxSubmit({
            error: function(xhr) {
        		console.log(xhr);
            },
            success: function(response) {
            	console.log(response)
            	spinner.remove();
            	blurred_image = true;
            	$('#blurred-image-size').val(response.blurred_image_size)
            	$('.btn.file.blurred').append(uploadicon);
            	$('.btn.file.blurred').removeClass('btn-danger');
				$('.btn.file.blurred').addClass('btn-primary');
            	$('#imagetab3').attr("src",response.url);
            },
            error: function(err) {
            	spinner.remove();
            	$('.btn.file.blurred').append(uploadicon);
            }
    	});
    	return false;
	});
	$uploadFormHighlighted.submit(function (e) {
		e.preventDefault;
		$(this).ajaxSubmit({
            error: function(xhr) {
        		console.log(xhr);
            },
            success: function(response) {
            	console.log(response)
            	spinner.remove();
            	highlighted_image = true;
            	$('#highlighted-image-size').val(response.highlighted_image_size)
            	$('.btn.file.highlighted').append(uploadicon);
            	$('.btn.file.highlighted').removeClass('btn-danger');
				$('.btn.file.highlighted').addClass('btn-primary');
            	$('#imagetab4').attr("src",response.url);
            },
            error: function(err) {
            	spinner.remove();
            	$('.btn.file.highlighted').append(uploadicon);
            }
    	});
    	return false;
	});



	//Functions
	var getRoutes = function () {
		$.getJSON('/api/routes', function (json) {
			routes = json;
			for (i in json) {
				$('.dropdown-menu').append('<li><a href="#">'+json[i].route_name+'</a></li>');
			}
			$('.route-btn').click(function (e) {
				//Get Points of route
				$('.route-info').hide();
				id = $(this)[0].id;
				$('#div-'+id).show();
			});
			$.getJSON('/api/points', function (_points) {
				for(i in _points) {
					r_id = _points[i];
					$('#table tbody').append('<tr><td>Route '+r_id.route_id+'</td><td>'+r_id.geometry+'</td><td><a href="'+r_id.raw_image_url+'">Raw Image</a><br><a href="'+r_id.processed_blurred_image_url+'">Blurred Image</a><br><a href="'+r_id.processed_highlighted_image_url+'">Highlighted Image</a></td><td>'+r_id.date_image_modified+'</td></tr>');
				}
				$('#table').DataTable();
			});
			$('ul.dropdown-menu li a').click(function (e) {
			    var $div = $(this).parent().parent().parent(); 
			    var $btn = $div.find('button');
			    $btn.html($(this).text() + ' <span class="caret"></span>');
			    $div.removeClass('open');
			    route_name = $(this).text();
			    route = routes.filter(function (ob) {
					return ob.route_name===route_name;
				})[0];
				$('#destination-point-name').val(route.destination_point_name);
				$('#origin-point-name').val(route.origin_point_name);
				$('#primary-activity').val(route.primary_route_purposes);
			    e.preventDefault();
			    return false;
			});
		});
	}

	var addRObject = function () {
		$row = $('<div class="row" style="overflow-x:hidden;"></div>')
		$col4 = $('<div class="col-md-4"></div>')
		$col7 = $('<div class="col-md-7"></div>')
		$name = $('<input placeholder="Name" type="text" class="form-control" id="reference-object-name'+r_objects.length+'" aria-describedby="basic-addon3">');
		$desc = $('<input placeholder="Description" type="text" class="form-control" id="reference-object-desc'+r_objects.length+'" aria-describedby="basic-addon3">');
		$col4.append($name);
		$row.append($col4);
		$row.append($col7);
		$col7.append($desc);
		$('#r-object-form').append($row);
		r_objects.push({
			name: null,
			description: null
		});
	}


	//Logic
	getRoutes();
	addRObject();
	$('.sidenav').hide();
	$('#rootwizard').bootstrapWizard( 
		{
			onTabClick: function () {
				return false;
			},
			onNext: function (tab, navigation, index) {
				switch(index) {
					case(1):
						if(route) {
							point.route_id = route.route_id;
							route.primary_route_purposes = $('#primary-activity').val();
							route.origin_point_name = $('#origin-point-name').val();
							route.destination_point_name = $('#destination-point-name').val();
							if(route.primary_route_purposes != "") {
								if(route.origin_point_name != "") {
									if(route.destination_point_name != "") {
										//Nothing to do
									} else {
										$('#destination-point-name').focus();
										return false;
									}
								} else {
									$('#origin-point-name').focus();
									return false;
								}
							} else {
								$('#primary-activity').addClass('error');
								$('#primary-activity').focus();
								return false;
							}
						} else {
							$('.dropdown').addClass('open');
							$('#instructionsPane').html('<p> &#8226; Choose one route from the list</p><p style="color:red;"> &#8226; You have to choose a route to continue</p><p> &#8226; Click next</p>');
							return false;
						}
						break;
					case(2):
						if(raw_image) {
							point.raw_image_url = $('#imagetab2').attr("src");
							point.raw_image_size = $('#raw-image-size').val();
							if($('#longitude').val() == "" || $('#latitude').val() == "") {
								point.geometry = "";
							} else {
								point.geometry = "POINT ("+$('#longitude').val()+" "+$('#latitude').val()+")";
							}	
							today = new Date();
							point.date_captured = today;
							point.device_captured_with = $('#device').val();
							console.log(point);
						} else {
							$('.btn.file.raw').removeClass('btn-primary');
							$('.btn.file.raw').addClass('btn-danger');
							$('#instructionsPane').html('<p> &#8226; Upload your raw image (*.jpg)</p><p style="color:red;"> &#8226; You have to choose an image to continue</p><p> &#8226; Click next</p>');
							return false;
						}
						break;
					case(3):
						if(blurred_image) {
							point.processed_blurred_image_url = $('#imagetab3').attr("src");
							point.processed_blurred_image_size = $('#blurred-image-size').val();
							console.log(point);
						} else {
							$('.btn.file.blurred').removeClass('btn-primary');
							$('.btn.file.blurred').addClass('btn-danger');
							$('#instructionsPane').html('<p> &#8226; Upload your blurred image</p><p style="color:red;"> &#8226; You have to choose an image to continue</p><p> &#8226; Click next</p>');
							return false;
						}
						break;
					case(4):
						if(highlighted_image) {
							point.processed_highlighted_image_url = $('#imagetab4').attr("src");
							point.processed_highlighted_image_size = $('#highlighted-image-size').val();
							finished = true;
						} else {
							$('.btn.file.highlighted').removeClass('btn-primary');
							$('.btn.file.highlighted').addClass('btn-danger');
							$('#instructionsPane').html('<p> &#8226; Upload your image with the referenced objects highlighted</p><p style="color:red;"> &#8226; You have to choose an image to continue</p><p> &#8226; Click next</p>');
							return false;
						}
						break;
					case(5):
						break;
					default:
						break;
				}
			},
			onTabShow: function(tab, navigation, index) {
				if(index==0) {
					$('#instructionsPane').html('<p> &#8226; Choose one route from the list</p><p> &#8226; Click next</p>');
				} else if (index==1) {
					$('#instructionsPane').html('<p> &#8226; Upload your raw image (*.jpg)</p><p> &#8226; Click next</p>');
					$('.btn.file.raw').append(uploadicon);
				} else if (index==2) {
					$('#instructionsPane').html('<p> &#8226; Upload your blurred image</p><p> &#8226; Click next</p>');
					$('.btn.file.blurred').append(uploadicon);
				} else if (index==3) {
					$('#instructionsPane').html('<p> &#8226; Upload your image with the referenced objects highlighted</p><p> &#8226; Click next</p>');
					$('.btn.file.highlighted').append(uploadicon);
				} else if(index==4) {
					$('#instructionsPane').html('<p> &#8226; Add name and description of your referenced objects</p><p> &#8226; Use for each object a new line</p><p> &#8226; If all information is inserted click button "Submit all Data"</p>');
				}
			}
		}
	);
});