const packIt = async () => {
  event.preventDefault();
  const itemName = $('.pack-it-input').val();
  const url = '/api/v1/items';
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: itemName })
  }

  const response = await fetch(url, options);
  const item = await response.json();

  fetchLastItem();
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
          <button class="delete-card">Delete</button>
        </div>
        <div class="item-card-b">
          <input type="checkbox" value="packed" ${ packed ? "checked" : ""} />
          <label for="packed">Packed</label>
        </div>
      </div>
    `)
  })
};

const fetchLastItem = async () => {
  const url = '/api/v1/items';
  const response = await (fetch(url));
  const items = await response.json();
  const lastItem = items[items.length - 1];

  $('.item-container').prepend(`
    <div class="item-card" id="item-${lastItem.id}">
      <div class="item-card-a">
        <h3>${lastItem.name}</h3>
        <button class="delete-card">Delete</button>
      </div>
      <div class="item-card-b">
        <input type="checkbox" value="packed"/>
        <label for="packed">Packed</label>
      </div>
    </div>
  `)
};

const buttonToggle = () => $('.pack-it-button').prop('disabled', !($('.pack-it-input').val()));

$('.pack-it-input').on('keypress', buttonToggle);
$('.pack-it-button').on('click', packIt);

fetchItems();