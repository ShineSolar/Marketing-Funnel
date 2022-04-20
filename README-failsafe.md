# Failsafe

Simple backup of leads and their journey for marketing purposes.

## What does this file do?

This file contains a function that will track leads through their journey when filling out a marketing funnel.
It grabs some standard info, namely:

* calendar_url:
  * The url that this script is included on.
  * This is the url where the form is that the lead is filling out.
* user_data:
  * This is data colected from geolocation api.
  * This is the data in the object:
    * country_code
    * country_name
    * city
    * postal
    * latitude
    * longitude
    * IPv4
    * state
* mobile
  * Tiny int value indicating whether the lead is on mobile or not.
    * i.e. 0 = desktop, 1 = mobile
* input_values
  * Stringified object of all the inputs and the values that the lead has input.
* fbclid
  * This is a uuid that is created and used for matching purposes.
* gclid
  * This is a uuid that google generated for matching purposes.
* attr_fp
  * This is a uuid that attribute genereates for their matching purposes.
* utm_source
  * Standard UTM perameter.
* utm_medium
  * Standard UTM perameter.
* utm_campaign
  * Standard UTM perameter.
* utm_term
  * Standard UTM perameter.
* utm_content
  * Standard UTM perameter.
* created_at
  * When this record was created.

## How do I use this file?

This script exposes these functions:

* trackLead()
* updateLead(lastUpdate, questionAnswerObj)
* archiveLead(data, isUpdate)
* userDeviceIsMobile(userAgent)
* saveToLS(key, value)
* clearFromLS(key)

This will be updated in the future to only expose tracklead and archive lead.

1. Import the script in the HTML head. This makes the functions open to use within the website. It will automatically get most of the user data and assign a lead tracking id.

    ```js
    <head>
      ...
      <script src="https://shinesolar.github.io/Marketing-Funnel/createUniqueID.js" async></script>
    </head>
    ```

2. Call update Lead with false and the data object you wish to add to tracking.
3. Call update lead with true and the data object you wish to add to tracking when the lead converts and you want them to have a new lead tracking id if they return to the funnel.

## How can I access it?

This file tracks leads and puts them into a database in the GCP project Shine Solar (adams-website-backend).\
The name of the SQL instance is: luminary-us-west2\
The name of the database within the instance is: leads_backup\
This database has a table named: leads_archive.

The credentials to access it are the standard credentials needed to access adams-website-backend.

Here is a sample query:

```sql
SELECT * FROM leads_backup.leads_archive ORDER BY leads_archive.id DESC LIMIT 1
```
