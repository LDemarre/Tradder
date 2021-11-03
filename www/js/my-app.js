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
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");

  // onSuccess Callback
  // This method accepts a Position object, which contains the
  // current GPS coordinates
  //
  var onSuccess = function (position) {
    alert('Latitude: ' + position.coords.latitude + '\n' +
      'Longitude: ' + position.coords.longitude + '\n' +
      'Altitude: ' + position.coords.altitude + '\n' +
      'Accuracy: ' + position.coords.accuracy + '\n' +
      'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
      'Heading: ' + position.coords.heading + '\n' +
      'Speed: ' + position.coords.speed + '\n' +
      'Timestamp: ' + position.timestamp + '\n');
  };

  // onError Callback receives a PositionError object
  //
  function onError(error) {
    alert('code: ' + error.code + '\n' +
      'message: ' + error.message + '\n');
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);
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
        rol: "User"
      }

      console.log('hola');

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

// function login() {
//   var email = $$('#Lemail').val();
//   var password = $$('#Lpassword').val();

//   console.log(email, password);

//   firebase.auth().signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       // Signed in
//       // ...
//       var user = userCredential.user;

//       passOfCollection = email;
//       var docRef = colUser.doc(passOfCollection);

//       docRef.get().then((doc) => {
//         if (doc.exits)
//       })
//     })
//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//     });
// }

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('.convert-form-to-data').on('click', register);
})

$$('#preNext').click(function () {
  var width = $$('.swiper-slide').width() + 50;
  width -= width * 2;

  $$('#slider').css('transform', 'translate3d(' + width + 'px, 0px, 0px)');
  $$('#slider').css('transition', '.5s');
});