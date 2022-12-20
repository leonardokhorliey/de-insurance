

const convertBNToStableCoin = (amount, decimals) => {
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

    const stringVal = `${whole}.${decimal}`

    return stringVal;
}

const convertStableCoinToBN = (amount, decimals) => {
    const [whole, decimal] = amount.split(".");

    const zeroFill = '0'.repeat(decimals - decimal.length);

    if (whole === '0') {
        whole = ''
        while (decimal.charAt(0) === '0') decimal = decimal.trimLeft()
    }

    const stringVal = `${whole}${decimal}${zeroFill}`;
    return stringVal;
}

export default {
    convertBNToStableCoin,
    convertStableCoinToBN
}