// DOM elements
var state_container = $(".state"),
	buttons = $(".board button"),
	btn_play = $(".play"),
	btn_reset = $(".reset");


// game state
var round = 1,
	board_is_locked = true,
	sequence = [],
	current_sequence = [];


// attach event listeners
btn_play.on("click", start_new_game);
btn_reset.on("click", restart_game);

for (var i = 0; i < buttons.length; i++) {
	$(buttons[i]).on("click", user_click_handler);
}



function generate_random_num(max) {
	// returns a random int && 0 >= int < `max`
	return Math.floor(Math.random() * max);
}


function generate_play_sequence() {
	// !!! this func has side effects :( it is modifying `sequence` global variable !!!
	// fills sequence array with 23 random numbers for a new game
	// (if you made it upto 23, you're a winner;)\)
	for (var i = 0; i < 23; i++) {
		var random_num = generate_random_num(buttons.length);
		sequence.push(random_num);
	}
}


function play_sequence() {
	var i = 0;
	board_is_locked = true;
	current_sequence = sequence.slice(0, round);

	var interval = setInterval(function() {
		animate(buttons[current_sequence[i]]);

		++i;

		if (i >= current_sequence.length) {
			clearInterval(interval);
			board_is_locked = false;
		}
	}, 800);
	
}


function animate(elem) {
	$(elem).addClass("lit");
	play_audio(elem);

	window.setTimeout(function() {
		$(elem).removeClass("lit");
	}, 600);
}


function play_audio(elem) {
	var audio = document.createElement("audio");
	audio.src = "./audio/btn-" + $(elem).data("id") + ".mp3";
	audio.play();
}


function start_new_game() {
	reset_game_data();

	// disable the play button
	btn_play.prop("disabled", true);

	generate_play_sequence();
	start_new_round();
}

function start_new_round() {
	render_state();

	play_sequence();
}

function restart_game() {
	reset_game_data();

	// enable the play button
	btn_play.prop("disabled", false);

	render_state();
	window.clearTimeout();		
}


function reset_game_data() {
	round = 1;
	board_is_locked = true;
	current_sequence = [];
	sequence = [];
}

function render_state() {
	state_container.text("Count:\t" + round);
}


function user_click_handler(e) {
	if (board_is_locked) {
		return null;
	}

	var i = current_sequence.shift();
	var desired_move = buttons[i],
		user_move = e.target;

	animate(user_move);
	play_audio(user_move);

	if (user_move == desired_move) {
		// if user has already clicked the generated sequence
		if (current_sequence.length == 0) {
			round++;
			setTimeout(start_new_round, 800);
			return null;
		}
	}
	else {
		state_container.html("<strong>YOU MADE A MISTAKE!!!</strong>");
		setTimeout(play_sequence, 800)
	}

}

