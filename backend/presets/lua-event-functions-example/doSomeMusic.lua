require "lua/com/com"

parameters = {
    { name="octave", default=0 },
}

function CreateEvent(octave, pitch, duration, tags)
    return {
        ["type"] = "note",
        ["velocity"] = 100,
        ["duration"] = duration,
        ["pitches"] = {
            {
                ["octave"] = octave,
                ["pitch"] = pitch,
            }
        },
        ["tags"] = tags
    }
end

-- "Entry Point"
function execute(params, timeinfo)
    local octave = params["octave"]
    return {
        CreateEvent(octave, 1, 1, {"leise"}),
        CreateEvent(octave, 2, 1, {"leise", "legato"}),
        CreateEvent(octave, 3, 1, {}),
        {
            ["type"] = "rest",
            ["duration"] = 1,
        }
    }
end