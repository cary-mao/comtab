import MVCEvent from './Event';

export default class ModelEvent extends MVCEvent {
  constructor (bubble?: boolean) {
    super('Model', bubble);
  }
}
