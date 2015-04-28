/**
 * @private
 */
Ext.define('Ext.util.PositionMap', {
    config: {
        minimumHeight: 50
    },

    constructor: function(config) {
        this.map = [];
        this.adjustments = {};
        this.offset = 0;

        this.initConfig(config);
    },

    populate: function(count, offset) {
        var map = this.map = this.map || [],
            minimumHeight = this.getMinimumHeight(),
            i, previousIndex, ln;

        // We add 1 item to the count so that we can get the height of the bottom item
        count++;
        map.length = count;

        map[0] = 0;
        for (i = offset + 1, ln = count - 1; i <= ln; i++) {
            previousIndex = i - 1;
            map[i] = map[previousIndex] + minimumHeight;
        }

        this.adjustments = {
            indices: [],
            heights: {}
        };
        this.offset = 0;
        for (i = 1, ln = count - 1; i <= ln; i++) {
            previousIndex = i - 1;
            this.offset += map[i] - map[previousIndex] - minimumHeight;
        }
    },

    setItemHeight: function(index, height) {
        height = Math.max(height, this.getMinimumHeight());
        if (height !== this.getItemHeight(index)) {
            var adjustments = this.adjustments;
            adjustments.indices.push(parseInt(index, 10));
            adjustments.heights[index] = height;
        }
    },

    update: function() {
        var adjustments = this.adjustments,
            indices = adjustments.indices,
            heights = adjustments.heights,
            map = this.map,
            ln = indices.length,
            minimumHeight = this.getMinimumHeight(),
            difference = 0,
            i, j, height, index, nextIndex, currentHeight;

        if (!adjustments.indices.length) {
            return false;
        }

        Ext.Array.sort(indices, function(a, b) {
            return a - b;
        });

        for (i = 0; i < ln; i++) {
            index = indices[i];
            nextIndex = indices[i + 1] || map.length - 1;

            currentHeight = (map[index + 1] !== undefined) ? (map[index + 1] - map[index] + difference) : minimumHeight;
            height = heights[index];

            difference += height - currentHeight;

            for (j = index + 1; j <= nextIndex; j++) {
                map[j] += difference;
            }
        }

        this.offset += difference;
        this.adjustments = {
            indices: [],
            heights: {}
        };
        return true;
    },

    getItemHeight: function(index) {
        return this.map[index + 1] - this.map[index];
    },

    getTotalHeight: function() {
        return ((this.map.length - 1) * this.getMinimumHeight()) + this.offset;
    },

    findIndex: function(pos) {
        return this.map.length ? this.binarySearch(this.map, pos) : 0;
    },

    binarySearch: function(sorted, value) {
        var start = 0,
            end = sorted.length;

        if (value < sorted[0]) {
            return 0;
        }
        if (value > sorted[end - 1]) {
            return end - 1;
        }
        while (start + 1 < end) {
            var mid = (start + end) >> 1,
                val = sorted[mid];
            if (val == value) {
                return mid;
            } else if (val < value) {
                start = mid;
            } else {
                end = mid;
            }
        }
        return start;
    }
});
