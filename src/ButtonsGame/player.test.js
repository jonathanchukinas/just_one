import PubSub from 'pubsub-js';


PubSub.subscribe('SAY_MOO', ()=>{
  console.log('moo!')
})


it('Say moo (sync)!', () => {
  PubSub.publishSync('SAY_MOO');
  expect('hello').toEqual('hello');
});
