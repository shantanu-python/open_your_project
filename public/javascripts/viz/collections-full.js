d3.json(collections_json_path, function(data) {

  var w = 800,
      h = 800,
      r = 720,
      x = d3.scale.linear().range([0, r]),
      y = d3.scale.linear().range([0, r]),
      node,
      root;

  var pack = d3.layout.pack()
      .size([r, r])
      .value(function(d) { return d.size; })

  var vis = d3.select("#viz-collections-full").append("svg:svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");

  node = root = data;

  var nodes = pack.nodes(root);

  vis.selectAll("circle")
      .data(nodes)
    .enter().append("svg:circle")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return d.r; })
      .on("click", function(d) { return zoom_or_navigate(d); });

  vis.selectAll("text")
      .data(nodes)
    .enter().append("svg:text")
      .attr("class", function(d) { return d.children ? "parent" : "child"; })
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("opacity", function(d) { return d.children ? 1 : 0;})
      .text(function(d) { return d.children ? d.name.substring(0, d.r / 3) : ''; });

  d3.select(window).on("click", function() { zoom(root); });

  function zoom_or_navigate(d) {
    var xx = (node == d) ? root : d;
    var k = r / xx.r / 2;
    var zoomed = k > 1;

    console.log(k);
    console.log(zoomed);
    console.log('---');

    var leaf = !d.children;

    if (leaf && zoomed) {
      return (window.location = d.name);
    }
    else if (leaf && !zoomed) {
      return null;
    }
    else {
      return zoom(node == d ? root : d);
    }
  }

  function zoom(d, i) {
    var k = r / d.r / 2;
    var zoomed = k > 1;
    x.domain([d.x - d.r, d.x + d.r]);
    y.domain([d.y - d.r, d.y + d.r]);

    var t = vis.transition()
        .duration(d3.event.altKey ? 7500 : 750);

    t.selectAll("circle")
        .attr("cx", function(d) { return x(d.x); })
        .attr("cy", function(d) { return y(d.y); })
        .attr("r", function(d) { return k * d.r; });

    t.selectAll("text")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .style("opacity", function(d) { return (d.children && !zoomed || !d.children && zoomed) ? 1 : 0; })
        .text(function(d) { return d.name? d.name.substring(0, k*d.r / 3) : ''; });

    node = d;
    d3.event.stopPropagation();
  }

});

