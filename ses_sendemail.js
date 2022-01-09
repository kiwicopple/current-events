// Load the AWS SDK for Node.js
var AWS = require('aws-sdk')
const { createClient } = require('@supabase/supabase-js')


const supabase = createClient(process.env.SUPABASE_URL, 'public-anon-key')


var supabase = supabaseClient.createClient({})
AWS.config.update({ region: 'us-east-1' })

// Create sendEmail params
var params = {
  Destination: {
    /* required */
    CcAddresses: [
      /* more items */
    ],
    ToAddresses: [
      'pcopplestone@gmail.com',
      'copple@supabase.io',
      /* more items */
    ],
  },
  Message: {
    /* required */
    Body: {
      /* required */
      Html: {
        Charset: 'UTF-8',
        Data: 'HTML_FORMAT_BODY',
      },
      Text: {
        Charset: 'UTF-8',
        Data: 'TEXT_FORMAT_BODY',
      },
    },
    Subject: {
      Charset: 'UTF-8',
      Data: 'Test email',
    },
  },
  Source: 'no-reply@currentevents.email' /* required */,
  ReplyToAddresses: ['no-reply@currentevents.email'],
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
