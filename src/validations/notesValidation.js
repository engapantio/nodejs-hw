// src/validations/notesValidation.js

import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) =>
  !isValidObjectId(value) ? helpers.message('Invalid id format') : value;

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().trim().allow(''),
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(2).max(25).default(10),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
      'string.allow': 'Content can be an empty string',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: {...TAGS}`,
      }),
  }),
};

export const updateNoteSchema = {
  ...noteIdSchema,
  // [Segments.PARAMS]: Joi.object({
  //   noteId: Joi.string().custom(objectIdValidator).required(),
  // }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
    }),
    content: Joi.string().min(0).messages({
      'string.base': 'Content must be a string',
      'string.min': 'Content must be at least {#limit}',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'any.only': `Tag must be one of: {TAGS}`,
      }),
  }).min(1),
};
