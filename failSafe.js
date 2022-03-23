let leadTrackingId = getFromLS('lead_tracking_id');

async function trackLead() {
    // check to see if there is
    if (leadTrackingId) {
        // need to parse the leadTrackingId, becasue getting it from LS, will be a string
        if (isNaN(parseInt(leadTrackingId))) {
            // this means that the lead_tracking_id isn't valid
            // delete it
            clearFromLS('lead_tracking_id');
            // recurse this function to get a new lead_tracking_id
            return trackLead();
        }
    } else {
        // need to generate an id for the lead
        // first, get ipv4, zip, country, city, state, lat, lng
        let userData = await fetch('https://geolocation-db.com/json/', { method: 'GET' })
            .then(res => res.json()).then(res => res)
            .catch(err => console.log(err));
        // get the funnel url
        let funnelUrl = window.location.href;
        // getting the userAgent info
        let userAgent = window.navigator.userAgent;
        // is the user on mobile or not
        let isMobile = userDeviceIsMobile(userAgent) ? 1 : 0;

        // get the params from the url
        const urlParams = new URLSearchParams(window.location.search);

        // now we need to write this lead to the db, should return back an id
        const data = { 
            user_data: userData ? JSON.stringify(userData) : null, 
            calendar_url: funnelUrl, 
            user_agent: userAgent ? userAgent : null, 
            mobile: isMobile,
            fbcid: urlParams.get('fbcid'),
            gclid: urlParams.get('gclid'),
            attr_fp: urlParams.get('attr_fp'),
            utm_source: urlParams.get('utm_source'),
            utm_medium: urlParams.get('utm_medium'),
            utm_campaign: urlParams.get('utm_campaign'),
            utm_term: urlParams.get('utm_term'),
            utm_content: urlParams.get('utm_content') 
        };

        // archive the lead in the db
        let response = await archiveLead(data, false);
        if (!response.lead) return;
        // set the id into localStorage, just in case the user refreshes or revisits the funnel
        saveToLS('lead_tracking_id', response.lead);
        // save the tracking id to global scope
        leadTrackingId = getFromLS('lead_tracking_id');
        return
    }
}

async function updateLead(lastUpdate = false, questionAnswerObj) {
    console.log(questionAnswerObj)
    // if no inputvalues, retrun
    if (!questionAnswerObj) return;
    // if no lead tracking id, just return
    if (!leadTrackingId) return;

    // make sure the input_values is stringified
    const inputValues = typeof questionAnswerObj == 'string' ? questionAnswerObj : JSON.stringify(questionAnswerObj);
    // prep the data to be sent to the leads_backup db
    const data = { id: +leadTrackingId, input_values: inputValues };

    // send data to leads_backup db
    archiveLead(data, true);

    // clear localStorage if there are no more updates, HINT the last slide
    if (lastUpdate === true) {
        clearFromLS('lead_tracking_id');
    }

    return;
}

async function archiveLead(data, isUpdate) {
    try {
        // data should look like
        // { id: 44555, input_values: JSON.stringify({ questionLabel: leadAnswer, etc... }) }
        let config = {
            method: "POST", 
            headers: {"Content-Type": "application/json", "Authorization":"Basic U2hpbmVBZG1pbjIwMjIhOlNoaW5lTm93MjAyMiE"},
            body: JSON.stringify(data)
        }
        let res = await fetch('https://us-west2-adams-website-backend.cloudfunctions.net/archive', config)
            .then(res => !isUpdate && res.json())

        return res;
    } catch (err) {
        console.log(err);
    }
}

function userDeviceIsMobile(userAgent) {
    const toMatch = [ /Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i,/Windows Phone/i ];
    return toMatch.some((toMatchItem) => {
        return userAgent.match(toMatchItem);
    });
}

function saveToLS(key, value) {
    return localStorage.setItem(key, value);
}

function getFromLS(key) {
    return localStorage.getItem(key);
}

function clearFromLS(key) {
    return localStorage.removeItem(key);
}

// initialize fail safe
trackLead();