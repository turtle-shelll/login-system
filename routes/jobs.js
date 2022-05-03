const express = require('express');
const router = express.Router()



const {
    getAllJobs,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob,
} = require('../controllers/jobs');



router.route('/').post(createJob);
router.route('/').get(getAllJobs);
router.route('/:id').get(getSingleJob).patch(updateJob).delete(deleteJob);


module.exports = router;