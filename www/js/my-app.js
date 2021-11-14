// const { keyup } = require("dom7");

// const { name } = require("file-loader");

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
    { path: '/pagPrin/', url: 'pagPrin.html', },
    { path: '/register/', url: 'register.html', },
    { path: '/login/', url: 'login.html' },
    { path: '/loginTemp/', url: 'loginTemp.html' },
    { path: '/registerTemp/', url: 'registerTemp.html' },
    { path: '/profile/', url: 'profile.html' },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

//Expresiones regulares - Formulario de registro
const expression = {
  name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  password: /^.{6,12}$/, // 4 a 12 digitos.
  email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  phone: /^\d{7,14}$/ // 7 a 14 numeros.
}

const fields = {
  Name: false,
  Surname: false,
  Email: false,
  Password: false,
  ConPassword: false,
  Phone: false
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
  var phone = $$('#rPhone').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);
      // ...

      firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
          passOfCollection = email;

          data = {
            rol: "User",
            name: name,
            surname: surname,
            email: email,
            password: password,
            phone: phone
          }

          colUser.doc(passOfCollection).set(data)
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });

          $$('#rForm input').val('');

          $$('#form-message-error').removeClass('is-active');
          $$('#form-message-exito').addClass('is-active');
          setTimeout(() => {
            $$('#form-message-exito').removeClass('is-active');
          }, 5000);

          $$('#rForm .group.group-correct').removeClass('group-correct');

          fields.Name = false;
          fields.Surname = false;
          fields.Password = false;
          fields.ConPassword = false;
          fields.Email = false;
          fields.Phone = false;

          mainView.router.navigate('/registerTemp/');
          // // Email verification sent!
          // // ...
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ..
      console.log(email);
      console.log(error.code);
      console.log(error.message);

      if (errorCode == 'auth/email-already-in-use') {
        $$('#rForm input').val('');
        $$('#rForm .group').removeClass('group-incorrect');
        $$('#rForm .group').removeClass('group-correct');
        $$('#gEmail > i').removeClass('fa-solid fa-check');
        $$('#gEmail > i').removeClass('fa-regular fa-circle-xmark');
        $$('#form-message-error').addClass('is-active');
        $$('#form-message-error span').html('El email ya esta en uso');
      }
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

      $$('#form-message-error-login').removeClass('is-active');
      mainView.router.navigate('/loginTemp/');
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;

      console.error(errorCode);
      console.log(errorMessage);

      if (errorCode == 'auth/user-not-found') {
        $$('#form-message-error-login').addClass('is-active');
        $$('#form-message-error-login span').html('El email no está registrado')
      }
      else if (errorCode == 'auth/wrong-password') {
        $$('#form-message-error-login').addClass('is-active')
        $$('#form-message-error-login span').html('La contraseña es errónea')
      }
      else if (errorCode == 'auth/too-many-requests') {
        // Access to this account has been temporarily disabled due to many failed login attempts.You can immediately restore it by resetting your password or you can try again later.
      }
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

//Función para validar el formulario
function formValidation(e) {
  if (e.target.name == 'Name') {
    fieldValidation(expression.name, e.target, 'Name');
  }
  else if (e.target.name == 'Surname') {
    fieldValidation(expression.name, e.target, 'Surname');
  }
  else if (e.target.name == 'Email') {
    fieldValidation(expression.email, e.target, 'Email');
  }
  else if (e.target.name == 'Password') {
    fieldValidation(expression.password, e.target, 'Password');
    passwordValidation();
  }
  else if (e.target.name == 'ConPassword') {
    passwordValidation();
  }
  else {
    fieldValidation(expression.phone, e.target, 'Phone');
  }
}

//Función para validar los campos
function fieldValidation(expression, input, field) {
  if (expression.test(input.value) && input.value != '') {
    $$('#g' + field).removeClass('group-incorrect');
    $$('#g' + field).addClass('group-correct');

    $$('#g' + field + '> i').removeClass('fa-regular fa-circle-xmark');
    $$('#g' + field + '> i').addClass('fa-solid fa-check');

    $$('#form-error-' + field).removeClass('is-active');

    fields[field] = true;
  }
  else if (input.value == '') {
    $$('#g' + field).removeClass('group-correct');
    $$('#g' + field).removeClass('group-incorrect');
    $$('#form-error-' + field).removeClass('is-active');

    fields[field] = false;
  }
  else {
    $$('#g' + field).removeClass('group-correct');
    $$('#g' + field).addClass('group-incorrect');

    $$('#g' + field + '> i').removeClass('fa-solid fa-check');
    $$('#g' + field + '> i').addClass('fa-regular fa-circle-xmark');

    $$('#form-error-' + field).addClass('is-active');

    fields[field] = false;
  }
}

//Función para validar la contraseña
function passwordValidation() {
  password = $$('#rPassword').val();
  conPassword = $$('#rConPassword').val();

  if (password !== conPassword) {
    $$('#gConPassword').removeClass('group-correct');
    $$('#gConPassword').addClass('group-incorrect');

    $$('#gConPassword > i').removeClass('fa-solid fa-check');
    $$('#gConPassword > i').addClass('fa-regular fa-circle-xmark');

    $$('#form-error-ConPassword').addClass('is-active');

    fields['ConPassword'] = false;
  } else if (conPassword !== '') {
    $$('#gConPassword').removeClass('group-incorrect');
    $$('#gConPassword').addClass('group-correct');

    $$('#gConPassword > i').removeClass('fa-regular fa-circle-xmark');
    $$('#gConPassword > i').addClass('fa-solid fa-check');

    $$('#form-error-ConPassword').removeClass('is-active');

    fields['ConPassword'] = true;
  }
}

//Función para verificar el email
function emailVerification() {
  var user = firebase.auth().currentUser;
  user.reload();

  if (user.emailVerified === true) {
    mainView.router.navigate('/pagPrin/');
  }
}

//Función que muestra el menu de "mi perfil"
function menuToggle() {
  const toggleMenu = $$('.menu-acc');
  toggleMenu.toggleClass('active');
}

function tabs(panelIndex) {
  if (panelIndex === 0) {
    $$('.profile.tabShow').addClass('is-active').siblings().removeClass('is-active');
  }
  else if (panelIndex === 1) {
    $$('.payment.tabShow').addClass('is-active').siblings().removeClass('is-active');
  }
  else if (panelIndex === 2) {
    $$('.subscription.tabShow').addClass('is-active').siblings().removeClass('is-active');
  }
  else if (panelIndex === 3) {
    $$('.privacy.tabShow').addClass('is-active').siblings().removeClass('is-active');
  }
  else {
    $$('.settings.tabShow').addClass('is-active').siblings().removeClass('is-active');
  }
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      $$('#home').css('display', 'none');
      $$('#login').css('display', 'none');
      $$('#signUp').css('display', 'none');
      $$('.hamburger.button.no-ripple').css('display', 'none');
      $$('#myAcc').css('display', 'block');

      $$('#signOut').on('click', signOut);
      $$('#profile').on('click', menuToggle);

      var user = firebase.auth().currentUser;
      var docRef = db.collection('Users').doc(user.email);

      docRef.get()
        .then((doc) => {
          if (doc.exists) {
            $$('.menu-acc h3').html(doc.data().surname + ' ' + doc.data().name);
            $$('#pFullName').val(doc.data().surname + ' ' + doc.data().name);
            $$('#pPhone').val(doc.data().phone);
            $$('#pEmail').val(doc.data().email);
            $$('#pPassword').val(doc.data().password);
          } else {
            console.log('No such document!');
          }
        }).catch((error) => {
          console.log('Error getting document:', error);
        });
    } else {
      $$('#home').css('display', 'block');
      $$('#login').css('display', 'block');
      $$('#signUp').css('display', 'block');
      $$('#myAcc').css('display', 'none');

      $$('.hamburger.button.no-ripple').on('click', function () {
        $$('.hamburger.button.no-ripple').toggleClass('is-active');
        $$('.menu-mobile').toggleClass('is-active');
      })
    }
  });
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('input').on('keyup', formValidation);
  $$('input').on('blur', formValidation);

  $$('#rButton').on('click', function (e) {
    e.preventDefault();

    if (fields.Name && fields.Surname && fields.Password && fields.ConPassword && fields.Email && fields.Phone) {
      register();
    } else {
      $$('#rForm input').val('');
      $$('#rForm .group').addClass('group-incorrect');

      $$('.form-val-status').removeClass('fa-solid fa-check');
      $$('.form-val-status').addClass('fa-regular fa-circle-xmark');

      $$('#form-message-exito').removeClass('is-active');
      $$('#form-message-error').addClass('is-active');

      fields.Name = false;
      fields.Surname = false;
      fields.Password = false;
      fields.ConPassword = false;
      fields.Email = false;
      fields.Phone = false;
    }
  });
})

$$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $$('#lButton').on('click', function (e) {
    e.preventDefault();
    login();
  });
})

$$(document).on('page:init', '.page[data-name="registerTemp"', function (e) {
  $$('#rTempIS').on('click', emailVerification);
})

$$(document).on('page:init', '.page[data-name="profile"', function (e) {
  tabs(0);

  $$('.tab').on('click', function () {
    $$(this).addClass('active').siblings().removeClass('active');
  })
})

//slider
$$('#preNext').click(function () {
  var width = $$('.swiper-slide').width();
  width -= width * 2;

  $$('#slider').css('transform', 'translate3d(' + width + 'px, 0px, 0px)');
  $$('#slider').css('transition', '.5s');
});