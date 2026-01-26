module.exports = {
    apps: [{
        name: 'anchor-dashboard',
        cwd: '/root/anchor-os/tools/dashboard/server',
        script: 'index.js',

        // Environment
        env: {
            NODE_ENV: 'production',
            PORT: 3001
        },

        // Process Management
        instances: 1,
        exec_mode: 'fork',

        // Auto-restart Configuration
        autorestart: true,
        watch: false,
        max_memory_restart: '200M',
        restart_delay: 1000,           // Wait 1s before restart
        max_restarts: 10,              // Max 10 restarts in min_uptime window
        min_uptime: 5000,              // Consider "started" after 5s uptime

        // Kill timeout
        kill_timeout: 3000,

        // Logging
        log_file: '/root/anchor-os/tools/dashboard/logs/combined.log',
        out_file: '/root/anchor-os/tools/dashboard/logs/out.log',
        error_file: '/root/anchor-os/tools/dashboard/logs/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,

        // Graceful shutdown
        wait_ready: true,
        listen_timeout: 10000
    }]
};
