/*
 *   Selectables
 *
 *   v1.4.1
 *
 *   https://github.com/p34eu/Selectables.git
 */
/*
//console.log("UYDGUDZYUYVDZUYDZVUDYZVUDZYVDZUYVDZ");

function Selectables(opts) {
    'use strict';
    var defaults = {
        zone: "#wrapper", // ID of the element whith selectables.
        elements: "a", //  items to be selectable .list-group, #id > .class,'htmlelement' - valid querySelectorAll
        selectedClass: 'active', // class name to apply to seleted items
        key: false, //'altKey,ctrlKey,metaKey,false  // activate using optional key
        moreUsing: 'shiftKey', //altKey,ctrlKey,metaKey   // add more to selection
        enabled: true, //false to .enable() at later time
        start: null, //  event on selection start
        stop: null, // event on selection end
        onSelect: null, // event fired on every item when selected.
        onDeselect: null         // event fired on every item when selected.
    };
    var extend = function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }
        return a;
    };
    this.foreach = function (items, callback, scope) {
        if (Object.prototype.toString.call(items) === '[object Object]') {
            for (var prop in items) {
                if (Object.prototype.hasOwnProperty.call(items, prop)) {
                    callback.call(scope, items[prop], prop, items);
                }
            }
        } else {
            for (var i = 0, len = items.length; i < len; i++) {
                callback.call(scope, items[i], i, items);
            }
        }
    }
    this.options = extend(defaults, opts || {});
    this.on = false;
    var self = this;
    this.enable = function () {
        if (this.on) {
            throw new Error(this.constructor.name + " :: is alredy enabled");
            return;
        }
        this.zone = document.querySelector(this.options.zone);
        if (!this.zone) {
            throw new Error(this.constructor.name + " :: no zone defined in options. Please use element with ID");
        }
        this.items = document.querySelectorAll(this.options.zone + ' ' + this.options.elements);
        this.disable();
        this.zone.addEventListener('mousedown', self.rectOpen);
        this.on = true;
        return this;
    };
    this.disable = function () {
        this.zone.removeEventListener('mousedown', self.rectOpen);
        this.on = false;
        return this;
    };
    var offset = function (el) {
        var r = el.getBoundingClientRect();
        return {top: r.top + document.body.scrollTop, left: r.left + document.body.scrollLeft}
    };
    this.suspend = function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    this.rectOpen = function (e) {
        self.options.start && self.options.start(e);
        if (self.options.key && !e[self.options.key]) {
            return;
        }
        document.body.classList.add('s-noselect');
        self.foreach(self.items, function (el) {
            el.addEventListener('click', self.suspend, true); //skip any clicks
            if (!e[self.options.moreUsing]) {
                el.classList.remove(self.options.selectedClass);
            }
        });
        self.ipos = [e.pageX, e.pageY];
        if (!rb()) {
            var gh = document.createElement('div');
            gh.id = 's-rectBox';
            gh.style.left = e.pageX + 'px';
            gh.style.top = e.pageY + 'px';
            document.body.appendChild(gh);
        }
        document.body.addEventListener('mousemove', self.rectDraw);
        window.addEventListener('mouseup', self.select);
    };
    var rb = function () {
        return document.getElementById('s-rectBox');
    };
    var cross = function (a, b) {
        var aTop = offset(a).top, aLeft = offset(a).left, bTop = offset(b).top, bLeft = offset(b).left;
        return !(((aTop + a.offsetHeight) < (bTop)) || (aTop > (bTop + b.offsetHeight)) || ((aLeft + a.offsetWidth) < bLeft) || (aLeft > (bLeft + b.offsetWidth)));
    };
    this.select = function (e) {
        var a = rb();
        if (!a) {
            return;
        }
        delete(self.ipos);
        document.body.classList.remove('s-noselect');
        document.body.removeEventListener('mousemove', self.rectDraw);
        window.removeEventListener('mouseup', self.select);
        var s = self.options.selectedClass;
        self.foreach(self.items, function (el) {
            if (cross(a, el) === true) {
                if (el.classList.contains(s)) {
                    el.classList.remove(s);
                    self.options.onDeselect && self.options.onDeselect(el);
                } else {
                    el.classList.add(s);
                    self.options.onSelect && self.options.onSelect(el);
                }
            }
            setTimeout(function () {
                el.removeEventListener('click', self.suspend, true);
            }, 100);
        });
        a.parentNode.removeChild(a);
        self.options.stop && self.options.stop(e);
    }
    this.rectDraw = function (e) {
        var g = rb();
        if (!self.ipos || g === null) {
            return;
        }
        var tmp, x1 = self.ipos[0], y1 = self.ipos[1], x2 = e.pageX, y2 = e.pageY;
        if (x1 > x2) {
            tmp = x2, x2 = x1, x1 = tmp;
        }
        if (y1 > y2) {
            tmp = y2, y2 = y1, y1 = tmp;
        }
        g.style.left = x1 + 'px', g.style.top = y1 + 'px', g.style.width = (x2 - x1) + 'px', g.style.height = (y2 - y1) + 'px';
    }
    this.options.selectables = this;
    if (this.options.enabled) {
        return this.enable();
    }
    return this;
}


new Selectables({
    elements: 'div',
    zone: 'body'
});

//console.log("new attempt !!!!!!!!!!!!!!!!!!");

const selection = Selection.create({

    // Class for the selection-area
    class: 'selection',

    // All elements in this container can be selected
    selectables: ['body > div'],

    // The container is also the boundary in this case
    boundaries: ['body']
}).on('start', ({inst, selected, oe}) => {

    // Remove class if the user isn't pressing the control key or ⌘ key
    if (!oe.ctrlKey && !oe.metaKey) {

        // Unselect all elements
        for (const el of selected) {
            el.classList.remove('selected');
            inst.removeFromSelection(el);
        }

        // Clear previous selection
        inst.clearSelection();
    }

}).on('move', ({changed: {removed, added}}) => {

    // Add a custom class to the elements that where selected.
    for (const el of added) {
        el.classList.add('selected');
    }

    // Remove the class from elements that where removed
    // since the last selection
    for (const el of removed) {
        el.classList.remove('selected');
    }

}).on('stop', ({inst}) => {

    // Remember selection in case the user wants to add smth in the next one
    inst.keepSelection();
});

*/