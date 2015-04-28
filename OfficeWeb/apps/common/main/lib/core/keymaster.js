/*
 * (c) Copyright Ascensio System SIA 2010-2015
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 (function (global) {
    var k, _handlers = {},
    _mods = {
        16: false,
        18: false,
        17: false,
        91: false
    },
    _scope = "all",
    _MODIFIERS = {
        "⇧": 16,
        shift: 16,
        "⌥": 18,
        alt: 18,
        option: 18,
        "⌃": 17,
        ctrl: 17,
        control: 17,
        "⌘": 91,
        command: 91
    },
    _MAP = {
        backspace: 8,
        tab: 9,
        clear: 12,
        enter: 13,
        "return": 13,
        esc: 27,
        escape: 27,
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        del: 46,
        "delete": 46,
        home: 36,
        end: 35,
        pageup: 33,
        pagedown: 34,
        ",": 188,
        ".": 190,
        "/": 191,
        "`": 192,
        "-": 189,
        "=": 187,
        ";": 186,
        "'": 222,
        "[": 219,
        "]": 221,
        "\\": 220
    },
    code = function (x) {
        return _MAP[x] || x.toUpperCase().charCodeAt(0);
    },
    _downKeys = [];
    var locked;
    for (k = 1; k < 20; k++) {
        _MAP["f" + k] = 111 + k;
    }
    function index(array, item) {
        var i = array.length;
        while (i--) {
            if (array[i] === item) {
                return i;
            }
        }
        return -1;
    }
    function compareArray(a1, a2) {
        if (a1.length != a2.length) {
            return false;
        }
        for (var i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }
    var modifierMap = {
        16: "shiftKey",
        18: "altKey",
        17: "ctrlKey",
        91: "metaKey"
    };
    function updateModifierKey(event) {
        for (k in _mods) {
            _mods[k] = event[modifierMap[k]];
        }
    }
    function dispatch(event) {
        var key, handler, k, i, modifiersMatch, scope;
        key = event.keyCode;
        if (index(_downKeys, key) == -1) {
            _downKeys.push(key);
        }
        if (key == 93 || key == 224) {
            key = 91;
        }
        if (key in _mods) {
            _mods[key] = true;
            for (k in _MODIFIERS) {
                if (_MODIFIERS[k] == key) {
                    assignKey[k] = true;
                }
            }
            return;
        }
        updateModifierKey(event);
        if (!assignKey.filter.call(this, event)) {
            return;
        }
        if (! (key in _handlers)) {
            return;
        }
        scope = getScope();
        for (i = 0; i < _handlers[key].length; i++) {
            handler = _handlers[key][i];
            if (handler.scope == scope || handler.scope == "all") {
                modifiersMatch = handler.mods.length > 0;
                for (k in _mods) {
                    if ((!_mods[k] && index(handler.mods, +k) > -1) || (_mods[k] && index(handler.mods, +k) == -1)) {
                        modifiersMatch = false;
                    }
                }
                if ((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch) {
                    if (locked === true || handler.locked || handler.method(event, handler) === false) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        } else {
                            event.returnValue = false;
                        }
                        if (event.stopPropagation) {
                            event.stopPropagation();
                        }
                        if (event.cancelBubble) {
                            event.cancelBubble = true;
                        }
                    }
                }
            }
        }
    }
    function clearModifier(event) {
        var key = event.keyCode,
        k, i = index(_downKeys, key);
        if (i >= 0) {
            _downKeys.splice(i, 1);
        }
        if (key == 93 || key == 224) {
            key = 91;
        }
        if (key in _mods) {
            _mods[key] = false;
            for (k in _MODIFIERS) {
                if (_MODIFIERS[k] == key) {
                    assignKey[k] = false;
                }
            }
        }
    }
    function resetModifiers() {
        for (k in _mods) {
            _mods[k] = false;
        }
        for (k in _MODIFIERS) {
            assignKey[k] = false;
        }
    }
    function assignKey(key, scope, method) {
        var keys, mods;
        keys = getKeys(key);
        if (method === undefined) {
            method = scope;
            scope = "all";
        }
        for (var i = 0; i < keys.length; i++) {
            mods = [];
            key = keys[i].split("+");
            if (key.length > 1) {
                mods = getMods(key);
                key = [key[key.length - 1]];
            }
            key = key[0];
            key = code(key);
            if (! (key in _handlers)) {
                _handlers[key] = [];
            }
            _handlers[key].push({
                shortcut: keys[i],
                scope: scope,
                method: method,
                key: keys[i],
                mods: mods
            });
        }
    }
    function unbindKey(key, scope) {
        var multipleKeys, keys, mods = [],
        i,
        j,
        obj;
        multipleKeys = getKeys(key);
        for (j = 0; j < multipleKeys.length; j++) {
            keys = multipleKeys[j].split("+");
            if (keys.length > 1) {
                mods = getMods(keys);
                key = keys[keys.length - 1];
            }
            key = code(key);
            if (scope === undefined) {
                scope = getScope();
            }
            if (!_handlers[key]) {
                return;
            }
            for (i in _handlers[key]) {
                obj = _handlers[key][i];
                if (obj.scope === scope && compareArray(obj.mods, mods)) {
                    _handlers[key][i] = {};
                }
            }
        }
    }
    function isPressed(keyCode) {
        if (typeof(keyCode) == "string") {
            keyCode = code(keyCode);
        }
        return index(_downKeys, keyCode) != -1;
    }
    function getPressedKeyCodes() {
        return _downKeys.slice(0);
    }
    function filter(event) {
        var tagName = (event.target || event.srcElement).tagName;
        return ! (tagName == "INPUT" || tagName == "SELECT" || tagName == "TEXTAREA");
    }
    for (k in _MODIFIERS) {
        assignKey[k] = false;
    }
    function setScope(scope) {
        _scope = scope || "all";
    }
    function getScope() {
        return _scope || "all";
    }
    function deleteScope(scope) {
        var key, handlers, i;
        for (key in _handlers) {
            handlers = _handlers[key];
            for (i = 0; i < handlers.length;) {
                if (handlers[i].scope === scope) {
                    handlers.splice(i, 1);
                } else {
                    i++;
                }
            }
        }
    }
    function getKeys(key) {
        var keys;
        key = key.replace(/\s/g, "");
        keys = key.split(",");
        if ((keys[keys.length - 1]) == "") {
            keys[keys.length - 2] += ",";
        }
        return keys;
    }
    function getMods(key) {
        var mods = key.slice(0, key.length - 1);
        for (var mi = 0; mi < mods.length; mi++) {
            mods[mi] = _MODIFIERS[mods[mi]];
        }
        return mods;
    }
    function addEvent(object, event, method) {
        if (object.addEventListener) {
            object.addEventListener(event, method, false);
        } else {
            if (object.attachEvent) {
                object.attachEvent("on" + event, function () {
                    method(window.event);
                });
            }
        }
    }
    addEvent(document, "keydown", function (event) {
        dispatch(event);
    });
    addEvent(document, "keyup", clearModifier);
    addEvent(window, "focus", resetModifiers);
    var previousKey = global.key;
    function noConflict() {
        var k = global.key;
        global.key = previousKey;
        return k;
    }
    function setKeyOptions(key, scope, option, value) {
        var keys, mods = [],
        i,
        obj;
        var multipleKeys = getKeys(key);
        for (var j = multipleKeys.length; j--;) {
            keys = multipleKeys[j].split("+");
            if (keys.length > 1) {
                mods = getMods(keys);
                key = keys[keys.length - 1];
            }
            key = code(key);
            if (scope === undefined) {
                scope = getScope();
            }
            if (_handlers[key]) {
                for (i in _handlers[key]) {
                    obj = _handlers[key][i];
                    if (obj.scope === scope && compareArray(obj.mods, mods)) {
                        _handlers[key][i][option] = value;
                    }
                }
            }
        }
    }
    function suspend(key, scope) {
        key ? setKeyOptions(key, scope, "locked", true) : (locked = true);
    }
    function resume(key, scope) {
        key ? setKeyOptions(key, scope, "locked", false) : (locked = false);
    }
    global.key = assignKey;
    global.key.setScope = setScope;
    global.key.getScope = getScope;
    global.key.deleteScope = deleteScope;
    global.key.filter = filter;
    global.key.isPressed = isPressed;
    global.key.getPressedKeyCodes = getPressedKeyCodes;
    global.key.noConflict = noConflict;
    global.key.unbind = unbindKey;
    global.key.suspend = suspend;
    global.key.resume = resume;
    if (typeof module !== "undefined") {
        module.exports = key;
    }
})(this);