const User = require("../models/User");
const outils = require("../outils/outils");
const crypto = require("crypto");

const createUser = async (req) => {
  try {
    const adresseMail = req.body.email
    const motDePasse = req.body.password

    if (!adresseMail || !motDePasse) {
      throw new Error("Information manquante");
    }

    const nombreCaractererAleatoire = Math.floor(Math.random() * 20) + 1;
    const grainDeSel = outils.createGrainDeSel(nombreCaractererAleatoire);
    if (!grainDeSel) {
      throw new Error("Erreur lors de la création du grain de sel");
    }

    const mdpHasher = crypto.createHash('sha256').update(motDePasse + grainDeSel).digest('hex');

    const newUtilisateur = {
      email: adresseMail,
      password: mdpHasher,
      salt: grainDeSel,
      role: 'user', 
      tokenAccess: "",
      tokenRefresh: ""
    };

    const user = await User.create(newUtilisateur);
    if (!user) {
      throw new Error("Utilisateur non créé");
    }

    return grainDeSel; 
  }
  catch (err) {
    console.error(err);
    return "";
  }
};

const updateUser = async (req, res, grainDeSel) => {
  try {
    const adresseMail = req.body.email
    const motDePasse = req.body.password
    if (!adresseMail || !motDePasse) {
      throw new Error("Information manquante");
    }

    const mdpHasher = crypto.createHash('sha256').update(motDePasse + grainDeSel).digest('hex');
    if (!mdpHasher) {
      throw new Error("Erreur lors de la création du hash du mot de passe");
    }

    const user = await User.findOne({ where: { email: adresseMail } });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const { issuedAt, deviceFingerprint } = outils.createData(req);
    const expiresInAccess = outils.createExpiresIn();
    const data = `${user.id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
    const { nonce, proofOfWork } = outils.createNonce(data);

    const payloadAccess = {
      userId: user.id, role: user.role,
      issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
      scope: ['read', 'write'], issuer: "authServer",
      deviceFingerprint
    };

    const tokenA = outils.generateToken(payloadAccess);
    const expiresInRefresh = outils.createExpiresIn(false);
    const payloadRefresh = {
      userId: user.id,
      issuedAt,
      expiresIn: expiresInRefresh,
      deviceFingerprint
    };
    const tokenR = outils.generateToken(payloadRefresh);

    await User.update({
      password: mdpHasher,
      tokenAccess: `Bearer ${tokenA}`,
      tokenRefresh: tokenR
    }, { where: { email: adresseMail } });

    res.cookie("tokenAccess", `Bearer ${tokenA}`);
    res.cookie("tokenRefresh", tokenR);
    res.status(201).json({ message: "Utilisateur mis à jour" });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Aucun utilisateur mis à jour" });
  }
};

const register = async (req, res) => {
  try {
    const grainDeSel = await createUser(req);
    if (!grainDeSel) {
      return res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
    await updateUser(req, res, grainDeSel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.destroy({ where: { id: id } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

const login = async (req, res) => {
  try {
    const adresseMail = req.body.email
    const motDePasse = req.body.password
    if (!adresseMail || !motDePasse) {
      throw new Error("Information manquante");
    }

    const user = await User.findOne({ where: { email: adresseMail } });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    const mdpHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
    if (mdpHasher !== user.password) {
      throw new Error("Mauvais mot de passe");
    }

    const { issuedAt, deviceFingerprint } = outils.createData(req);
    const expiresInAccess = outils.createExpiresIn();
    const data = `${user.id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
    const { nonce, proofOfWork } = outils.createNonce(data);

    const payloadAccess = {
      userId: user.id, role: user.role,
      issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
      scope: ['read', 'write'], issuer: "authServer",
      deviceFingerprint
    };

    const tokenA = outils.generateToken(payloadAccess);
    const expiresInRefresh = outils.createExpiresIn(false);
    const payloadRefresh = {
      userId: user.id,
      issuedAt,
      expiresIn: expiresInRefresh,
      deviceFingerprint
    };
    const tokenR = outils.generateToken(payloadRefresh);

    await User.update({
      tokenAccess: `Bearer ${tokenA}`,
      tokenRefresh: tokenR
    }, { where: { email: adresseMail } });

    res.cookie("tokenAccess", `Bearer ${tokenA}`);
    res.cookie("tokenRefresh", tokenR);
    res.status(201).json({ message: "Utilisateur connecté" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Utilisateur non connecté" });
  }
};

module.exports = {
  register,
  deleteUser,
  login,
};
