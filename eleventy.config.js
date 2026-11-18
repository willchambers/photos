import { HtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import yaml from "js-yaml";
import { readFileSync } from "node:fs";

// This is a GitHub project site, served at https://willchambers.github.io/photos/.
// Every root-relative URL in the built HTML gets the /photos/ prefix from
// HtmlBasePlugin, so templates and content keep writing "/assets/…".
// /photos.json and /photos.xml aren't HTML, so they add it themselves (site.base).
const site = yaml.load(readFileSync("src/_data/site.yml", "utf8"));

export default function (eleventyConfig) {
  // _data/*.yml, so the CMS and hand edits both use YAML.
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));

  // Files served as they are. The design system is a synced copy (sync-jewel.ps1);
  // jewel-candidates holds the components this site uses that Jewel doesn't have yet.
  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets",
    "admin": "admin",
    "jewel": "jewel",
    "jewel-candidates": "jewel-candidates",
    // The Photostream app, released here from github.com/willchambers/photostream.
    "photostream": "photostream",
  });

  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Every <img> in the built pages gets resized copies and a srcset. One format
  // keeps the output a plain <img> (no <picture>), so Jewel's selectors still match.
  // src/_includes/photo-sizes.js asks for the same sizes, so keep the two in step.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp"],
    widths: [480, 960, 1600, 2400],
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });

  // ---- Collections ----------------------------------------------------------
  const byDate = (a, b) => a.date - b.date;
  eleventyConfig.addCollection("photoSets", (api) => api.getFilteredByGlob("src/photos/*.md").sort(byDate));

  // Every photo from every set, newest set first.
  eleventyConfig.addCollection("photoStream", (api) =>
    api.getFilteredByGlob("src/photos/*.md").sort(byDate).reverse().flatMap((set) =>
      (set.data.images || []).map((photo) => ({
        ...photo,
        title: set.data.title,
        description: set.data.description,
        location: set.data.location,
        date: set.date,
        topics: set.data.topics || [],
      })),
    ),
  );

  // ---- Filters --------------------------------------------------------------
  const slugify = eleventyConfig.getFilter("slugify");

  // "Night Walks" → "night-walks", space-separated, for data-tags.
  eleventyConfig.addFilter("topicSlugs", (topics = []) => topics.map((t) => slugify(t)).join(" "));

  // Unique topics across photoStream entries, for the filter buttons.
  eleventyConfig.addFilter("topicsOf", (items = []) => {
    const all = items.flatMap((item) => item.topics || []);
    return [...new Set(all)].sort((a, b) => a.localeCompare(b));
  });

  return {
    pathPrefix: site.base,
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
