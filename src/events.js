module.exports = function createEvents({ connectionId, userId }) {
    function on (eventList, msgs, callback) {
        eventList = Array.isArray(eventList) ? eventList : [eventList];
        const includedEvents = Object.keys(msgs);

        for (let index = 0; index < eventList.length; index++) {
            const eventName = eventList[index];

            if (!includedEvents.includes(eventName)) continue;

            const msg = msgs[eventName];
            callback(msg);            
        }
    }

    return {
        on
    }

}