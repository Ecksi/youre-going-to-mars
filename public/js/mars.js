const packIt = () => {
  event.preventDefault();
  $('.pack-it-input').val('');
  buttonToggle();
};

const fetchItems = async () => {
  const url = '/api/v1/items';
  const response = await(fetch(url));
  const items = await response.json();

  items.forEach(({name, packed, id}) => {
    $('.item-container').prepend(`
      <div class="item-card" id="item-${id}">
        <div class="item-card-a">
          <h3>${name}</h3>
          <button>Delete</button>
        </div>
        <div class="item-card-b">
          <input type="checkbox" value="packed" ${ packed ? "checked" : ""} />
          <label for="packed">Packed</label>
        </div>
      </div>
    `)
  })
}

const buttonToggle = () => $('.pack-it-button').prop('disabled', !($('.pack-it-input').val()));

$('.pack-it-input').on('keypress', buttonToggle);
$('.pack-it-button').on('click', packIt);

fetchItems();