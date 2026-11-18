// Where Photostream reads and writes.
// dev/server.mjs serves this file with apiBase pointed at its local GitHub
// mock, so development never touches the real repos.

export const config = {
  apiBase: 'https://api.github.com',

  // The private library: every post, published or not. It lives on its own
  // branch so the app's photo commits never mix with code history.
  library: { owner: 'willchambers', repo: 'photostream', branch: 'library' },

  // The public photos site. Published posts land here and go live after its
  // build. It's a GitHub project site at /photos/, and the app is served from
  // its photostream/ folder, so the feed is one level up from the app.
  site: {
    owner: 'willchambers',
    repo: 'photos',
    branch: 'main',
    url: 'https://willchambers.github.io/photos/',
    feed: new URL('../../photos.json', import.meta.url).pathname, // /photos/photos.json, same origin
  },
};
