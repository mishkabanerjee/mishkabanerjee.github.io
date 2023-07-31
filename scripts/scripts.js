function redirectToAnotherPage() {
    window.location.href = 'IngredientsPercentComparison.html';
}

// Function to handle the scroll wheel event
function handleScroll(event) {
    // Get the deltaY value from the event to determine the scroll direction
    const delta = Math.sign(event.deltaY);
  
    if (delta > 0) {
      console.log('Scrolling down');
      redirectToAnotherPage();
    } 
  }
  
  // Add the event listener for the scroll wheel event
  window.addEventListener('wheel', handleScroll);

