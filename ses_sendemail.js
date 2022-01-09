// Load the AWS SDK for Node.js
var AWS = require('aws-sdk')
const { createClient } = require('@supabase/supabase-js')


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
AWS.config.update({ region: 'us-east-1' })


async function fetchEmails() {
    const { data, error } = await supabase.from('subscribers').select('email')
    return data.map(x => x.email)
}

async function sendEmail () {
  const Source = 'no-reply@currentevents.email'
  const ReplyToAddresses = ['no-reply@currentevents.email']
  const ToAddresses = await fetchEmails()

  // Create sendEmail params
  var params = {
    Destination: {
      CcAddresses: [],
      ToAddresses,
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
    Source,
    ReplyToAddresses,
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
}

sendEmail()