const translator = require('@vitalets/google-translate-api');

console.log(translator);
const translate2 = async ({text, from, to}) => {
    if(!text || ! to) return {code: 1, msg: "Plese provide text needed to be translated and the target language."};
    code = 0;
    data = "";
    msg = "";
    if(from) {
        try {
            const res = await translator(text, {from,to});
            return {code:0, text: res.text};
        } catch (error) {
            return {code:1, msg: error};
        }
    }
    else {
        try {
            const res = await translator(text, {to});
            return {code:0, text: res.text};
        } catch (error) {
            return {code:1, msg: error};
        }
    }
    }

console.log("example")
console.log(translate2)

async function main() {
    let a = await translate2({
        text: "hello",
        from: "en",
        to: "zh-CN"
    })
    
    console.log("Translate hello to chinese " + a.text)

    let b = await translate2({
        text: "今天是周日",
        to: "en"
    })

    console.log("Translated '今天是周日' to English(with automatic language detection) " + b.text)
    
    let c = await translate2({
        text: "Hi, Nice to meet",
        from: "en",
        to: "es"
    })
    
    console.log("Translated 'Hi, Nice to meet' you to Spanish " + c.text)
}
main()

