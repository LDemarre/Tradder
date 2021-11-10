// const { keyup } = require("dom7");

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

//Expresiones regulares - Formulario de registro
const expresiones = {
  user: /^[a-zA-Z0-9\_\-]{4,16}$/, // Letras, numeros, guion y guion_bajo
  name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  password: /^.{4,12}$/, // 4 a 12 digitos.
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  phone: /^\d{7,14}$/ // 7 a 14 numeros.
}

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
  firebase.auth().signOut()
    .then(() => {
      mainView.router.refreshPage();
    }).catch((error) => {
      // An error happened.
    });
}

var bool = false;

function formValidation(e) {
  if (e.target.name == 'Name') {
    if (expresiones.user.test(e.target.value)) {
      $$('#gName').removeClass('grupo-incorrect');
      $$('#gName').addClass('grupo-correct');

      $$('#gName > i').removeClass('form-val-status fa-regular fa-circle-xmark');
      $$('#gName > i').addClass('form-val-status fa-solid fa-check');

      // if (bool) {
      //   $$('#form-error-name').toggleClass('is-active');
      //   $$('#gName > i').css('bottom', '10px');
      //   bool = !bool;
      // }
    }
    else {
      $$('#gName').removeClass('grupo-correct');
      $$('#gName').addClass('grupo-incorrect');

      $$('#gName > i').removeClass('form-val-status fa-solid fa-check');
      $$('#gName > i').addClass('form-val-status fa-regular fa-circle-xmark');

      // if (!bool) {
      //   $$('#form-error-name').toggleClass('is-active');
      //   $$('#gName > i').css('bottom', '45px');
      //   bool = !bool;
      // }
    }
  }
  else if (e.target.name == 'Surname') {
    if (expresiones.user.test(e.target.value)) {
      $$('#gSurname').removeClass('grupo-incorrect');
      $$('#gSurname').addClass('grupo-correct');

      $$('#gSurname > i').removeClass('form-val-status fa-regular fa-circle-xmark');
      $$('#gSurname > i').addClass('form-val-status fa-solid fa-check');
    }
    else {
      $$('#gSurname').removeClass('grupo-correct');
      $$('#gSurname').addClass('grupo-incorrect');

      $$('#gSurname > i').removeClass('form-val-status fa-solid fa-check');
      $$('#gSurname > i').addClass('form-val-status fa-regular fa-circle-xmark');
    }
  }
  else if (e.target.name == 'Email') {
    if (expresiones.user.test(e.target.value)) {
      $$('#gEmail').removeClass('grupo-incorrect');
      $$('#gEmail').addClass('grupo-correct');

      $$('#gEmail > i').removeClass('form-val-status fa-regular fa-circle-xmark');
      $$('#gEmail > i').addClass('form-val-status fa-solid fa-check');
    }
    else {
      $$('#gEmail').removeClass('grupo-correct');
      $$('#gEmail').addClass('grupo-incorrect');

      $$('#gEmail > i').removeClass('form-val-status fa-solid fa-check');
      $$('#gEmail > i').addClass('form-val-status fa-regular fa-circle-xmark');
    }
  }
  else if (e.target.name == 'Password') {
    if (expresiones.user.test(e.target.value)) {
      $$('#gPassword').removeClass('grupo-incorrect');
      $$('#gPassword').addClass('grupo-correct');

      $$('#gPassword > i').removeClass('form-val-status fa-regular fa-circle-xmark');
      $$('#gPassword > i').addClass('form-val-status fa-solid fa-check');
    }
    else {
      $$('#gPassword').removeClass('grupo-correct');
      $$('#gPassword').addClass('grupo-incorrect');

      $$('#gPassword > i').removeClass('form-val-status fa-solid fa-check');
      $$('#gPassword > i').addClass('form-val-status fa-regular fa-circle-xmark');
    }
  }
  else if (e.target.name == 'ConPassword') {
    if (expresiones.user.test(e.target.value)) {
      $$('#gConPassword').removeClass('grupo-incorrect');
      $$('#gConPassword').addClass('grupo-correct');

      $$('#gConPassword > i').removeClass('form-val-status fa-regular fa-circle-xmark');
      $$('#gConPassword > i').addClass('form-val-status fa-solid fa-check');
    }
    else {
      $$('#gConPassword').removeClass('grupo-correct');
      $$('#gConPassword').addClass('grupo-incorrect');

      $$('#gConPassword > i').removeClass('form-val-status fa-solid fa-check');
      $$('#gConPassword > i').addClass('form-val-status fa-regular fa-circle-xmark');
    }
  }
  else {
    if (expresiones.user.test(e.target.value)) {
      $$('#gPhone').removeClass('grupo-incorrect');
      $$('#gPhone').addClass('grupo-correct');

      $$('#gPhone > i').removeClass('form-val-status fa-regular fa-circle-xmark');
      $$('#gPhone > i').addClass('form-val-status fa-solid fa-check');
    }
    else {
      $$('#gPhone').removeClass('grupo-correct');
      $$('#gPhone').addClass('grupo-incorrect');

      $$('#gPhone > i').removeClass('form-val-status fa-solid fa-check');
      $$('#gPhone > i').addClass('form-val-status fa-regular fa-circle-xmark');
    }
  }
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  var user = firebase.auth().currentUser;

  if (user) {
    $$('#home').css('display', 'none');
    $$('#login').css('display', 'none');
    $$('#signUp').css('display', 'none');
    $$('#signOut').css('display', 'block');
  } else {
    $$('#home').css('display', 'block');
    $$('#login').css('display', 'block');
    $$('#signUp').css('display', 'block');
    $$('#signOut').css('display', 'none');
  }

  $$('.hamburger.button.no-ripple').on('click', function () {
    $$('.hamburger.button.no-ripple').toggleClass('is-active');
    $$('.menu-mobile').toggleClass('is-active');
  })
})

$$(document).on('page:init', '.page[data-name="página_principal"]', function (e) {
  $$('#signOut').on('click', signOut);
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('input').on('keyup', formValidation);
  $$('input').on('blur', formValidation);

  $$('#rButton').on('click', function (e) {
    e.preventDefault();
    register();
  });
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