import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, LovelaceCardConfig } from "custom-card-helpers";

interface SpotifyGridCardItem {
  image: string;
  uri: string;
}

interface SpotifyGridCardConfig extends LovelaceCardConfig {
  type: string;
  entity: string;
  columns?: number;
  aspect_ratio?: number;
  items: SpotifyGridCardItem[];
}

@customElement("spotify-grid-card")
class SpotifyGridCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: SpotifyGridCardConfig;

  public setConfig(config: SpotifyGridCardConfig): void {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    if (!config.items || !Array.isArray(config.items)) {
      throw new Error("You need to define a list of items");
    }
    this.config = {
      columns: 3,
      aspect_ratio: 1,
      ...config,
    };
  }

  private _handleClick(uri: string) {
    this.hass.callService("media_player", "play_media", {
      entity_id: this.config.entity,
      media_content_id: uri,
      media_content_type: "music",
    });
  }

  render() {
    const { items, columns, aspect_ratio } = this.config;
    const itemWidth = `calc(${100 / columns}% - 10px)`;

    return html`
      <div class="grid">
        ${items.map(
          (item) => html`
            <div
              class="item"
              style="
                width: ${itemWidth};
                padding-bottom: calc(${itemWidth} * ${aspect_ratio});
                background-image: url('${item.image}');
              "
              @click=${() => this._handleClick(item.uri)}
            >
              <div class="play-overlay">▶</div>
            </div>
          `
        )}
      </div>
    `;
  }

  static styles = css`
    .grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .item {
      position: relative;
      background-size: cover;
      background-position: center;
      border-radius: 10px;
      cursor: pointer;
      overflow: hidden;
    }
    .play-overlay {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 5px 8px;
      border-radius: 50%;
      font-size: 16px;
      display: none;
    }
    .item:hover .play-overlay {
      display: block;
    }
  `;
}
