import "./css/index.css"
import IMask from "imask"

// Alterando cores do cartão
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#DF6F29"],
    elo: ["#FFCB05", "#00A4E0"],
    default: ["black", "gray"],
  }
  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

// Máscaras de campos
// CVC
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// Data de expiração
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "mm{/}YY",
  blocks: {
    mm: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// Número do cartão
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      cardtype: "mastercard",
      regex: /((^5[1-5]\d{0,2})|(^22[3-7]\d{0,2})|(^2[3-7]\d{0,2}))\d{0,12}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "visa",
      regex: /^4\d{0,15}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "elo",
      regex:
        /(((^5090[40-69])|^636368|^438935|^504175|^451416)\d{0,12})|((^5067|^4576|^4011)\d{0,14})/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const findMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )
    return findMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Funcionalidades
// Adiciionando cartão
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado.")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

// Exibindo cartào conforme input
// Nome do titular
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "Fulano da silva " : cardHolder.value
})

// Número do cartão
cardNumberMasked.on("accept", () => {
  updateCardNumber(cardNumberMasked.value)
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

// Expiração
expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}

// CVC
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}