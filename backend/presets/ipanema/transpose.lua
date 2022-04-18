parameters = {
    { name="semitones",           default="12" }
}
function perform(events, params, timeinfo)
    return events
end

function perform(events, params, timeinfo) 
    local semitones = tonumber(params.semitones)
    for i, event in pairs(events) do
    	
    	for j, pitch in pairs(event.pitches) do
      		pitch.pitch = pitch.pitch + semitones
    	end
    end
    return events
end