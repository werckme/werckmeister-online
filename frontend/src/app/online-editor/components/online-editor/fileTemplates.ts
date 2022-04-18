export const TmplSheetTemplate = `[
type: template;
name: myTemplate;
instrument: piano; 
{
    <I II III IV V VI VII>1 |
}   
] 
`;

export const TmplChordDef = `X: 			I=0	    		III=4 			V=7
Xmin: 		I=0     		III=3 			V=7
X7: 		I=0     		III=4 			V=7 			VII=10
Xmin7: 		I=0     		III=3 			V=7 			VII=10
`;

export const TmplPitchmap = `"bd": c,,
"sn": d,,
"ht": f#,, 
`;

export const TmplLuaVoicing = `parameters = {}

function isnumber(t) return type(t) == 'number' end

function degreeToPitch(degreeDef, chord)
    return chord.rootPitch + degreeDef.degreeValue
end

function createPitch(chord, degreeDef, octave)
    if degreeDef == nil or degreeDef.degreeValue == nil
    then
        return nil
    end
    return { ["pitch"]= degreeToPitch(degreeDef, chord), ["octave"]=octave }
end

function solve(chord, degrees, parameters)
    local pitches = {}
    for degree, degreeDefs in pairs(degrees)
    do
        if isnumber(degree)
        then
            for idx, degreeDef in pairs(degreeDefs)
            do
                table.insert(pitches, createPitch(chord, degreeDef, degreeDef.octave))
            end
        end
    end
    return pitches
end`;

export const TmplLuaMod = `parameters = {}

function perform(events, params, timeinfo)
    return events
end`;

export const TmplConductionRules = `all() {
    velocity += 0;
}`;