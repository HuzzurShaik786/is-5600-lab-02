/* add your code here */

/* add your code here */



// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Parse the JSON data from the loaded scripts
  const userData = JSON.parse(userContent);
  const stocksData = JSON.parse(stockContent);
  
  // Generate the initial user list
  generateUserList(userData, stocksData);
  
  // Get references to save and delete buttons
  const saveButton = document.querySelector('#btnSave');
  const deleteButton = document.querySelector('#btnDelete');
  
  // Register event listener on save button
  saveButton.addEventListener('click', (event) => {
    // Prevent form submission
    event.preventDefault();
    
    // Find the user object in our data
    const id = document.querySelector('#userID').value;
    
    for (let i = 0; i < userData.length; i++) {
      // Found relevant user, so update object at this index and redisplay
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;
        
        generateUserList(userData, stocksData);
        break;
      }
    }
  });
  
  // Register the event listener on the delete button
  deleteButton.addEventListener('click', (event) => {
    // Prevent form submission
    event.preventDefault();
    
    // Find the index of the user in the data array
    const userId = document.querySelector('#userID').value;
    const userIndex = userData.findIndex(user => user.id == userId);
    
    // Remove the user from the array
    if (userIndex !== -1) {
      userData.splice(userIndex, 1);
      
      // Clear the form
      document.querySelector('#userID').value = '';
      document.querySelector('#firstname').value = '';
      document.querySelector('#lastname').value = '';
      document.querySelector('#address').value = '';
      document.querySelector('#city').value = '';
      document.querySelector('#email').value = '';
      
      // Clear the portfolio
      const portfolioDetails = document.querySelector('.portfolio-list');
      portfolioDetails.innerHTML = '';
      
      // Clear stock details
      document.querySelector('#stockName').textContent = '';
      document.querySelector('#stockSector').textContent = '';
      document.querySelector('#stockIndustry').textContent = '';
      document.querySelector('#stockAddress').textContent = '';
      document.querySelector('#logo').src = '';
      
      // Re-render the user list
      generateUserList(userData, stocksData);
    }
  });
});

/**
 * Loops through the users and renders a ul with li elements for each user
 * @param {*} users 
 * @param {*} stocks 
 */
function generateUserList(users, stocks) {
  // Get the list element
  const userList = document.querySelector('.user-list');
  
  // Clear out the list from previous render
  userList.innerHTML = '';
  
  // For each user create a list item and append it to the list
  users.map(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = user.lastname + ', ' + user.firstname;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });
  
  // Register the event listener on the list
  userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

/**
 * Handles the click event on the user list
 * @param {*} event 
 * @param {*} users 
 * @param {*} stocks 
 */
function handleUserListClick(event, users, stocks) {
  // Get the user id from the list item
  const userId = event.target.id;
  
  // Find the user in the userData array
  // We use a "truthy" comparison here because the user id is a number and the event target id is a string
  const user = users.find(user => user.id == userId);
  
  if (!user) return;
  
  // Populate the form with the user's data
  populateForm(user);
  
  // Render the portfolio items for the user
  renderPortfolio(user, stocks);
}

/**
 * Populates the form with the user's data
 * @param {*} data 
 */
function populateForm(data) {
  // Use destructuring to get the user and id from the data object
  const { user, id } = data;
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

/**
 * Renders the portfolio items for the user
 * @param {*} user 
 * @param {*} stocks 
 */
function renderPortfolio(user, stocks) {
  // Get the user's stock data
  const { portfolio } = user;
  
  // Get the portfolio list element
  const portfolioDetails = document.querySelector('.portfolio-list');
  
  // Clear the list from previous render
  portfolioDetails.innerHTML = '';
  
  // Map over portfolio items and render them
  portfolio.map(({ symbol, owned }) => {
    // Create elements and append them to the list
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');
    
    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);
    
    portfolioDetails.appendChild(symbolEl);
    portfolioDetails.appendChild(sharesEl);
    portfolioDetails.appendChild(actionEl);
  });
  
  // Register the event listener on the portfolio list for view buttons
  portfolioDetails.addEventListener('click', (event) => {
    // Let's make sure we only handle clicks on the buttons
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

/**
 * Renders the stock information for the symbol
 * @param {*} symbol 
 * @param {*} stocks 
 */
function viewStock(symbol, stocks) {
  // Get the stock area
  const stockArea = document.querySelector('.stock-form');
  
  if (stockArea) {
    // Find the stock object for this symbol
    const stock = stocks.find(function (s) { 
      return s.symbol == symbol;
    });
    
    if (!stock) return;
    
    // Update stock details
    document.querySelector('#stockName').textContent = stock.name;
    document.querySelector('#stockSector').textContent = stock.sector;
    document.querySelector('#stockIndustry').textContent = stock.subIndustry;
    document.querySelector('#stockAddress').textContent = stock.address;
    
    // Update logo with dimensions to prevent layout shift
    const logo = document.querySelector('#logo');
    logo.style.width = '100px';
    logo.style.height = '100px';
    logo.style.objectFit = 'contain';
    logo.style.display = 'block';
    logo.src = `/logos/${symbol}.svg`;
    logo.alt = `${stock.name} logo`;
    logo.onerror = function() {
      this.style.display = 'none';
    };
  }
}