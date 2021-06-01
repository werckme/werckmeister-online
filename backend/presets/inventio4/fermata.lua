require "lua/com/com"

parameters = {}

local t = 0

function perform(events, params, timeinfo)
    local event = events[1]
    local hasFermataTag = contains(event.tags, "fermata")
    if hasFermataTag == false then
        return events
    end
    event.duration = events[1].duration * 1.5
    return events
end