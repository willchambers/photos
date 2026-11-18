# Photos

Will Chambers's photo wall, built on the [Jewel design system](https://github.com/willchambers/jewel-design-system). A static site made with [Eleventy](https://www.11ty.dev/), served by GitHub Pages at **https://willchambers.github.io/photos/**.

It's a GitHub *project* site, so every URL lives under `/photos/`. Content and templates write plain root paths (`/assets/uploads/…`), and the build adds the prefix (`HtmlBasePlugin` in `eleventy.config.js`; `/photos.json` and `/photos.xml` add it themselves from `site.base`).

```
src/
  index.liquid          the wall (/photos/)
  photos/               photo sets (front matter only)
  assets/uploads/       the photos (WebP, 2400px or smaller)
  photos-json.11ty.js   /photos/photos.json, the feed Photostream reads
  photos-rss.11ty.js    /photos/photos.xml, an RSS feed for readers
  _data/site.yml        title, URL and base path (edit by hand)
  _data/profile.yml     headline and intro (edit in /admin)
admin/                  Sveltia CMS
photostream/            the Photostream app, released here from willchambers/photostream
jewel/                  synced copy of the design system; don't edit here
jewel-candidates/       components Jewel doesn't have yet (copies; see willchambers.github.io's GAPS.md)
```

Every push to `main` (including CMS saves and Photostream posts) builds and deploys in about a minute.

## Adding photos

- **From the iPhone:** [Photostream](https://github.com/willchambers/photostream) (private), at `/photos/photostream/`. Publishing a post opens a pull request here and merges it.
- **In a browser:** https://willchambers.github.io/photos/admin/, then **Sign In with Token**.

The token is a fine-grained GitHub token with access to `willchambers/photos`: **Contents: Read and write** for /admin, plus **Pull requests: Read and write** for Photostream. Keep it in the browser or app only; never commit it.

## Working locally

```bash
npm install
npm start
```

Then open http://localhost:8081/photos/.

## Updating the design system

```bash
npm run sync-jewel
```

Copies Jewel's last pushed commit into `jewel/` (`-- -Ref <commit>` for a particular one). Then commit.
