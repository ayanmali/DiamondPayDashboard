async function requestUSDToEuroExchangeRate() {
    const response = await fetch("https://www.xe.com/api/protected/midmarket-converter/", {
        "headers": {
            "authorization": "Basic bG9kZXN0YXI6cHVnc25heA==",
            "sec-ch-ua": "\"Not(A:Brand\";v=\"99\", \"Brave\";v=\"133\", \"Chromium\";v=\"133\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "Referer": "https://www.xe.com/en-ca/currencyconverter/convert/?Amount=1&From=USD&To=EUR",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "method": "GET"
    });

    const data = await response.json();
    return data;
}

async function getExchangeRates() {
    const data = await requestUSDToEuroExchangeRate();
    data['rates']['EUR'];
    return {
        usdToEuro: data['rates']['EUR'] as number,
        euroToUsd: 1 / (data['rates']['EUR'] as number) as number
    }
}

async function requestEtherPrice() {
    
}