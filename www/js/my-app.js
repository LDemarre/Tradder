// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    { path: '/about/', url: 'about.html', },
    { path: '/registro/', url: 'registro.html', },
    { path: '/ingreso/', url: 'ingreso.html' },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

//Variables de firestore
var db = firebase.firestore();
var colUser = db.collection("Users");

//Función de registro
function register() {
  var name = $$('#name').val();
  var email = $$('#email').val();
  var password = $$('#password').val();
  var tel = $$('#tel').val();
  var gender = $$('#gender').val();
  var date = $$('#date').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);
      // ...

      passOfCollection = email;

      data = {
        name: name,
        email: email,
        password: password,
        tel: tel,
        gender: gender,
        date: date,
        rol: "User"
      }

      colUser.doc(passOfCollection).set(data)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      console.log(error.code);
      console.log(error.message);
    });
}

//Función de ingreso
function login() {
  var email = $$('#Lemail').val();
  var password = $$('#Lpassword').val();

  console.log(email, password);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      console.log("Bienvenid@!!! " + email);
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.error(errorCode);
      console.error(errorMessage);
    });

}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
  console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('.convert-form-to-data').on('click', register);
})

$$(document).on('page:init', '.page[data-name="ingreso"]', function (e) {
  $$('.convert-form-to-data').on('click', login);
})

//slider
$$('#preNext').click(function () {
  var width = $$('.swiper-slide').width();
  width -= width * 2;

  $$('#slider').css('transform', 'translate3d(' + width + 'px, 0px, 0px)');
  $$('#slider').css('transition', '.5s');
});