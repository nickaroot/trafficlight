updateInterval = 60 // каждую минуту

function parseStatus(url) {
	$.ajax({
		method: "POST",
		url: url,
		data: null
	})
	.done(function(msg) {
		var msgFormatted = msg.substring(36).slice(0, -2);
		selectMoscow(JSON.parse(msgFormatted.replace(/(['"])?([a-zA-Z_]+)(['"])?:/g, '"$2": ')));
	});
}

$(document).ready(function(){
	parseStatus('http://nickaroot.me/trafficlight/parse.php');
});

function selectMoscow(json) {
	var regions = json.regions;
	regions.forEach(function(item) {
		if (item.regionId == "213") {
			updateStatus(item);
		}
	});
}

function updateStatus(region) {
	var levels = ["Неизветно", "1 балл", "2 балла", "3 балла", "4 балла", "5 баллов", "6 баллов", "7 баллов", "8 баллов", "9 баллов", "10 баллов"];
	var level = region.level;
	var road = 0;
	var style = region.style;

	$(".level").text(levels[level-1]);
	
	if (level >= 0 && level <= 1) {
		road = 1;
	} else if (level >= 2 && level <= 3) {
		road = 2;
	} else if (level >= 4 && level <= 5) {
		road = 3;
	} else if (level >= 6 && level <= 7) {
		road = 4;
	} else if (level >= 8 && level <= 9) {
		road = 5;
	} else if (level >= 10) {
		road = 6;
	}

	console.log(road);

	for(var i = 1; i <= 6; i++) {
		if (i == road) {
			$("#road_"+i).removeClass("bounceOutDown").addClass("animated bounceInUp active");
			setTimeout(function(){$("#road_"+i).removeClass("bounceInUp")}, 1000);
		} else {
			$("#road_"+i).addClass("bounceOutDown").removeClass("bounceInUp");
			setTimeout(function(){$("#road_"+i).removeClass("active")}, 1000);
		}
	}

	switch(style) {
		case "green":
			activateLight("green");
			break;
		case "yellow":
			activateLight("yellow");
			break;
		case "red":
			activateLight("red");
			break;

	}
}

function activateLight(color) {
	var colors = ["red", "yellow", "green"];
	colors.forEach(function(item){
		if (item == color) {
			$("#"+item+"Main").removeClass(item+"DeactiveMain").removeClass(item+"FlashingMain").addClass(item+"ActiveMain");
			$("#"+item+"Add").removeClass(item+"DeactiveAdd").removeClass(item+"FlashingAdd").addClass(item+"ActiveAdd");
			$("body").addClass(item+"ActiveBody");
			$(".levelContainer").addClass(item+"DeactiveMain");
		} else {
			$("#"+item+"Main").removeClass(item+"ActiveMain").removeClass(item+"FlashingMain").addClass(item+"DeactiveMain");
			$("#"+item+"Add").removeClass(item+"ActiveAdd").removeClass(item+"FlashingAdd").addClass(item+"DeactiveAdd");
			$("body").removeClass(item+"ActiveBody");
			$(".levelContainer").removeClass(item+"DeactiveMain");
		}
	});
	console.log(color+" is activated");
	setTimeout('parseStatus("http://nickaroot.me/trafficlight/parse.php")', updateInterval*1000);
}