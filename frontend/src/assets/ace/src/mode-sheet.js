define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define("ace/mode/sheet_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var currentVoice = null;

    var Event = "constant.other event";

    function normalizeClassName(name) {
        return name.replace(/[^a-zA-Z0-9]/g, '');
    }

    function getChordToken(token) {
        return Event + " chord chord-" + normalizeClassName(token[0]);
    }
    function getNoteToken(token) {
        return Event + " note note-" + normalizeClassName(token);
    }
    function getRestToken(token) {
        token = token || '';
        return Event + " rest " + token;
    }
    function getClusterToken(token, currentState, stack, line, pos) {
        var res = getNoteToken(token, currentState, stack, line, pos);
        res += " cluster";
        return res;
    }
    var SheetHighlightRules = function () {

        var degrees = (["I", "II", "III", "IV", "V", "VI", "VII",
        "Ib", "IIb", "IIIb", "IVb", "Vb", "VIb", "VIIb",
        "I#", "II#", "III#", "IV#", "V#", "VI#", "VII"])

        var alias = '\".*?\"';
        var notes = ([ alias, "c", "cis", "des", "d", "dis", "es", "e", "fes"
            , "eis", "f", "fis", "ges", "g", "gis", "as", "a", "ais", "bes"
            , "b", "ces", "bis"])
            .concat(degrees)
            .sort()
            .reverse() // cis has to appear before c
            .join('|');
            

        var octaves = ",,,,,|,,,,|,,,|,,|,|'''''|''''|'''|''|'";

        var durations = (["1", "2", "4", "8", "16", "32", "64", "128", "1\\.", "2\\.", "4\\.", "8\\.",
            "16\\.", "32\\.", "64\\.", "128\\.", "1t", "2t", "4t", "8t", "16t", "32t", "64t", "128t",
            "1n5", "2n5", "4n5", "8n5", "16n5", "32n5", "64n5", "128n5", "1n7", "2n7", "4n7",
            "8n7", "16n7", "32n7", "64n7", "128n7", "1n9", "2n9", "4n9", "8n9", "16n9", "32n9",
            "64n9", "128n9"
        ])
            .sort()
            .reverse()
            .join('|');

        var expressionSymbols = ["p", "pp", "ppp", "pppp", "ppppp",
        "f", "ff", "fff", "ffff", "fffff"];

        var expressions = "\\\\" 
            + expressionSymbols
            .sort()
            .reverse()
            .join('|\\\\');

        var expressionPlayedOnce = "!" 
            + expressionSymbols
            .sort()
            .reverse()
            .join('|!');
        this.$rules = {
            "start": [
                {
                    token: "keyword document-config document-config-load",
                    regex: "@\\w+ *",
                    next: "documentConfig.String"
                },
                {
                    token: "keyword metaevent",
                    regex: "\\w+:",
                    next: "document.metaevent"
                },                
                {
                    token: "paren.lparen track-begin track",
                    regex: "\\[",
                    next: "track",
                },
            ],
            "documentConfig.String": [
                {
                    token: "string",
                    regex: "\".*?\"",
                    next: "eol"
                },
            ],
            "eol": [
                {
                    token: "eol",
                    regex: "; *$",
                    next: "start"
                }
            ],
            "track": [
                {
                    token: "paren.lparen voice voice-begin",
                    regex: "\\{",
                    next: "voice"
                },
                {
                    token: "paren.rparen track track-end",
                    regex: "\\]",
                    next: "start"
                },
                {
                    token: "keyword metaevent",
                    regex: "\\w+:",
                    next: "track.metaevent"
                },                   
            ],
            "voice": [
                {
                    token: "keyword metaevent-begin",
                    regex: "/",
                    next: "voice.metaevent.begin"
                },
                {
                    token: "meta expression",
                    regex: expressions
                },
                {
                    token: "meta expression",
                    regex: expressionPlayedOnce
                },     
                {
                    token: getNoteToken,
                    regex: "(" + notes + ")(" + octaves + "){0,1}(" + durations + "){0,1}",
                },
                {
                    token: getNoteToken,
                    regex: "(x)(" + durations + "){0,1}",
                },                
                {
                    token: getClusterToken,
                    regex: "< *((" + notes + ") *(" + octaves + "){0,1} *)+ *>(" + durations + "){0,1}",
                },
                {
                    token: getChordToken,
                    regex: "[A-Z][a-zA-Z0-9/+#~*!?-]*",
                },                
                {
                    token: getRestToken,
                    regex: "r(" + durations + "){0,1}",
                },        
                {
                    token: " eob",
                    regex: "\\|"
                },
                {
                    token: "paren.rparen voice voice-end",
                    regex: "\\}",
                    next: "track"
                }
            ],
            "voice.metaevent.begin": [
                {
                    token: "keyword metaevent metaevent-command",
                    regex: "\\w+",
                },
                {
                    token: "keyword metaevent args-begin",
                    regex: ":",
                    next: "voice.metaevent"
                },
            ],
            "voice.metaevent": [
                {
                    token: "variable.parameter metaargs",
                    regex: "([a-zA-Z0-9.] *)+",
                },
                {
                    token: "keyword metaevent-end",
                    regex: "/",
                    next: "voice"   
                }
            ],
            "track.metaevent": [
                {
                    token: "variable.parameter metaargs",
                    regex: "([a-zA-Z0-9.] *)+",
                },
                {
                    token: "keyword metaevent-end",
                    regex: ";",
                    next: "track"   
                }
            ],                 
            "document.metaevent": [
                {
                    token: "variable.parameter document-metaevent metaargs",
                    regex: "([a-zA-Z0-9.] *)+",
                },
                {
                    token: "keyword document-metaevent metaevent-end",
                    regex: ";",
                    next: "start"   
                }
            ],            
        };

        let commentRules = {};
        for(let rule in this.$rules) {
            let commentRuleName = `comment-${rule}`
            let commentBeginRule = {
                token: "comment begin",
                regex: "--",
                next: commentRuleName
            }
            let emptyComment = {
                token: "comment",
                regex: "--$",
            }            
            commentRules[commentRuleName] = [
                {
                    token: "comment comment-contnet link",
                    regex: "[a-z]+://[a-zA-Z0-9_!~*'().;?:@&=+$,%#-/]+"
                },
                {
                    token: "comment comment-contnet",
                    regex: ".",
                },
                {
                    token: "",
                    regex: "$",
                    next: rule
                    
                }
            ]
            this.$rules[rule].splice(0, 0, commentBeginRule);
            this.$rules[rule].splice(0, 0, emptyComment);
        }
        Object.assign(this.$rules, commentRules);
    };

    oop.inherits(SheetHighlightRules, TextHighlightRules);
    exports.SheetHighlightRules = SheetHighlightRules;
});

define("ace/mode/sheet",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/matching_brace_outdent","ace/mode/sheet_highlight_rules"], function (require, exports, module) {
    "use strict";
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
    var SheetHighlightRules = require("./sheet_highlight_rules").SheetHighlightRules;


    var Mode = function () {
        this.HighlightRules = SheetHighlightRules;
        this.$outdent = new MatchingBraceOutdent();
        this.$background_tokenizer = null;
    };
    oop.inherits(Mode, TextMode);
    (function () {
        this.lineCommentStart = "--";
        this.getNextLineIndent = function (state, line, tab) {
            var indent = this.$getIndent(line);
            return indent;
        };

        this.checkOutdent = function (state, line, input) {
            return this.$outdent.checkOutdent(line, input);
        };

        this.autoOutdent = function (state, doc, row) {
            this.$outdent.autoOutdent(doc, row);
        };

    }).call(Mode.prototype);
    exports.Mode = Mode;
});                (function() {
                    window.require(["ace/mode/sheet"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            