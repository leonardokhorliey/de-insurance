

const convertBNToStableCoin = (amount, decimals) => {
    console.log(amount, ' ', decimals)
    let ln = amount.length;

    let whole;
    let decimal;
    let zeroFill = '';

    if (ln <= decimals) {
        whole = '0';
        zeroFill = '0'.repeat(decimals - ln);
        decimal = amount
    } else {
        whole = amount.slice(0, ln - decimals);
        decimal = amount.slice(ln-decimals);
    }

    const stringVal = `${whole}.${zeroFill}${decimal}`

    return stringVal;
}

const convertStableCoinToBN = (amount, decimals) => {
    console.log(amount, ' bro', decimals)
    let [whole, decimal] = amount.split(".");

    if(!decimal) decimal = '0';

    const zeroFill = '0'.repeat(decimals - decimal.length);

    if (whole === '0') {
        whole = ''
        while (decimal.charAt(0) === '0') decimal = decimal.trimLeft()
    }

    const stringVal = `${whole}${decimal}${zeroFill}`;
    return stringVal;
}

const v = {
    convertBNToStableCoin,
    convertStableCoinToBN
}

export default v;