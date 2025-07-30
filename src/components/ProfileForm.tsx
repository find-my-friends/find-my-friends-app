'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { upsertStudent } from '@/lib/dbActions';
import './ProfileForm.css';

const defaultProfiles = [
  {
    name: 'Lana K.',
    major: 'Biology',
    year: 'Sophomore',
    hobbies: ['Surfing', 'Drawing'],
    bio: 'Loves beach days and learning about marine life.',
    photo: '/profile-pictures/lana.png',
    owner: 'lana@demo.com',
  },
  {
    name: 'Jason T.',
    major: 'Computer Science',
    year: 'Senior',
    hobbies: ['Coding', 'Gaming', 'Climbing'],
    bio: 'Building full-stack apps and climbing boulders.',
    photo: '/profile-pictures/jason.png',
    owner: 'jason@demo.com',
  },
  {
    name: 'Malia A.',
    major: 'Psychology',
    year: 'Junior',
    hobbies: ['Yoga', 'Writing', 'Hiking'],
    bio: 'Passionate about mindfulness and mental health.',
    photo: '/profile-pictures/malia.png',
    owner: 'malia@demo.com',
  },
];

const ProfileForm: React.FC = () => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const [preview, setPreview] = useState<string | null>(null);
  const [realProfiles, setRealProfiles] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/auth/profiles');
      const data = await res.json();
      setRealProfiles(data);

      const current = data.find((p: any) => p.owner === currentUser);
      if (current) {
        setUserProfile(current);
        setValue('name', current.name);
        setValue('major', current.major);
        setValue('year', current.year);
        setValue('hobbies', Array.isArray(current.hobbies) ? current.hobbies.join(', ') : current.hobbies);
        setValue('bio', current.bio);
        setPreview(current.image);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') redirect('/auth/signin');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const onSubmit = async (data: any) => {
    const hobbiesArray = data.hobbies.split(',').map((h: string) => h.trim());

    await upsertStudent({
      name: data.name,
      major: data.major,
      year: data.year,
      hobbies: hobbiesArray,
      bio: data.bio,
      image: preview || '/profile-pictures/default.png',
      owner: currentUser,
    });

    swal('Success', 'Your profile has been saved', 'success', { timer: 2000 });
    fetchProfiles();
  };

  const allProfiles = [
    ...realProfiles.map((p) => ({ ...p, photo: p.image })),
    ...defaultProfiles,
  ];

  return (
    <div className="profile-page">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <h2 className="text-center mb-3 text-white">
              {userProfile ? 'Edit Your Profile' : 'Create Your Profile'}
            </h2>
            <Card>
              <Card.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" {...register('name')} required />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Major</Form.Label>
                    <Form.Control type="text" {...register('major')} required />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Select {...register('year')} required>
                      <option value="">Select your year</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Hobbies (comma separated)</Form.Label>
                    <Form.Control type="text" {...register('hobbies')} required />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>About Me</Form.Label>
                    <Form.Control as="textarea" rows={3} {...register('bio')} required />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Upload Profile Picture</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileUpload} />
                  </Form.Group>

                  {preview && (
                    <div className="text-center mt-3">
                      <Image
                        src={preview}
                        alt="Profile Preview"
                        width={100}
                        height={100}
                        className="rounded-circle"
                      />
                    </div>
                  )}

                  <input type="hidden" value={currentUser} {...register('owner')} />

                  <div className="d-flex justify-content-between pt-3">
                    <Button type="submit" variant="success">
                      {userProfile ? 'Update Profile' : 'Save Profile'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        reset();
                        setPreview(null);
                        setUserProfile(null);
                      }}
                      variant="secondary"
                    >
                      Reset
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col>
            <h4 className="text-white mb-3">Meet Other Students</h4>
            {allProfiles.map((profile, index) => (
              <Card key={profile.name + index} className="mb-3 p-2">
                <Row className="align-items-center g-3">
                  <Col xs={3} md={2}>
                    <Image
                      src={profile.photo}
                      alt={`${profile.name}'s photo`}
                      width={80}
                      height={80}
                      className="rounded-circle"
                    />
                  </Col>
                  <Col>
                    <h5>{profile.name}</h5>
                    <p className="mb-1"><strong>Major:</strong> {profile.major}</p>
                    <p className="mb-1"><strong>Year:</strong> {profile.year}</p>
                    <p className="mb-1"><strong>Hobbies:</strong> {Array.isArray(profile.hobbies) ? profile.hobbies.join(', ') : profile.hobbies}</p>
                    <p><strong>Bio:</strong> {profile.bio}</p>
                    {profile.owner !== currentUser && (
                      <Button
                        href={`/chat?user=${encodeURIComponent(profile.owner)}`}
                        variant="primary"
                      >
                        Start Chat
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileForm;
