export const text = `$USINGS
device: MyDevice midi _isType=webPlayer _useFont="FluidR3-GM"; 

instrumentDef: rhythm _onDevice=MyDevice _ch=0 _pc=0;
instrumentDef: rhythm2 _onDevice=MyDevice _ch=0 _pc=0;
instrumentDef: bass _onDevice=MyDevice _ch=1 _pc=34;
instrumentDef: drums _onDevice=MyDevice _ch=9 _pc=0;
instrumentDef: piano _onDevice=MyDevice _ch=3 _pc=0; -- workaround

tempo: $TEMPO;
[
type: accomp;
{
    $TEMPLATES
    C7 | C7 | Fmaj7 | Fmaj7 | C7 | C7 | G7 | F7 | C7 | G7 |
}
]`;