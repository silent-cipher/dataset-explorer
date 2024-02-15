<template>
  <div class="modal-slider">
    <!-- =================================================================== -->
    <section ref="panel" class="panel">
      <div class="inner-content">
        <div class="pannel-top">
          <div class="name">
            {{ option.label }}
          </div>
          <div v-if="option.label != 'Lighthouse'" class="cid">
            {{ deal.cids.v1 }}
          </div>
          <div v-if="option.label === 'Lighthouse'">{{ deal.cids.v0 }}</div>
        </div>

        <div class="storage-deal-id">
          <div class="storage-provider">
            <h5>Storage Provider</h5>
            <div>
              {{ deal.storage_provider[0] }}
              <span class="flag">
                {{ $GetFlagIcon(deal.location) }}
              </span>
            </div>
          </div>
          <div class="deal-id">
            <h5>Deal ID</h5>
            <div v-for="deal_id in deal.deal_ids" :key="deal_id">
              {{ deal_id }}
            </div>
          </div>
        </div>

        <div class="option">
          <!-- <div v-if="modal_options.length > 1" class="option-label">
            {{ option.label }}
          </div> -->
          <div class="helper-text">
            {{ option.helper_text }}
          </div>
          <div v-if="!option.disabled" class="code-snippet">
            <CopyButton
              :value="`${option.command}${
                option.label === 'Boost'
                  ? deal.miner_id + ' -o ' + deal.filename + ' ' + deal.cids.v1
                  : option.label === 'Lighthouse'
                  ? deal.cids.v0 + ' -o ' + deal.filename
                  : option.label === 'Lotus'
                  ? deal.miner_id + ' ' + deal.cids.v1 + ' ' + deal.filename
                  : '-o ' + lassie_filename + ' ' + deal.cids.v1
              }`"
              class="copy-button"
            />
            <span>{{ option.command }}</span>
            <span v-if="option.label === 'Boost' || option.label === 'Lotus'">{{
              deal.miner_id
            }}</span>
            <span v-if="option.label === 'Lighthouse'">{{ deal.cids.v0 }}</span>
            <span v-if="option.label !== 'Lotus'">-o</span>
            <span v-if="option.label !== 'Lotus'">
              {{ option.label === "Lassie" ? lassie_filename : deal.filename }}
            </span>
            <span v-if="option.label !== 'Lighthouse'" class="cid">
              {{ deal.cids.v1 }}
            </span>

            <span v-if="option.label === 'Lotus'">
              {{ deal.filename }}
            </span>
          </div>
          <button
            v-if="option.label === 'Saturn'"
            class="download-btn"
            @click="downloadFile"
          >
            Download
          </button>
          <div id="percentage-progress-bar">
            <span id="percentage">0%</span>
            <progress id="progress-bar" value="0" max="100" />
          </div>

          <div
            v-if="option.label != 'Lighthouse' && option.label != 'Saturn'"
            class="docs-helper"
          >
            {{ option.docs_helper
            }}<a
              class="docs-link"
              :href="option.docs_link"
              target="_blank"
              referrerpolicy="no-referrer"
              >here.</a
            >
          </div>
          <div v-if="option.label === 'Saturn'" class="docs-helper">
            Use
            <a
              class="docs-link"
              :href="option.docs_link"
              target="_blank"
              referrerpolicy="no-referrer"
              >Saturn Browser Client</a
            >
            to integrate datasets on your projects.
          </div>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters, mapActions } from "vuex";

import CopyButton from "@/components/copy-button";
import ArrowRightIcon from "@/components/icons/ArrowRight";

// ====================================================================== Export
export default {
  name: "ProviderData",

  components: {
    CopyButton,
    ArrowRightIcon,
  },

  props: {
    deal: {
      type: Object,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      siteContent: "global/siteContent",
      sliderIndex: "global/sliderIndex",
    }),
    pageData() {
      return this.siteContent.explorer;
    },
    modal_options() {
      return this.pageData.modal.options;
    },
    option() {
      return this.modal_options[this.provider];
    },
    lassie_filename() {
      const name_arr = this.deal.filename.split(".");
      name_arr[name_arr.length - 1] = "car";
      return name_arr.join(".");
    },
  },

  methods: {
    ...mapActions({
      setSliderIndex: "global/setSliderIndex",
    }),
    downloadFile() {
      const percentageProgressBar = document.getElementById(
        "percentage-progress-bar"
      );
      const percentageElement = document.getElementById("percentage");
      const progressElement = document.getElementById("progress-bar");
      const downloadBtn = document.querySelector(".download-btn");
      downloadBtn.style.display = "none";
      percentageProgressBar.style.display = "block";
      fetch(`https://ipfs.io/ipfs/${this.deal.cids.v1}`)
        .then((response) => {
          const contentLength = Number(this.deal.size);
          let downloaded = 0;

          const reader = response.body.getReader();

          return new ReadableStream({
            async start(controller) {
              while (true) {
                const { done, value } = await reader.read();

                if (done) {
                  controller.close();
                  break;
                }

                downloaded += value.byteLength;
                const percentage = Math.floor(
                  (downloaded / contentLength) * 100
                );
                percentageElement.textContent = `${percentage}%`;
                progressElement.value = percentage;

                controller.enqueue(value);
              }
            },
          });
        })
        .then((stream) => new Response(stream))
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]));
          const a = document.createElement("a");
          a.href = url;
          a.download = this.deal.filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          percentageProgressBar.style.display = "none";
          downloadBtn.style.display = "block";
        })
        .catch((error) => {
          percentageProgressBar.style.display = "none";
          downloadBtn.style.display = "block";

          console.error("Error downloading file:", error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General

#percentage-progress-bar {
  display: none;
  position: relative;
  margin-top: 1rem;
  width: 132px;
  #progress-bar {
    width: 200px;
    height: 50px;
  }
  #progress-bar {
    appearance: none;
    height: 31px;
    width: 100%;
    background-color: #eee;
    border-radius: 0.325rem;
    overflow: hidden;
    &::-webkit-progress-bar {
      border-radius: 0.325rem;
      background-color: $white;
    }
    &::-webkit-progress-value {
      background-color: $classicBlue;
    }
    &::-moz-progress-bar {
      background-color: $white;
    }
  }
  #percentage {
    @include fontSize_Regular;
    position: absolute;
    top: 50%;
    left: 50%;
    color: $fog;
    transform: translate(-50%, -50%);
  }
}
.modal-slider {
  position: relative;
  @include mini {
    overflow-y: scroll;
    padding-top: 1.5rem;
  }
}

.inner-content {
  position: relative;
}

.panel {
  margin: 2.4375rem 3.875rem;
  @include mini {
    margin: 0 2rem;
  }
}

.fade {
  animation-name: fade;
  animation-duration: 1.5s;
}

@keyframes fade {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 1;
  }
}

// /////////////////////////////////////////////////////////////// Sections
.pannel-top {
  border-bottom: 2px solid white;
  padding-bottom: 1.9875rem;
  margin-bottom: 2.125rem;
  @include mini {
    margin-bottom: 1.5rem;
  }
  @include tiny {
    margin-bottom: 1rem;
  }
}
.name {
  @include fontWeight_Semibold;
  @include fontSize_Regular;
  padding-bottom: 0.5rem;
  @include tiny {
    padding-bottom: 0.25rem;
  }
}
.cid {
  @include fontWeight_Regular;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: $font_Secondary;
  font-size: 1rem;
}
.storage-deal-id {
  @include fontSize_Regular;
  font-weight: 800;
  font-family: $font_Secondary;
  display: flex;
  flex-direction: row;
  @include mini {
    flex-direction: column;
    font-size: 0.8125rem;
  }
  h5 {
    @include fontWeight_Semibold;
    font-family: $font_Primary;
    font-size: 0.9375rem;
    padding-bottom: 0.5rem;
    @include mini {
      padding-bottom: 0rem;
    }
  }
}
.storage-provider,
.deal-id {
  display: flex;
  flex-direction: column;
}

.deal-id {
  padding-left: 3.25rem;
  @include mini {
    padding-left: 0;
    padding-top: 1rem;
  }
}

// //////////////////////////////////////////////////////////////// Options
.option {
  padding-top: 2.4375rem;
}
.option-label {
  font-size: 1rem;
  padding-bottom: 0.25rem;
}
.helper-text {
  @include fontWeight_Regular;
  line-height: 1.3;
}
.code-snippet {
  @include fontSize_Mini;
  @include fontWeight_Regular;
  font-family: $font_Secondary;
  background-color: $fog;
  border-radius: 0.325rem;
  padding: 0.5rem 0.75rem;
  margin-top: 1rem;
  .cid {
    @include fontSize_Mini;
  }
}

.copy-button {
  float: right;
}

.download-btn {
  padding: 0.4rem 1.8rem;
  border-radius: 0.325rem;
  background-color: $white;
  color: $classicBlue;
  cursor: pointer;
  margin-top: 1rem;
  @include fontWeight_Regular;
  font-family: $font_Secondary;
  font-size: 1rem;
  transition: color 0.25s ease, background-color 0.25s ease;
  &:hover {
    background-color: $classicBlue;
    color: $white;
  }
}

// /////////////////////////////////////////////////////////////// Toggle Buttons
.toggle-buttons {
  padding: 2rem 3.875rem 0 3.875rem;
  margin-bottom: 2.4375rem;
  // font-size: 0.9375;
  font-size: 1rem;
  z-index: 20;
  @include mini {
    padding: 2rem 2rem 0 2rem;
    margin-top: 0;
  }
  .prev,
  .next {
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }
  .prev {
    align-items: flex-start;
    .arrow {
      position: relative;
      left: -0.5rem;
      transform: rotate(180deg);
    }
    &:hover {
      .arrow {
        left: -1rem;
      }
    }
  }
  .next {
    align-items: flex-end;
    @include medium {
      padding-right: 1.75rem;
    }
    @include mini {
      padding-right: 0;
      margin-right: -3rem;
    }
    .arrow {
      position: relative;
      right: -0.5rem;
    }
    &:hover {
      .arrow {
        right: -1rem;
      }
    }
  }
}

.arrow {
  width: 0.75rem;
  transition: all 0.25s ease;
}

.provider,
.id {
  @include fontWeight_Regular;
  font-family: $font_Secondary;
}

.button-details {
  @include fontSize_Mini;
  flex-direction: column !important;
  padding-top: 0.75rem;
  @include mini {
    display: none;
  }
}

.panel-numbers {
  padding-top: 3rem;
  justify-content: center;
  align-items: center;
  display: flex;
  @include mini {
    padding-top: 0;
  }
}

.mobile-panel-numbers {
  display: none;
  @include mini {
    align-items: center;
    justify-content: center;
    display: flex;
  }
}
.docs-helper {
  @include fontWeight_Regular;
  line-height: 1.3;
  margin-top: 1rem;
  .docs-link {
    @include fontWeight_Semibold;
    text-decoration: underline;
  }
}
</style>
