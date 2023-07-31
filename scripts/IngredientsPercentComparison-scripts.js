// Set up the SVG containers for the charts
const margin = { top: 50, right: 50, bottom: 80, left: 50 };
const width = 900 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const svg1 = d3
  .select("#chart1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2 = d3
  .select("#chart2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data from the CSV file
d3.csv("data/MVSupFacts.csv").then((data) => {
  // Convert the percentage values to numbers and sort the data in descending order
  data.forEach((d) => {
    d.percentDailyValue = +d.percentDailyValue.replace("%", "");
  });

      // Function to update each chart based on selected brands
  function updateCharts() {

    const uniqueVitamins = Array.from(new Set(data.map((d) => d.vitamin.trim())));

    const selectedBrand1 = d3.select("#brand1").property("value");
    const selectedBrand2 = d3.select("#brand2").property("value");        

    const filteredData1 = data.filter((d) => d.brand === selectedBrand1);
    const filteredData2 = data.filter((d) => d.brand === selectedBrand2);

    // Update the annotation with the selected product
    const selectedProduct1 = filteredData1[0].product;
    //d3.select("#annotation1").text(`Brand: ${selectedBrand1}, Product: ${selectedProduct1}`);

    const selectedProduct2 = filteredData2[0].product;
    //d3.select("#annotation2").text(`Brand: ${selectedBrand2}, Product: ${selectedProduct2}`);

    // Remove any existing annotation
    d3.select("#annotation1").selectAll("*").remove();
    d3.select("#annotation2").selectAll("*").remove();

    // Append new annotation to the SVG
    const annotationGroup1 = d3.select("#annotation1");
    const annotationGroup2 = d3.select("#annotation2");
    annotationGroup1
      .append("text")
      .attr("x", width / 2) // Set the x-coordinate position
      .attr("y", height / 2) // Set the y-coordinate position
      .text(`Product: ${selectedProduct1}`);

      annotationGroup2
      .append("text")
      .attr("x", width / 2) // Set the x-coordinate position
      .attr("y", height / 2) // Set the y-coordinate position
      .text(`Product: ${selectedProduct2}`);        

    // Calculate the maximum value for the y-axis domain
    const maxPercentValue1 = d3.max(filteredData1, (d) => d.percentDailyValue);
    const maxPercentValue2 = d3.max(filteredData2, (d) => d.percentDailyValue);
    const maxYValue = Math.max(maxPercentValue1, maxPercentValue2);     

    const transitionDuration = 2000; // Duration of the transition in milliseconds
    const transitionEase = d3.easeCubic; // Easing function for the transition

    // Define a color scale
    const colorScale = d3.scaleOrdinal()
      .domain(uniqueVitamins) 
      //.range(d3.schemePaired)
      //.range(d3.schemeCategory10)
      .range(d3.schemeSet3); 

    const xScale1 = d3
      .scaleBand()
      //.domain(filteredData1.map((d) => d.vitamin))
      .domain(uniqueVitamins)
      .range([0, width])
      //.paddingInner(0.2)
      //.paddingOuter(0.2)
      .padding(0.2);

    //const yScale1 = d3.scaleLog().domain([1, d3.max(filteredData1, (d) => d.percentDailyValue)]).range([height, 0]);
    //const yScale1 = d3.scaleLinear().domain([0, d3.max(filteredData1, (d) => d.percentDailyValue)]).range([height, 0]);
    const yScale1 = d3.scaleLinear().domain([0, 1000]).range([height, 0]); //should be maxYValue and not 1000

        // Calculate the y-coordinate for the line at the y-scale value of 100
    const yValue100 = yScale1(100);   

    const bars1 = svg1.selectAll(".bar").data(filteredData1);

    bars1.exit().remove();

    bars1
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars1)
      .attr("x", (d) => xScale1(d.vitamin))
      .attr("y", (d) => yScale1(d.percentDailyValue))
      .attr("width", xScale1.bandwidth())
      .attr("height", (d) => height - yScale1(d.percentDailyValue))
      .attr("fill", (d) => colorScale(d.vitamin)) // Set the fill color based on the ingredient
      // Add the tooltip interaction to the bars
      .on("mouseover", function (event, d) {
          // Transition the bars to their original height and y position when hovered over
        d3.select(this)
          .transition()
          .duration(transitionDuration)
          .ease(transitionEase)
          .attr("y", (d) => yScale1(d.percentDailyValue))
          .attr("height", (d) => height - yScale1(d.percentDailyValue));
        showTooltip(event, d);
      })
      .on("mouseout", function () {
        hideTooltip();
      });     
      
    // Append the line element to the SVG
    svg1.append("line")
      .attr("x1", 0) // Starting x-coordinate of the line
      .attr("y1", yValue100) // Starting y-coordinate of the line
      .attr("x2", width) // Ending x-coordinate of the line (extends across the width of the chart)
      .attr("y2", yValue100) // Ending y-coordinate of the line (same as the starting y-coordinate)
      .attr("stroke", "gray") // Set the color of the line (you can change "red" to any other color)
      .attr("stroke-width", 1) // Set the width of the line (you can adjust this value as needed)                           
      .raise(); 

    const xScale2 = d3
      .scaleBand()
      //.domain(filteredData2.map((d) => d.vitamin))
      .domain(uniqueVitamins)
      .range([0, width])          
      //.paddingInner(0.1)
      //.paddingOuter(0.1)
      .padding(0.2);          

    //const yScale2 = d3.scaleLinear().domain([1, d3.max(filteredData2, (d) => d.percentDailyValue)]).range([height, 0]);
    //const yScale2 = d3.scaleLinear().domain([0, d3.max(filteredData2, (d) => d.percentDailyValue)]).range([height, 0]);
    const yScale2 = d3.scaleLinear().domain([0, 1000]).range([height, 0]); //should be maxYValue and not 1000

    const bars2 = svg2.selectAll(".bar").data(filteredData2);

    bars2.exit().remove();

    bars2
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars2)
      .attr("x", (d) => xScale2(d.vitamin))
      .attr("y", (d) => yScale2(d.percentDailyValue))
      .attr("width", xScale2.bandwidth())
      .attr("height", (d) => height - yScale2(d.percentDailyValue))
      .attr("fill", (d) => colorScale(d.vitamin)) // Set the fill color based on the ingredient
      // Add the tooltip interaction to the bars
      .on("mouseover", function (event, d) {
        showTooltip(event, d);
      })
      .on("mouseout", function () {
        hideTooltip();
      });    
      //.on("mouseover", showMeasurement)
      //.on("mouseout", hideMeasurement);

    // Append the line element to the SVG
    svg2.append("line")
      .attr("x1", 0) // Starting x-coordinate of the line
      .attr("y1", yValue100) // Starting y-coordinate of the line
      .attr("x2", width) // Ending x-coordinate of the line (extends across the width of the chart)
      .attr("y2", yValue100) // Ending y-coordinate of the line (same as the starting y-coordinate)
      .attr("stroke", "gray") // Set the color of the line (you can change "red" to any other color)
      .attr("stroke-width", 1) // Set the width of the line (you can adjust this value as needed)      
      .raise(); 

    // Add axes for each chart
    svg1.selectAll(".axis").remove();

    svg1
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale1))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg1.append("g").attr("class", "axis").call(d3.axisLeft(yScale1).ticks(5, ".1s"));

    svg1
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Ingredients");

    svg1
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - height / 2)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percentage of Daily Value (Linear Scale)");

    svg2.selectAll(".axis").remove();

    svg2
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale2))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg2.append("g").attr("class", "axis").call(d3.axisLeft(yScale2).ticks(5, ".1s"));

    svg2
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Ingredients");

    svg2
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - height / 2)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percentage of Daily Value (Linear Scale)");
  }

  // Function to display the actual measurement as a tooltip on mouse hover
  /*
  function showMeasurement(d) {
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");
    tooltip
      .html(
        `Percentage: ${d.percentDailyValue}%<br>Amount per Tablet: ${d.amountPerTablet}`
      )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px");
  }

  // Function to hide the tooltip on mouseout
  function hideMeasurement() {
    d3.select(".tooltip").remove();
  }     */      

  // Call updateCharts initially and when the brand dropdowns change
  updateCharts();
  d3.select("#brand1").on("change", updateCharts);
  d3.select("#brand2").on("change", updateCharts);

  // Add annotation to display the selected brand and product
  const selectedProduct1 = d3.select("#brand1 option:checked").text();
  const selectedProduct2 = d3.select("#brand2 option:checked").text();
  //d3.select("#annotation1").text(`Brand: ${selectedBrand1}, Product: ${selectedProduct1}`);
  //d3.select("#annotation2").text(`Brand: ${selectedBrand2}, Product: ${selectedProduct2}`);

  // Function to show tooltip on hover
  function showTooltip(event, d) {
    // Get the position of the mouse pointer
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    // Create and show the tooltip
    const tooltip = d3.select("#tooltip");
    tooltip
      .style("opacity", 1)
      //.html(`Vitamin: ${d.vitamin}<br>Percentage: ${d.percentDailyValue}%`)
      .html(`Vitamin: ${d.vitamin}<br>Percentage: ${d.percentDailyValue}%<br>Amount per Tablet: ${d.amountPerTablet}`)
      .style("left", `${mouseX}px`) // Position the tooltip at the mouse pointer's x-coordinate
      .style("top", `${mouseY}px`); // Position the tooltip at the mouse pointer's y-coordinate
  }

  // Function to hide tooltip on mouseout
  function hideTooltip() {
    const tooltip = d3.select("#tooltip");
    tooltip.style("opacity", 0);
  }     
});

function redirectToAnotherPage() {
  window.location.href = 'index.html';
}

function redirectToAnotherPage2() {
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
}


// Attach the onscroll event listener to the window
window.addEventListener('scroll', handleScroll);