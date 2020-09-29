interface Block {
  name: string;
  id: string;
}

interface LoadedEvent extends Event {
  id: string;
  userId: string;
  category: string;
}

interface Event {
  category: string | null;
  collaborator: string | null;
  color: any;
  end: number;
  memo: string | null;
  name: string;
  registered: boolean;
  start: number;
  timed: boolean;
}

interface Calendar {
  checkChange(): void;
  prev(): void;
  next(): void;
}

interface Tms {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

interface CustomDate {
  date: string;
}

const EmptyLoadedEvent = Object.freeze({
  id: "",
  userId: "",
  category: "",
  collaborator: "",
  color: "blue",
  end: -1,
  memo: "",
  name: "",
  registered: false,
  start: -1,
  timed: false,
});

const EmptyEvent = Object.freeze({
  category: "",
  collaborator: "",
  color: "blue",
  end: -1,
  memo: "",
  name: "",
  registered: false,
  start: -1,
  timed: false,
});

export {
  Block,
  Event,
  LoadedEvent,
  EmptyEvent,
  EmptyLoadedEvent,
  Calendar,
  Tms,
  CustomDate,
};
