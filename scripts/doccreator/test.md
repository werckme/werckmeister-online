## Commands
* [instrumentConf](#instrumentConf)
* [signature](#signature)
* [tempo](#tempo)
* [volume](#volume)

## `instrumentConf`
---
With `instrumentConf` you are able to config a specific instrument.<br>
 Following settings can be used:<br>
  * volume<br>
  * pan<br>
  * voicing strategy<br>
  * mod<br>
  * velocity remap<br>
 ### examples<br>
 #### mixed settings<br>
 **positional:** <br>
 `instrumentConf: piano volume 100 pan 50;`<br>
 **named:**<br>
 `instrumentConf: _for=piano _set=volume _to=50 _set=pan _to=50;`<br>
 #### setup a mod<br>
 **positional:** <br>
 `instrumentConf: piano mod myLuaMod bar; --the bar argument belongs to "myLuaMod"`<br>
 **named:**<br>
 `instrumentConf: _for=piano _set=mod _use=myLuaMod _myLuaModFoo=bar;`<br>
 #### setup a velocity remap<br>
 With `remapVelocity` you are able to change the velocity values behind `ppppp..fffff` for a specific instrument.<br>
 In the example below the velcity for `p` will be set to 100 and the value for `f` will be set to 10.<br>
 The value range is 0..100. (100=127 Midi velocity)<br>
 **named:**<br>
 `instrumentConf: _set=remapVelocity _p=100 _f=10;`<br>
 **positional:**<br>
 `remapVelocity` dosen't supports positional arguments
### parameters
| name | position | description | range |
|:--- |:--- |:--- |:--- |
| for | 0 | The name of the target instrument. This is the only "unique" parameter for this command. All further parameters are specific to its related setting. | - |

<br><br><br>

## `signature`
---
Set the time signature of the current track.<br>
 ### examples<br>
 **positional:** <br>
 `/signature: 3 4/`<br>
 **named:**<br>
 `/signature: _upper=3 _lower=4/`
### parameters
| name | position | description | range |
|:--- |:--- |:--- |:--- |
| upper | 0 | The upper value of the signature. | - |
| lower | 1 | The lower value of the signature. | - |

<br><br><br>

## `tempo`
---
`tempo` defines or changes the current tempo.<br>
 ### examples<br>
 **positional:** <br>
 `tempo: 120;`<br>
 **named:**<br>
 `tempo: _bpm=120;`<br>
 This command can be used as document config:<br>
 `tempo: 120;`<br>
 or within a track<br>
 `/tempo: 120/`<br>
 It is also possible to set diffrent tempo values for several tracks:<br>
 [see here](/manual#Tempo)
### parameters
| name | position | description | range |
|:--- |:--- |:--- |:--- |
| bpm | 0 | The tempo bpm value. | - |

<br><br><br>

## `volume`
---
set the volume of the current track<br>
 ### examples<br>
 **positional:** <br>
 `/volume: 50/`<br>
 **named:**<br>
 `/volume: _to=50/`
### parameters
| name | position | description | range |
|:--- |:--- |:--- |:--- |
| to | 0 | The volume value. | 0..100 |

<br><br><br>

