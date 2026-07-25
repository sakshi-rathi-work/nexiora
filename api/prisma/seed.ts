import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Initializing NEXIORA System Admin...');

  // Create default Admin User if not existing
  const passwordHash = await bcrypt.hash('AdminPassword123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@nexiora.com' },
    update: {},
    create: {
      email: 'admin@nexiora.com',
      passwordHash,
      firstName: 'Nexiora',
      lastName: 'Admin',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log('✅ System Admin initialized successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
