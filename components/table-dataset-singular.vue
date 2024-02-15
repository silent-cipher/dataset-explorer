<template>
  <section class="table-deals">
    <ul class="navs-list">
      <template v-for="(title, index) in navs">
        <li
          :class="{ active: selectedProvider === title.slug }"
          @click="selectProvider(title.slug)"
        >
          {{ title.label }}
        </li>
      </template>
    </ul>
    <Provider class="deal-modal" :provider="selectedProvider" />
  </section>
</template>

<script>
// ===================================================================== Imports

import Provider from "@/components/provider";

// ====================================================================== Export
export default {
  name: "TableDatasetSingular",

  components: {
    Provider,
  },

  props: {
    navs: {
      type: Array,
      required: true,
    },

    paginationDisplay: {
      type: Number,
      required: false,
      default: 20,
    },
  },

  data() {
    return {
      selectedProvider: "boost",
    };
  },

  methods: {
    selectProvider(provider) {
      this.selectedProvider = provider;
    },
  },
};
</script>

<style lang="scss" scoped>
/*
  Most of the table styles below are not supported by Safari. Therefore, table
  styles are reset at the end of this <style> tag and safar-specific styles are
  applied.
*/

// ///////////////////////////////////////////////////////////////////// General
.table-deals {
  @include fontSize_Mini;
  margin-bottom: 0.5rem;
  font-weight: $fontWeight_Semibold;
}

.navs-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
  margin: 1rem 0rem;
  list-style: none;
  li {
    padding: 0.5rem 1rem;
    background-color: $aquaHaze;
    color: $classicBlue;

    border-radius: 0.5rem;
    cursor: pointer;
    &:hover {
      background-color: $classicBlue;
      color: $white;
    }
    &.active {
      background-color: $classicBlue;
      color: $white;
    }
  }
}

.table-container {
  min-width: 100%;
  @include medium {
    margin-bottom: -5rem;
    padding-bottom: 5rem;
    overflow-x: scroll;
  }
  @include mini {
    padding: 0;
    padding-bottom: 5rem;
    margin-top: 0;
  }
}

.external-link {
  @include fontWeight_Semibold;
  color: $classicBlue;
  &:hover {
    text-decoration: underline;
  }
}

.table-head {
  position: relative;
  filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.9));
  vertical-align: bottom;
  @include mini {
    display: none;
  }
}

.row-head {
  position: relative;
  z-index: 10;
}

.cell-head {
  @include fontSize_Mini;
  padding: 0.5rem 1.25rem !important;
  text-align: left;
}
@-moz-document url-prefix() {
  .cell-head {
    padding-bottom: 1rem !important;
  }
}

.table-body {
  vertical-align: top;
}

tbody.divider {
  height: 0.5rem;
}

tbody:not(.divider) {
  position: relative;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 10px);
    height: calc(100% - 4px);
    background: #a9b4cb;
    opacity: 0.6;
    filter: blur(20px);
  }
}

.row-body {
  position: relative;
  cursor: pointer;
  @include mini {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding-left: 2rem;
    padding-top: 2rem;
    padding-bottom: 1rem;
  }
  &:hover {
    .cell-parent:nth-child(3) {
      .dotted-border {
        transition: 100ms ease-in;
        opacity: 1;
      }
    }
  }
}

.cell-parent:first-child {
  &:before,
  &:after {
    content: "";
    position: absolute;
    border-radius: 5px;
  }
  // Border gradient
  &:before {
    top: -2px;
    left: -2px;
    width: 100%;
    height: 100%;
    background: $white;
    z-index: 0;
  }
  // Background color
  &:after {
    top: 1px;
    left: 1px;
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    background: $gradient_SilverGrey;
    z-index: 5;
  }
}

.cell-parent:not(:first-child) {
  @include mini {
    margin-top: 1rem;
    &:before {
      content: "";
      position: absolute;
      z-index: 25;
      left: -0.125rem;
      background-color: $classicBlue;
      opacity: 0.3;
      height: 1px;
      width: calc(100% + 0.125rem);
      margin-top: -1.5rem;
    }
  }
}

::v-deep .cell-parent:nth-child(3) {
  .dotted-border {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
    transition: 100ms ease-out;
    rect {
      transform: scale(0.99, 0.9) translate(0.188rem, 0.25rem);
    }
    &:before,
    &:after {
      display: none;
    }
  }
}

.cell-parent {
  @include mini {
    display: flex;
    flex-direction: row;
    line-height: 1.5;
    width: 100%;
    padding-bottom: 1rem;
    &:last-child {
      .cell-body {
        padding-bottom: 0;
      }
    }
  }
  &.hovering {
    &:not(:nth-child(4)) {
      .cell-body {
        opacity: 0;
      }
    }
    &:nth-child(4) {
      &:before {
        transition: 100ms ease-in;
        opacity: 1;
        pointer-events: all;
      }
      .cell-body.sp {
        opacity: 0;
      }
    }
  }
}

.cell-body {
  padding: 1.25rem;
  @include mini {
    padding-top: 0;
    width: 65% !important;
  }
}

tr.divider {
  &:not(:last-child) {
    height: 0.5rem;
  }
}

.no-results-placeholder {
  position: relative;
  padding: 1rem;
  filter: drop-shadow(0px 5px 3px rgba(0, 0, 0, 0.3));
  @include medium {
    margin: 0 calc(7% + 0.5rem);
    margin-bottom: -3rem;
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    border-radius: 5px;
  }
  &:before {
    top: -2px;
    left: -2px;
    width: 100%;
    height: 100%;
    background: $white;
    z-index: 0;
  }
  &:after {
    top: 1px;
    left: 1px;
    width: calc(100% - 1px);
    height: calc(100% - 1px);
    background: $gradient_SilverGrey;
    z-index: 5;
  }
  span {
    position: relative;
    z-index: 10;
  }
}

.mobile-cell-head {
  display: none;
  @include mini {
    display: block;
    position: relative;
    z-index: 25;
    width: 35%;
    padding-right: 1rem;
  }
}

// ///////////////////////////////////////////////////////////////////// General
.cell-body {
  position: relative;
  z-index: 25;
  span {
    display: block;
  }
}

// ////////////////////////////////////////////////////////////////////// Common

// //////////////////////////////////////////////////////////////////// Specific
.filter-description {
  padding-bottom: 2.5rem;
  padding-left: 1.5rem;
}

.file_name {
  @include fontWeight_Semibold;
}

.cid {
  padding-top: 0.5rem;
  @include mini {
    width: 10rem;
  }
}

.curated_dataset {
  width: 13rem;
}

.miner_id > div > div {
  display: flex;
  flex-direction: row;
  .miner {
    width: 6rem;
  }
}

.cid {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.data_size,
.cid,
.deal_id,
.miner_id,
.date_epoch {
  font-family: $font_Secondary;
  @include fontWeight_Regular;
}

.date_epoch {
  padding-top: 0.5rem;
}

.data-unit {
  padding-top: 0.375rem;
}

.data_size > div {
  display: flex;
}

.dataset {
  @include fontSize_Tiny;
  @include leading_Large;
}

// ////////////////////////////////////////////////////////////// Safari Browser
@include Safari7Plus("tbody:not(.divider):before") {
  display: none;
}

@include Safari7Plus(".cell-parent:first-child:before") {
  display: none;
}

@include Safari7Plus(".cell-parent:first-child:after") {
  display: none;
}

@include Safari7Plus(".cell-parent:nth-child(3):after") {
  display: none;
}

@include Safari7Plus(".row-body") {
  background-color: $aquaHaze;
  transition: 100ms ease-out;
}

@include Safari7Plus(".row-body:hover") {
  background-color: $mystic;
  transition: 100ms ease-in;
}
</style>
