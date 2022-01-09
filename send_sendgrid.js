const sgMail = require('@sendgrid/mail')
const fs = require('fs')
var request = require('request')
const moment = require('moment')
const html = fs.readFileSync(__dirname + '/public/index.html', 'utf8')
var today = moment().subtract(1, 'day')

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

request(
  {
    method: 'GET',
    url: 'https://api.sendgrid.com/v3/marketing/contacts',
    headers: { authorization: `Bearer ${process.env.SENDGRID_API_KEY}` },
  },
  function (error, response, body) {
    if (error) throw new Error(error)
    let json = JSON.parse(body)
    let { result: contacts } = json
    let personalizations = contacts.map((x) => ({
      to: {
        email: x.email,
      },
    }))
    const msg = {
      personalizations,
      from: {
        email: 'no-reply@currentevents.email',
        name: `Current Events`,
      },
      subject: `Current Events: ${today.format('dddd DD MMMM YYYY')}`,
      text: 'Text not available. See latest current events at https://currentevents.email',
      html,
    }
    sgMail.send(msg)
  }
)
