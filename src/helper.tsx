/**
 * Returns the token from the cookies
 * or fail if no cookie with token
 */
const getToken = () => {

    let cookies = document.cookie.split(';');
    let ret = '';

    if (cookies[0] != "") {
        cookies.forEach((keyPair) => {
            let subArray: Array<string> = keyPair.split('=');
            let key: string = subArray[0].trim();
            let value: string = subArray[1].trim();

            if (key == "token") ret = value;
        })
    } else return 'fail';

    return ret;
}

export { getToken }