export default class AboutPage {
  async render() {
    return `
      <div class="container" style="padding-block: 40px;">
        <article class="auth-card" style="max-width: 800px; margin: 0 auto; text-align: center;">
          <section aria-labelledby="aboutTitle">
            <h1 id="aboutTitle">Tentang Story App</h1>
            <p class="auth-subtitle">Platform berbagi momen dan cerita di seluruh dunia</p>
            
            <div style="margin-block: 30px; text-align: left; color: var(--text-secondary);">
              <p style="margin-bottom: 16px;">
                <strong>Story App</strong> adalah aplikasi Single Page Application (SPA) yang dirancang untuk memudahkan Anda berbagi pengalaman melalui foto dan lokasi geografis.
              </p>
              <p style="margin-bottom: 16px;">
                Fitur Utama:
                <ul style="margin-left: 20px; margin-top: 8px;">
                  <li>Peta Interaktif dengan Leaflet.js</li>
                  <li>Akses Kamera Langsung (MediaStream API)</li>
                  <li>Location Picker berbasis Peta</li>
                  <li>Transisi Halaman yang Mulus</li>
                  <li>Aksesibilitas Tinggi (WCAG Compliant)</li>
                </ul>
              </p>
            </div>

            <div style="padding-top: 20px; border-top: 1px solid var(--border-light);">
              <p>Dibuat sebagai proyek submission untuk kelas <strong>Belajar Pengembangan Web Intermediate</strong> di Dicoding Indonesia.</p>
              <div style="margin-top: 24px;">
                <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
              </div>
            </div>
          </section>
        </article>
      </div>
    `;
  }

  async afterRender() {
    // Tidak ada logic tambahan
  }

  onPageLeave() {
    // Cleanup jika diperlukan
  }
}
