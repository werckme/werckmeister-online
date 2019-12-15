export const TmplNewSheet = `-- 
-- werck://help/tutorial
--
tempo: 119;
-- midi device(s)
--      name  type id
device: OUT1  midi 1;
-- instrument(s)
--             name  device ch cc pc
instrumentDef: piano   OUT1  2 0 0;

-- track(s)
[
instrument: piano;
{
    <c e g>1 |
}
]
`;

export const TmplSheetTemplate = `
[
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
"ht": fis,, 
`;