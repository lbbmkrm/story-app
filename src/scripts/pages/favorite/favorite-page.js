import StoryModel from "../../data/story-model";
import { formatDate } from "../../utils";
import AuthModel from "../../data/auth-model";

class FavoritePage {
  constructor() {}

  async render() {
    return `
      <div class="container" style="margin-top: 40px; min-height: 80vh;">
        <header class="stories-header" style="text-align: center; margin-bottom: 40px;">
          <h1>Cerita Favorit Anda</h1>
          <p>Kumpulan momen yang Anda simpan secara lokal</p>
          
          <div class="search-sort-container" style="margin-top: 24px; display: flex; gap: 12px; max-width: 600px; margin-left: auto; margin-right: auto; flex-wrap: wrap;">
            <div style="flex: 2; min-width: 250px;">
              <input 
                type="text" 
                id="searchFavorite" 
                placeholder="Cari cerita favorit..." 
                class="form-control"
                style="width: 100%; padding: 12px 20px; border-radius: 50px; border: 2px solid var(--border-light);"
              />
            </div>
            <div style="flex: 1; min-width: 150px;">
              <select 
                id="sortFavorite" 
                class="form-control" 
                style="width: 100%; padding: 12px; border-radius: 50px; border: 2px solid var(--border-light); height: 100%; cursor: pointer;"
                aria-label="Urutkan cerita"
              >
                <option value="desc">Terbaru</option>
                <option value="asc">Terlama</option>
              </select>
            </div>
          </div>
        </header>
        
        <div id="favoriteStoriesContainer" class="stories-list" role="region" aria-live="polite">
          <div id="loadingIndicator">Memuat data cerita favorit...</div>
        </div>
        
        <div id="emptyMessage" style="display: none; text-align: center; padding: 60px 20px;">
          <div style="font-size: 4rem; margin-bottom: 16px;">🤍</div>
          <h3>Belum Ada Favorit</h3>
          <p>Cerita yang Anda tandai dengan hati akan muncul di sini.</p>
          <a href="#/" class="btn btn-primary" style="margin-top: 20px;">Jelajahi Cerita</a>
        </div>
      </div>
    `;
  }

  async afterRender() {
    if (!AuthModel.isUserLoggedIn()) {
      window.location.hash = "#/login";
      return;
    }

    const updateView = async () => {
      const query = document.querySelector("#searchFavorite").value;
      const sortOrder = document.querySelector("#sortFavorite").value;
      
      let stories = await StoryModel.searchFavoriteStories(query);
      
      // Logika Pengurutan (Sorting)
      stories.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });

      this._renderStories(stories);
    };

    // Event listener untuk Pencarian
    document.querySelector("#searchFavorite").addEventListener("input", updateView);
    
    // Event listener untuk Pengurutan
    document.querySelector("#sortFavorite").addEventListener("change", updateView);

    // Render awal
    await updateView();
  }

  async _renderStories(stories) {
    const container = document.querySelector("#favoriteStoriesContainer");
    const emptyMessage = document.querySelector("#emptyMessage");

    if (stories.length === 0) {
      container.innerHTML = "";
      emptyMessage.style.display = "block";
      return;
    }

    emptyMessage.style.display = "none";
    container.innerHTML = stories
      .map(
        (story) => `
          <article class="story-card" data-story-id="${story.id}">
            <div class="story-image-wrapper">
              <img src="${story.photoUrl}" alt="${story.name}" class="story-image" loading="lazy" />
            </div>
            <div class="story-content">
              <div class="story-header-row">
                <h3>${story.name}</h3>
                <button class="btn-favorite active" data-id="${story.id}" title="Hapus dari favorit">❤️</button>
              </div>
              <p class="story-description">${story.description}</p>
              <div class="story-meta">
                <span class="story-location">📍 ${story.lat ? `${story.lat.toFixed(1)}, ${story.lon.toFixed(1)}` : "Lokasi tidak tersedia"}</span>
                <span class="story-date">${formatDate(story.createdAt)}</span>
              </div>
            </div>
          </article>
        `,
      )
      .join("");

    // Registrasi listener
    stories.forEach((story) => {
      const card = document.querySelector(`[data-story-id="${story.id}"]`);
      if (card) {
        card.addEventListener("click", () => {
          window.location.hash = `#/stories/${story.id}`;
        });

        const favoriteBtn = card.querySelector(".btn-favorite");
        favoriteBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          await StoryModel.deleteFavoriteStory(story.id);
          const updatedStories = await StoryModel.getAllFavoriteStories();
          this._renderStories(updatedStories);
        });
      }
    });
  }
}

export default FavoritePage;
