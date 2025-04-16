
function checkPw(inputPw) {
    const passwords = {
        frontDesk: process.env.FRONTDESK_PW,
        security: "sec",
        racer: "rac"
    };

    if (inputPw === passwords.frontDesk) {
        return 'frontDesk';
    } else if (inputPw === passwords.security) {
        return 'security';
    } else if (inputPw === passwords.racer) {
        return 'racer';
    } else {
        return 'invalid';
    }
};

export default checkPw;
