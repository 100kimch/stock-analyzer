<template>
  <div
    id="top-view"
    :class="{ minimized: minimized, side: side, flipped: flipped }"
    @click="setPage()"
  >
    <div class="linked-line" />
    <section class="front card pa-0">
      <v-icon size="4.25em" class="ma-6 mb-0" color="grey"
        >mdi-briefcase
      </v-icon>
      <div class="description">
        <h1>Company</h1>
        <v-tabs v-model="tabs" background-color="transparent" centered>
          <v-tab v-for="company in corpList" :key="company['corp_code']">
            {{ company["corp_name"].slice(0, 6) }}
            <!-- <v-avatar color="indigo">
              <span class="white--text headline">{{ company }}</span>
            </v-avatar> -->
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs">
          <v-tab-item>
            <h2>Hello</h2>
            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
            />
          </v-tab-item>
          <v-tab-item>
            <h2>Hello</h2>
            <GChart
              type="ColumnChart"
              :data="chartData"
              :options="chartOptions"
            />
          </v-tab-item>
        </v-tabs-items>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import axios from "axios";

@Component
export default class CardCorp extends Vue {
  @Prop() readonly minimized!: boolean;
  @Prop() readonly side!: boolean;
  private loaded = false;
  private data: Array<object> = [];
  private tabs: any = null;

  private chartData: Array<Array<any>> = [
    ["Year", "Sales", "Expenses", "Profit"],
    ["2014", 1000, 400, 200],
    ["2015", 1170, 460, 250],
    ["2016", 660, 1120, 300],
    ["2017", 1030, 540, 350],
  ];
  private chartOptions: object = {
    chart: {
      title: "Company Performance",
      subtitle: "Sales, Expenses, and Profit: 2014-2017",
    },
  };

  mounted() {
    this.loaded = true;
  }

  get flipped(): boolean {
    return this.$store.getters.getViewMode === "reporting";
  }

  get corpList(): Array<string> {
    return this.$store.getters.getCorpList;
  }

  @Watch("corpList")
  public async loadDate() {
    this.setPage();
    console.debug("corpList: ", this.corpList);
    const res = await axios.post(
      process.env.VUE_APP_SERVER_URL + "/corp/finstate",
      {
        companies: this.corpList,
        years: [2018, 2019, 2020],
      }
    );
    console.debug("loadDate(): ", res);
    this.data = res.data;
  }

  public setPage() {
    if (this.minimized || this.side) this.$store.commit("setPage", "corp");
  }
}
</script>

<style lang="scss" scoped>
#top-view {
  position: relative;
  width: 100%;
  height: 70vh;
  margin-top: 0;
  z-index: 1;
  .linked-line {
    width: calc(40vw - 3.5em);
    margin-left: calc(12.5em - 40vw);
  }
  .front.card {
    overflow: hidden;
    background: linear-gradient(45deg, #e0e0e0, #eeeeee);
  }

  &.side {
    width: 100%;
    .card {
      &:hover {
        transform: none;
      }
    }
  }
}
</style>
