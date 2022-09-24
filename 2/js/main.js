const = getRandomInteger = (from, to) => {  
  if(from < 0 || to < 0) {
    return 0
    }
  return Math.floor(Math.random() * (to - from)) + from; // взято с https://myrusakov.ru/js-random-numbers.html
}
getRandomInteger(4,10);


const = checkLenght = (stringToCheck, maxLenght) => {
  stringToCheck = String(stringToCheck); //ввёл, чтобы не было проблем с типами данных
 return stringToCheck.length <= maxLenght ? True : False;
}
checkLenght('sfff', 8);
