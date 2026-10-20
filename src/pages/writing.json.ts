import writing from '../../data/writing.json';

// Machine-readable writing list (articles, newsletter issues): newest first, template rows removed.
export const GET = () => {
  const items = writing.filter(w => !w.id.includes('template')).sort((a, b) => b.date.localeCompare(a.date));
  return new Response(JSON.stringify(items, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
