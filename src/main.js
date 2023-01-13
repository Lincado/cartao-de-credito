import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")


function setCardType (type) {
    const colors = {
        "visa": ["#436D99", "#2D57F2"],
        "mastercard": ["#DF6F29","#C69347"],
        "default": ["black", "gray"]
    }
ccBgColor01.setAttribute("fill", colors[type][0])
ccBgColor02.setAttribute("fill", colors[type][1])
ccLogo.setAttribute("src", `cc-${type}.svg`)
}

//usar console no navegador
globalThis.setCardType = setCardType

// quando usar IMask tem que seguir algumas regras, sempre ler a documentação

const securityCode = document.querySelector("#security-code")
//criando padrão dp CVC
const securityCodePattern = {
    // CVC pode ter até 4 dígitos
    mask: "0000"
}
//compilando o padrão no no input CVC para aceitar até 4 dígitos
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")

const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: { 
        //range para aceitar cartão do ano atual e valer por até 10 anos
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
        
        MM: {
            // Range de para aceitar de 01 até 12 
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        }
    }
}
//compilando o pattern para aceitar apenas do ano atual com validade de até 10 anos
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
//criando padrão de números para através deles identificar se cartão e visa, mastercard ou default
const cardNumberPattern = {
    mask: [
        //expressão regular (regex) para identificar cartão visa
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardType: "visa"
        },

        //expressão regular (regex) para identificar cartão mastercard
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: "mastercard"
        },

        {
            mask: "0000 0000 0000 0000",
            cardType: "default"
        },
    ],
    //dispatch e as funções seguintes são obrigatórias quando for usar dynamicMasked
    dispatch: function (appended, dynamicMasked) {
        //filtra para pegar somente números, se string forem digitadas ele converte para vazio
        const number = (dynamicMasked.value + appended).replace(/\D/, "")
        //dynamicMask.compiledMask é o array de mask (object dentro do array), find é uma High order que pesquisa um item dentro do vetor
        const foundMask = dynamicMasked.compiledMasks.find(function(item) {
            //através dos números digitados, passa pelo regex e retorna (item.regex é o mesmo que numero.regex, ou seja números do cartão que estão sendo digitados)
            return number.match(item.regex)
        })
        return foundMask
    },
}

//compilando o pattern no número do cartão para identical padrão e dizer o tipo de cartão (bandeira)
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)