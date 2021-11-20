
const DragPipe=new ((function(){
	return class DragPipe{
		constructor(){
			this._datas={};
		}
		registerDrag(element,getData,family='all'){
			element.draggable=1;
			element.ondragstart=(evt)=>{
				this._datas[family]=getData();
			}
		}
		registerDrop(element,callback,family='all'){
			element.ondragover=(evt)=>evt.preventDefault();
			element.ondrop=(evt)=>{
				evt.preventDefault();
				if(family in this._datas){
					callback(this._datas[family]);
				}
				this._datas={};
			};
		}
	}
})())();

// module.exports={DragPipe};