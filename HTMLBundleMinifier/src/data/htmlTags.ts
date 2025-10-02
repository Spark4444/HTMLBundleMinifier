type HtmlTags = {
    [key: string]: string[];
};

// List of HTML tags and their attributes that may contain URLs
const htmlTags: HtmlTags = {
  "img": [
    "src",
    "srcset",
    "data-src",
    "data-srcset"
  ],
  "source": [
    "src",
    "srcset"
  ],
  "video": [
    "src",
    "poster",
    "data-src",
    "data-poster"
  ],
  "audio": [
    "src",
    "data-src"
  ],
  "track": [
    "src"
  ],
  "link": [
    "href"
  ],
  "object": [
    "data",
    "codebase"
  ],
  "embed": [
    "src"
  ],
  "input": [
    "src"
  ],
  "image": [
    "href",
    "xlink:href"
  ],
  "use": [
    "href"
  ]
};

export default htmlTags;