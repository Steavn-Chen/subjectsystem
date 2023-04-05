const express = require('express')
const router = express.Router()
const { Teacher } = require('../../../models')

router.post('/', async (req, res, next) => {
  try {
    const { name, phone, password, email, address, avatar_image, working, account } = req.body
    const checkAccount = await Teacher.findOne({ where: { account: req.body.account }})
    if (checkAccount) {
      return res.json({ status: 'error', message: '這個帳號己經註冊了。' })
    }
    if (!name || !phone || !password || !email || !address || !avatar_image || !working) {
      return res.json({ status: 'error', message: '所有資訊必需填寫。' })
    }
    const data = await Teacher.create({
      name,
      email,
      phone,
      password,
      address,
      avatar_image,
      working,
      account
    })
    res.status(200).json(data.toJSON())
  } catch (err) {
    next(err)
  }
})
router.get('/', async (req, res, next) => {
  try {
    const data = await Teacher.findAll({
      raw: true,
      attributes: {
        exclude: [
          'password',

        ]
      },
    })
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

router.get('/:t_id', async (req, res, next) => {
  try {
    const data = await Teacher.findOne({
      where: {
        id: Number(req.params.t_id)
      },
      attributes: {
        exclude: [
          'password',

        ]
      },
    })
    if (!data) {
      return res.status(404).json({ status: 'error', message: '沒有這個帳號。' })
    }
    res.status(200).json(data.toJSON())
  } catch (err) {
    next(err)
  }
})
router.put('/:t_id', async (req, res, next) => {
  try {
    const [checkAccount, teacher] = await Promise.all([Teacher.findOne({ where: { account: req.body.account } }), Teacher.findOne({ where: { 
      id: Number(req.params.t_id)
    }})])
    if (!checkAccount) {
      return res.json({ status: 'error', message: '沒有這個帳號。' })
    }
    if (Number(checkAccount.id) !== Number(req.params.t_id)) {
      return res.status(200).json({ status: 'error', message: '只能修改自己的帳號。' })
    }
    await teacher.update({...req.body})
    return res.status(200).json({ status: 'success', message: '使用者編輯成功' })
  } catch (err) {
    next(err)
  }
})
router.delete('/:t_id', async (req, res, next) => {
  try {
    const [teacher] = await Promise.all([Teacher.findOne({
      where: {
        id: Number(req.params.t_id)
      }
    })])
    if (!teacher) {
      return res.status(404).json({ status: 'error', message: '沒有這個帳號。' })
    }
    await teacher.destroy({
      where: { id: Number(req.params.t_id) }
    })
    return res.status(200).json({ status: 'success', message: '刪除成功' })
  } catch (err) {
    next(err)
  }
})

module.exports = router