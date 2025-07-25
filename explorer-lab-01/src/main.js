import "./css/index.css"
import IMask from "imask"

//Modifico a cor 1 com a classe cc-bg, dentro busco svg,dentro svg busco o primeiro nivel de g e o path dele//
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

//Dentro da funcao vai estar os tipo de cc e suas cores, e alteracao do tipo dos cartoes//
function setCardType(type) {
const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercad: ["#DF6F29","#C69347"],
    default: ["black","gray"],
}

ccBgColor01.setAttribute("fill",colors[type][0])                          //Seleciono uma propriedade do elemento na posicao 0//
ccBgColor02.setAttribute("fill",colors[type][1])
ccLogo.setAttribute("src",`cc-${type}.svg`)
}

globalThis.setCardType = setCardType                                    //Faco alteracao em tempo real os tipos de cartas no console//


const securityCode = document.querySelector('#security-code')          //Pego o id do input CVC//
const securityCodePattern = {                                         //Criando um padrao da mask,com o objeto e o seu padrao de 4 digitos*/ 
    mask: "0000"
}

const securityCodeMasked = IMask(securityCode,securityCodePattern)   //Passando pelo IMask,e o Imask pediu securitycode e o pattern//

const expirationDate = document.querySelector("#expiration-date")  //Peguei o id do input Expiracao e coloquei o padrao dessa expiracao//
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: { 
        YY: {
            mask: IMask.MaskedRange,                             //Pego a mask do ano atual ate 10 anos pra frente com 2 ultimos caracteres//
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },

        MM: {
            mask: IMask.MaskedRange,                            //Fiz um bloco que vai receber a propriedade mes, coloco a mask dessa propiedade e vai do mes 1 ate 12//
            from: 1,
            to: 12,
        },
    },
}

const expirationDateMasked = IMask(expirationDate,expirationDatePattern)    //A var vai rodar a date de expericao e o padrao dela//

const cardNumber = document.querySelector("#card-number")                  //Pega o input do numero do cartao//
const cardNumberPattern = {                                               //O padrao do numero do cartao, com os digitos do cartao e o regex dos cartoes//
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercad",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    dispatch: function(appended, dynamicMasked) {                                     //Essa funcao roda toda vez que eu comecar a digitar vai ser adicionada,com qual a mask dinamica criada//
        const number = (dynamicMasked.value + appended).replace(/\D/g,"")            //o mask veio vazio e vai ser contatenado com numero e o replace so aceitando digitos//
        const foundMask = dynamicMasked.compiledMasks.find(function(item) {         //Saber se o numero esta batendo com regex//
            return number.match(item.regex)
        })

        console.log(foundMask)

        return foundMask
        },
    }

    const cardNumberMasked = IMask(cardNumber,cardNumberPattern)

    const addButton = document.querySelector("#add-card")                         //Guardo a informacao do button,querendo saber se usuario clicou ou nao nesse botao//
    addButton.addEventListener("click",() => {                                   //Pego meu elemento e adiciono um evento de click e vai disparar uma funcao//
        alert("cartao direcionado!")
    })             
    
    document.querySelector("form").addEventListener("submit", (Event) => {       //Vou selecionar um elemento de form e adicionar um evento de submit, acesso o evento que esta acontecendo//
        Event.preventDefault()                                                  //Quero que o evento nao tenha um comportamento padrao//
    }) 

    const cardHolder = document.querySelector("#card-holder")                  //Pego o input do nome titular//
    cardHolder.addEventListener("input", () =>  {                             //Adiciono um evento que conforme o usuario for digitando no input apareca no cartao e passar uma funcao e dizer o que tem que ser feito//
        const ccHolder = document.querySelector(".cc-holder .value")         //Dentro da const eu vou selecionar um elemento que tem a class cc e value desse elemento//

        ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value       //Quero mudar esse conteudo acessando o value dele e colocando dentro ccholder.innerText, o length uso pra saber quantas letras tem digitadas//
    })                                                                                                 //Se esse conteudo for igual a 0 vou deixar o fulano da silva//

    securityCodeMasked.on("accept",() => {                                       //Eu quero capturar esse conteudo quando ele for aceito//
        updateSecurityCode(securityCodeMasked.value);                           //passo o code e pegar o value que esta dentro dele//
    })

    function updateSecurityCode(code) {                                       //A funcao updatesecuritycode vai receber um codigo//
        const ccSecurity = document.querySelector(".cc-security .value")     //Eu tenho a referencia dentro dela anotei o endereco onde esta este input//
        ccSecurity.innerText = code.length === 0 ? "123" : code             //Acesso o conteudo do codigo,se o tamanho for igual a 0 entao mostra 123, senao mostra o conteudo do code//
    }

    cardNumberMasked.on("accept", () => {                                  //Fica observando o input onde o numero do cartao e digitado e se o conteudo digitado e um conteudo valido vai executar uma funcao//
        const cardType = cardNumberMasked.masked.currentMask.cardtype     //Dentro do cardnumbermasked acesso a sua mascara,e acesso a mascara atual que tem la e o tipo do cartao//
        setCardType(cardType)                                            //Pego a funcao setcardtype e atualizo o tipo de cartao selecionado//
        updatecardNumber(cardNumberMasked.value)                        //Passo o valor ou numero do cartao//
    })

    function updatecardNumber(number){                                                   //Essa funcao vai receber o numero do cartao como parametro//
        const ccNumber = document.querySelector(".cc-number")                           //Eu tenho a referencia e dentro dela o conteudo do input//
        ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number      //Se o usuario nao colocou nenhum numero aparece o numero de exemplo,senao retorna o proprio numero da pessoa que esta digitando//
    }

    expirationDateMasked.on("accept", () => {                       //Pego a data de expiracao, uso essa informacao pra ficar observando e a funcao que deve ser executada//
        updateExpirationDate(expirationDateMasked.value)           //Ele vai retornar o valor valido//
    })

    function updateExpirationDate(date) {                                       //A funcao vai receber a data e coloco a referencia daquela data//
        const ccExpiration = document.querySelector(".cc-extra .value")        //Acesso a class value dentro dessa div cc-extra//
        ccExpiration.innerText = date.length === 0 ? "02/32" : date           //Se o usuario nao tiver colocado nada la,vai continuar o de exemplo que ta la, se tiver digitado mostre o que tiver digitado//
    }