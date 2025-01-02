const TwitterConection = require('../models/TwitterConection');
const User = require('../models/User');
const SocialPost = require('../models/SocialPost');
const {TwitterApi} = require('twitter-api-v2');
const config = require('../config');
const Log = require('../utilities/Log');
const {sendEmail} = require('../utilities/sendgrid');
const Notification = require('../models/Notification');
const Assistant = require('../models/Assistant');
const client = new TwitterApi({
    clientId: config.twitter.clientId,
    clientSecret: config.twitter.clientSecret,
  });

async function getUpcomingTwitterPosts() {
    const now = new Date();
    const nextInterval = new Date(now.getTime() + config.twitter.Social_post_time);
    
    try {
      const posts = await SocialPost.find({
        post_platform: 'twitter',
        time_to_post: {
          $gte: now,
          $lt: nextInterval
        }, 
        post_response_status_code:{
          $nin: ['200', '400']
        }
        
      }).sort({ time_to_post: 1 });
  
      return posts;
    } catch (error) {
      Log.error('Error fetching upcoming Twitter posts:', error)
      
      throw error;
    }
  }
  const awatingPostHandler =async (post) => {
    try{
      const {email} = await User.findById(post.userID)
      const {  refreshToken, username } = await TwitterConection.findOne({ userId: post.userID });
      console.log(refreshToken)
      const { client: loggedClient, accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken)
      await TwitterConection.findOneAndUpdate({ userId: post.userID }, { accessToken, refreshToken: newRefreshToken });
      const tweetdata = await loggedClient.v2.tweet(post.post_phrasing);
  
      await SocialPost.findOneAndUpdate({ _id: post._id }, { post_response_status_code: '200', post_response_message: 'Success', tweetdata:tweetdata.data });
      const html = `
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1DA1F2; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Tweet Sent Successfully</h1>
        </div>
        <div style="padding: 20px; background-color: #f5f8fa; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hey there!</p>
          <p style="font-size: 16px;">Your tweet has been posted successfully. Check it out here:</p>
          <a href="https://x.com/${username}/status/${tweetdata.data.id}" style="display: inline-block; background-color: #1DA1F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Your Tweet</a>
          <p style="font-size: 14px; margin-top: 20px;">Best regards,<br>SAMI, Workonit</p>
        </div>
      </body>
    </html>
    `
      await sendEmail("your tweet was sent successfuly", "your tweet was sent successfuly", html, email )
      const samisid = (await Assistant.findOne({name:'SAMI'})).assistant_id
      const notify = new Notification({ userId:post.userID, assistantId:samisid, title:"Congrats! your tweet was published successfully", body:"successfully published your tweet check it out:"+`https://x.com/${username}/status/${tweetdata.data.id}`, seen:false, date: new Date()})
      await notify.save()
      }
    catch(e){
      Log.error('tweet fail', e)
      await SocialPost.findOneAndUpdate({ _id: post._id }, { post_response_status_code: '400', post_response_message: e.message });
    }
  }
  //a job for sending all the tweets
  const handlecomingtweets = async ()=>{
    const now  = new Date()
    
    const awaitingposts = await getUpcomingTwitterPosts();
    console.log("awaiting posts:", awaitingposts)
    awaitingposts.forEach(
      (post) => {
        const tweetDate = new Date(post.time_to_post)
        setTimeout(awatingPostHandler, tweetDate.getTime()-now.getTime(), post);
      }
    );
  
  }
  module.exports = {
    queryFunction:getUpcomingTwitterPosts,
    handlerFunction:awatingPostHandler,
    name:'Social Posts Job'
  }
  