import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import ProfileForm from '@/components/ProfileForm'; // ✅ This is correct

const ProfilePage = async () => {
  // Protect the page, only logged-in users can access it
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  return (
    <main>
      <ProfileForm />
    </main>
  );
};

export default ProfilePage;
