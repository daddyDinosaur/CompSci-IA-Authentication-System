const express = require('express');
const router = express.Router();
const { SubKey } = require('../../models/subKey');
const { checkApiKey, isAdmin } = require('./security');
const jwt = require('jsonwebtoken');