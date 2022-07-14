const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } =  require('../../utils/auth');
const { User, Group, Membership, sequelize } = require('../../db/models');
const { validateSignup } = require('../../utils/validateAll');

const router = express.Router();

  //Sign up
  router.post('/signup', validateSignup, async (req, res) => {
      const { email, password, firstName, lastName} = req.body;

      const checkEmail = await User.findOne({ where: { email } });

        if(checkEmail) {
        let err = new Error('User already exists');
        err.status = 403,
        err.errors = {
          email: "User with that email already exists"
        }
        throw err;
      }

      const user = await User.signup({ email, password, firstName, lastName});
      await setTokenCookie(res, user);
      const { token } = req.cookies;

      return res.json({
          ...user.toSafeObject(),
          token
      });
  });

  //Get Current User
router.get('/current', restoreUser, (req, res) => {
    const { user } = req;

    if(user){
        return res.json(
           user.toSafeObject()
        );
    } else return res.json({});
  });

  //Get all Groups joined or organized by current user
  router.get('/current/groups', requireAuth, async (req, res) => {
    const { user } = req;

    const Groups = await Group.findAll({
    include: [
      {
        model: Membership,
        where: {memberId: user.id},
        attributes: []
      }
    ],
    attributes: [
      'id',
      'organizerId',
      "name",
      "about",
      "type",
      "private",
      "city",
      "state",
      "previewImage",
      "createdAt",
      "updatedAt",
      [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"], //numMembers count is wrong
    ],
  group: ["Group.id"]
  });

  // const Groups = await Group.findAll({
  //   include: [{
  //     model: Membership,
  //     where: {memberId: user.id},
  //     attributes: []
  //     }]
  //   });

  // const Groups = await Membership.findAll({
  //   where: {memberId: user.id},
  //   include: [{
  //     model: Group
  //   }],
  //   attributes: []
  // })

    return res.json({
      Groups
    })
  });


module.exports = router;
