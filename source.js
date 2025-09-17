// source.js
class ComickSo extends ComicSource {
  name = "Comick.so";
  key = "comickso";
  version = "1.0.0";
  minAppVersion = "1.0.0";
  url = "https://comick.so";

  settings = [
    {
      key: "baseUrl",
      label: "Domain",
      type: "text",
      value: "https://comick.so",
    },
  ];

  category = {
    title: "Genres",
    parts: [
      {
        name: "Genres",
        type: "fixed",
        categories: [
          "All",
          "Action",
          "Adventure",
          "Boys' Love",
          "Comedy",
          "Drama",
          "Fantasy",
          "Girls' Love",
          "Historical",
          "Horror",
          "Isekai",
          "Josei",
          "Martial Arts",
          "Mecha",
          "Medical",
          "Mystery",
          "Music",
          "Psychological",
          "Romance",
          "School Life",
          "Sci-Fi",
          "Seinen",
          "Shoujo",
          "Shounen",
          "Slice of Life",
          "Sports",
          "Supernatural",
          "Thriller",
          "Tragedy",
          "Webtoon",
          "Yaoi",
          "Yuri"
        ],
        categoryParams: [
          "all",
          "action",
          "adventure",
          "bl",
          "comedy",
          "drama",
          "fantasy",
          "gl",
          "historical",
          "horror",
          "isekai",
          "josei",
          "martial-arts",
          "mecha",
          "medical",
          "mystery",
          "music",
          "psychological",
          "romance",
          "school-life",
          "sci-fi",
          "seinen",
          "shoujo",
          "shounen",
          "slice-of-life",
          "sports",
          "supernatural",
          "thriller",
          "tragedy",
          "webtoon",
          "yaoi",
          "yuri"
        ],
        itemType: "category",
      }
    ],
    enableRankingPage: true,
  };

  categoryComics = {
    optionList: [
      {
        options: ["latest-Latest", "popular-Popular"],
      }
    ],
    load: async (category, param, options, page) => {
      const url = `${this.url}/genre/${param}?page=${page}&sort=${options[0] || "latest"}`;
      const doc = await this.request(url);
      const comics = [];
      doc.querySelectorAll(".comic-card").forEach(el => {
        comics.push({
          id: el.querySelector("a").getAttribute("href"),
          title: el.querySelector("h3").textContent.trim(),
          cover: el.querySelector("img").getAttribute("src"),
        });
      });
      return { comics, maxPage: 999 };
    }
  };

  search = {
    optionList: [
      {
        type: "select",
        options: ["latest-Latest", "popular-Popular"],
        label: "Sort",
        default: "latest",
      }
    ],
    load: async (keyword, options, page) => {
      const url = `${this.url}/search?q=${encodeURIComponent(keyword)}&page=${page}&sort=${options[0] || "latest"}`;
      const doc = await this.request(url);
      const comics = [];
      doc.querySelectorAll(".comic-card").forEach(el => {
        comics.push({
          id: el.querySelector("a").getAttribute("href"),
          title: el.querySelector("h3").textContent.trim(),
          cover: el.querySelector("img").getAttribute("src"),
        });
      });
      return { comics, maxPage: 999 };
    }
  };

  comic = {
    loadInfo: async (id) => {
      const doc = await this.request(this.url + id);
      const data = JSON.parse(doc.querySelector("#__NEXT_DATA__").textContent).props.pageProps.comic;
      return {
        id,
        title: data.title,
        cover: data.cover_url,
        description: data.desc,
        chapters: data.chapters.map(ch => ({
          id: ch.hid,
          title: ch.title,
          date: ch.created_at,
        })),
        tags: data.genres.map(g => g.name),
      };
    },
    loadEp: async (comicId, epId) => {
      const url = `${this.url}/comic/${comicId}/${epId}`;
      const doc = await this.request(url);
      const data = JSON.parse(doc.querySelector("#__NEXT_DATA__").textContent).props.pageProps.chapter;
      return {
        images: data.images.map(img => img.url),
      };
    }
  };
}
