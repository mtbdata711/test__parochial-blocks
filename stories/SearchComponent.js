import template from "./grid-item.hbs";

export class SearchComponent extends HTMLElement {
  constructor() {
    super();
    this.nextButton = this.querySelector("[data-slot='next']");
    this.prevButton = this.querySelector("[data-slot='previous']");
    this.results = this.querySelector("[data-slot='results']");
    this.cache = new Map();
    this.ssr = this.getAttribute("ssr") === "true" ? true : false;
  }

  get page() {
    return parseInt(this.getAttribute("page"));
  }

  set page(val) {
    this.setAttribute("page", val);
  }

  get collection() {
    return this.getAttribute("collection");
  }

  set collection(val) {
    this.setAttribute("collection", val);
  }

  get perPage() {
    return parseInt(this.getAttribute("per-page"));
  }

  set perPage(val) {
    this.setAttribute("per-page", val);
  }

  get ssr() {
    return this.getAttribute("ssr") === "true" ? true : false;
  }

  set ssr(val) {
    this.setAttribute("ssr", val.toString());
  }

  static get observedAttributes() {
    return ["page", "collection", "per-page"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // if any of the observed attributes change, re-render the results
    if (oldValue !== newValue) {
      this.renderResults();
    }
  }

  connectedCallback() {
    this.nextButton.addEventListener("click", this.nextPage.bind(this));
    this.prevButton.addEventListener("click", this.prevPage.bind(this));
    if (this.ssr !== true) {
      this.renderResults()
    }
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    const requestedPage = this.page - 1;
    if (requestedPage < 1) {
      return;
    }
    this.page--;
  }

  async renderResults() {
    const startRank = (this.page - 1) * this.perPage + 1;
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
