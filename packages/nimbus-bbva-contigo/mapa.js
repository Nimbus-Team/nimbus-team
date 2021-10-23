                var width = 250,
                height = 250,
                sens = 0.25,
                focused;
            var countries;
            
            var projection = d3.geo.orthographic()
                            .scale(100)
                            .rotate([0, 0])
                            .translate([width / 2, height / 2])
                            .clipAngle(90);

            var path = d3.geo.path()
                .projection(projection);

            console.log(d3.select('#d3_globe'));
            var svg = d3.select("#d3_globe").append("svg")
                .attr("width", width)
                .attr("height", height);
            
            svg.append("path")
                .datum({type: "Sphere"})
                .attr("class", "water")
                .attr("d", path);

            queue()
                    .defer(d3.json, "world.json")
                    .defer(d3.tsv, "world-110m-country-names.tsv")
                    .await(ready);

            function ready(error, world, countryData) {
                var countryById = {};
                countries = topojson.feature(world, world.objects.countries).features;
                var world = svg.selectAll("path.land")
                                                    .data(countries)
                                                    .enter().append("path")
                                                    .attr("class", "land")
                                                    .attr("d", path)
        }




        
        
        function setCountry(id_country,color){
            var rotate = projection.rotate(),
            focusedCountry = country(countries, id_country),
            p = d3.geo.centroid(focusedCountry);
            svg.selectAll(".focused").classed("focused", focused = false);
    
            (function transition() {
                d3.transition()
                .duration(2500)
                .tween("rotate", function() {
                    var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                    return function(t) {
                        projection.rotate(r(t));
                        svg.selectAll("path").attr("d", path)
                            .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; })
                            .style("fill", function(d, i) { return d.id == focusedCountry.id ? color : false; });
                            
                    };
                })
            })();
        }
        
        function unsetCountry(){
            svg.selectAll("path").attr("d", path)
                .classed("focused", false)
                .style("fill", "#2C1E3D");
        }
        
        function country(cnt, sel) { 
            for(var i = 0, l = cnt.length; i < l; i++) {
                if(cnt[i].id == sel) {return cnt[i];}
            }
        }