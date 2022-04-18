export interface IExpressionDomain {
    name: string;
    content: any;
}

export interface IExpressionDef {
    name: string;
    usage: string;
    args: IExpressionArg[];
}

export interface IExpressionArg {
    name: string;
    type: string;
    description: string;
}

export enum ArgumentType {
    identifier = "identifier",
    pnumber = "positive integer"
}

export const werckmeisterExpressions = {
    setup: {
        name: "Setup",
        content: {
            device: {
                name: "device",
                usage: "device: name type portNumber [offset millis];",
                args: [
                    {
                        name: "name",
                        type: ArgumentType.identifier,
                        description: "The name which will be used later in your document<br><i>You can choose any name you want to</i>"
                    },
                    {
                        name: "type",
                        type: ArgumentType.identifier,
                        description: "There is currently one supported type: midi"
                    },
                    {
                        name: "portNumber",
                        type: ArgumentType.pnumber,
                        description: "This is the id of your device"
                    },
                    {
                        name: "offset",
                        type: ArgumentType.pnumber,
                        description: "optional: an offset in millis, which delays the output to this port<br><i>e.g.: \"device: MyDevice midi 0 offset 20\"</i>"
                    }
                ]
            },
            instrumentDef: {
                name: "instrumentDef",
                usage: "instrumentDef: name midiDevice midiChannel controlChange programChange;",
                args: [
                    {
                        name: "name",
                        type: ArgumentType.identifier,
                        description: "The name of the instrument"
                    },
                    {
                        name: "midiDevice",
                        type: ArgumentType.identifier,
                        description: "the midi device name"
                    },
                    {
                        name: "midiChannel",
                        type: ArgumentType.pnumber,
                        description: "the midi channel (0..15)"
                    },
                    {
                        name: "controlChange",
                        type: ArgumentType.pnumber,
                        description: "a midi control change number (cc)"
                    },
                    {
                        name: "programChange",
                        type: ArgumentType.pnumber,
                        description: "a midi program change number (pc)"
                    }
                ]
            },
            instrumentConf: {
                name: "instrumentConf",
                usage: "instrumentConf: instrumentName [volume value] [pan value];",
                args: [
                    {
                        name: "instrumentName",
                        type: ArgumentType.identifier,
                        description: "The name of the instrument"
                    },
                    {
                        name: "volume",
                        type: ArgumentType.pnumber,
                        description: "optional: the instrument volume (0..100)<br>e.g.:\"instrumentConf: piano volume 100;\""
                    },
                    {
                        name: "pan",
                        type: ArgumentType.pnumber,
                        description: "optional: the instrument panning (0..100), where 0 means <i>left</i> and 100 means <i>right</i><br>e.g.:\"instrumentConf: piano pan 50;\""
                    },
                ]
            }                            
        }
    }
}