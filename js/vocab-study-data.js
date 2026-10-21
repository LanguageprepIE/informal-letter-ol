/* Small, curated groups share the same three-step study interface. */
'use strict';
const vocabularyStudySets = {
  'home-rooms-1': {
    title: 'Rooms 1 / Habitaciones 1',
    topic: 'House & home / Casa y hogar',
    reference: 'vocab.html#vocab-3',
    words: [
      {id:'salon', es:'el salón', en:'living room', answer:'salón', alternatives:[], example:'Veo la televisión en el salón.', translation:'I watch television in the living room.'},
      {id:'cocina', es:'la cocina', en:'kitchen', answer:'cocina', alternatives:[], example:'Preparo la cena en la cocina.', translation:'I prepare dinner in the kitchen.'},
      {id:'comedor', es:'el comedor', en:'dining room', answer:'comedor', alternatives:[], example:'Como con mi familia en el comedor.', translation:'I eat with my family in the dining room.'},
      {id:'bano', es:'el cuarto de baño', en:'bathroom', answer:'cuarto de baño', alternatives:['baño'], example:'El cuarto de baño está al lado de mi dormitorio.', translation:'The bathroom is next to my bedroom.'},
      {id:'dormitorio', es:'el dormitorio', en:'bedroom', answer:'dormitorio', alternatives:['habitación','cuarto'], example:'Mi dormitorio es pequeño, pero cómodo.', translation:'My bedroom is small, but comfortable.'},
      {id:'jardin', es:'el jardín', en:'garden', answer:'jardín', alternatives:[], example:'Cuando hace sol, paso tiempo en el jardín.', translation:'When it is sunny, I spend time in the garden.'}
    ],
    sentences: [
      {parts:['En mi casa hay un ',{word:'salon'},' para ver la televisión.'], en:'In my house there is a living room for watching television.'},
      {parts:['Preparo la cena en la ',{word:'cocina'},' y como con mi familia en el ',{word:'comedor'},'.'], en:'I prepare dinner in the kitchen and eat with my family in the dining room.'},
      {parts:['Mi ',{word:'dormitorio'},' es pequeño, pero muy cómodo.'], en:'My bedroom is small, but very comfortable.'},
      {parts:['El ',{word:'bano'},' está al lado.'], en:'The bathroom is next door.'},
      {parts:['Cuando hace sol, paso tiempo en el ',{word:'jardin'},'.'], en:'When it is sunny, I spend time in the garden.'}
    ]
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = vocabularyStudySets;
