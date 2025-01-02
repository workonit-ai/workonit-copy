const { Business } = require('../../models/Business');
const Log = require('../../utilities/Log');
const {environmentUrls} = require('../../config');

exports.get_company_link = async (args) => {
    let companyName;
    
    if (typeof args === 'object' && args !== null && args.hasOwnProperty('companyName')) {
        companyName = args.companyName;
    } else if (typeof args === 'string') {
        companyName = args;
    } else {
        throw new Error('Invalid input: companyName is required');
    }
    
    Log.info(`Searching for business: ${companyName}`);
    
    try {
        const business = await Business.findOne({ name: companyName , userId: args.userId }).exec();
        
        if (!business) {
            Log.info(`Business not found: ${companyName}`);
            return { 
                status: 'error',
                message: 'Business not found'
            };
        }
        
        Log.info(`Business found: ${business.name}`);
        var links = [];
        if(environmentUrls.frontend_url) {
            // const link = `${environmentUrls.frontend_url}/${encodeURIComponent(business._id)}/${encodeURIComponent(business.name)}${args.role ? `?role=${args.role}` : ''}`;
            // return {
            //     status: 'success',
            //     message: 'Company link generated successfully',
            //     link: link
            // };
            links = business.roles.map(role => `${environmentUrls.frontend_url}/${encodeURIComponent(business._id)}/${encodeURIComponent(business.name)}?role=${role}}`);
            Log.info(`Company links for each roles has been generated successfully.`);
            console.log(links);
            return{
                status: 'success',
                message: "Company links for each roles has been generated successfully. Tell the user about each role and it's link",
                links
            }
        }

        // var link = `www.workonit.ai/${encodeURIComponent(business._id)}/${encodeURIComponent(business.name)}`;
        links = business.roles.map(role => `www.workonit.ai/${encodeURIComponent(business._id)}/${encodeURIComponent(business.name)}${args.role ? `?role=${role}` : ''}`);
        return {
            status: 'success',
            message: 'Company link generated successfully',
            links
        };
    } catch (error) {
        Log.error(`Error while searching for business: ${error.message}`);
        return {
            status: 'error',
            message: 'An error occurred while generating the company link'
        };
    }
};

