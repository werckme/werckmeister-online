define("ace/mode/sheet_tokenizer",["require","exports","module","ace/lib/oop","ace/tokenizer"], function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var Tokenizer = require("../tokenizer").Tokenizer;
    var MAX_TOKEN_COUNT = 2000;
    var SheetTokenizer = function (rules) {
        this.states = rules;

        this.regExps = {};
        this.matchMappings = {};
        this.lineLengths_ = [];
        for (var key in this.states) {
            var state = this.states[key];
            var ruleRegExps = [];
            var matchTotal = 0;
            var mapping = this.matchMappings[key] = {defaultToken: "text"};
            var flag = "g";
    
            var splitterRurles = [];
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule.defaultToken)
                    mapping.defaultToken = rule.defaultToken;
                if (rule.caseInsensitive)
                    flag = "gi";
                if (rule.regex == null)
                    continue;
    
                if (rule.regex instanceof RegExp)
                    rule.regex = rule.regex.toString().slice(1, -1);
                var adjustedregex = rule.regex;
                var matchcount = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
                if (Array.isArray(rule.token)) {
                    if (rule.token.length == 1 || matchcount == 1) {
                        rule.token = rule.token[0];
                    } else if (matchcount - 1 != rule.token.length) {
                        this.reportError("number of classes and regexp groups doesn't match", { 
                            rule: rule,
                            groupCount: matchcount - 1
                        });
                        rule.token = rule.token[0];
                    } else {
                        rule.tokenArray = rule.token;
                        rule.token = null;
                        rule.onMatch = this.$arrayTokens;
                    }
                } else if (typeof rule.token == "function" && !rule.onMatch) {
                    if (matchcount > 1)
                        rule.onMatch = this.$applyToken;
                    else
                        rule.onMatch = rule.token;
                }
    
                if (matchcount > 1) {
                    if (/\\\d/.test(rule.regex)) {
                        adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function(match, digit) {
                            return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                        });
                    } else {
                        matchcount = 1;
                        adjustedregex = this.removeCapturingGroups(rule.regex);
                    }
                    if (!rule.splitRegex && typeof rule.token != "string")
                        splitterRurles.push(rule); // flag will be known only at the very end
                }
    
                mapping[matchTotal] = i;
                matchTotal += matchcount;
    
                ruleRegExps.push(adjustedregex);
                if (!rule.onMatch)
                    rule.onMatch = null;
            }
            
            if (!ruleRegExps.length) {
                mapping[0] = 0;
                ruleRegExps.push("$");
            }
            
            splitterRurles.forEach(function(rule) {
                rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
            }, this);
    
            this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
        }
    }
    oop.inherits(SheetTokenizer, Tokenizer);
    
    SheetTokenizer.prototype.updateLineLength = function(line, row) {
        this.lineLengths_[row] = line.length + 1; // \n peer line
    }

    SheetTokenizer.prototype.getLineLength = function(row) {
        return this.lineLengths_[row];
    }

    SheetTokenizer.prototype.absoluteLinePosition = function(row) {
        if (row<0) {
            throw Error("invalid row index: " + row);
        }
        if (row===0) {
            return 0;
        }
        row -= 1;
        var total = 0;
        for(var idx=0; idx < row; ++idx) {
            if (this.lineLengths_[idx] === undefined) {
                continue;
            }
            if (row>=this.lineLengths_.length) {
                break;
            }
            total += this.lineLengths_[idx];
        }
        console.log(row, total);
        return total;
    }
    
    SheetTokenizer.prototype.getLineTokens = function(line, startState, row) {
        this.updateLineLength(line, row);
        if (startState && typeof startState != "string") {
            var stack = startState.slice(0);
            startState = stack[0];
            if (startState === "#tmp") {
                stack.shift();
                startState = stack.shift();
            }
        } else
            var stack = [];

        var currentState = startState || "start";
        var state = this.states[currentState];
        if (!state) {
            currentState = "start";
            state = this.states[currentState];
        }
        var mapping = this.matchMappings[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match, tokens = [];
        var lastIndex = 0;
        var matchAttempts = 0;

        var token = {type: null, value: ""};

        while (match = re.exec(line)) {
            var type = mapping.defaultToken;
            var rule = null;
            var value = match[0];
            var index = re.lastIndex;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                if (token.type == type) {
                    token.value += skipped;
                } else {
                    if (token.type)
                        tokens.push(token);
                    token = {type: type, value: skipped};
                }
            }

            for (var i = 0; i < match.length-2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = state[mapping[i]];

                if (rule.onMatch) {
                    var col = index - value.length;
                    var posargs = {row: row, column: col, absolutePosition: this.absoluteLinePosition(row) + col};
                    type = rule.token(value, currentState, stack, line, posargs);
                }
                else {
                    type = rule.token;
                }

                if (rule.next) {
                    if (typeof rule.next == "string") {
                        currentState = rule.next;
                    } else {
                        currentState = rule.next(currentState, stack);
                    }
                    
                    state = this.states[currentState];
                    if (!state) {
                        this.reportError("state doesn't exist", currentState);
                        currentState = "start";
                        state = this.states[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
                if (rule.consumeLineEnd)
                    lastIndex = index;
                break;
            }

            if (value) {
                if (typeof type === "string") {
                    if ((!rule || rule.merge !== false) && token.type === type) {
                        token.value += value;
                    } else {
                        if (token.type)
                            tokens.push(token);
                        token = {type: type, value: value};
                    }
                } else if (type) {
                    if (token.type)
                        tokens.push(token);
                    token = {type: null, value: ""};
                    for (var i = 0; i < type.length; i++)
                        tokens.push(type[i]);
                }
            }

            if (lastIndex == line.length)
                break;

            lastIndex = index;

            if (matchAttempts++ > MAX_TOKEN_COUNT) {
                if (matchAttempts > 2 * line.length) {
                    this.reportError("infinite loop with in ace tokenizer", {
                        startState: startState,
                        line: line
                    });
                }
                while (lastIndex < line.length) {
                    if (token.type)
                        tokens.push(token);
                    token = {
                        value: line.substring(lastIndex, lastIndex += 2000),
                        type: "overflow"
                    };
                }
                currentState = "start";
                stack = [];
                break;
            }
        }

        if (token.type)
            tokens.push(token);
        
        if (stack.length > 1) {
            if (stack[0] !== currentState)
                stack.unshift("#tmp", currentState);
        }
        return {
            tokens : tokens,
            state : stack.length ? stack : currentState
        };
    };
    

    exports.SheetTokenizer = SheetTokenizer;
});                (function() {
                    window.require(["ace/mode/sheet_tokenizer"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            