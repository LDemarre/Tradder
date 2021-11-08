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
    { path: '/pagPrin/', url: 'página_principal.html', },
    { path: '/registro/', url: 'registro.html', },
    { path: '/ingreso/', url: 'ingreso.html' },
    { path: '/ingresoTemp/', url: 'ingresoTemp.html' },
    { path: '/registroTemp/', url: 'registroTemp.html' },
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
  var surname = $$('#surname').val();
  var email = $$('#rEmail').val();
  var password = $$('#rPassword').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);
      // ...

      passOfCollection = email;

      data = {
        name: name,
        surname: surname,
        email: email,
        password: password,
        rol: "User"
      }

      colUser.doc(passOfCollection).set(data)
        .then(() => {
          console.log("Document successfully written!");
          mainView.router.navigate('/registroTemp/');
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
  var email = $$('#lEmail').val();
  var password = $$('#lPassword').val();

  console.log(email, password);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      console.log("Bienvenid@!!! " + email);
      mainView.router.navigate('/ingresoTemp/');
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.error(errorCode);
      console.log(errorMessage);
    });

}

//Función para cerrar sesión
function signOut() {
  firebase.auth().signOut().then(() => {
    mainView.router.refreshPage();
  }).catch((error) => {
    // An error happened.
  });
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  var user = firebase.auth().currentUser;

  if (user) {
    $$('#Ingreso').css('display', 'none');
    $$('#Registro').css('display', 'none');
    $$('#signOut').css('display', 'block');
  } else {
    $$('#Ingreso').css('display', 'block');
    $$('#Registro').css('display', 'block');
    $$('#signOut').css('display', 'none')
  }
})

$$(document).on('page:init', '.page[data-name="página_principal"]', function (e) {
  $$('#signOut').on('click', signOut);
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('#rButton').on('click', register);
})

$$(document).on('page:init', '.page[data-name="ingreso"]', function (e) {
  $$('#lButton').on('click', login);
})

//slider
$$('#preNext').click(function () {
  var width = $$('.swiper-slide').width();
  width -= width * 2;

  $$('#slider').css('transform', 'translate3d(' + width + 'px, 0px, 0px)');
  $$('#slider').css('transition', '.5s');
});