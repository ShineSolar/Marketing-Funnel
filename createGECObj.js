// create Google Enhanced Conversions Obj

// loop through obj and send not null or not undefined values
// HAS TO BE AN EMAIL, if no email.... what to do? Ask brad
// phone number needs to be full 10 digits with no symbols, except in front we need +1 --> Ex) '+15555555555'
// prefer first name and last name to be first character upper case and rest lower case
// region is state, full state or two letter --> Ex) AR or Arkansas
// postal code needs to full 5 digit code
// country capital --> US <-- Hardcode this


function formatPhoneNumber(phoneNumberString) {
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      let intlCode = '+1';
      return [intlCode, match[2], match[3], match[4]].join('');
    }
    return null;
}

function createGECObj(leadDataObj) {
    // object to send google
    const googleObj = { address: { country: 'US' } };
    // loop through the object, and add neccessary values to the googleObj
    for (let key in leadDataObj) {
        // if the val NOT null or NOT undefined
        if (leadDataObj[key] != null && leadDataObj[key] !== undefined) {
            // set every key to lowercase for easier comparing
            let lowerCaseKey = key.toLowerCase();
            switch(lowerCaseKey) {
                // if the key in the global object is containing the value for the first name
                case 'firstname':
                case 'first_name':
                case 'first name':
                    googleObj['address']['first_name'] = leadDataObj[key];
                    break;
                // if the key in the global object is containing the value for the last name
                case 'lastname':
                case 'last_name':
                case 'last name':
                    googleObj['address']['last_name'] = leadDataObj[key];
                    break;
                // if the key in the global object is containing the value for the email
                case 'email':
                case 'email address':
                case 'emailaddress':
                case 'email_address':
                    googleObj['email'] = leadDataObj[key];
                    break;
                // if the key in the global object is containing the value for the phone number
                case 'phone':
                case 'phone number':
                case 'phone_number':
                case 'phonenumber':
                    googleObj['phone_number'] = formatPhoneNumber(leadDataObj[key]);
                    break;
                // if the key in the global object is containing the value for the address
                case 'address':
                    const street = leadDataObj[key].split(",")[0].trim();
                    const city = leadDataObj[key].split(",")[1].trim();
                    const state = leadDataObj[key].split(",")[2].trim();
                    googleObj['address']['street'] = street;
                    googleObj['address']['city'] = city;
                    googleObj['address']['region'] = state;
                    break;
                // if the key in the global object is containing the value for the zip code
                case 'zip':
                case 'zip_code':
                case 'zipcode':
                    googleObj['postal_code'] = leadDataObj[key];
                    break;
                // else, just break the switch statement
                default:
                    break;
            }
        }
    }

    return googleObj;
}