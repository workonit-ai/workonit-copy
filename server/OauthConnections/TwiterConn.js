const { OkResponse, BadRequestResponse } = require('express-http-response');
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
  const redirectUri = config.twitter.callback;
const checkTwitterConnection = async (req, res, next) => {
    const  userId = req.user.id;
   
    const twitterConnection = await TwitterConection.findOne({ userId });
    if (!twitterConnection) {
        console.log(userId)
      
        const { url, codeVerifier, state } = client.generateOAuth2AuthLink(config.twitter.callback, {
          scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        });
        let us = new TwitterConection({
            userId:userId,
            codeVerifier,
          state,
          code:'',
          createdAt: new Date(),
        });
        await us.save();
        console.log('authUrl', url, config.twitter.callback);
        return next(new OkResponse({ url }))
    }
    return next(new OkResponse({ d:"twitterConnection" }));
};
const tweet = async (req, res, next) => {
  try{
  const  userId = req.user.id;
  const twitterConnection = await TwitterConection.findOne({ userId });
  // const postdata = new SocialPost({ userID:userId, post_phrasing: req.body.message, post_platform:'twitter',  time_to_post: new Date(Date.now() + 30 * 60 * 1000)});
  // const d = await postdata.save();
  // return next(new OkResponse({ d}));
  if (!twitterConnection) {
        return next(new BadRequestResponse('Invalid state'));
    }
    const { codeVerifier, code } = twitterConnection;
    
    try{
    const { client: loggedClient, accessToken, refreshToken} = await client.loginWithOAuth2({
      code: code,
      codeVerifier: codeVerifier,
      redirectUri,
    });
    await TwitterConection.findOneAndUpdate({ userId }, { accessToken, refreshToken });
    const d = await loggedClient.v2.tweet(req.body.message);
   
    return next(new OkResponse({ d}));
  }catch(e){

    const refreshToken = (await TwitterConection.findOne({ userId })).refreshToken;
    console.log(refreshToken)
    const { client: loggedClient, accessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(refreshToken);
    await TwitterConection.findOneAndUpdate({ userId }, { accessToken, refreshToken: newRefreshToken });
    const twwetdata = await loggedClient.v2.tweet(req.body.message);
    return next(new OkResponse({ accessToken}));
  }
}catch(e){
  console.log(e)
  return next(new BadRequestResponse(e.message));
}
};
const updatecode = async (req, res, next) => {
  try{
  const  userId = req.user.id;
    const code = req.body.code
  const twitterConnection = await TwitterConection.findOne({ userId });
  if(twitterConnection.code.length>4){
    return next(new OkResponse({ d:"alredy has code"}));
  }
  const { client: loggedClient, accessToken, refreshToken} = await client.loginWithOAuth2({
    code: code,
    codeVerifier: twitterConnection.codeVerifier,
    redirectUri,
  });
  const user = await loggedClient.v2.me()
  const username = user.data.username
  const samisid = (await Assistant.findOne({name:'SAMI'})).assistant_id
  const w = await TwitterConection.findOneAndUpdate({ userId }, { code: req.body.code, codeVerifier: twitterConnection.codeVerifier, state: twitterConnection.state, refreshToken , username});
  const notify = new Notification({ userId:userId, assistantId:samisid, title:"Congrats! you've succesfuly connected to twitter", body:"succesfuly connected to twitter", seen:false})
  await notify.save()
  
  return next(new OkResponse({ d:"g"}));
} catch(e){
  console.log(e)
  Log.error(e)
  return next(new BadRequestResponse({d:"d"}));
  }
}

const create_twitter_auth_assis = async (userId) =>{
    const twitterConnection = await TwitterConection.findOne({ userId, code: { $ne: "" } });

    if (!twitterConnection) {
        console.log(userId)
      
        const { url, codeVerifier, state } = client.generateOAuth2AuthLink(config.twitter.callback, {
          scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        });
        let conn = new TwitterConection({
            userId:userId,
            codeVerifier,
          state,
          code:'',
          createdAt: new Date(),
        });
        await conn.save();
        return url
    }
    return "already connected";
  
}
const immediate_tweet_assist = async (args) =>{
  try{
    const userId =args.userId
    const text = args.text
    const post = new SocialPost({ userID:userId, post_phrasing: text, post_platform:'twitter',  time_to_post: new Date()});
    await post.save();
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
        <a href="${config.environmentUrls.frontend_url}/sami" style="display: inline-block; background-color: #29b6d9; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Go back to your chat</a>
        <p style="font-size: 14px; margin-top: 20px;">Best regards,<br>SAMI, Workonit</p>
      </div>
    </body>
  </html>
  `
    await sendEmail("your tweet was sent successfuly", "your tweet was sent successfuly", html, email )
    return {tweet_url:`https://x.com/${username}/status/${tweetdata.data.id}` }
    }
  catch(e){
    Log.error('tweet fail', e)
    await SocialPost.findOneAndUpdate({ _id: post._id }, { post_response_status_code: '400', post_response_message: e.message });
    return 'tweet failed'
  }
}
const tweet_assis = async (args)=>{
  const userId =args.userId
  const text = args.text
  const time = args.time_to_post
  const twitterConnection = await TwitterConection.findOne({ userId });
  if(!twitterConnection){
    return "not authenticated to twitter"
  }
  try{
    const postdata = new SocialPost({ userID:userId, post_phrasing: text, post_platform:'twitter',  time_to_post: time});
    const d = await postdata.save();
    return "saved seccesfuly and sechduled for "+ time
  }catch(error){
    Log.error("error saving post", error)
    return "error saving post"

  }
  
}
module.exports = {
    checkTwitterConnection,
    updatecode,
    tweet,
    tweet_assis,
    create_twitter_auth_assis,
    immediate_tweet_assist

}