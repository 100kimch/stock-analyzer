<template>
  <div
    id="top-view"
    :class="{ minimized: minimized, side: side, flipped: flipped }"
    @click="setPage()"
  >
    <div class="linked-line" />
    <section class="front card pa-0">
      <v-icon size="4.25em" class="ma-6 mb-0" color="grey">mdi-domain</v-icon>
      <div class="description">
        <h1>
          Stock market
          <v-spacer />
          <v-text-field
            v-model="selectedCompany"
            append-icon="mdi-magnify"
            class="ma-5 mt-0"
            label="종목 검색"
            single-line
            hide-details
            @keyup.enter="searchCompany()"
          />
        </h1>
        <v-data-table
          v-model="selectedData"
          class="transparent"
          :headers="headers['codes']"
          :items="data"
          :single-select="false"
          item-key="corp_code"
          show-select
          :loading="!loaded"
          loading-text="로딩중..."
        >
          <!-- <template v-slot:top>
            <v-switch
              v-model="singleSelect"
              label="Single select"
              class="pa-3"
            ></v-switch>
          </template> -->
        </v-data-table>
        <div class="my-3">
          <v-btn
            :elevation="0"
            :loading="!loadedCorpData"
            color="primary"
            class="mr-3"
            @click="selectCorp"
          >
            <v-icon size="1.5em" class="mr-3">mdi-check</v-icon>등록하기
          </v-btn>
          <v-btn :elevation="0" outlined color="grey" @click="reset()">
            <v-icon size="1.5em" class="mr-3">mdi-cancel</v-icon>취소
          </v-btn>
        </div>
      </div>
    </section>
    <section class="back card">
      <h2>Plane 리포트</h2>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
// import { Event, LoadedEvent, Tms, CustomDate } from "../types/timetable.model";
import axios from "axios";

@Component
export default class CardMarket extends Vue {
  @Prop() readonly minimized!: boolean;
  @Prop() readonly side!: boolean;
  private loaded = false;
  private loadedCorpData: Array<any> = [];
  private selectedData: Array<any> = [];
  private selectedCompany = "";
  private data: Array<object> = [];
  private dataType = 0;
  private dataUrl: Array<string> = ["list.json", "corpCode"];
  private headers: object = {
    reports: [
      {
        text: "법인구분",
        sortable: true,
        value: "corp_cls",
      },
      {
        text: "종목코드",
        sortable: true,
        value: "corp_code",
      },
      {
        text: "종목명",
        sortable: true,
        value: "corp_name",
      },
      {
        text: "공시 제출인명",
        sortable: true,
        value: "flr_nm",
      },
      {
        text: "접수일자",
        sortable: true,
        value: "rcept_dt",
      },
      {
        text: "접수번호",
        sortable: true,
        value: "rcept_no",
      },
      {
        text: "종목코드",
        sortable: true,
        value: "stock_code",
      },
      {
        text: "보고서명",
        sortable: true,
        value: "report_nm",
      },
      {
        text: "비고",
        sortable: true,
        value: "rm",
      },
    ],
    codes: [
      {
        text: "종목명",
        sortable: true,
        value: "corp_name",
      },
      {
        text: "종목코드",
        sortable: true,
        value: "corp_code",
      },
      {
        text: "수정일자",
        sortable: true,
        value: "modify_date",
      },
      {
        text: "종목코드",
        sortable: true,
        value: "stock_code",
      },
    ],
  };

  mounted() {
    // this.addBulkEvents();
    this.updateCompanyList();
  }

  get flipped(): boolean {
    return this.$store.getters.getViewMode === "reporting";
  }

  public async updateCompanyList() {
    const res = await axios.get(process.env.VUE_APP_SERVER_URL + "/corp/codes");
    console.debug("updateCompanyList(): ", res);
    if (res["data"]) this.data = res.data;
    this.loaded = true;
  }

  public async searchCompany() {
    this.loaded = false;
    const res = await axios.post(
      process.env.VUE_APP_SERVER_URL + "/corp/codes",
      {
        // eslint-disable-next-line
        corp_name: this.selectedCompany,
      }
    );
    console.debug("searchCompany(): ", res);
    if (res["data"]) this.data = res.data;
    this.loaded = true;
  }

  public async selectCorp(e: Event) {
    e.stopPropagation();
    const ret = this.selectedData.reduce(
      (a, o) => (
        a.push({
          // eslint-disable-next-line
          corp_name: o["corp_name"],
          // eslint-disable-next-line
          corp_code: o["corp_code"],
        }),
        a
      ),
      []
    );
    console.debug("selectedCorp: ", ret);
    this.$store.commit("setCorpList", ret);
  }

  public setPage() {
    if (this.minimized || this.side) this.$store.commit("setPage", "market");
  }
}
</script>

<style lang="scss" scoped>
#top-view {
  position: relative;
  width: 100%;
  height: 70vh;
  margin-top: 0;
  // overflow: hidden;
  z-index: 2;
  .linked-line {
    width: calc(40vw - 3.5em);
    margin-left: calc(12.5em - 40vw);
  }
  .front.card {
    overflow: auto;
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
