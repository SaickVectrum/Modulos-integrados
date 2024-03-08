document.getElementById('passwordForm').addEventListener('submit', function (e) {
    e.preventDefault();
    validatePassword();
});

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const password = passwordInput.value;

    // Expresiones regulares para evaluar la fortaleza de la contraseña
    const regexLength = /^.{8,}$/;
    const regexUppercase = /[A-Z]/;
    const regexLowercase = /[a-z]/;
    const regexDigit = /\d/;
    const regexSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

    // Validación de longitud y otros requisitos
    if (regexLength.test(password) && regexUppercase.test(password) && regexLowercase.test(password) && regexDigit.test(password) && regexSpecialChar.test(password)) {
        // La contraseña es segura
        passwordError.textContent = '';
        alert('¡Contraseña segura!');
    } else {
        // La contraseña no cumple con los requisitos
        passwordError.textContent = 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.';
    }
}