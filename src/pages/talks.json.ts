import talks from '../../data/talks.json';

// Machine-readable talks list for agents and crawlers: newest first, template rows removed.
export const GET = () => {
  const items = talks.filter(t => !t.id.includes('template')).sort((a, b) => b.date.localeCompare(a.date));
  return new Response(JSON.stringify(items, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
