const translate = require('./translate').translate;

async function main() {
    let a = await translate({
        text: "hello",
        from: "en",
        to: "zh-CN"
    })
    
    console.log("Translate hello to chinese " + a.text)

    let b = await translate({
        text: "今天是周日",
        to: "en"
    })

    console.log("Translated '今天是周日' to English(with automatic language detection) " + b.text)
    
    let c = await translate({
        text: "Hi, Nice to meet",
        from: "en",
        to: "es"
    })
    
    console.log("Translated 'Hi, Nice to meet' you to Spanish " + c.text)
}
main()

