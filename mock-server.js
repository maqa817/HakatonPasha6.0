const http = require('http');

const PORT = 8080;

// In-memory database
let users = [
  {
    userId: 'SA-ADMIN',
    email: 'admin@freshguard.com',
    firstName: 'Sübhan',
    lastName: 'Admin',
    filial: 'Mərkəz',
    role: 'SUPER_ADMIN',
    password: 'SuperAdmin!2026',
    active: true
  }
];

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Auth: Login
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { userId, password } = JSON.parse(body);
        // Find user by email or userId
        const user = users.find(u => (u.email === userId || u.userId === userId) && u.password === password && u.active);
        
        if (user) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            accessToken: `mock-jwt-token-${user.userId}`,
            expiresInSeconds: 86400,
            role: user.role,
            displayName: `${user.firstName} ${user.lastName}`
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'İstifadəçi adı və ya şifrə yanlışdır' }));
        }
      } catch (e) {
        res.writeHead(400);
        res.end();
      }
    });
    return;
  }

  // Admin: Fetch Users
  if (req.url.startsWith('/api/admin/users') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  }

  // Admin: Create User
  if (req.url === '/api/admin/users' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const newUser = {
          userId: `U-${Date.now()}`,
          ...payload,
          active: true
        };
        users.push(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (e) {
        res.writeHead(400);
        res.end();
      }
    });
    return;
  }

  // Admin: Update User
  if (req.url.startsWith('/api/admin/users/') && req.method === 'PUT') {
    const userId = decodeURIComponent(req.url.split('/').pop());
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const index = users.findIndex(u => u.userId === userId);
        if (index !== -1) {
          users[index] = { 
            ...users[index], 
            ...payload,
            password: payload.newPassword || users[index].password
          };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(users[index]));
        } else {
          res.writeHead(404);
          res.end();
        }
      } catch (e) {
        res.writeHead(400);
        res.end();
      }
    });
    return;
  }

  // Admin: Deactivate User
  if (req.url.endsWith('/deactivate') && req.method === 'PATCH') {
    const parts = req.url.split('/');
    const userId = decodeURIComponent(parts[parts.length - 2]);
    const index = users.findIndex(u => u.userId === userId);
    if (index !== -1) {
      users[index].active = false;
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404);
      res.end();
    }
    return;
  }

  // Mock Overview
  if (req.url === '/api/admin/overview/summary' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      totalStores: 0,
      monthlyGoodsReceptionsMock: 0,
      totalCriticalAlerts: 0,
      trendNoteAz: 'Sistem aktivdir.',
      stores: []
    }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Mock server running at http://localhost:${PORT}/`);
});
