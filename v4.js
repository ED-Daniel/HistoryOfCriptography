const fs = require('fs')
const path = require('path')

const textFilePath = path.join(__dirname, 'text.txt') // путь к файлу с текстом
const encryptedFilePath = path.join(__dirname, 'encrypted.txt') // путь к файлу для записи зашифрованного текста
const keysFilePath = path.join(__dirname, 'keys.txt') // путь к файлу с ключами

// Чтение текста из файла
function readTextFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return fileContent
}

// Запись зашифрованного текста в файл
function writeEncryptedTextToFile(filePath, encryptedText) {
  fs.writeFileSync(filePath, encryptedText, 'utf-8')
}

function generateKey() {
    // Генерируем случайное число от 0 до 65535
    let randomNumber = Math.floor(Math.random() * 65536)
    // Представляем его в двоичном виде с помощью toString()
    let binaryNumber = randomNumber.toString(2)
    // Дополняем его нулями слева до 16 бит
    while (binaryNumber.length < 16) {
        binaryNumber = "0" + binaryNumber
    }
    // Возвращаем двоичный ключ
    return binaryNumber
}

function generateKeys(textBlocksCount) {
    const keys = []
    for (let i = 0; i < textBlocksCount; i += 1) {
        keys.push(generateKey())
    }
    return keys.join('')
}

function encrypt(text, keys) {
    let encryptedText = ""

    // Разбиваем текст на блоки по 3 символа
    let textBlocks = splitTextToBlocks(text)
    let keysBlocks = splitKeysToBlocks(keys)

    for (let i = 0; i < textBlocks.length; i++) {
        const key = keysBlocks[i]
        // Разбиваем ключ на две части по 8 бит
        const keyA = key.substr(0, 8)
        const keyB = key.substr(8, 8)

        let block = textBlocks[i]
        // Проходим по каждому символу блока и шифруем его
        for (let j = 0; j < block.length; j++) {
            let charCode = block.charCodeAt(j)
            let encryptedCharCode = charCode ^ parseInt(keyA, 2) ^ parseInt(keyB, 2)
            let encryptedChar = String.fromCharCode(encryptedCharCode)
            encryptedText += encryptedChar
        }
    }
    return encryptedText
}

function decrypt(text, keys) {
    let decryptedText = ""

    // Разбиваем зашифрованный текст на блоки по 3 символа
    let encryptedTextBlocks = splitTextToBlocks(text)
    let keysBlocks = splitKeysToBlocks(keys)

    for (let i = 0; i < encryptedTextBlocks.length; i++) {
        const key = keysBlocks[i]
        // Разбиваем ключ на две части по 8 бит
        const keyA = key.substr(0, 8)
        const keyB = key.substr(8, 8)

        let block = encryptedTextBlocks[i]
        // Проходим по каждому символу блока и расшифровываем его
        for (let j = 0; j < block.length; j++) {
            let encryptedCharCode = block.charCodeAt(j)
            let decryptedCharCode = encryptedCharCode ^ parseInt(keyA, 2) ^ parseInt(keyB, 2)
            let decryptedChar = String.fromCharCode(decryptedCharCode)
            decryptedText += decryptedChar
        }
    }
    return decryptedText
}

function splitTextToBlocks(text) {
    let blocks = []
    for (let i = 0; i < text.length; i += 3) {
        let block = text.substr(i, 3)
        blocks.push(block)
    }
    return blocks
}

function splitKeysToBlocks(keys) {
    const keysBlocks = []
    for (let i = 0; i < keys.length; i += 16) {
        const key = keys.substr(i, 16)
        keysBlocks.push(key)
    }
    return keysBlocks
}

let text = readTextFromFile(textFilePath)
let keys = generateKeys(splitTextToBlocks(text).length)
console.log('Ключи:', keys)
let encryptedText = encrypt(text, keys)

writeEncryptedTextToFile(encryptedFilePath, encryptedText)
writeEncryptedTextToFile(keysFilePath, keys)

console.log("Зашифрованный текст: " + encryptedText)
let decryptedText = decrypt(encryptedText, keys)
console.log("Расшифрованный текст: " + decryptedText)