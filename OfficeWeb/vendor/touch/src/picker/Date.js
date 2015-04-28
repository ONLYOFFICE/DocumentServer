/**
 * A date picker component which shows a Date Picker on the screen. This class extends from {@link Ext.picker.Picker}
 * and {@link Ext.Sheet} so it is a popup.
 *
 * This component has no required configurations.
 *
 * ## Examples
 *
 *     @example miniphone preview
 *     var datePicker = Ext.create('Ext.picker.Date');
 *     Ext.Viewport.add(datePicker);
 *     datePicker.show();
 *
 * You may want to adjust the {@link #yearFrom} and {@link #yearTo} properties:
 *
 *     @example miniphone preview
 *     var datePicker = Ext.create('Ext.picker.Date', {
 *         yearFrom: 2000,
 *         yearTo  : 2015
 *     });
 *     Ext.Viewport.add(datePicker);
 *     datePicker.show();
 *
 * You can set the value of the {@link Ext.picker.Date} to the current date using `new Date()`:
 *
 *     @example miniphone preview
 *     var datePicker = Ext.create('Ext.picker.Date', {
 *         value: new Date()
 *     });
 *     Ext.Viewport.add(datePicker);
 *     datePicker.show();
 *
 * And you can hide the titles from each of the slots by using the {@link #useTitles} configuration:
 *
 *     @example miniphone preview
 *     var datePicker = Ext.create('Ext.picker.Date', {
 *         useTitles: false
 *     });
 *     Ext.Viewport.add(datePicker);
 *     datePicker.show();
 */
Ext.define('Ext.picker.Date', {
    extend: 'Ext.picker.Picker',
    xtype: 'datepicker',
    alternateClassName: 'Ext.DatePicker',
    requires: ['Ext.DateExtras'],

    /**
     * @event change
     * Fired when the value of this picker has changed and the done button is pressed.
     * @param {Ext.picker.Date} this This Picker
     * @param {Date} value The date value
     */

    config: {
        /**
         * @cfg {Number} yearFrom
         * The start year for the date picker. If {@link #yearFrom} is greater than
         * {@link #yearTo} then the order of years will be reversed.
         * @accessor
         */
        yearFrom: 1980,

        /**
         * @cfg {Number} [yearTo=new Date().getFullYear()]
         * The last year for the date picker. If {@link #yearFrom} is greater than
         * {@link #yearTo} then the order of years will be reversed.
         * @accessor
         */
        yearTo: new Date().getFullYear(),

        /**
         * @cfg {String} monthText
         * The label to show for the month column.
         * @accessor
         */
        monthText: 'Month',

        /**
         * @cfg {String} dayText
         * The label to show for the day column.
         * @accessor
         */
        dayText: 'Day',

        /**
         * @cfg {String} yearText
         * The label to show for the year column.
         * @accessor
         */
        yearText: 'Year',

        /**
         * @cfg {Array} slotOrder
         * An array of strings that specifies the order of the slots.
         * @accessor
         */
        slotOrder: ['month', 'day', 'year']

        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Ext.picker.Date} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Examples:
         *
         * - `{year: 1989, day: 1, month: 5}` = 1st May 1989
         * - `new Date()` = current date
         * @accessor
         */

        /**
         * @cfg {Array} slots
         * @hide
         * @accessor
         */
    },

    initialize: function() {
        this.callParent();

        this.on({
            scope: this,
            delegate: '> slot',
            slotpick: this.onSlotPick
        });

        this.on({
            scope: this,
            show: this.onSlotPick
        });
    },

    setValue: function(value, animated) {
        if (Ext.isDate(value)) {
            value = {
                day  : value.getDate(),
                month: value.getMonth() + 1,
                year : value.getFullYear()
            };
        }

        this.callParent([value, animated]);
    },

    getValue: function(useDom) {
        var values = {},
            items = this.getItems().items,
            ln = items.length,
            daysInMonth, day, month, year, item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue(useDom);
            }
        }

        //if all the slots return null, we should not return a date
        if (values.year === null && values.month === null && values.day === null) {
            return null;
        }

        year = Ext.isNumber(values.year) ? values.year : 1;
        month = Ext.isNumber(values.month) ? values.month : 1;
        day = Ext.isNumber(values.day) ? values.day : 1;

        if (month && year && month && day) {
            daysInMonth = this.getDaysInMonth(month, year);
        }
        day = (daysInMonth) ? Math.min(day, daysInMonth): day;

        return new Date(year, month - 1, day);
    },

    /**
     * Updates the yearFrom configuration
     */
    updateYearFrom: function() {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
     * Updates the yearTo configuration
     */
    updateYearTo: function() {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
     * Updates the monthText configuration
     */
    updateMonthText: function(newMonthText, oldMonthText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldMonthText) || (item.title.html == oldMonthText)) {
                    item.setTitle(newMonthText);
                }
            }
        }
    },

    /**
     * Updates the {@link #dayText} configuration.
     */
    updateDayText: function(newDayText, oldDayText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldDayText) || (item.title.html == oldDayText)) {
                    item.setTitle(newDayText);
                }
            }
        }
    },

    /**
     * Updates the yearText configuration
     */
    updateYearText: function(yearText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if (item.title == this.yearText) {
                    item.setTitle(yearText);
                }
            }
        }
    },

    // @private
    constructor: function() {
        this.callParent(arguments);
        this.createSlots();
    },

    /**
     * Generates all slots for all years specified by this component, and then sets them on the component
     * @private
     */
    createSlots: function() {
        var me        = this,
            slotOrder = me.getSlotOrder(),
            yearsFrom = me.getYearFrom(),
            yearsTo   = me.getYearTo(),
            years     = [],
            days      = [],
            months    = [],
            reverse   = yearsFrom > yearsTo,
            ln, i, daysInMonth;

        while (yearsFrom) {
            years.push({
                text  : yearsFrom,
                value : yearsFrom
            });

            if (yearsFrom === yearsTo) {
                break;
            }

            if (reverse) {
                yearsFrom--;
            } else {
                yearsFrom++;
            }
        }

        daysInMonth = me.getDaysInMonth(1, new Date().getFullYear());

        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text  : i + 1,
                value : i + 1
            });
        }

        for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
            months.push({
                text  : Ext.Date.monthNames[i],
                value : i + 1
            });
        }

        var slots = [];

        slotOrder.forEach(function (item) {
            slots.push(me.createSlot(item, days, months, years));
        });

        me.setSlots(slots);
    },

    /**
     * Returns a slot config for a specified date.
     * @private
     */
    createSlot: function(name, days, months, years) {
        switch (name) {
            case 'year':
                return {
                    name: 'year',
                    align: 'center',
                    data: years,
                    title: this.getYearText(),
                    flex: 3
                };
            case 'month':
                return {
                    name: name,
                    align: 'right',
                    data: months,
                    title: this.getMonthText(),
                    flex: 4
                };
            case 'day':
                return {
                    name: 'day',
                    align: 'center',
                    data: days,
                    title: this.getDayText(),
                    flex: 2
                };
        }
    },

    onSlotPick: function() {
        var value = this.getValue(true),
            slot = this.getDaySlot(),
            year = value.getFullYear(),
            month = value.getMonth(),
            days = [],
            daysInMonth, i;

        if (!value || !Ext.isDate(value) || !slot) {
            return;
        }

        this.callParent();

        //get the new days of the month for this new date
        daysInMonth = this.getDaysInMonth(month + 1, year);
        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }

        // We don't need to update the slot days unless it has changed
        if (slot.getData().length == days.length) {
            return;
        }

        slot.setData(days);

        // Now we have the correct amount of days for the day slot, lets update it
        var store = slot.getStore(),
            viewItems = slot.getViewItems(),
            valueField = slot.getValueField(),
            index, item;

        index = store.find(valueField, value.getDate());
        if (index == -1) {
            return;
        }

        item = Ext.get(viewItems[index]);

        slot.selectedIndex = index;
        slot.scrollToItem(item);

//        slot._value = value;
    },

    getDaySlot: function() {
        var innerItems = this.getInnerItems(),
            ln = innerItems.length,
            i, slot;

        if (this.daySlot) {
            return this.daySlot;
        }

        for (i = 0; i < ln; i++) {
            slot = innerItems[i];
            if (slot.isSlot && slot.getName() == "day") {
                this.daySlot = slot;
                return slot;
            }
        }

        return null;
    },

    // @private
    getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month-1];
    },

    // @private
    isLeapYear: function(year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },

    onDoneButtonTap: function() {
        var oldValue = this._value,
            newValue = this.getValue(true),
            testValue = newValue;

        if (Ext.isDate(newValue)) {
            testValue = newValue.toDateString();
        }
        if (Ext.isDate(oldValue)) {
            oldValue = oldValue.toDateString();
        }

        if (testValue != oldValue) {
            this.fireEvent('change', this, newValue);
        }

        this.hide();
    }
});
