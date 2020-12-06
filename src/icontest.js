import { Deck, COORDINATE_SYSTEM, OrthographicView } from '@deck.gl/core';
import { ScatterplotLayer, IconLayer, LineLayer, TextLayer } from '@deck.gl/layers';
import axios from 'axios';
import * as d3 from 'd3';
let nodes = [];
let links = [];
const columnWidth = 20;
const rowHight = 40;
const charSet = new Set();
let forceSimulation = null;
let layoutFlag = 0;
let isAllowMoving = false;
let data = [];

const initViewState = {
    target: [1500, 1000, 0],
    rotationX: 0,
    rotationOrbit: 0,
    zoom: 0,

}


initData();
function initData() {
    axios.get('/src/2472_data.json').then((res) => {
        nodes = res.data.data.nodes;
        links = res.data.data.links;
        console.log(nodes.length);
        console.log(links.length);
        let count = 0
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].img = '/src/img1/' + 'a' + count + ".png";
            nodes[i].status = 2;
            nodes[i].isDelete = false;
            count++;
            if (count > 4500) {
                count = 0;
            }
            if (nodes[i].name) {
                generateCharSet(nodes[i].name);
            } else {
                generateCharSet(nodes[i].Entity_type);
            }
        }
        for (let i = nodes.length; i < 20000; i++) {
            nodes.push({ id: i, img: '/src/img1/' + 'a' + count + ".png", status: 2, isDelete: false });
            count++;
            if (count > 4500) {
                count = 0;
            }
        }
        for (let i = 0; i < links.length; i++) {
            links[i].isDelete = false;

        }
        generateLinks();
        initRender();
    });

}

function generateCharSet(str) {
    if (str) {
        for (const s of str) {
            charSet.add(s);
        }
    }
}

function generateLinks() {
    links.forEach((v, i) => {
        v.source = v.from;
        v.target = v.to;
    });

    let force = d3.forceSimulation()
        .force("link", d3.forceLink().id((d) => {
            return d.id;
        }))
        .force('charge', d3.forceManyBody().strength(-30))
        .force('forceX', d3.forceX(1500))
        .force('forceY', d3.forceY(1000))
        .force("center", d3.forceCenter(1500, 1000));

    force.force('forceX').strength(0.5);
    force.force('forceY').strength(0.5);
    force.force('link').distance(100);
    force.force('link').strength(0.05);
    // force.force('charge').strength(-40);

    force.nodes(nodes)
    force.force('link').links(links)
    data = nodes;
    force.on("tick", () => {
        // console.log(nodes);
        reRender();

    });
    force.on('end', () => {
        // reRender();
    });
    forceSimulation = force;


}
let linew = 2;
let width = 0;
let height = 0;
let iconSize = 20;
let tempIconSize = 20;


function reRender() {
    let iconLayerProps = {
        id: 'icon-layer',
        data: data.filter((v, i) => {
            return !v.isDelete;
        }),
        pickable: true,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        getIcon: d => {
            return {
                url: d.img,
                width: 40,
                height: 40
            }
        },
        getPosition: (d) => {
            //console.log(d.x);
            return [d.x + width / 2, d.y + height / 2];
        },
        getSize: tempIconSize,
        onDrag: iconDrag,
        onDragEnd: iconDragEnd,
        dataComparator: comparatorX,
    }
    let iconLayer = new IconLayer(iconLayerProps);

    const textLayer = new TextLayer({
        id: 'text-layer',
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        data: data.filter((v, i) => {
            return !v.isDelete;
        }),
        pickable: true,
        fontFamily: 'Microsoft YaHei',
        getPosition: (d) => {
            return [d.x + width / 2, d.y + height / 2 + tempIconSize / 2 + tempIconSize / 4];
        },
        getText: d => d.name,
        getSize: 12,
        getAngle: 0,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        characterSet: Array.from(charSet),
        getColor: (d) => [255, 255, 255, 255]
    });

    let scatterLayer = new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: data.filter((v, i) => {
            return !v.isDelete;
        }),
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        pickable: true,
        opacity: 1,
        stroked: true,
        filled: true,
        getFillColor: d => {
            if (d.status === 1) {
                return [0, 0, 0, 100];
            } else {
                return [255, 255, 255, 0];
            }
        },
        getRadius: 10,
        getPosition: (d) => {
            return [d.x + width / 2, d.y + height / 2];
        },
        getLineColor: d => {
            if (d.status === 0) {
                return [255, 255, 255, 0];
            } else if (d.status === 2) {
                return [255, 255, 255, 255];
            } else if (d.status === 1) {
                return [255, 255, 255, 0];
            }
        },
        autoHighlight: true,
        getLineWidth: linew,
        onDrag: iconDrag,
        onDragEnd: iconDragEnd,
        onClick: iconClick,
        dataComparator: comparatorX,
        onHover: circleHoverHandler,
        onDragStart: iconDragStart

    });

    const lineLayer = new LineLayer({
        id: 'line-layer',
        data: links.filter((v, i) => {
            return !v.isDelete;
        }),
        pickable: true,
        getWidth: 1,
        getSourcePosition: d => [d.source.x + width / 2, d.source.y + height / 2],
        getTargetPosition: d => [d.target.x + width / 2, d.target.y + height / 2],
        getColor: d => [255, 0, 0, 255],
        dataComparator: comparatorX
    });
    layerMap.set('line-layer', lineLayer);
    if (layoutFlag === 0) {
        deck.setProps({ layers: [lineLayer, iconLayer, scatterLayer] });
    } else {
        deck.setProps({ layers: [lineLayer, iconLayer, scatterLayer, textLayer] });
    }

    //deck.setProps({ viewState });

}




let deck;
let layerMap = new Map();
function initRender() {
    let iconSize = 20;
    let iconLayerProps = {
        id: 'icon-layer',
        data,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        getIcon: d => {
            return {
                url: d.img,
                width: 40,
                height: 40
            }
        },
        getPosition: (d) => {
            return [d.x + width / 2, d.y + height / 2];
        },
        onDrag: iconDrag,
        loadOptions:{
            timeout:10000,
        },
        pickable: true,
        getSize: iconSize,
        dataComparator: comparatorX,
        onDragEnd: iconDragEnd,
    }
    let iconLayer = new IconLayer(iconLayerProps);
    layerMap.set('icon-layer', iconLayer);
    let scatterLayer = new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: data.filter((v, i) => {
            return !v.isDelete;
        }),
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        onDrag: iconDrag,
        onDragEnd: iconDragEnd,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        getFillColor: [255, 140, 0, 0],
        getRadius: 10,
        getPosition: (d) => {
            return [d.x + width / 2, d.y + height / 2];
        },
        //getFillColor: [255, 140, 0],
        getLineColor: [255, 255, 255],
        autoHighlight: true,
        getLineWidth: 2,
        onHover: circleHoverHandler,
        dataComparator: comparatorX,
        onDragStart: iconDragStart,

    });

    const lineLayer = new LineLayer({
        id: 'line-layer',
        data: links,
        pickable: true,
        getWidth: 1,
        getSourcePosition: d => [d.source.x + width / 2, d.source.y + height / 2],
        getTargetPosition: d => [d.target.x + width / 2, d.target.y + height / 2],
        getColor: d => [255, 0, 0, 255],
        dataComparator: comparatorX,
    });



    const onViewStateChange = ({ viewState, oldViewState }) => {
        if (isAllowMoving) {
            console.log("0");
            // initViewState=viewState;

        } else {
            viewState.target = oldViewState.target;
        }

        tempIconSize = iconSize * (2 ** Math.floor(viewState.zoom));
        reRender();

        deck.setProps({ viewState });

    }
    deck = new Deck({
        // width: 3000,
        // height: 2000,

        views: new OrthographicView({
            id: 'globalView',
            x: 0,
            y: 0,
            width: 3000,
            height: 2000,
            maxZoom: 2,
            minZoom: -2,
        }),
        viewState: initViewState,
        controller: true,
        layers: [lineLayer, iconLayer, scatterLayer],
        onViewStateChange,
        onDragStart: deckDragStart,
        onDragEnd: deckDragEnd,
        getTooltip,
    });


}
function circleHoverHandler(info, event) {
    // iconLayer.setNeedsRedraw()
    let pickingObjects = deck.pickObjects({ x: 1000, y: 1000, width: 1000, height: 1000, layerIds: ['scatterplot-layer'] });
    // console.log(pickingObjects);
}
let brushAreaShow = false;
let brushArea = null
let startX = 0;
let startY = 0;

function deckDragStart() {
    isAllowMoving = true;
}

function deckDragEnd() {
    isAllowMoving = false;
}
function iconDragStart(info, event) {
    console.log(event);
    deck.setProps({ controller: false });
    if (info.object) {
        deck.setProps({ controller: false });
    }
    if (isBrushing) {
        if (brushAreaShow) {
            return;
        }
        brushAreaShow = true;
        startX = parseFloat(info.x);
        startY = parseFloat(info.y);
        brushArea = document.createElement('div');
        brushArea.style.opacity = 0.5;
        brushArea.style.backgroundColor = 'red';
        brushArea.style.position = 'absolute';
        brushArea.style.top = parseFloat(info.y) + 'px';
        brushArea.style.left = parseFloat(info.x) + 'px';
        document.querySelector('body').appendChild(brushArea);

    }
    return true;
}

function iconDrag(info, event) {
    if (brushAreaShow) {
        brushArea.style.width = parseFloat(event.deltaX) + 'px';
        brushArea.style.height = parseFloat(event.deltaY) + 'px';
    }
    // event .preventdefault();
    return true;

}

function iconDragEnd(info, event) {
    console.log(event);
    if (isBrushing) {
        if (brushAreaShow) {

            let pickingObjects = deck.pickObjects({ x: startX, y: startY, width: parseFloat(brushArea.style.width), height: parseFloat(brushArea.style.height), layerIds: ['scatterplot-layer'] });
            for (let i = 0; i < data.length; i++) {
                data[i].status = 1;
            }
            pickingObjects.forEach((v, i) => {
                v.object.status = 2;
            });
            brushArea.remove();
            brushArea = null;
            brushAreaShow = false;
            isBrushing = false;
            document.getElementById('brush').innerHTML = "Brush";
            startY = 0;
            startX = 0;
        }

    } else {
        for (let i = 0; i < data.length; i++) {
            if (info.object.id === data[i].id) {
                data[i].x = parseFloat(data[i].x) + parseInt(event.deltaX);
                data[i].y = parseFloat(data[i].y) + parseInt(event.deltaY);
                break;
            }
        }
    }


    reRender();
    return true;
}

function iconClick(info, event) {
    for (let i = 0; i < data.length; i++) {
        data[i].status = 1;
    }
    info.object.status = 2;
    reRender();
    return true;
}



let isBrushing = false;
document.getElementById('brush').addEventListener('click', (e) => {
    if (!isBrushing) {
        e.target.innerHTML = 'noBrush';
        isBrushing = true;
    } else {
        e.target.innerHTML = 'Brush';
        isBrushing = false;
    }

});

document.getElementById('delete').addEventListener('click', (e) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].status === 2) {
            for (let j = 0; j < links.length; j++) {
                if (data[i].id === links[j].from || data[i].id === links[j].to) {
                    links[j].isDelete = true;
                }
            }
            data[i].isDelete = true;
        }

    }
    reRender();
});
document.getElementById('selectAll').addEventListener('click', (e) => {
    data.forEach((v, i) => {
        v.status = 2;
    });
    reRender();
});

document.getElementById('layout').addEventListener('click', (e) => {
    if (forceSimulation) {
        forceSimulation.stop();
    }
    layoutFlag = 1;
    rectLayout();


});

function rectLayout() {
    const marginLeft = 5;
    let column = 0;
    let row = 0;
    const nodeLocationMap = new Map();
    const startDate = new Date().getTime();
    data.forEach((v, i) => {
        v.x = column * columnWidth + marginLeft * column;
        v.y = row * rowHight;
        nodeLocationMap.set(v.id, [v.x, v.y]);
        column++;
        if (column > 150) {
            column = 0;
            row++;
        }

    });
    links.forEach((linkV, linkI) => {
        const locationForm = nodeLocationMap.get(linkV.from);
        linkV.source.x = locationForm[0];
        linkV.source.y = locationForm[1];
        const locationTo = nodeLocationMap.get(linkV.to);
        linkV.target.x = locationTo[0];
        linkV.target.y = locationTo[1];
    })
    console.log(new Date().getTime() - startDate);
    reRender(1)
}
function getTooltip({ object }) {
    return (
        object &&
        `\
    ${object.name || object.Entity_type || object.type || ''}`
    );
}






function shallowEqual(object1, object2) {
    if (object1 === object2) {
        //console.log("===");
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


function comparatorX(object1, object2) {
    return false;
    if (object1.length !== object2.length) {
        return false;
    }

    for (let i = 0; i < object2.length; i++) {
        if (object1[i].x !== object2[i].x || object1[i].y !== object2[i].y) {
            return false;
        }
    }
    return false;
}


