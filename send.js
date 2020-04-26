const sgMail = require('@sendgrid/mail')
const fs = require('fs')
const moment = require('moment')
const html = fs.readFileSync(__dirname + '/public/index.html', 'utf8')
var today = moment().subtract(1, 'day')

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`)
const msg = {
  to: 'pcopplestone@gmail.com',
  from: {
      email: 'today@currentevents.email',
      name: `Current Events`
    },
  subject: `Current Events: ${today.format('dddd DD MMMM YYYY')}`,
  text: 'Text not available. See latest current events at https://currentevents.email',
  html,
}
sgMail.send(msg)
