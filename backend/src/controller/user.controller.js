const User = require("../models/User");
const outils = require("../outils/outils");
const crypto = require("crypto");

const getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
};

const createUser = async (req, res) => {
  // try {
  //   const user = await User.create(req.body);
  //   res.status(201).json(user);
  // } catch (err) {
  //   res.status(500).json({ message: "server error user has not been created" });
  // }
  try {
    const { adresseMail, role } = req.body;
    if (!adresseMail || !role) {
      throw new Error("Information manquant");
    }

    const nombreCaractererAleatoire = Math.floor(Math.random() * 20) + 1;
    const grainDeSel = outils.createGrainDeSel(nombreCaractererAleatoire);
    if (!grainDeSel) {
      throw new Error("Erreur lors de la création du grain de sel");
    }

    const newUtilisateur = { email: adresseMail, password: "", salt: grainDeSel, role, tokenAccess: "", tokenRefresh: "" };
    if (!newUtilisateur) {
      throw new Error("Information manquant");
    }

    const user = await User.create(newUtilisateur);
    if (!user) {
      throw new Error("Utilisateur non crée");
    }

    res.status(201).json({ grainDeSel: grainDeSel });
  }
  catch (err) {
    res.status(500).json({ message: "Aucun utilisateur crée" });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

const updateUser = async (req, res) => {
  // try {
  //   const id = req.params.id;
  //   await User.update(req.body, { where: { id: id } });
  //   res.status(200).json({ message: "User updated !" });
  // } catch (err) {
  //   res.status(500).json({ message: "server error the user has not been updated !" });
  // }

  try {
    // Récupérer le mot de passe hasher en FrontEnd
    const { adresseMail, grainDeSel, motDePasse, /* mdpHasher */ } = req.body;
    if (!adresseMail || !grainDeSel || !motDePasse) {
      throw new Error("Information manquant");
    }

    // Hasher le mot de passe en FrontEnd
    const mdpHasher = crypto.createHash('sha256').update(motDePasse + grainDeSel).digest('hex');
    if (!mdpHasher) {
      throw new Error("Erreur lors de la création du hash du mot de passe");
    }

    const user = await User.findOne({ where: { email: adresseMail } });
    if (!user) {
      throw new Error("Utilisateur non crée");
    }

    const { issuedAt, deviceFingerprint } = outils.createData(req);
    if (!issuedAt || !deviceFingerprint) {
      throw new Error("Erreur lors de la création des données de token");
    }

    const expiresInAccess = outils.createExpiresIn();
    if (!expiresInAccess) {
      throw new Error("Erreur lors de la création de l'expiration de l'accès");
    }

    const data = `${user.id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
    const { nonce, proofOfWork } = outils.createNonce(data);
    if (!nonce || !proofOfWork) {
      throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
    }

    const payloadAccess = {
      userId: user.id, role: user.role,
      issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
      scope: ['read', 'write'], issuer: "authServer",
      deviceFingerprint
    }

    const tokenA = outils.generateToken(payloadAccess);
    if (!tokenA) {
      throw new Error("Erreur lors de la création du token");
    }

    const expiresInRefresh = outils.createExpiresIn(false);
    if (!expiresInRefresh) {
      throw new Error("Erreur lors de la création de l'expiration du rafraichissement");
    }

    const payloadRefresh = {
      userId: user.id,
      issuedAt,
      expiresIn: expiresInRefresh,
      deviceFingerprint
    };

    const tokenR = outils.generateToken(payloadRefresh);
    if (!tokenR) {
      throw new Error("Erreur lors de la création du token");
    }

    await User.update({
      password: mdpHasher,
      tokenAccess: `Bearer ${tokenA}`,
      tokenRefresh: tokenR
    }, { where: { email: adresseMail } });

    res.cookie("tokenAccess", `Bearer ${tokenA}`/* , { httpOnly: false, secure: false, sameSite: "strict" } */);
    res.cookie("tokenRefresh", tokenR/* , { httpOnly: false, secure: false, sameSite: "strict" } */);
    res.status(201).json({ message: "Utilisateur mis à jour" });
  }
  catch (err) {
    res.status(500).json({ message: "Aucun utilisateur mis à jour" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.destroy({ where: { id: id } });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "user not found" });
  }
};

const updateUserByEmail = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(req.body)
    await User.update(req.body, { where: { email: email } });
    res.status(200).json({ message: "User updated !" });
  } catch (err) {
    res.status(500).json({ message: "server error the user has not been updated !" });
  }
};

const login = async (req, res) => {
  try {
    // Récupérer le mot de passe hasher en FrontEnd
    let { adresseMail, motDePasse, /* mdpHasher */ } = req.body;
    if (!adresseMail /* || !mdpHasher */ || !motDePasse) {
      throw new Error("Information manquant");
    }

    const user = await User.findOne({ where: { email: adresseMail } });
    if (!user) {
      throw new Error("Utilisateur non trouvée");
    }

    // Hasher le mot de passe en FrontEnd
    const mdpHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
    if (!mdpHasher) {
      throw new Error("Erreur lors de la création du hash du mot de passe");
    }

    const compareMdpHasher = crypto.createHash('sha256').update(motDePasse + user.salt).digest('hex');
    if (compareMdpHasher !== user.password) {
      throw new Error("Mauvais mot de passe");
    }

    const { issuedAt, deviceFingerprint } = outils.createData(req);
    if (!issuedAt || !deviceFingerprint) {
      throw new Error("Erreur lors de la création des données de token");
    }

    const expiresInAccess = outils.createExpiresIn();
    if (!expiresInAccess) {
      throw new Error("Erreur lors de la création de l'expiration de l'accès");
    }

    const data = `${user.id}${user.role}${issuedAt}${expiresInAccess}${deviceFingerprint}`;
    const { nonce, proofOfWork } = outils.createNonce(data);
    if (!nonce || !proofOfWork) {
      throw new Error("Erreur lors de la création des données de nonce et proofOfWork");
    }

    const payloadAccess = {
      userId: user.id, role: user.role,
      issuedAt, expiresIn: expiresInAccess, nonce, proofOfWork,
      scope: ['read', 'write'], issuer: "authServer",
      deviceFingerprint
    }

    const tokenA = outils.generateToken(payloadAccess);
    if (!tokenA) {
      throw new Error("Erreur lors de la création du token");
    }

    const expiresInRefresh = outils.createExpiresIn(false);
    if (!expiresInRefresh) {
      throw new Error("Erreur lors de la création de l'expiration du rafraichissement");
    }

    const payloadRefresh = {
      userId: user.id,
      issuedAt,
      expiresIn: expiresInRefresh,
      deviceFingerprint
    };
    const tokenR = outils.generateToken(payloadRefresh);
    if (!tokenR) {
      throw new Error("Erreur lors de la création du token");
    }

    await User.update({
      tokenAccess: `Bearer ${tokenA}`,
      tokenRefresh: tokenR
    }, { where: { email: adresseMail } });

    res.cookie("tokenAccess", `Bearer ${tokenA}`);
    res.cookie("tokenRefresh", tokenR);
    res.status(201).json({ message: "Utilisateur connectée" });
  }
  catch (err) {
    res.status(500).json({ message: "Utilisateur non connectée" });
  }
}

module.exports = {
  getAll,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  updateUserByEmail,
  login,
}