
parameters = {
    -- the ammount of the staccato mod. Can be between 0 and 100
    { name="amount",           default="50" }
}

function perform(events, params, timeinfo)
    local amount = tonumber(params.amount)
    local factor = 100 - ((amount/100) * 90)
    factor = factor / 100
    for i, event in pairs(events) do
        event.duration = event.duration * factor
    end
    return events
end