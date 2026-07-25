import bcrypt from 'bcryptjs';
import path from 'path';
import readline from 'readline';
import { initDatabase, dbGet, dbRun } from '../db/database';
import { logAuditEvent } from '../middleware/auditLogger';

function validatePasswordPolicy(password: string): { valid: boolean; error?: string } {
  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one numeric digit.' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character.' };
  }
  return { valid: true };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function main() {
  console.log('====================================================');
  console.log('⚡ Engiverse Direct Database Admin User Creation Tool');
  console.log('🔒 OWASP Compliant • Direct SQLite Authentication');
  console.log('====================================================\n');

  try {
    await initDatabase();

    // Check command line arguments first: ts-node src/scripts/createAdmin.ts <username> <email> <password> [role]
    const args = process.argv.slice(2);
    let username = args[0];
    let email = args[1];
    let password = args[2];
    let role = args[3] || 'Super Admin';

    if (!username) {
      username = await askQuestion('Enter Admin Username (e.g. engiverse_admin): ');
    }
    if (!email) {
      email = await askQuestion('Enter Admin Email (e.g. chaitanyasoni40@gmail.com): ');
    }
    if (!password) {
      password = await askQuestion('Enter Admin Password (min 12 chars, upper, lower, num, symbol): ');
    }

    username = username.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // 1. Check for forbidden usernames
    const forbiddenUsernames = ['root', 'admin', 'administrator', 'superadmin'];
    if (forbiddenUsernames.includes(username.toLowerCase())) {
      console.error(`\n❌ SECURITY ERROR: Username '${username}' is forbidden for security compliance. Please choose a unique administrative handle.\n`);
      rl.close();
      process.exit(1);
    }

    // 2. Validate password strength
    const pwdCheck = validatePasswordPolicy(password);
    if (!pwdCheck.valid) {
      console.error(`\n❌ PASSWORD SECURITY VIOLATION: ${pwdCheck.error}\n`);
      rl.close();
      process.exit(1);
    }

    // 3. Check for existing username or email
    const existing = await dbGet('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing) {
      console.error(`\n❌ DATABASE ERROR: A user with username '${username}' or email '${email}' already exists in database.\n`);
      rl.close();
      process.exit(1);
    }

    // 4. Hash password with bcrypt cost factor 12
    console.log('\n🔒 Encrypting password using Bcrypt (cost factor 12)...');
    const passwordHash = await bcrypt.hash(password, 12);

    // 5. Insert directly into database
    const result = await dbRun(
      `INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [username, email, passwordHash, role]
    );

    // 6. Log audit event
    await logAuditEvent({
      userId: result.lastID,
      username,
      action: 'DIRECT_DB_ADMIN_CREATED',
      details: `Admin user '${username}' (${role}) inserted directly into SQLite database authentication table.`,
      ipAddress: '127.0.0.1 (CLI Tool)',
      userAgent: 'Engiverse CLI Script',
      severity: 'critical'
    });

    console.log('\n====================================================');
    console.log(`✅ SUCCESS: Admin User '${username}' Created Directly in Database!`);
    console.log(`🆔 User ID: ${result.lastID}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Role: ${role}`);
    console.log(`🌐 You can now log in at: http://localhost:5173/admin`);
    console.log('====================================================\n');

  } catch (err: any) {
    console.error('Fatal CLI Admin Creation Error:', err.message || err);
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();
