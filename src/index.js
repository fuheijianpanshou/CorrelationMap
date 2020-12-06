import { Deck, COORDINATE_SYSTEM, OrthographicView } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';

const data = [{ position: [500, 500], radius: 50 ,url:'/src/img/1.png'}, { position: [0, 0], radius: 20 ,url:'/src/img/2.png'}];
const INITIAL_VIEW_STATE = {
    center: [1, 1]
};
const layer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    
    getRadius: d => d.radius,
    getPosition: (d) => {
        return d.position;
    },
    getFillColor: [255, 140, 0],
    getLineColor: [0, 0, 0],
    onClick: layerClick,
    dataComparator:shallowEqual,
});



const viewState = {
    target: [1500, 1000, 0],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: 0
}

const onViewStateChange = ({ viewState }) => {
    //console.log(viewState);
    deck.setProps({viewState});
}
var deck = new Deck({
    views: new OrthographicView({
        id: 'globalView',
        x: 0,
        y: 0,
        width: 3000,
        height: 2000,
    }),
    viewState,
    controller: true,
    layers: [layer],
    onViewStateChange
});

let step = 10;
function layerClick(info,event) {
    console.log(info);
    console.log("111");
    const x = data[0].position[0] + step;
    const y = data[0].position[1] + step;
    console.log(deck);
   console.log(layer.getProps)
    
    // data.push({ position: [x, y], radius: 50 });
    // deck.getLayer
    // const layer = new ScatterplotLayer({
    //     id: 'scatterplot-layer',
    //     data,
    //     coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    //     pickable: true,
    //     opacity: 0.8,
    //     stroked: true,
    //     filled: true,
    //     getRadius: d => d.radius,
    //     getPosition: (d) => {
    //         return d.position;
    //     },
    //     getFillColor: [255, 140, 0],
    //     getLineColor: [0, 0, 0],
    //     onClick: layerClick,
    //     dataComparator:shallowEqual
    // });
    // let layers=[layer];

    // deck.setProps({ layers });
    step += 10;
}
// function deepEqual(object1, object2) {
//     console
//     const keys1 = Object.keys(object1);
//     const keys2 = Object.keys(object2);
  
//     if (keys1.length !== keys2.length) {
//       return false;
//     }
  
//     for (const key of keys1) {
//       const val1 = object1[key];
//       const val2 = object2[key];
//       const areObjects = isObject(val1) && isObject(val2);
//       if (
//         areObjects && !deepEqual(val1, val2) ||
//         !areObjects && val1 !== val2
//       ) {
//         return false;
//       }
//     }
  
//     return true;
//   }

  function shallowEqual(object1, object2) {
      console.log(object2);
      console.log(object1);
    if(object1===object2){
        console.log("===");
    }
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return false;
  }
  
  function isObject(object) {
    return object != null && typeof object === 'object';
  }

