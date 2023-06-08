const express = require('express');
const router = express.Router();
const { SubKey } = require('../../models/subKey');
const security = require('./security');
const jwt = require('jsonwebtoken');