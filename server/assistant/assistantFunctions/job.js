const Job = require('../../models/Job');

exports.create_job = async (args) => {
    console.log('[INFO] saving job in database');
    const job = new Job(args);

    await job.save();
    console.log('[INFO] Job saved successfully:', job._id);

    return {
        status: 'success',
        message: 'Job has been saved to database',
        jobId: job._id
    };
};
