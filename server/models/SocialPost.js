const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userID: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: true
},
  post_platform: {
    type: String,
    required: false
  },
  platform_posting_location: {
    type: String,
    required: false
  },
  job_desc_id: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  price: {
    type: Number,
    required: false
  },
  post_phrasing: {
    type: String,
    required: false
  },
  time_to_post: {
    type: Date,
    required: false
  },
  post_response_status_code: {
    type: String
  },
  post_response_message: {
    type: String
  },
  post_url: {
    type: String
  },
  tweetdata:{
    type:Object
  }

}, );

const SocialPost = mongoose.model('SocialPost', postSchema);

module.exports = SocialPost;