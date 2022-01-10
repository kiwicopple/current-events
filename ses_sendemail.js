// Load the AWS SDK for Node.js
var AWS = require('aws-sdk')
const moment = require('moment')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const html = fs.readFileSync(__dirname + '/public/index.html', 'utf8')
var today = moment().subtract(1, 'day')


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
AWS.config.update({ region: 'us-east-1' })


async function fetchEmails() {
    const { data, error } = await supabase.from('subscribers').select('email')
    if (error) { throw new Error(error.message) }
    return data.map(x => x.email)
}

async function sendEmail () {
    try {
      const Source = 'no-reply@currentevents.email'
      const ReplyToAddresses = ['no-reply@currentevents.email']
      const ToAddresses = await fetchEmails()

      // Create sendEmail params
      var params = {
        Destination: {
          ToAddresses,
        },
        Source,
        ReplyToAddresses,
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: 'UTF-8',
              Data: html,
            },
            Text: {
              Charset: 'UTF-8',
              Data: 'Text not available. See latest current events at https://currentevents.email',
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: `Current Events: ${today.format('dddd DD MMMM YYYY')}`,
          },
        },
      }

      // Create the promise and SES service object
      var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise()

      // Handle promise's fulfilled/rejected states
      sendPromise
        .then(function (data) {
          console.log(data.MessageId)
        })
        .catch(function (err) {
          console.error(err, err.stack)
        })
    } catch (error) {
        console.log('error.message', error.message)
    }
}

sendEmail()