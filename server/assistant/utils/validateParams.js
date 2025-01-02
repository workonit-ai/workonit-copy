exports.validateParameters = (params, requiredParams) => {

    const missingParams = requiredParams.filter((param) => {
        if (!(param in params))
            return true;

        const value = params[param];

        if (typeof value === 'object' && value !== null) {
            return false; // valid if it's an object and not null
        }

        return !(typeof value === 'string' && value.trim() !== '');
    });

    return {
        isValid: missingParams.length === 0,
        missingParams
    };
};
