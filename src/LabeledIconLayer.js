import {CompositeLayer,IconLayer,TextLayer} from 'deck.gl';

class LabeledIconLayer extends CompositeLayer{
    initializeState(){
       this.state={
           data:[]
       }
    }

    updateState({oldProps,props,changeFlags}){
        console.log(changeFlags.dataChanged);
        this.setState({
            data:this.props.data
        });
        
    }

    

    renderLayers(){
        console.log("rederLayers!");
        return [new IconLayer(this.getSubLayerProps({
            id:'${this.props.id}-icon',
            data:this.props.data,
           
            //iconAtlas:this.props.iconAtlas,
            //iconMapping:this.props.iconMapping,
            
            getPosition:this.props.getPosition,
            getIcon:this.props.getIcon,
            getSize:this.props.getIconSize,
            getColor:this.props.getIconColor,
            

            updateTriggers: {
                getPosition: this.props.updateTriggers.getPosition,
                getIcon: this.props.updateTriggers.getIcon,
                getSize: this.props.updateTriggers.getIconSize,
                getColor: this.props.updateTriggers.getIconColor
              }
        })),
        new TextLayer(this.getSubLayerProps({
            id:'${this.props.id}-label',
            data:this.props.data,
            fontFamily:this.props.fontFamily,
            fontWeight:this.props.fontWeight,

            getPosition:this.props.getPosition,
            getText:this.props.getText,
            getSize:this.props.getTextSize,
            getColor:this.props.getTextColor,

            updateTriggers: {
                getPosition: this.props.updateTriggers.getPosition,
                getText: this.props.updateTriggers.getText,
                getSize: this.props.updateTriggers.getTextSize,
                getColor: this.props.updateTriggers.getTextColor
              }
        }))]
    }

    getPackingInfo({info,sourceLayer}){
        console.log(info);
        return info;
    }

}

LabeledIconLayer.layerName='LabeledIconLayer';

LabeledIconLayer.defaultProps={
    getPosition:{type:'accessor',value:x=>{
        console.log(x);
        return x.position;}},
    iconAtlas:null,
    iconMapping:{type:'object',value:{},async:true},
    getIcon:{type:'accessor',value:x=>x.icon},
    getIconSize:{type:'accessor',value:20},
    getIconColor:{type:'accessor',value:[0,0,0,255]},
    fontFamily:'sans-serif',
    fontWeight:'nomal',
    getText:{type:'accessor',value:x=>x.text},
    getTextSize:{type:'accessor',value:12},
    getTextColor:{type:'accessor',value:[0,0,0,255]}
}

export {LabeledIconLayer}