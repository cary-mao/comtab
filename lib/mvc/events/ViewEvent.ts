import MVCEvent from "./Event";

export default class ViewEvent extends MVCEvent {
  constructor (bubble?: boolean) {
    super('View', bubble);
  }
}