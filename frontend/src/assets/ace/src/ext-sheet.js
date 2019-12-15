define("ace/ext/sheet_highlight_rules",["require","exports","module","ace/lib/oop","ace/ext/text_highlight_rules"], function (require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var currentVoice = null;

    var Event = "constant.other event";


    function getChordToken(token) {
        return Event + " chord chord-" + token[0];
    }
    function getNoteToken(token) {
        return Event + " note note-" + token;
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

        var comment = function (next) {
            return {
                token: "comment",
                regex: "--.*?$",
            }
        };
        var notes = (["c", "cis", "des", "d", "dis", "es", "e", "fes"
            , "eis", "f", "fis", "ges", "g", "gis", "as", "a", "ais", "bes"
            , "b", "ces", "bis"])
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

        var expressions = "\\\\" + (["p", "pp", "ppp", "pppp", "ppppp",
            "f", "ff", "fff", "ffff", "fffff"
        ])
            .sort()
            .reverse()
            .join('|\\\\');
        this.$rules = {
            "start": [
                comment(),
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
                comment(),
                {
                    token: "eol",
                    regex: "; *$",
                    next: "start"
                }
            ],
            "track": [
                comment(),
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
                comment(),
                {
                    token: "keyword metaevent",
                    regex: "/\\w+:",
                    next: "voice.metaevent"
                },
                {
                    token: "meta expression",
                    regex: expressions
                },                   
                {
                    token: getNoteToken,
                    regex: "(" + notes + ")(" + octaves + "){0,1}(" + durations + "){0,1}",
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
            "voice.metaevent": [
                comment(),
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
                comment(),
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
                comment(),
                {
                    token: "variable.parameter metaargs",
                    regex: "([a-zA-Z0-9.] *)+",
                },
                {
                    token: "keyword metaevent-end",
                    regex: ";",
                    next: "start"   
                }
            ],            
        };

    };

    oop.inherits(SheetHighlightRules, TextHighlightRules);
    exports.SheetHighlightRules = SheetHighlightRules;
});

define("ace/ext/sheet",["require","exports","module","ace/lib/oop","ace/ext/text","ace/ext/matching_brace_outdent","ace/ext/sheet_highlight_rules"], function (require, exports, module) {
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
                    window.require(["ace/ext/sheet"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            