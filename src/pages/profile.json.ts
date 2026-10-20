import profile from '../../data/profile.json';

// Public profile for agents. The email address is deliberately left out.
export const GET = () => {
  const { email, ...pub } = profile;
  return new Response(JSON.stringify(pub, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
