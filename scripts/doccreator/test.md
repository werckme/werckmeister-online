## Commands
* [device](#device)
* [instrument](#instrument)
* [instrumentConf](#instrumentConf)
* [instrumentDef](#instrumentDef)
* [signature](#signature)
* [tempo](#tempo)
* [volume](#volume)

## `device`
---
Defines a device which can be used when adding instruments (see [instrumentDef](#instrumentDef))<br>
 ### examples<br>
 **positional:** <br>
 `device: MyDevice midi 0 offset 100;`<br>
 **named:**<br>
 `device: _setName=MyDevice _isType=midi _usePort=0 _withOffset=100;`
### parameters
| name | position | description | range |
|:--- |:--- |:--- |:--- |
| setName | 1 | An arbitary name. | [a-zA-Z0-9.]+ |
| isType | 2 | The type of the device. (Currently the only supported type is `midi`) | [midi] |
| usePort | 3 | The port id of your device. You can get a list of your connected devices, by executing `sheetp --list` | 0..N |
| withOffset |  | Defines an offset in milliseconds. Can be used to keep different devices in sync. | 0..N |

<br><br><br>

## `instrument`
---
### examples<br>
 **positional:** <br>
 **named:**
### parameters
| name | position | description | range |
|:--- |:--- |:--- |:--- |
| to | 1 | The volume value. | 0..100 |

<br><br><br>

## `instrumentConf`
---
With `instrumentConf` you are able to setup a specific instrument.<br>
 Following settings can be applied:<br>
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
| for | 1 | The name of the target instrument. This is the only "unique" parameter for this command. All further parameters are specific to its related setting. | - |

<br><br><br>

## `instrumentDef`
---
Adds a new MIDI instrument.<br>
 ### examples<br>
 **positional:** <br>
 `instrumentDef: drums MyDevice 9 0 3;`<br>
 **named:**<br>
 `instrumentDef: _setName=drums _onDevice=MyDevice _ch=9 _cc=0 _pc=3;`
### parameters
| name | position | description | range |
|:--- |:--- |:--- |:--- |
| setName | 1 | An arbitary name. | [a-zA-Z0-9.]+ |
| onDevice | 2 | The device which to use (The name of the device, see [device](#device)). | [a-zA-Z0-9.]+ |
| ch | 3 | The MIDI channel. | 0..15 |
| cc | 4 | A MIDI `control change` value. | 0..127 |
| pc | 5 | A MIDI `program change` value. | 0..127 |

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
| upper | 1 | The upper value of the signature. | - |
| lower | 2 | The lower value of the signature. | - |

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
| bpm | 1 | The tempo bpm value. | - |

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
| to | 1 | The volume value. | 0..100 |

<br><br><br>

