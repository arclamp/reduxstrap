import { action,
         store,
         observeStore } from './redux';

console.log('reduxstrap');

observeStore(next => {
  const mode = next.get('mode');
  console.log(`mode changed to ${mode}`);
}, s => s.get('mode'));

store.dispatch(action.initial('reduxstrap'));
