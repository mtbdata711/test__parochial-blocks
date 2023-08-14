import template from "./grid-item.hbs";

export class SearchComponent extends HTMLElement {
  constructor() {
    super();
    this.nextButton = this.querySelector("[data-slot='next']");
    this.prevButton = this.querySelector("[data-slot='previous']");
    this.results = this.querySelector("[data-slot='results']");
    this.page =
      this.getAttribute("page") && !isNaN(this.getAttribute("page"))
        ? parseInt(this.getAttribute("page"))
        : 1;
    this.collection = this.getAttribute("collection");
    this.perPage =
      this.getAttribute("per-page") && !isNaN(this.getAttribute("per-page"))
        ? parseInt(this.getAttribute("per-page"))
        : 10;
    this.cache = new Map();
    this.ssr = this.getAttribute("ssr") === "true" ? true : false;
  }

  connectedCallback() {
    this.nextButton.addEventListener("click", this.nextPage.bind(this));
    this.prevButton.addEventListener("click", this.prevPage.bind(this));
    if (this.ssr !== true) {
      this.nextPage(true);
    }
  }

  nextPage(force) {
    if (force !== true) {
      this.page++;
    }
    const currentPage = this.page;
    // start ranks go from 1 to 11 to 21 etc
    const startRank = (currentPage - 1) * this.perPage + 1;

    this.setAttribute("page", currentPage);

    return this.renderResults(startRank);
  }

  prevPage() {
    this.page--;
    const requestedPage = this.page;

    if (requestedPage < 1) {
      this.setAttribute("page", 1);
      return;
    }

    this.setAttribute("page", requestedPage);
    const startRank = (requestedPage - 1) * this.perPage + 1;
    return this.renderResults(startRank);
  }

  async renderResults(startRank) {
    const fetchUrl = `https://searchtest.arts.ac.uk/s/search.json?collection=${this.collection}&query=%21nullquery&start_rank=${startRank}&num_ranks=${this.perPage}`;

    // check if we have this page in the cache
    if (this.cache.has(fetchUrl)) {
      this.results.innerHTML = this.cache.get(fetchUrl);
      return;
    }

    const response = await fetch(fetchUrl);
    const data = await response.json();
    const items = data.response.resultPacket.results;
    // cache the results
    const html = template({ items });
    this.cache.set(fetchUrl, html);
    this.results.innerHTML = html;
  }
}

customElements.define("search-component", SearchComponent);
