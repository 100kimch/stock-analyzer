import Vue from "vue";
import Vuex, { StoreOptions, ActionContext } from "vuex";
// import {
//   Block,
//   Event,
//   LoadedEvent,
//   EmptyEvent,
//   EmptyLoadedEvent,
// } from "@/types/timetable.model";
import axios from "axios";
// import _ from "lodash";

Vue.use(Vuex);

// interface State {
//   container: string;
//   viewMode: string;
//   pageName: object;
//   pageQueue: Array<number>;
//   popup: string;
//   categories: object;
//   selectedBlock: Block | {};
//   selectedEvent: LoadedEvent;
//   newEvent: Event;
//   events: Array<LoadedEvent>;
// }

const store: StoreOptions<any> = {
  state: {
    container: "",
    viewMode: "monitoring",
    // NOTE: pageOrder for page order
    pageOrder: ["", "", "main", "account", "market", "corp"],
    // NOTE: pageQueue for 5 pages
    pageQueue: [0, 1, 2, 3, 4],
    popup: "",
    corpList: [],
    // categories: Object.freeze(["주피터", "새턴", "우라누스", "플루토"]),
    // selectedBlock: {},
    // selectedEvent: Object.assign({}, EmptyLoadedEvent),
    // newEvent: Object.assign({}, EmptyEvent),
    // events: [],
  },
  mutations: {
    setContainer(state, val) {
      state.container = val;
    },
    setViewMode(state, val) {
      state.viewMode = val;
    },
    setPageToLeft(state) {
      if (!state.pageOrder[state.pageQueue[1]]) return;
      state.pageQueue.unshift(state.pageQueue[2] - 3);
      state.pageQueue.pop();
    },
    setPageToRight(state) {
      if (!state.pageOrder[state.pageQueue[3]]) {
        console.debug("setPageToRight skipped!");
        return;
      }
      state.pageQueue.push(state.pageQueue[2] + 3);
      state.pageQueue.shift();
      if (state.pageQueue[2] == 3)
        setTimeout(() => {
          console.debug(this);
          if (state.pageQueue[2] == 3) this.commit("setPageToRight");
        }, 4000);
    },
    setPage(state, val) {
      let pageNum = state.pageOrder.indexOf(val);
      console.debug("setPage: ", val, pageNum);
      if (!pageNum) {
        state.pageOrder.push(val);
        pageNum = state.pageOrder.length;
      }

      state.pageQueue = [
        pageNum - 2,
        pageNum - 1,
        pageNum,
        pageNum + 1,
        pageNum + 2,
      ];
    },
    setCorpList(state, val) {
      state.corpList = val;
    },
    // NOTE: set popup works on setSelectedEvent() and setNewEvent()
    // setPopup(state, val) {
    //   state.popup = val;
    // },
    // setSelectedBlock(state, val) {
    //   state.selectedBlock = val;
    // },
    // setSelectedEvent(state, val: LoadedEvent) {
    //   state.selectedEvent = val;
    //   state.popup = "old";
    // },
    // updateSelectedEvent(state) {
    //   console.debug("updating selected event: ", state.events);
    //   state.events
    //     .filter((event: LoadedEvent) => {
    //       if (event.id == state.selectedEvent.id) {
    //         return false;
    //       }
    //       return true;
    //     })
    //     .push(state.selectedEvent);
    //   console.debug("updated selected event: ", state.events);
    // },
    // deleteSelectedEvent(state) {
    //   console.debug("deleting selected event: ", state.events);
    //   state.events = state.events.filter((event: LoadedEvent) => {
    //     return event.id != state.selectedEvent.id;
    //   });
    //   console.debug("deleted selected event: ", state.events);
    // },
    // resetSelectedEvent(state) {
    //   state.popup = "";
    //   state.selectedEvent = Object.assign({}, EmptyLoadedEvent);
    // },
    // setNewEvent(state, val: Event) {
    //   state.newEvent = val;
    //   state.popup = "new";
    // },
    // resetNewEvent(state) {
    //   state.newEvent = Object.assign({}, EmptyEvent);
    //   state.popup = "";
    // },
    // async loadEvents(state) {
    //   try {
    //     const res = await axios.get(
    //       process.env.VUE_APP_SERVER_URL + "events/",
    //       {
    //         params: {
    //           start: 0,
    //           end: 1,
    //         },
    //       }
    //     );
    //     console.debug("[STORE] Events loaded", res.data);
    //     state.events.push(...res.data);
    //   } catch (e) {
    //     console.error("[ERROR] ", e);
    //   }
    // },
    // addBulkEvents(state, val) {
    //   if (Array.isArray(val)) state.events.push(...val);
    //   else state.events.push(val);
    // },
  },
  actions: {
    setContainer({ commit }, { newVal }) {
      commit("setContainer", newVal);
    },
    setViewMode({ commit }, { newVal }) {
      commit("setViewMode", newVal);
    },
    // shufflePage({ commit }) {
    //   commit("shufflePage");
    // },
    setPageToLeft({ commit }) {
      commit("setPageToLeft");
    },
    setPageToRight({ commit }) {
      commit("setPageToRight");
    },
    setPage({ commit }, { newVal }) {
      commit("setPage", newVal);
    },
    setPopup({ commit }, { newVal }) {
      commit("setPopup", newVal);
    },
    setCorpList({ commit }, { newVal }) {
      commit("setCorpList", newVal);
    },
    // setSelectedBlock({ commit }, { newVal }) {
    //   commit("setSelectedBlock", newVal);
    // },
    // setSelectedEvent({ commit }, { newVal }) {
    //   commit("setSelectedEvent", newVal);
    // },
    // updateSelectedEvent({ commit }) {
    //   commit("updateSelectedEvent");
    // },
    // deleteSelectedEvent({ commit }) {
    //   commit("deleteSelectedEvent");
    // },
    // resetSelectedEvent({ commit }) {
    //   commit("resetSelectedEvent");
    // },
    // setNewEvent({ commit }, { newVal }) {
    //   commit("setNewEvent", newVal);
    // },
    // resetNewEvent({ commit }) {
    //   commit("resetNewEvent");
    // },
    // loadEvents({ commit }) {
    //   commit("loadEvents");
    // },
    // addBulkEvents({ commit }, { newVal }) {
    //   commit("addBulkEvents", newVal);
    // },
  },
  getters: {
    getContainer(state) {
      return state.container;
    },
    getViewMode(state) {
      return state.viewMode;
    },
    getPageQueue(state) {
      return state.pageQueue;
    },
    getPageName(state) {
      return state.pageOrder[state.pageQueue[2]];
    },
    getCurrentPage(state) {
      return state.pageQueue[2];
    },
    getPopup(state) {
      return state.popup;
    },
    getCorpList(state) {
      return state.corpList;
    },
    // getCategories(state) {
    //   return state.categories;
    // },
    // getSelectedBlock(state) {
    //   return state.selectedBlock;
    // },
    // getSelectedEvent(state) {
    //   return state.selectedEvent;
    // },
    // getNewEvent(state) {
    //   return state.newEvent;
    // },
    // getEvents(state) {
    //   return [...state.events, state.newEvent];
    //   // return [...state.events, state.newEvent];
    // },
  },
  modules: {},
};

export default new Vuex.Store(store);
