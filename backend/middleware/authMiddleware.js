const outils = require("../src/outils/outils.js");
const User = require("../src/models/User.js");

module.exports = async (req, res, next) => {
    console.log("authMiddleware");
    const { tokenAccess, tokenRefresh } = req.cookies;
    req.auth = null;

    if (!tokenAccess || !tokenRefresh) {
        return next();
    }

    const deviceFingerprint = outils.createDeviceFingerprint(req);

    // changer la partie verif pour intergrer la generation accesstoken avec refreshtoken
    const goodAccessToken = outils.verifyAccessToken(tokenAccess, deviceFingerprint);
    
    if (!goodAccessToken) {
        return next();
    }
    
    const goodRefreshToken = outils.verifyRefreshToken(tokenRefresh, deviceFingerprint);
    if (!goodRefreshToken) {
        return next();
    }

    let tokenBDD = await User.findByPk(goodAccessToken.userId);
    if (!tokenBDD) {
        return next();
    }

    if (tokenBDD.tokenAccess !== tokenAccess) {
        return next();
    }

    if (tokenBDD.tokenRefresh !== tokenRefresh) {
        return next();
    }

    req.auth = { userId: goodAccessToken.userId };

    return next();
}