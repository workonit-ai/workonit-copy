const Post = require('../../models/Post');
const postStatus = require('../../constants/postStatus');

exports.create_post = async (args) => {
    console.log('[INFO] saving job in database');
    console.log(args);
    const post = new Post({
        status: postStatus.CREATED,
        post_platform: args.platform,
        platform_group: args.group,
        ...args
    });

    await post.save();
    console.log('[INFO] Post saved successfully:', post._id);

    return {
        status: 'success',
        message: 'Post has been saved to database',
        jobId: post._id
    };
};
