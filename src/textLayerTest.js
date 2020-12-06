import { Deck, COORDINATE_SYSTEM, OrthographicView } from '@deck.gl/core';
import { ScatterplotLayer, IconLayer, TextLayer } from '@deck.gl/layers';
import axios from 'axios';

//,{position:[100,100],name:'LI'},{position:[150,150],name:'Welcome'}
const data = [{ position: [50, 50], name: '编码' }];
const charSet = new Set();




const layer = new TextLayer({
    id: 'text-layer',
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    data,
    pickable: true,
    fontFamily: 'Microsoft YaHei',
    getPosition: d => d.position,
    getText: d => d.name,
    getSize: 32,
    getAngle: 0,
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'center',
    characterSet: ['编','码'],
    getColor: (d) => [255, 0, 0, 255]
});

const viewState = {
    target: [2500, 3000, 0],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: 0
}

const onViewStateChange = ({ viewState }) => {
    deck.setProps({ viewState });
}
const deck = new Deck({
    views: new OrthographicView({
        id: 'globalView',
        x: 0,
        y: 0,
        width: 5000,
        height: 6000,
    }),
    viewState,
    controller: true,
    layers: [layer],
    onViewStateChange
});

function generateCharSet(str){
    for(s of str){
        charSet.add(s);
    }
}

 // var txt = escape(str).toLocaleLowerCase().replace(/%u/gi, '\\u');
    // //var txt= escape(str).replace(/([%3F]+)/gi,'\\u');
    // return txt.replace(/%7b/gi, '{').replace(/%7d/gi, '}').replace(/%3a/gi, ':').replace(/%2c/gi, ',').replace(/%27/gi, '\'').replace(/%22/gi, '"').replace(/%5b/gi, '[').replace(/%5d/gi, ']').replace(/%3D/gi, '=').replace(/%20/gi, ' ').replace(/%3E/gi, '>').replace(/%3C/gi, '<').replace(/%3F/gi, '?').replace(/%5c/gi, '\\');