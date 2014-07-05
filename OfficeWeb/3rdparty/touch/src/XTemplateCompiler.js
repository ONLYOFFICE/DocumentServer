/**
 * This class compiles the XTemplate syntax into a function object. The function is used
 * like so:
 *
 *      function (out, values, parent, xindex, xcount) {
 *          // out is the output array to store results
 *          // values, parent, xindex and xcount have their historical meaning
 *      }
 *
 * @private
 */
Ext.define('Ext.XTemplateCompiler', {
    extend: 'Ext.XTemplateParser',

    // Chrome really likes "new Function" to realize the code block (as in it is
    // 2x-3x faster to call it than using eval), but Firefox chokes on it badly.
    // IE and Opera are also fine with the "new Function" technique.
    useEval: Ext.isGecko,

    // See [http://jsperf.com/nige-array-append](http://jsperf.com/nige-array-append) for quickest way to append to an array of unknown length
    // (Due to arbitrary code execution inside a template, we cannot easily track the length in var)
    // On IE6 and 7 `myArray[myArray.length]='foo'` is better. On other browsers `myArray.push('foo')` is better.
    useIndex: Ext.isIE6 || Ext.isIE7,

    useFormat: true,

    propNameRe: /^[\w\d\$]*$/,

    compile: function (tpl) {
        var me = this,
            code = me.generate(tpl);

        // When using "new Function", we have to pass our "Ext" variable to it in order to
        // support sandboxing. If we did not, the generated function would use the global
        // "Ext", not the "Ext" from our sandbox (scope chain).
        //
        return me.useEval ? me.evalTpl(code) : (new Function('Ext', code))(Ext);
    },

    generate: function (tpl) {
        var me = this,
            // note: Ext here is properly sandboxed
            definitions = 'var fm=Ext.util.Format,ts=Object.prototype.toString;',
            code;

        // Track how many levels we use, so that we only "var" each level's variables once
        me.maxLevel = 0;

        me.body = [
            'var c0=values, a0=' + me.createArrayTest(0) + ', p0=parent, n0=xcount, i0=xindex, v;\n'
        ];
        if (me.definitions) {
            if (typeof me.definitions === 'string') {
                me.definitions = [me.definitions, definitions ];
            } else {
                me.definitions.push(definitions);
            }
        } else {
            me.definitions = [ definitions ];
        }
        me.switches = [];

        me.parse(tpl);

        me.definitions.push(
            (me.useEval ? '$=' : 'return') + ' function (' + me.fnArgs + ') {',
                me.body.join(''),
            '}'
        );

        code = me.definitions.join('\n');

        // Free up the arrays.
        me.definitions.length = me.body.length = me.switches.length = 0;
        delete me.definitions;
        delete me.body;
        delete me.switches;

        return code;
    },

    //-----------------------------------
    // XTemplateParser callouts

    //
    doText: function (text) {
        var me = this,
            out = me.body;

        text = text.replace(me.aposRe, "\\'").replace(me.newLineRe, '\\n');
        if (me.useIndex) {
            out.push('out[out.length]=\'', text, '\'\n');
        } else {
            out.push('out.push(\'', text, '\')\n');
        }
    },

    doExpr: function (expr) {
        var out = this.body;
        out.push('if ((v=' + expr + ')!==undefined && (v=' + expr + ')!==null) out');

        // Coerce value to string using concatenation of an empty string literal.
        // See http://jsperf.com/tostringvscoercion/5
        if (this.useIndex) {
             out.push('[out.length]=v+\'\'\n');
        } else {
             out.push('.push(v+\'\')\n');
        }
    },

    doTag: function (tag) {
        this.doExpr(this.parseTag(tag));
    },

    doElse: function () {
        this.body.push('} else {\n');
    },

    doEval: function (text) {
        this.body.push(text, '\n');
    },

    doIf: function (action, actions) {
        var me = this;

        // If it's just a propName, use it directly in the if
        if (action === '.') {
            me.body.push('if (values) {\n');
        } else if (me.propNameRe.test(action)) {
            me.body.push('if (', me.parseTag(action), ') {\n');
        }
        // Otherwise, it must be an expression, and needs to be returned from an fn which uses with(values)
        else {
            me.body.push('if (', me.addFn(action), me.callFn, ') {\n');
        }
        if (actions.exec) {
            me.doExec(actions.exec);
        }
    },

    doElseIf: function (action, actions) {
        var me = this;

        // If it's just a propName, use it directly in the else if
        if (action === '.') {
            me.body.push('else if (values) {\n');
        } else if (me.propNameRe.test(action)) {
            me.body.push('} else if (', me.parseTag(action), ') {\n');
        }
        // Otherwise, it must be an expression, and needs to be returned from an fn which uses with(values)
        else {
            me.body.push('} else if (', me.addFn(action), me.callFn, ') {\n');
        }
        if (actions.exec) {
            me.doExec(actions.exec);
        }
    },

    doSwitch: function (action) {
        var me = this;

        // If it's just a propName, use it directly in the switch
        if (action === '.') {
            me.body.push('switch (values) {\n');
        } else if (me.propNameRe.test(action)) {
            me.body.push('switch (', me.parseTag(action), ') {\n');
        }
        // Otherwise, it must be an expression, and needs to be returned from an fn which uses with(values)
        else {
            me.body.push('switch (', me.addFn(action), me.callFn, ') {\n');
        }
        me.switches.push(0);
    },

    doCase: function (action) {
        var me = this,
            cases = Ext.isArray(action) ? action : [action],
            n = me.switches.length - 1,
            match, i;

        if (me.switches[n]) {
            me.body.push('break;\n');
        } else {
            me.switches[n]++;
        }

        for (i = 0, n = cases.length; i < n; ++i) {
            match = me.intRe.exec(cases[i]);
            cases[i] = match ? match[1] : ("'" + cases[i].replace(me.aposRe,"\\'") + "'");
        }

        me.body.push('case ', cases.join(': case '), ':\n');
    },

    doDefault: function () {
        var me = this,
            n = me.switches.length - 1;

        if (me.switches[n]) {
            me.body.push('break;\n');
        } else {
            me.switches[n]++;
        }

        me.body.push('default:\n');
    },

    doEnd: function (type, actions) {
        var me = this,
            L = me.level-1;

        if (type == 'for') {
            /*
            To exit a for loop we must restore the outer loop's context. The code looks
            like this (which goes with that produced by doFor:

                    for (...) { // the part generated by doFor
                        ...  // the body of the for loop

                        // ... any tpl for exec statement goes here...
                    }
                    parent = p1;
                    values = r2;
                    xcount = n1;
                    xindex = i1
            */
            if (actions.exec) {
                me.doExec(actions.exec);
            }

            me.body.push('}\n');
            me.body.push('parent=p',L,';values=r',L+1,';xcount=n',L,';xindex=i',L,'\n');
        } else if (type == 'if' || type == 'switch') {
            me.body.push('}\n');
        }
    },

    doFor: function (action, actions) {
        var me = this,
            s,
            L = me.level,
            up = L-1,
            pL = 'p' + L,
            parentAssignment;

        // If it's just a propName, use it directly in the switch
        if (action === '.') {
            s = 'values';
        } else if (me.propNameRe.test(action)) {
            s = me.parseTag(action);
        }
        // Otherwise, it must be an expression, and needs to be returned from an fn which uses with(values)
        else {
            s = me.addFn(action) + me.callFn;
        }

        /*
        We are trying to produce a block of code that looks like below. We use the nesting
        level to uniquely name the control variables.

            // Omit "var " if we have already been through level 2
            var i2 = 0,
                n2 = 0,
                c2 = values['propName'],
                    // c2 is the context object for the for loop
                a2 = Array.isArray(c2);
                p2 = c1,
                    // p2 is the parent context (of the outer for loop)
                r2 = values
                    // r2 is the values object to

            // If iterating over the current data, the parent is always set to c2
            parent = c2;
            // If iterating over a property in an object, set the parent to the object
            parent = a1 ? c1[i1] : p2 // set parent
            if (c2) {
                if (a2) {
                    n2 = c2.length;
                } else if (c2.isMixedCollection) {
                    c2 = c2.items;
                    n2 = c2.length;
                } else if (c2.isStore) {
                    c2 = c2.data.items;
                    n2 = c2.length;
                } else {
                    c2 = [ c2 ];
                    n2 = 1;
                }
            }
            // i2 is the loop index and n2 is the number (xcount) of this for loop
            for (xcount = n2; i2 < n2; ++i2) {
                values = c2[i2]           // adjust special vars to inner scope
                xindex = i2 + 1           // xindex is 1-based

        The body of the loop is whatever comes between the tpl and /tpl statements (which
        is handled by doEnd).
        */

        // Declare the vars for a particular level only if we have not already declared them.
        if (me.maxLevel < L) {
            me.maxLevel = L;
            me.body.push('var ');
        }

        if (action == '.') {
            parentAssignment = 'c' + L;
        } else {
            parentAssignment = 'a' + up + '?c' + up + '[i' + up + ']:p' + L;
        }

        me.body.push('i',L,'=0,n', L, '=0,c',L,'=',s,',a',L,'=', me.createArrayTest(L), ',p',L,'=c',up,',r',L,'=values;\n',
            'parent=',parentAssignment,'\n',
            'if (c',L,'){if(a',L,'){n', L,'=c', L, '.length;}else if (c', L, '.isMixedCollection){c',L,'=c',L,'.items;n',L,'=c',L,'.length;}else if(c',L,'.isStore){c',L,'=c',L,'.data.items;n',L,'=c',L,'.length;}else{c',L,'=[c',L,'];n',L,'=1;}}\n',
            'for (xcount=n',L,';i',L,'<n'+L+';++i',L,'){\n',
            'values=c',L,'[i',L,']');
        if (actions.propName) {
            me.body.push('.', actions.propName);
        }
        me.body.push('\n',
            'xindex=i',L,'+1\n');
    },

    createArrayTest: ('isArray' in Array) ? function(L) {
        return 'Array.isArray(c' + L + ')';
    } : function(L) {
        return 'ts.call(c' + L + ')==="[object Array]"';
    },

    doExec: function (action, actions) {
        var me = this,
            name = 'f' + me.definitions.length;

        me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' try { with(values) {',
                            '  ' + action,
                            ' }} catch(e) {',
                            //<debug>
                            'Ext.Logger.log("XTemplate Error: " + e.message);',
                             //</debug>
                            '}',
                      '}');

        me.body.push(name + me.callFn + '\n');
    },

    //-----------------------------------
    // Internal

    //
    addFn: function (body) {
        var me = this,
            name = 'f' + me.definitions.length;

        if (body === '.') {
            me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' return values',
                       '}');
        } else if (body === '..') {
            me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' return parent',
                       '}');
        } else {
            me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
                            ' try { with(values) {',
                            '  return(' + body + ')',
                            ' }} catch(e) {',
                            //<debug>
                            'Ext.Logger.log("XTemplate Error: " + e.message);',
                             //</debug>
                            '}',
                       '}');
        }

        return name;
    },

    parseTag: function (tag) {
        var me = this,
            m = me.tagRe.exec(tag),
            name = m[1],
            format = m[2],
            args = m[3],
            math = m[4],
            v;

        // name = "." - Just use the values object.
        if (name == '.') {
            // filter to not include arrays/objects/nulls
            if (!me.validTypes) {
                me.definitions.push('var validTypes={string:1,number:1,boolean:1};');
                me.validTypes = true;
            }
            v = 'validTypes[typeof values] || ts.call(values) === "[object Date]" ? values : ""';
        }
        // name = "#" - Use the xindex
        else if (name == '#') {
            v = 'xindex';
        }
        else if (name.substr(0, 7) == "parent.") {
            v = name;
        }
        // compound JavaScript property name (e.g., "foo.bar")
        else if (isNaN(name) && name.indexOf('-') == -1 && name.indexOf('.') != -1) {
            v = "values." + name;
        }
        // number or a '-' in it or a single word (maybe a keyword): use array notation
        // (http://jsperf.com/string-property-access/4)
        else {
            v = "values['" + name + "']";
        }

        if (math) {
            v = '(' + v + math + ')';
        }

        if (format && me.useFormat) {
            args = args ? ',' + args : "";
            if (format.substr(0, 5) != "this.") {
                format = "fm." + format + '(';
            } else {
                format += '(';
            }
        } else {
            return v;
        }

        return format + v + args + ')';
    },

    // @private
    evalTpl: function ($) {

        // We have to use eval to realize the code block and capture the inner func we also
        // don't want a deep scope chain. We only do this in Firefox and it is also unhappy
        // with eval containing a return statement, so instead we assign to "$" and return
        // that. Because we use "eval", we are automatically sandboxed properly.
        eval($);
        return $;
    },

    newLineRe: /\r\n|\r|\n/g,
    aposRe: /[']/g,
    intRe:  /^\s*(\d+)\s*$/,
    tagRe:  /([\w-\.\#\$]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?/
}, function () {
    var proto = this.prototype;

    proto.fnArgs = 'out,values,parent,xindex,xcount';
    proto.callFn = '.call(this,' + proto.fnArgs + ')';
});
