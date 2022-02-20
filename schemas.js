const BaseJoi = require('joi');
BaseJoi.objectId = require('joi-objectid')(BaseJoi);
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.recordSchema = Joi.object({
    record: Joi.object({
        price: Joi.number().required().min(0),
        payer: Joi.objectId().required(),
        date: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        category: Joi.objectId().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().escapeHTML()
    }).required()
});