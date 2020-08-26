// login register

const express = require('express');
const router = express.Router();
// 这个库依赖太大了，直接干掉
// const bcrypt = require('bcrypt');
const crypto = require('crypto');
const gravatar = require('gravatar');
const User = require('../../models/User');

// @route type: get
// @desc 返回json数据
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'login works' });
})

// @route type: post
// @desc 返回json数据
// @access public
router.post('/register', (req, res) => {
  console.log(res.body);
  // 查询数据库中是否已有邮箱
  User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        return res.status(400).json({
          email: '邮箱已被注册'
        })
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        })
        console.log(newUser);

        newUser.avatar = gravatar.url(newUser.email, {s: '200', r: 'pg', d: 'mm'});
        const ps = crypto.createHash('md5').update(newUser.password).digest('hex');
        newUser.password = ps;
        
        newUser.save()
          .then(user => res.json(user))
          .catch(e => console.log(e));
      }
    })
})

module.exports = router;
