<template>
  <div v-if="dataset" id="provider-container">
    <section id="modal-deal">
      <ProviderData :deal="dataset" :provider="provider" />
    </section>
  </div>
</template>

<script>
// ====================================================================== Import
import { mapGetters } from "vuex";

import CloseIcon from "@/components/icons/x";
import ProviderData from "@/components/provider-data";

// ====================================================================== Export
export default {
  name: "Provider",

  components: {
    CloseIcon,
    ProviderData,
  },

  props: {
    provider: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      initialized: false,
    };
  },

  computed: {
    ...mapGetters({
      modal: "global/modal",
      deals: "explorer/datasetList",
      datasetNames: "explorer/datasetNames",
      cids: "explorer/datasetSingular",
      sliderIndex: "global/sliderIndex",
    }),
    dataset() {
      return this.cids;
    },
  },

  mounted() {
    window.addEventListener("keydown", (e) => {
      const key = e.key || e.keyCode;
      if (key === "Escape" || key === "Esc" || key === 27) {
        this.closeModal();
      }
    });
  },
};
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General

#provider-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  &:before {
    content: "";
    position: absolute;
    top: inherit;
    left: inherit;
    width: inherit;
    height: inherit;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    z-index: 5;
    transition: 250ms ease-out;
  }
  #modal-deal {
    flex: 1;
    transition: 250ms 100ms ease-in;
    transform: translateY(0);
    opacity: 1;
    z-index: 1000;
  }
}
// #modal {
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   visibility: hidden;
//   pointer-events: none;
//   z-index: -1;
//   &:before {
//     content: "";
//     position: absolute;
//     top: inherit;
//     left: inherit;
//     width: inherit;
//     height: inherit;
//     background: rgba(0, 0, 0, 0.5);
//     opacity: 0;
//     z-index: 5;
//     transition: 250ms ease-out;
//   }
//   &.active {
//     visibility: visible;
//     pointer-events: all;
//     z-index: 10000;
//     &:before {
//       transition: 250ms ease-in;
//       opacity: 1;
//     }
//     #modal-deal {
//       transition: 250ms 100ms ease-in;
//       transform: translateY(0);
//       opacity: 1;
//       z-index: 1000;
//     }
//   }
// }
// ///////////////////////////////////////////////////////////////////// Toolbar
.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.close-button {
  @include fontWeight_Semibold;
  color: $classicBlue;
  padding: 0.5rem 1rem;
}
// /////////////////////////////////////////////////////////////// [Modal] Deal
#modal-deal {
  background: $gradient_SilverGrey;
  box-shadow: 0px 30px 70px rgba(169, 180, 203, 0.3), -3px -3px 0px #ffffff,
    0px 3px 0px #d6dadf, inset 0px -20px 20px rgba(255, 255, 255, 0.2);
  border-radius: 0.3125rem;
  width: 50%;
  @include medium {
    margin-top: 4rem;
    width: 80%;
  }
}
</style>
