const User = require("../models/User");

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
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: "server error user has not been created" });
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
  try {
      const id = req.params.id;
      await User.update(req.body, { where: { id: id } });
      res.status(200).json({ message: "User updated !" });
    } catch (err) {
      res.status(500).json({ message: "server error the user has not been updated !" });
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

  module.exports = {
    getAll,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    updateUserByEmail,
  }