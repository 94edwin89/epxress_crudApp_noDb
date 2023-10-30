const itemList = document.getElementById('itemList');
const itemForm = document.getElementById('itemForm');

// Function to render the list of items
function renderItems(items) {
  itemList.innerHTML = '';
  
  //adding new lines to while updating 
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}</span>
      <button class="btn btn-info m-3" onclick="editItem('${item.id}')">EDIT</button>
      <button class="btn btn-danger " onclick="deleteItem('${item.id}')">DELETE</button>
    `;
    itemList.appendChild(li);
  });
}

// Function to fetch items from the server
function fetchItems() {
  fetch('/api/items')
    .then(response => response.json())
    .then(items => renderItems(items));
}

// Function to add a new item
function addItem(name) {
  fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })

  /* then() difined in the promise API and used to 
   deal with async task such as api call */
    .then(response => response.json())
    .then(item => {
      fetchItems();
      itemForm.reset();
    });
}

// Function to edit an item
function editItem(id) {
  const name = prompt('Enter a new name for the item:');
  if (name) {
    fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
      .then(response => response.json())
      .then(updatedItem => fetchItems());
  }
}

// Function to delete an item
function deleteItem(id) {
  fetch(`/api/items/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(deletedItem => fetchItems());
}

// Fetch items when the page loads
fetchItems();

// Handle form submission
itemForm.addEventListener('submit', e => {
  e.preventDefault();
  const itemName = itemForm.elements.name.value.trim();
  if (itemName) {
    addItem(itemName);
  }
});
