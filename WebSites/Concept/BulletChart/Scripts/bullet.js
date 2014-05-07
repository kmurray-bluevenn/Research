(function () {
    d3.bullet = function () {
        var orient = "left", // TODO top & bottom
            reverse = false,
            duration = 500,
            ranges = bulletRanges,
            markers = bulletMarkers,
            measures = bulletMeasures,
            w = 380,
            calculatedwidth = function () { return w - margin.left - margin.right; },
            height = 30,
            tickFormat = null,
            showMeasureLabel = false,
            showRangeLabel = false,
            showMarkerLabel = false,
            margin = { top: 5, right: 40, bottom: 20, left: 50 };

        // For each small multiple…
        function bullet(g) {
            g.each(function (d, i) {
                var rangez = ranges.call(this, d, i).slice().sort(function (a, b) { return elementSort(a, b); }),
                    markerz = markers.call(this, d, i).slice().sort(function (a, b) { return elementSort(a, b); }),
                    measurez = measures.call(this, d, i).slice().sort(function (a, b) { return elementSort(a, b); }),
                    g = d3.select(this);
                // Compute the new x-scale.
                var x1 = d3.scale.linear()
                    .domain([0, maxValue(rangez, markerz, measurez)])
                    .range(reverse ? [calculatedwidth(), 0] : [0, calculatedwidth()]);

                // Retrieve the old x-scale, if this is an update.
                var x0 = this.__chart__ || d3.scale.linear()
                    .domain([0, Infinity])
                    .range(x1.range());

                // Stash the new scale.
                this.__chart__ = x1;

                // Derive width-scales from the x-scales.
                var w0 = bulletWidth(x0),
                    w1 = bulletWidth(x1);

                // Update the range rects.
                var range = g.selectAll("rect.range")
                    .data(rangez);

                range.enter().append("rect")
                    .attr("class", function (d, i) { return "range s" + i; })
                    .attr("width", w0)
                    .attr("height", height)
                    .attr("x", reverse ? x0 : 0)
                    .transition()
                    .duration(duration)
                    .attr("width", w1)
                    .attr("x", reverse ? x1 : 0);

                range.transition()
                    .duration(duration)
                    .attr("x", reverse ? x1 : 0)
                    .attr("width", w1)
                    .attr("height", height);

                if (showRangeLabel || typeof rangez !== "undefined" || typeof rangez[0] !== "number")
                    range.append("svg:title").text(function (d) { return d.label; });

                // Update the measure rects.
                var measure = g.selectAll("rect.measure")
                    .data(measurez);

                measure.enter().append("rect")
                    .attr("class", function (d, i) { return "measure s" + i; })
                    .attr("width", w0)
                    .attr("height", height / 3)
                    .attr("x", reverse ? x0 : 0)
                    .attr("y", height / 3)
                  .transition()
                    .duration(duration)
                    .attr("width", w1)
                    .attr("x", reverse ? x1 : 0);

                measure.transition()
                    .duration(duration)
                    .attr("width", w1)
                    .attr("height", height / 3)
                    .attr("x", reverse ? x1 : 0)
                    .attr("y", height / 3);

                if (showMeasureLabel || typeof measurez !== "undefined" || typeof measurez[0] !== "number")
                    measure.append("svg:title").text(function (d) { return d.label; });

                // Update the marker lines.
                var marker = g.selectAll("line.marker")
                    .data(markerz);

                marker.enter().append("line")
                    .attr("class", "marker")
                    .attr("x1", function (d) { return x0(elementValue(d)); })
                    .attr("x2", function (d) { return x0(elementValue(d)); })
                    .attr("y1", height / 6)
                    .attr("y2", height * 5 / 6)
                  .transition()
                    .duration(duration)
                    .attr("x1", function (d) { return x1(elementValue(d)); })
                    .attr("x2", function (d) { return x1(elementValue(d)); });

                marker.transition()
                    .duration(duration)
                    .attr("x1", function (d) { return x1(elementValue(d)); })
                    .attr("x2", function (d) { return x1(elementValue(d)); })
                    .attr("y1", height / 6)
                    .attr("y2", height * 5 / 6);

                if (showMarkerLabel && typeof markerz !== "undefined" && typeof markerz[0] !== "number")
                    marker.append("svg:title").text(function (d) { return d.label; });

                // Compute the tick format.
                var format = tickFormat || x1.tickFormat(8);

                // Update the tick groups.
                var tick = g.selectAll("g.tick")
                    .data(x1.ticks(8), function (d) {
                        return this.textContent || format(d);
                    });

                // Initialize the ticks with the old scale, x0.
                var tickEnter = tick.enter().append("g")
                    .attr("class", "tick")
                    .attr("transform", bulletTranslate(x0))
                    .style("opacity", 1e-6);

                tickEnter.append("line")
                    .attr("y1", height)
                    .attr("y2", height * 7 / 6);

                tickEnter.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dy", "1em")
                    .attr("y", height * 7 / 6)
                    .text(format);

                // Transition the entering ticks to the new scale, x1.
                tickEnter.transition()
                    .duration(duration)
                    .attr("transform", bulletTranslate(x1))
                    .style("opacity", 1);

                // Transition the updating ticks to the new scale, x1.
                var tickUpdate = tick.transition()
                    .duration(duration)
                    .attr("transform", bulletTranslate(x1))
                    .style("opacity", 1);

                tickUpdate.select("line")
                    .attr("y1", height)
                    .attr("y2", height * 7 / 6);

                tickUpdate.select("text")
                    .attr("y", height * 7 / 6);

                // Transition the exiting ticks to the new scale, x1.
                tick.exit().transition()
                    .duration(duration)
                    .attr("transform", bulletTranslate(x1))
                    .style("opacity", 1e-6)
                    .remove();
            });
            d3.timer.flush();
        }

        // left, right, top, bottom
        bullet.orient = function (x) {
            if (!arguments.length) return orient;
            orient = x;
            reverse = orient == "right" || orient == "bottom";
            return bullet;
        };

        // ranges (bad, satisfactory, good)
        bullet.ranges = function (x) {
            if (!arguments.length) return ranges;
            ranges = x;
            return bullet;
        };

        // markers (previous, goal)
        bullet.markers = function (x) {
            if (!arguments.length) return markers;
            markers = x;
            return bullet;
        };

        // measures (actual, forecast)
        bullet.measures = function (x) {
            if (!arguments.length) return measures;
            measures = x;
            return bullet;
        };

        bullet.width = function (x) {
            if (!arguments.length) return w;
            if (typeof x === "string")
                w= x.match(/\d+/g);
            else
                w = x;
            return bullet;
        };

        bullet.height = function (x) {
            if (!arguments.length) return height;
            height = x + "".match(/\d+/g);
            return bullet;
        };

        bullet.tickFormat = function (x) {
            if (!arguments.length) return tickFormat;
            tickFormat = x;
            return bullet;
        };

        bullet.duration = function (x) {
            if (!arguments.length) return duration;
            duration = x;
            return bullet;
        };

        bullet.margins = function (x) {
            if (!arguments.length) return margin;
            margin = x;
            return bullet;
        };

        bullet.margin_top = function (x) {
            if (!arguments.length) return margin.top;
            margin.top = x;
            return bullet;
        };

        bullet.margin_bottom = function (x) {
            if (!arguments.length) return margin.bottom;
            margin.bottom = x;
            return bullet;
        };

        bullet.margin_left = function (x) {
            if (!arguments.length) return margin.left;
            margin.left = x;
            return bullet;
        };

        bullet.margin_right = function (x) {
            if (!arguments.length) return margin.right;
            margin.right = x;
            return bullet;
        };

        bullet.showMeasureLabel = function (x) {
            if (!arguments.length) return showMeasureLabel;
            showMeasureLabel = x;
            return bullet;
        };

        bullet.showRangeLabel = function (x) {
            if (!arguments.length) return showRangeLabel;
            showRangeLabel = x;
            return bullet;
        };

        bullet.showMarkerLabel = function (x) {
            if (!arguments.length) return showMarkerLabel;
            showMarkerLabel = x;
            return bullet;
        };

        return bullet;
    };

    function bulletRanges(d) {
        return d.ranges;
    }

    function bulletMarkers(d) {
        return d.markers;
    }

    function bulletMeasures(d) {
        return d.measures;
    }

    function bulletTranslate(x) {
        return function (d) {
            return "translate(" + x(elementValue(d)) + ",0)";
        };
    }

    function bulletWidth(x) {
        var x0 = x(0);
        return function (d) {
            return Math.abs(x(elementValue(d)) - x0);
        };
    }
    function elementValue(x) {
        if (typeof x === "number")
            return x;
        return x.value;
    }

    function elementSort(a, b) {
        return d3.descending((typeof a === "number") ? a : a.value, (typeof b === "number") ? b : b.value);
    }

    function maxValue(range, marker, measure) {
        var maxRange = [];
        if (typeof range[0] !== "undefined")
            maxRange.push(elementValue(range[0]));
        if (typeof marker[0] !== "undefined")
            maxRange.push(elementValue(marker[0]));
        if (typeof measure[0] !== "undefined")
            maxRange.push(elementValue(measure[0]));

        return Math.max.apply(null, maxRange);
    }
})();