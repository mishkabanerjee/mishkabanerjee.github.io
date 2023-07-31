// Function to show tooltip on hover
function showTooltip(event, d) {
    // Get the position of the mouse pointer
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    // Create and show the tooltip
    const tooltip = d3.select("#tooltip");
    tooltip
      .style("opacity", 1)
      .html(`Actual Substance:${d.actualSubstance}<br>Percentage: ${d.percentDailyValue}%<br>Amount per Tablet: ${d.amountPerTablet}`)
      .style("left", `${mouseX}px`) // Position the tooltip at the mouse pointer's x-coordinate
      .style("top", `${mouseY}px`); // Position the tooltip at the mouse pointer's y-coordinate
  }

  // Function to hide tooltip on mouseout
  function hideTooltip() {
    const tooltip = d3.select("#tooltip");
    tooltip.style("opacity", 0);
  }

  // Function to capitalize the first letter of each word
  function toTitleCase(str) {
      return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Load the data from the CSV file
  d3.csv("data/MVSupFacts.csv").then((data) => {
    // Convert the percentage values to numbers and sort the data in descending order
    data.forEach((d) => {
      d.percentDailyValue = +d.percentDailyValue.replace("%", "");
      d.vitamin = toTitleCase(d.vitamin); // Convert vitamin names to title case
    });

    // Get unique vitamins from the data
    const uniqueVitamins = Array.from(new Set(data.map((d) => d.vitamin.trim())));

    // Add options to the vitamin dropdown
    const vitaminDropdown = d3.select("#vitamin");
    uniqueVitamins.forEach((vitamin) => {
      vitaminDropdown.append("option").attr("value", vitamin).text(vitamin);
    });

    // Create the SVG container and 'g' element once
    const width = 900;
    const height = 700;
    const margin = { top: 50, right: 50, bottom: 80, left: 50 };

    // Set up the SVG container     

    const svg = d3
         .select("#vitamin-chart")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "120%")
      .attr("height", "100%")
      .attr("fill", "#f0f0f0"); // Change this value to set the desired background color

    // Scales          

    const xScale = d3
          .scaleBand()
          .range([0, width])
          .padding(0.2);

    const yScale = d3.scaleLinear().range([height, 0]);

    // Function to update the vitamin chart based on user's selection
    function updateVitaminChart() {
      const selectedVitamin = d3.select("#vitamin").property("value").trim();
      const filteredData = data.filter((d) => d.vitamin.trim() === selectedVitamin);       

      const maxYValue = d3.max(filteredData, (d) => d.percentDailyValue);

      // Modify the color scale to use d3.interpolateGreens()
      //const colorScale = d3.scaleSequential(d3.interpolateGreens)
                   //.domain([0, maxYValue]); // Use the maximum value as the domain upper bound

      // Define a color scale
      const colorScale = d3.scaleOrdinal()
          .range(d3.schemeCategory10);

      // Define a color scale for the bars
      //const colorScale = d3.scaleOrdinal()
                           //.domain([0, maxYValue])
                          // .range(["pink","lightgreen","green","purple"]); 

      // Sort the filtered data based on percentage value in descending order
      filteredData.sort((a, b) => b.percentDailyValue - a.percentDailyValue);

      // Update the annotation with the selected vitamin
      //d3.select("#vitamin-annotation").text(`Selected Vitamin: ${selectedVitamin}`);
      
       // Update scales
      xScale.domain(filteredData.map((d) => d.brand));
      yScale.domain([0, maxYValue+50]);

      const bars = svg.selectAll(".bar").data(filteredData);

      bars.exit().remove();

      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", (d) => xScale(d.brand))
        .attr("y", (d) => yScale(d.percentDailyValue))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d.percentDailyValue))
        .attr("fill", (d) => colorScale(d.percentDailyValue))
        // Add the tooltip interaction to the bars
        .on("mouseover", function (event, d) {
          showTooltip(event, d);
        })
        .on("mouseout", function () {
          hideTooltip();
        });

      // Add axes to the chart
      svg.selectAll(".axis").remove();

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale).ticks(5, ".1s"));

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .text("Brands");

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", -margin.left-5)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Percentage of Daily Value");
      }

    // Call updateVitaminChart initially and when the vitamin dropdown changes
    updateVitaminChart();
    d3.select("#vitamin").on("change", updateVitaminChart);
  });

  function redirectToAnotherPage() {
    window.location.href = 'PriceComparison.html';
  }

  // Variables to store the previous scroll position
let previousScrollPosition = 0;

// Function to handle the scroll event
function handleScroll() {
  // Get the current scroll position
  const currentScrollPosition = window.scrollY;

  // Check if the user is scrolling up
  if (currentScrollPosition < 10 && currentScrollPosition <= previousScrollPosition) {
    redirectToAnotherPage()
  }

  if (currentScrollPosition >= previousScrollPosition && currentScrollPosition > 850) {
    redirectToAnotherPage2()
  }

  // Update the previous scroll position
  previousScrollPosition = currentScrollPosition;

  // Update the status element with the current scroll position
  const scrollStatusElement = document.getElementById('scrollStatus');
  scrollStatusElement.textContent = `Scroll Position: ${currentScrollPosition}px`;
}


// Attach the onscroll event listener to the window
window.addEventListener('scroll', handleScroll);