import {Deck,COORDINATE_SYSTEM,OrthographicView} from '@deck.gl/core';
import {LabeledIconLayer} from './LabeledIconLayer';
import axios from 'axios';
let data = [];

initData();
function initData(){
    axios.get('/src/entity_geo.json').then((res)=>{
        // for(let i=0;i<)
        data=res.data;
        let column = 0;
        let row = 0;
        const columnWidth=50;
        const rowHeight=50;
        for(let i=0;i<50;i++){
            let x = column * columnWidth;
            let y = row * rowHeight;
            data[i].position=[x,y];
            data[i].radius=20;
            column++;
            if (column > 200) {
                column = 0;
                row++;
            }
        }
        initRender();
    });

}

function initRender(){
    const labeledIconLayer=new LabeledIconLayer({
        id:'composite_layer',
        data,
        coordinateSystem:COORDINATE_SYSTEM.CARTESIAN,
        getIcon:d=>({
            url:d.img,
            width:40,
            height:40,
        }),
        getPosition:d=>d.position,
        getSize:40,
        pickable: true,
        getIconColor:d=>[255,0,0,255],
        fontFamily:'sans-serif',
        fontWeight:'nomal',
        getText:d=>d.name,
        getTextSize:d=>12,
        getTextColor:d=>[255,255,255,255],
    });

    console.log(labeledIconLayer.getSubLayers());

    const viewState = {
        target: [2500, 3000, 0],
        rotationX: 0,
        rotationOrbit: 0,
        zoom: 0
    }
    
    const onViewStateChange = ({ viewState }) => {
        deck.setProps({viewState});
    }
    const deck=new Deck({
        views: new OrthographicView({
            id: 'globalView',
            x: 0,
            y: 0,
            width:5000,
            height: 6000,
        }),
        viewState,
        controller: true,
        layers: [labeledIconLayer],
        onViewStateChange
    });


}

