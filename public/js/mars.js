const packIt = () => {
  event.preventDefault();
  $('.pack-it-input').val('');
  buttonToggle();
};

const buttonToggle = () => $('.pack-it-button').prop('disabled', !($('.pack-it-input').val()));

$('.pack-it-input').on('keypress', buttonToggle);
$('.pack-it-button').on('click', packIt);
