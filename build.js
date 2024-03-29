const request = require('request')
const cheerio = require('cheerio')
const moment = require('moment')
const fs = require('fs')
const LINK_COLOR = '#2a2a8d'
const SUBSCRIBE_LINK = 'https://currentevents.email/profile'
const UNSUBSCRIBE_LINK = 'https://currentevents.email/profile'

const YESTERDAY = moment().subtract(1, 'day')
const currentMonth = YESTERDAY.format('MMMM_YYYY')
const URL_TO_PARSE = `https://en.wikipedia.org/wiki/Portal:Current_events/${currentMonth}`

const cleanseLinks = ($) => {
  return $('a').each(function () {
    var oldHref = $(this).attr('href')
    var newHref =
      !!oldHref && oldHref.charAt(0) == '/' ? 'https://wikipedia.org' + oldHref : oldHref
    $(this).attr('href', newHref)
    $(this).attr('target', '_blank')
  })
}
const styleHeaders = ($) => {
  return $('[role=heading]').each(function () {
    $(this).attr(
      'style',
      `font-family:Avenir,Helvetica,calibri,sans-serif;font-size:18px;font-weight:bold;`
    )
  })
}
const styleLists = ($) => {
  return $('ul').each(function () {
    $(this).attr(
      'style',
      `font-family:Avenir,Helvetica,calibri,sans-serif;font-size:14px;margin:4px;padding-left:12px;`
    )
  })
}
const styleLinks = ($) => {
  return $('a').each(function () {
    $(this).attr(
      'style',
      `font-family:Avenir,Helvetica,calibri,sans-serif;font-size:14px;text-decoration:none;color:${LINK_COLOR};`
    )
  })
}

const template = (content, currentDate) => {
  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Current Events: ${currentDate.format('D MMMM YYYY')}</title>
    <style>
    @media only screen and (max-width: 620px) {
      table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      table[class=body] p,
            table[class=body] ul,
            table[class=body] ol,
            table[class=body] td,
            table[class=body] span,
            table[class=body] a {
        font-size: 16px !important;
      }
      table[class=body] .wrapper,
            table[class=body] .article {
        padding: 10px !important;
      }
      table[class=body] .content {
        padding: 0 !important;
      }
      table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
      }
      table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      table[class=body] .btn table {
        width: 100% !important;
      }
      table[class=body] .btn a {
        width: 100% !important;
      }
      table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }

    /* -------------------------------------
        PRESERVE THESE STYLES IN THE HEAD
    ------------------------------------- */
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
        line-height: 100%;
      }
      .apple-link a {
        color: inherit !important;
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        text-decoration: none !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
      }
      .btn-primary table td:hover {
        background-color: #34495e !important;
      }
      .btn-primary a:hover {
        background-color: #34495e !important;
        border-color: #34495e !important;
      }
    }
    </style>
  </head>
  <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
      <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
          <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
              Wikipedia's current events, delivered daily to your inbox.
            </span>
            <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">

              <!-- START MAIN CONTENT AREA -->
              <tr style="border-bottom:1pt solid black;">
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 24px; font-weight:bold; vertical-align: top;">
                        Current Events: ${currentDate.format('D MMMM YYYY')}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 16px; vertical-align: top;font-style:italic;">
                        Wikipedia's current events, delivered daily to your inbox.
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 14px; vertical-align: top;">
                        ---
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 14px; vertical-align: top;">
                        View on <a href="https://en.wikipedia.org/wiki/Portal:Current_events/${currentDate.format(
                          'MMMM_YYYY'
                        )}" target="_blank" style="text-decoration: none;color:${LINK_COLOR};">Wikipedia →</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 14px; vertical-align: top; ">
                        Support Wikipedia? <a href="https://donate.wikimedia.org/wiki/Ways_to_Give"  style="text-decoration: none;color:${LINK_COLOR};" target="_blank">Donate →</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 14px; vertical-align: top; ">
                        Not yet a subscriber? <a href="${SUBSCRIBE_LINK}"  style="text-decoration: none;color:${LINK_COLOR};" target="_blank">Subscribe → </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                        ${content}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                  <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                    
                    <tr>
                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                        ----
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 14px; vertical-align: top;">
                        Made by <a href="https://twitter.com/kiwicopple" style="text-decoration: none; color: ${LINK_COLOR}; ">kiwicopple</a>.
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Avenir','Helvetica Neue',Helvetica,'Lucida Grande',sans-serif; font-size: 14px; vertical-align: top;">
                        Missed a day? <a href="https://currentevents.email/${moment(currentDate)
                          .subtract(1, 'days')
                          .format('YYYY/MMMM/D')
                          .toLowerCase()}" style="text-decoration: none; color:${LINK_COLOR};">See previous → </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
              <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                <tr>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: none; border-radius: 5px; text-align: center; margin:5px;"> 
                        <a href="https://twitter.com/intent/tweet?url=https://currentevents.email/${moment(
                          currentDate
                        )
                          .format('YYYY/MMMM/D')
                          .toLowerCase()}&text=Today's current events: " target="_blank" style="margin: 0;margin-right:2%;width:98%; display: inline-block; color: #ffffff; background-color: #1DA1F2; border: solid 1px #1DA1F2; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold;  padding: 12px 25px; text-transform: capitalize;">
                            Share on Twitter → 
                        </a> 
                    </td>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: none; border-radius: 5px; text-align: center; margin:5px;"> 
                        <a href="${SUBSCRIBE_LINK}" target="_blank" style="margin: 0;margin-left:2%;margin-right:2%;width:98%;display: inline-block; color: #ffffff; background-color: ${LINK_COLOR}; border: solid 1px ${LINK_COLOR}; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; padding: 12px 25px; text-transform: capitalize;">
                            Subscribe → 
                        </a> 
                    </td>
                    <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: none; border-radius: 5px; text-align: center; margin:5px;"> 
                        <a href="${UNSUBSCRIBE_LINK}" target="_blank" style="margin: 0;margin-left:2%;width:98%;display: inline-block; color: #ffffff; background-color: ${LINK_COLOR}; border: solid 1px ${LINK_COLOR}; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; padding: 12px 25px; text-transform: capitalize;">
                            Unsubscribe → 
                        </a> 
                    </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`
}

const makeDirectory = (folderPath) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(folderPath, { recursive: true }, (err) => {
      if (err) return reject(err)
      else return resolve(true)
    })
  })
}

request(URL_TO_PARSE, async (err, response, body) => {
  if (err) throw new Error('Something went wrong', err)

  const $ = cheerio.load(body)
  $('*').removeAttr('style')
  cleanseLinks($)
  styleHeaders($)
  styleLists($)
  styleLinks($)

  var a = moment().startOf('month').format('YYYY-MM-DD')

  // If you want an exclusive end date (half-open interval)
  for (var m = moment(a); m.isBefore(YESTERDAY); m.add(1, 'days')) {
    const currentDayEvents = $('.description', `div#${m.format('YYYY_MMMM_D')}`)
    const directory = `./public/${m.format('YYYY/MMMM')}`
    const filename = `${m.format('D')}.html`
    let created = await makeDirectory(directory)
    fs.writeFileSync(`${directory}/${filename}`, template(currentDayEvents.html(), m))
    if (m.isSame(YESTERDAY, 'day')) {
      console.log('index', `div#${m.format('YYYY_MMMM_D')}`)
      fs.writeFileSync(`./public/index.html`, template(currentDayEvents.html(), m))
    }
  }
})
