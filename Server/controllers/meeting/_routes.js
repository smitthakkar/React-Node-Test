const express = require('express');

const router = express.Router();
const auth = require('../../middelwares/auth');

const meeting = require('./meeting');

router.get('/', auth, meeting.index);
router.post('/add', auth, meeting.add);
router.post('/addMany', auth, meeting.addMany);
router.get('/view/:id', auth, meeting.view);
router.put('/edit/:id', auth, meeting.edit);
router.delete('/delete/:id', auth, meeting.deleteData);
router.post('/deleteMany', auth, meeting.deleteMany);


module.exports = router