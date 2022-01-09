var SUPABASE_URL = 'https://hlnwelmttxkctyngpgdq.supabase.co'
var SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTEzNzY4NCwiZXhwIjoxOTQwNzEzNjg0fQ.wy-nis4ob0t5795xtjkbNPOTwP54tAMILAuW4CVIT2Y'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
window.userToken = null

document.addEventListener('DOMContentLoaded', function (event) {
  var signUpForm = document.querySelector('#sign-up')
  signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)

  var userDetailsButton = document.querySelector('#update')
  userDetailsButton.onclick = fetchUserDetails.bind(userDetailsButton)

  var logoutButton = document.querySelector('#logout')
  logoutButton.onclick = logoutSubmitted.bind(logoutButton)

  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_IN') {
      // set the class of div#sign-up to hidden
      document.querySelector('#sign-up').classList.add('hidden')
      document.querySelector('#profile').classList.remove('hidden')
    }
    if (event == 'SIGNED_OUT') {
      // set the class of div#profile to hidden
      document.querySelector('#sign-up').classList.remove('hidden')
      document.querySelector('#profile').classList.add('hidden')
    }
  })
})

const signUpSubmitted = (event) => {
  event.preventDefault()
  const email = event.target[0].value

  supabase.auth
    .signIn({ email }, { redirectTo: 'https://currentevents.email/profile' })
    .then((response) => {
      response.error
        ? alert(response.error.message)
        : alert('Check your email for a verification link.')
    })
    .catch((err) => {
      alert(err)
    })
}

const logoutSubmitted = (event) => {
  event.preventDefault()

  supabase.auth
    .signOut()
    .then((_response) => {
      document.querySelector('#access-token').value = ''
      document.querySelector('#refresh-token').value = ''
      alert('Logout successful')
    })
    .catch((err) => {
      alert(err.response.text)
    })
}
const updateUser = (event) => {
  event.preventDefault()

  var name = document.querySelector('#name').value
  var subscribed = document.querySelector('#subscribed').value
  supabase
    .from('profiles')
    .update({ name, subscribed })
    .then((_response) => {
      document.querySelector('#name').value = ''
      document.querySelector('#refresh-token').value = ''
      alert('Logout successful')
    })
    .catch((err) => {
      alert(err.response.text)
    })
    
}
