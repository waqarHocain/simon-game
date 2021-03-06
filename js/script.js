// DOM elements
var state_container = $(".state"),
	strict_game_mode = $(".mode input"),
	buttons = $(".board button"),
	btn_play = $(".play"),
	btn_reset = $(".reset");


// game state
var round = 1,
	board_is_locked = true,
	strict_mode_enabled = false,
	game_won = false,
	sequence = [],
	current_sequence = [];


// preload all audio files
var audios = {
	"audio1": new Audio("audio/btn-1.mp3"),
	"audio2": new Audio("audio/btn-2.mp3"),
	"audio3": new Audio("audio/btn-3.mp3"),
	"audio4": new Audio("audio/btn-4.mp3")
}

$.each(audios, function(key, value) {
	audios[key].preload = "auto";
	audios[key].load();
});


// attach event listeners
btn_play.on("click", start_new_game);
btn_reset.on("click", reset_game);

for (var i = 0; i < buttons.length; i++) {
	$(buttons[i]).on("click", user_click_handler);
}



function generate_random_num(max) {
	// returns a random int && 0 >= int < `max`
	return Math.floor(Math.random() * max);
}


function generate_play_sequence() {
	// !!! this func has side effects :( it is modifying `sequence` global variable !!!
	// fills sequence array with 20 random numbers for a new game
	// (if you made it upto 20, you're a winner;)\)
	for (var i = 0; i < 20; i++) {
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
	var elem_id = $(elem).data("id");

	var audio = audios["audio" + elem_id].cloneNode();
	audio.volume = 1;
	audio.play();
}


function start_new_game() {
	// clear previous games data
	reset_game_data();

	if (strict_game_mode.is(":checked")) {
		strict_mode_enabled = true;
	}	

	btn_play.prop("disabled", true);
	strict_game_mode.prop("disabled", true);

	generate_play_sequence();
	start_new_round();
}

function start_new_round() {
	render_state();

	play_sequence();
}

function reset_game() {
	reset_game_data();

	// enable the play button and game_mode checkbox
	btn_play.prop("disabled", false);
	strict_game_mode.prop("disabled", false);

	render_state();
	window.clearTimeout();	
}

function check_game_state() {
	if (round == 20) {
		game_won = true;
	}
}

function reset_game_data() {
	round = 1;
	board_is_locked = true;
	game_won = false;
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
		if (current_sequence.length == 0) {
			check_game_state();
			if (game_won) {
				reset_game_data();
				reset_game();
				
				state_container.html("YOU WON!!!");

				window.setTimeout(start_new_game, 2000);
			}

			round++;
			window.setTimeout(start_new_round, 800);
			return null;
		}
	}
	else {
		state_container.html("YOU MADE A MISTAKE!!!");
		board_is_locked = true;

		if (strict_mode_enabled) {
			window.setTimeout(start_new_game, 800);
			return;
		}

		window.setTimeout(play_sequence, 800);
	}

}

