// @ts-nocheck
'use strict';

const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const express = require('express');

function setupMiddleware(app) {
    app.use(cors());
    app.use(express.json({
        verify: (req, _res, buffer) => {
            req.rawBody = buffer.toString('utf8');
        }
    }));

    // Rate limiting for mutation endpoints (POST/PUT/DELETE)
    const mutationLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 30,             // 30 requests per minute per IP
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, please try again later.' }
    });
    app.use((req, _res, next) => {
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
            return mutationLimiter(req, _res, next);
        }
        next();
    });

    // Serve static files from client build (production)
    // Assets use content-hash filenames, so they can be cached forever.
    // index.html MUST NOT be cached to ensure fresh builds load immediately.
    const staticOptions = {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }
        }
    };
    // Serve at root (direct port 3001 access)
    app.use(express.static(path.join(__dirname, '../client/dist'), staticOptions));
    // Serve at /dashboard (Tailscale proxy access)
    app.use('/dashboard', express.static(path.join(__dirname, '../client/dist'), staticOptions));
}

module.exports = { setupMiddleware };
