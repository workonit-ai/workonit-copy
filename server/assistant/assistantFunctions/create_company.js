const { Business } = require('../../models/Business');
const Log = require('../../utilities/Log');

exports.create_organization = async (args) => {
    const { name, email, userId, shifts } = args;
    const managerId = userId

    if (!name || !email) {
        throw new Error('name and email are required');
    }

    try {
        // Check if an organization with this name already exists
        const existingBusiness = await Business.findOne({ name });
        if (existingBusiness) {
            return {
                status: 'error',
                message: 'An organization with this name already exists'
            };
        }
        const newBusiness = new Business({
            name,
            email,
            managerId: managerId || null,  // Set to null if not provided
            shifts: shifts || []  // Set to empty array if not provided
        });

        await newBusiness.save();

        Log.info(`Created new organization: ${name} with ID: ${newBusiness._id}`);

        return {
            status: 'success',
            message: 'Organization created successfully',
            data: {
                companyId: newBusiness._id,
                name: newBusiness.name,
                email: newBusiness.email,
                managerId: newBusiness.managerId
            }
        };
    } catch (error) {
        Log.error('Error in create_organization:', error);
        return {
            status: 'error',
            message: 'Failed to create organization',
            error: error.message
        };
    }
};