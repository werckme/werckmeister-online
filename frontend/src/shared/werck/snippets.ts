export const SnippetInstrument = `--                 name        device   ch cc pc
instrumentDef: myInstrument   myDevice  0  0  0;
instrumentConf: myInstrument volume 100 pan 50;
`;


export const SnippetNotationTrack = `
[
instrument: myInstrument;
{
    -- here we go
}
]`
;

export const SnippetTemplateTrack = `
[
type: template;
name: myTemplate;
instrument: piano; 
{
    -- here we go
}   
] 
`;

export const SnippetSheetTrack = `
[
type: sheet;
{
    -- use a specific template:
    -- /template: myTemplate/
}   
] 
`;