// Regular expression to check if string is a valid UUID
const regexExp =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

// Validate id
const validateId = (id) => {
  return regexExp.test(id);
};

// Validate email
const validateEmail = (email) => {
  if (email === 0 || email === false)
    return { eng: "Email must be a string", esp: "Email formato no válido" };
  if (!email) return { eng: "Email is missing", esp: "Email es requerido" };
  if (typeof email !== "string")
    return { eng: "Email must be a string", esp: "Email formato no válido" };
  if (email.split("@").length !== 2)
    return { eng: "Email format is not valid", esp: "Email formato no válido" };
  if (email.split("@")[1].split(".").length < 2)
    return { eng: "Email format is not valid", esp: "Email formato no válido" };
  for (s of email.split("@")[1].split(".")) {
    if (hasSymbol(s))
      return {
        eng: "Email format is not valid",
        esp: "Email formato no válido",
      };
    if (hasNumber(s))
      return {
        eng: "Email format is not valid",
        esp: "Email formato no válido",
      };
  }
  if (email.length > 30) {
    return {
      eng: "Email must be 30 characters length or less",
      esp: "Email debe tener 30 caracteres o menos",
    };
  }

  return false;
};

// Validate password
const validatePassword = (password) => {
  if (!password)
    return { eng: "Password is missing", esp: "Contraseña es requerida" };
  if (typeof password !== "string")
    return {
      eng: "Password must be a string",
      esp: "Contraseña formato no válido",
    };
  if (password.length < 8)
    return {
      eng: "Password must be at least 8 characters long",
      esp: "Constraseña debe tener mínimo 8 caracteres",
    };
  if (!hasCapitalLetter(password))
    return {
      eng: "Password must have one capital letter",
      esp: "Contraseña debe tener una mayúscula",
    };
  if (!hasNumber(password))
    return {
      eng: "Password must have one number",
      esp: "Contraseña debe tener un número",
    };
  if (!hasSymbol(password))
    return {
      eng: "Password must have one symbol",
      esp: "Contraseña debe tener un simbolo",
    };
  if (!hasSmallLetter(password))
    return {
      eng: "Password must have one small letter",
      esp: "Contraseña debe tener una minúscula",
    };
  if (password.length > 30) {
    return {
      eng: "Password must be 30 characters length or less",
      esp: "Contraseña debe tener 30 caracteres o menos",
    };
  }
  return false;
};

// Validate password confirmation
const validatePasswordConfirmation = (password, password2) => {
  if (!password2)
    return {
      eng: "Password Confirmation is missing",
      esp: "Confirmación de contraseña es requerida",
    };
  if (password !== password2)
    return {
      eng: "Password and Password Confirmation not match",
      esp: "Las contraseñas no coinciden",
    };

  return false;
};

/******************************* */

const hasCapitalLetter = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (capitalLetters.includes(c)) {
      return true;
    }
  }

  return false;
};

const hasSmallLetter = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (smallLetters.includes(c)) {
      return true;
    }
  }

  return false;
};

const hasNumber = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (nums.includes(c)) {
      return true;
    }
  }

  return false;
};

const hasSymbol = (password) => {
  const passwordToArray = Array.from(password);

  for (c of passwordToArray) {
    if (symbols.includes(c)) {
      return true;
    }
  }

  return false;
};

const smallLetters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const capitalLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

const symbols = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "<",
  ">",
  ".",
  ",",
  "?",
  "/",
  "\\",
  "|",
  "=",
  "+",
  "-",
];

// Validates page
const validatePage = (page) => {
  if (page !== "0" && !parseInt(page)) {
    return true;
  }
  return false;
};

// Validate Username
const validateUsername = (username) => {
  if (username.length > 20) {
    return {
      eng: "Username must be 20 characters length or less",
      esp: "Username debe tener 20 caracteres o menos",
    };
  }
  return false;
};

// Validate State
const validateState = (state) => {
  if (state.length > 50) {
    return {
      eng: "State must be 50 characters length or less",
      esp: "State debe tener 50 caracteres o menos",
    };
  }
  return false;
};

module.exports = {
  validateUsername,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateId,
  validatePage,
  validateState,
};
