const router = require("express").Router();
const { addUser,loginUsers, logoutUsers,getUserByEmail} = require("../Cotroller/UserData.controller");

// const { authCheck } = require("../middlewares/auth.middleware");


router.post('/add-user', addUser);
router.post('/login', loginUsers);

router.get('/get-user-by-email', getUserByEmail);
router.post('/logout', logoutUsers);

module.exports = router;