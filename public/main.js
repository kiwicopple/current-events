var SUPABASE_URL = 'https://hlnwelmttxkctyngpgdq.supabase.co'
var SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNTEzNzY4NCwiZXhwIjoxOTQwNzEzNjg0fQ.wy-nis4ob0t5795xtjkbNPOTwP54tAMILAuW4CVIT2Y'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
window.userToken = null

supabase.auth.onAuthStateChange((event, session) => {
  if (event == 'SIGNED_IN') {
    console.log('signed in', session)
    // set the class of div#sign-up to hidden
    document.querySelector('#sign-up').classList.add('hidden')
    document.querySelector('#profile').classList.remove('hidden')
    fetchUser()
  }
  if (event == 'SIGNED_OUT') {
    console.log('signed out', session)
    // set the class of div#profile to hidden
    document.querySelector('#sign-up').classList.remove('hidden')
    document.querySelector('#profile').classList.add('hidden')
  }
})

document.addEventListener('DOMContentLoaded', function (event) {
  var signUpForm = document.querySelector('#sign-up')
  signUpForm.onsubmit = signUpSubmitted.bind(signUpForm)

  var profileForm = document.querySelector('#profile')
  profileForm.onsubmit = updateUser.bind(profileForm)

  var logoutButton = document.querySelector('#logout')
  logoutButton.onclick = logoutSubmitted.bind(logoutButton)
})

const signUpSubmitted = (event) => {
  event.preventDefault()
  const email = event.target[0].value
  console.log('email', email)

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
  document.querySelector('#update').disabled = true
  supabase
    .from('profiles')
    .update({ first_name: name, subscribed })
    .then((response) => {
      console.log('response', response)
    })
    .catch((err) => {
      alert(err.response.text)
    })
    .finally(() => {
      document.querySelector('#update').disabled = false
    })
}

const fetchUser = () => {
  supabase
    .from('profiles')
    .select('first_name, subscribed')
    .eq('id', supabase.auth.user().id)
    .single()
    .then((response) => {
      console.log('response', response)
      if (response.error) {
        alert(response.error.message)
      }
      if (response.data.first_name) {
        document.querySelector('#name').value = response.data.first_name
      }
      if (response.data.subscribed !== undefined) {
        document.querySelector('#subscribed').value = response.data.subscribed
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
