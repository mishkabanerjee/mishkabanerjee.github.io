// Data
const data = [
    { brand: "Nature Made", product: "Multivitamin", price: 14, pillCount: 130 },
    { brand: "Sundown", product: "Multivitamin Gummies", price: 16, pillCount: 120 },
    { brand: "Centrum", product: "Multivitamin", price: 13, pillCount: 200 },
    { brand: "One A Day", product: "Adult Multi + Immunity Defense", price: 23, pillCount: 120 },
  ];

  // Set up the SVG container
  const svg = d3
    .select(".scatter-plot")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [0, 0, 800, 500]);

  // Add a background rectangle to the SVG
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#f0f0f0"); // Change this value to set the desired background color

  // Scales
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.price)+5])
    .range([40, 760]);

  //const yScale = d3
    //.scaleLinear()
   // .domain([d3.max(data, (d) => d.pillCount), 0]) // Reversed y-axis scale
    //.range([40, 460]); // Reversed y-axis range

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.pillCount+50)]) // Price per pill count scale
    .range([40, 460]); // Reversed y-axis range

  // Color scale
  const colorScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.price), d3.max(data, (d) => d.price)])
    .range(["green", "yellow"]);

  // Find the data with the lowest price and highest pill count
  const minPriceData = data.reduce((prev, curr) => (curr.price < prev.price ? curr : prev));
  const maxPillCountData = data.reduce((prev, curr) => (curr.pillCount > prev.pillCount ? curr : prev));

  // Function to animate the scatter plot dot
  function animateDot() {
  svg
    .selectAll(".scatter-dot")
    .transition()
    .duration(1000)
    .attr("r", (d) => (d === minPriceData || d === maxPillCountData ? 20 : 10))
    .transition()
    .duration(1000)
    .attr("r", 10)
    .on("end", animateDot); // Call the function again at the end of each animation cycle
  }

  // Draw the scatter dots with color
  svg
    .selectAll(".scatter-dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "scatter-dot")
    .attr("cx", (d) => xScale(d.price))
    .attr("cy", (d) => yScale(d.pillCount))
    .attr("r", 10)
    .attr("fill", (d) => colorScale(d.price))
    .append("title") // Add the title element for the tooltip
    .text((d) => `Price: $${d.price}, Pill Count: ${d.pillCount}`);
    //.transition() // Add animation to the scatter plot dots
    //.duration(1000) // Duration of the animation in milliseconds
    //.attr("r", (d) => (d === minPriceData || d === maxPillCountData ? 20 : 10)) // Increase the size for minPriceData and maxPillCountData
    //.transition() // Add another transition to reduce the size back to the original
    //.duration(1000) // Duration of the animation in milliseconds
    //.attr("r", 10);

  animateDot();

  // Add labels
  svg
    .selectAll(".scatter-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "scatter-label")
    .attr("x", (d) => xScale(d.price) + 15)
    .attr("y", (d) => yScale(d.pillCount))
    .text((d) => d.brand);

  // Add axes
  const xAxis = d3.axisBottom(xScale).ticks(6);
  const yAxis = d3.axisLeft(yScale).ticks(6);

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, 460)")
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(40, 0)")
    .call(yAxis);

  // Divide the chart into quadrants and add annotations
  const xMid = (xScale.range()[1] - xScale.range()[0]) / 2 + xScale.range()[0];
  const yMid = (yScale.range()[1] - yScale.range()[0]) / 2 + yScale.range()[0];

  // Calculate the y-coordinate for the line at the y-scale value of 100
  const yValue0 = yScale(0);
  const yValue250 = yScale(250);
  const yValue125 = yScale(125);  
  const xValue0 = xScale(0);  
  const xValue15 = xScale(15); 
  const xValue30 = xScale(28);  


  // Append the line element to the SVG - vertical
  svg.append("line")
        .attr("x1", xValue15) // Starting x-coordinate of the line
        .attr("y1", yValue0) // Starting y-coordinate of the line
        .attr("x2", xValue15) // Ending x-coordinate of the line (extends across the width of the chart)
        .attr("y2", yValue250) // Ending y-coordinate of the line (same as the starting y-coordinate)
        .attr("stroke", "gray") // Set the color of the line (you can change "red" to any other color)
        .attr("stroke-width", 1) // Set the width of the line (you can adjust this value as needed)                           
        .raise(); 

   // Append the line element to the SVG - horizontal
   svg.append("line")
        .attr("x1", xValue0) // Starting x-coordinate of the line
        .attr("y1", yValue125) // Starting y-coordinate of the line
        .attr("x2", xValue30) // Ending x-coordinate of the line (extends across the width of the chart)
        .attr("y2", yValue125) // Ending y-coordinate of the line (same as the starting y-coordinate)
        .attr("stroke", "gray") // Set the color of the line (you can change "red" to any other color)
        .attr("stroke-width", 1) // Set the width of the line (you can adjust this value as needed)                           
        .raise();

    // Add axis labels
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", 400) // x-coordinate of the label (middle of the chart)
      .attr("y", 490) // y-coordinate of the label (just below the x-axis)
      .attr("text-anchor", "middle") // Anchor the text in the middle horizontally
      .text("Price"); // Text for the x-axis label

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("x", -230)// x-coordinate of the label (left of the y-axis)
      .attr("y", 13) // y-coordinate of the label (middle of the chart)
      .attr("text-anchor", "middle") // Anchor the text in the middle vertically
      //.attr("dy", "-2.5em") // Adjust the vertical position relative to the y-coordinate
      .attr("transform", "rotate(-90)") // Rotate the text to align with the y-axis
      .text("Pill Count"); // Text for the y-axis label

    svg
    .append("text")
    .attr("class", "quadrant-annotation")
    .attr("x", xMid+200)
    .attr("y", yMid-120)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text("Worst Deal");

    svg
      .append("text")
      .attr("class", "quadrant-annotation")
      .attr("x", xScale.range()[0]+150)
      .attr("y", yMid-120)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .text("OK Deal");

    svg
      .append("text")
      .attr("class", "quadrant-annotation")
      .attr("x", xScale.range()[0]+180)
      .attr("y", yMid+120)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text("Best Deal");      

    svg
      .append("text")
      .attr("class", "quadrant-annotation")
      .attr("x", xMid+230)
      .attr("y", yMid+120)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .text("OK Deal");

function redirectToAnotherPage() {
  window.location.href = 'IngredientsPercentComparison.html';
}

function redirectToAnotherPage2() {
  window.location.href = 'Findyourbrand.html';
}

// Function to handle the scroll wheel event
function handleScroll(event) {
    // Get the deltaY value from the event to determine the scroll direction
    const delta = Math.sign(event.deltaY);
  
    if (delta > 0) {
      console.log('Scrolling down');
      redirectToAnotherPage2()
    } else if (delta < 0) {
      console.log('Scrolling up');
      redirectToAnotherPage()
    }
  }
  
  // Add the event listener for the scroll wheel event
  window.addEventListener('wheel', handleScroll);
  