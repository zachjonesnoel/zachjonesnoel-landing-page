import type { APIRoute } from 'astro';
import profile from '../../data/profile.json';
import talks from '../../data/talks.json';
import writing from '../../data/writing.json';

export const GET: APIRoute = ({ site }) => {
  const base = site!.origin;
  const realTalks = talks.filter(t => !t.id.includes('template'));
  const realWriting = writing.filter(w => !w.id.includes('template'));
  const upcoming = realTalks.filter(t => t.upcoming).sort((a, b) => a.date.localeCompare(b.date));

  const body = `# ${profile.name} (${profile.handle})

> ${profile.title} at ${profile.employer}. ${profile.bio}

Personal site with ${realTalks.length} conference talks and ${realWriting.length} articles/newsletter issues. All content is also available as JSON, which is the easiest way to read everything at once.

## Data (JSON)

- [Talks](${base}/talks.json): every talk with title, conference, date, location, abstract, tags, slides and video links
- [Writing](${base}/writing.json): every article and newsletter issue with title, date, platform, URL, tags and excerpt
- [Profile](${base}/profile.json): bio, socials, shows and consulting areas

## Pages

- [Home](${base}/): overview
- [Talks](${base}/talks): talks list and map
- [Writing](${base}/writing): articles and newsletter
- [Shows](${base}/shows): newsletter, YouTube show and livestream
${upcoming.length ? `\n## Upcoming talks\n\n${upcoming.map(t => `- ${t.date}: ${t.title} (${t.conference}, ${t.location.city})`).join('\n')}\n` : ''}
## Elsewhere

${Object.entries(profile.socials).map(([k, u]) => `- [${k}](${u})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
