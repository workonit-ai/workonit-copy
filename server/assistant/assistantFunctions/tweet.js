const {tweet_assis, immediate_tweet_assist} = require('../../OauthConnections/TwiterConn')
exports.tweet = async (args)=>{
    if(args.time_to_post === 'immediate'){
        const ans  = await immediate_tweet_assist(args)
        return ans
    }
    else{
        const ans = await tweet_assis(args)
        return ans
    }

}