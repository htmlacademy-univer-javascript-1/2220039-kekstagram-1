function getRandomInteger(from, to) {
  if(to<from) {
  return 'конечное число меньше, начального'
  }
  if(from < 0 || to < 0) {
    return 'какое то из чисел отрицательное'
    }
  
  return Math.floor(Math.random() * (to - from)) + from; // взято с https://myrusakov.ru/js-random-numbers.html
}
console.log(getRandomInteger());

function checkLenght (stringToCheck, maxLenght) {
  stringToCheck = String(stringToCheck); //ввёл, чтобы не было проблем с типами данных
  if (stringToCheck.length <= maxLenght) {
  return true
  } else {
    return false
    }
}
console.log(checkLenght());
