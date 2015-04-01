$(document).ready(function(){
  solutions = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
  avail_pos = [1,2,3,4,5,6,7,8,9]
  turn = 0;
  computer_selection = [];
  user_selection = [];
  user_score = 0;
  computer_score = 0;

  $('#new-game').on('click',function(){
    $('#new-game').addClass('animated slideOutDown')
    setTimeout('game()', 600);
    setTimeout("$('#game-info').addClass('animated slideInLeft')", 600);
  });
});

function game(){
  $('#player-score').text(user_score);
  $('#computer-score').text(computer_score);
  $('.boxes').css({
    'background-color': 'rgba(158, 169, 189, 0.6)'
  });
  $('.boxes').hover(
    function(){
      if (!$(this).text()){
        $(this).css({'background-color': 'rgba(206, 212, 222, 0.6)', 'cursor': 'pointer'})
      };
    }, function(){
      $(this).css({'background-color': 'rgba(158, 169, 189, 0.6)', 'cursor': 'initial'})
    }
  );
  $('.boxes').on('click', function(){
    var pos = $(this).attr('id')
    var index = avail_pos.indexOf(Number(pos));
    if (turn % 2 === 0) {
      $(this).text("X").css({
        'color': 'rgba(255, 79, 59, 0.8)'
      });
      // Remove clicked selection from available positions
      avail_pos.splice(index, 1)
      user_selection.push(Number(pos));
      turn++;
      // check winner if user has more than 2 selected positions
      if (user_selection.length > 2) {
        checkWinner(user_selection, "player");
      };
      $(this).off('click');
    }
    setTimeout(computerLogic, 1000);
  });
};

function computerLogic(){
  if (avail_pos.length > 0 && turn % 2 === 1){
    // bestSelection is our AI for figuring out placement
    var select = bestSelection();
    var index = avail_pos.indexOf(Number(select));
    $('#' + select).text("O").off('click').css({
      'color': 'rgba(59, 137, 255, 0.8)'
    });
    computer_selection.push(select);
    avail_pos.splice(index, 1)
    turn++;
    if (computer_selection.length > 2) {
      checkWinner(computer_selection, "computer");
    };
  };
};

function bestSelection(){
  var best_pick = 0;
  if (computer_selection.length < 1){
    if (avail_pos.indexOf(5) >= 0){
      return avail_pos[avail_pos.indexOf(5)];
    } else if (user_selection[0] === 5){
      return avail_pos[avail_pos.indexOf(4)];
    };
  } else {
    // logic for figuring out best placement
    if (selectionLogic(computer_selection).length > 0) {
      best_pick = Number(selectionLogic(computer_selection));
      return avail_pos[avail_pos.indexOf(best_pick)];
    } else if (selectionLogic(user_selection).length > 0) {
      best_pick = Number(selectionLogic(user_selection));
      return avail_pos[avail_pos.indexOf(best_pick)];
    } else {
      return avail_pos[Math.floor(Math.random() * avail_pos.length)];
    };
  }
};

function checkWinner(selection, user){
  $(solutions).each(function(idx, e){
    if (selection.indexOf(e[0]) >= 0 && selection.indexOf(e[1]) >= 0 && selection.indexOf(e[2]) >= 0) {
      if (user === "player") {
        user_score += 1;
        $('#player-score').text(user_score);
        alert("You Win!");
        gameAgain();
        return false;
      } else {
        computer_score += 1;
        $('#computer-score').text(computer_score);
        alert("Computer Wins!")
        gameAgain();
        return false;
      };
    } else {
      if (user_selection.length + computer_selection.length === 9) {
        alert("It is a Tie!")
        gameAgain();
        return false;
      };
    };
  });
};

// Main logic for figuring out best placement to win the game
function selectionLogic(selection){
  var select_picks = [];
  $(solutions).each(function(idx, e){
    if (selection.indexOf(e[0]) >= 0 && selection.indexOf(e[1]) >= 0) {
      if (avail_pos.indexOf(e[2]) >= 0) {
        select_picks.push(e[2]);
        return false;
      };
    } else if (selection.indexOf(e[0]) >= 0 && selection.indexOf(e[2]) >= 0) {
      if (avail_pos.indexOf(e[1]) >= 0) {
        select_picks.push(e[1]);
        return false;
      }
    } else if (selection.indexOf(e[1]) >= 0 && selection.indexOf(e[2]) >= 0) {
      if (avail_pos.indexOf(e[0]) >= 0) {
        select_picks.push(e[0]);
        return false;
      }
    };
  });
  return select_picks;
};

function gameAgain(){
  $('#game-menu').addClass('animated slideInRight');

  $('#yes').click(function(){
    $('#game-menu').addClass('animated slideOutRight');
    if ($('#game-menu').hasClass('animated')) {
      setTimeout("$('#game-menu').removeClass();", 2000);
    }
    $('.boxes').empty();
    avail_pos = [1,2,3,4,5,6,7,8,9];
    computer_selection = [];
    user_selection = [];
    game();
    if (turn % 2 != 0) {
      setTimeout("$('.boxes').trigger('click')", 300);
    }
  });
};
