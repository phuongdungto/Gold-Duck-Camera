const { BadRequest } = require('http-errors');

function validate(body, schema, options = {}) {
    const { error, value } = schema.validate(body, { abortEarly: false, ...options });
    if (error) {
        const errorDetails = error.details.map((deltail) => {
            const { message, path } = deltail;
            const [field] = [...path];
            return { message, field };
        })
        throw new BadRequest(errorDetails);
    }
    return value;
}

module.exports = { validate }