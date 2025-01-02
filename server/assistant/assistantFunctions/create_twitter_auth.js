const {create_twitter_auth_assis} = require('../../OauthConnections/TwiterConn')
exports.create_twitter_auth = async (args)=>{
 const ans = await create_twitter_auth_assis(args.user)
 return ans
}