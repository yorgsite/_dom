var DragPipe=new function(){
	var scope=this;
	var idcnt=1;
	var datas={};
	var transfer_id='dragpipe';
	this.drag=function(evt,data){
		var _id=''+(idcnt++);
		datas[_id]=data;
		evt.dataTransfer.setData(transfer_id,_id);
	};
	this.drop=function(evt){
		evt.preventDefault();
		var _id=evt.dataTransfer.getData(transfer_id);
		if(_id in datas){
			var data=datas[_id];
			delete datas[_id];
			return data;
		}
	};
	this.registerDrag=function(element,getData){
		element.draggable=1;
		element.ondragstart=function(evt){
			DragPipe.drag(evt,getData());
		};
	};
	this.registerDrop=function(element,callback){
		element.ondragover=function(evt){evt.preventDefault();};
		element.ondrop=function(evt){
			callback(DragPipe.drop(evt));
		};
	};
}();
