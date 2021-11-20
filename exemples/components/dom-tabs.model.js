


(function(_dom){
	/**
	Component 'dom-tabs'.
	ctreate a tab element
	@param {string} tagName : must be 'dom-tabs'.
	@param {string} className : appearance className.
	@param {string} familly : same familly share the same drag and drop context.
	*/
	_dom.model('dom-tabs',function(tagName,className,familly){
		var scope=this;
		var doms={};
		let handler=new DomTabsModel(this,doms).init(className,familly);
		return doms.root;
	},{
		'.dom-tabs':{
			'&>tbody':{
				'&>tr:first-child>td>div>span':{
					display:'inline-block'
				},
				'&>tr+tr>td>div>div':{
					display:'none',
					'&.selected':{
						display:'block'
					}
				}
			}
		}
	});
	/**
	Component 'dom-tabs' model handler.
	@constructor
	*/
	class DomTabsModel{
		constructor(scope,doms){
			this.tagName='dom-tabs';
			this.scope=scope;
			this.doms=doms;
			this.list=[];
			scope.__dom=this;
		}
		init(className,familly){
			this.className	= className;
			this.familly	= familly;
			
			this.initDom();
			this.initIO();
			return this;
		}
		initDom(){
			let doms=this.doms;
			doms.head=_dom('div',{className:'dom-tabs-head'});
			doms.body=_dom('div',{className:'dom-tabs-body'});
			doms.root=_dom('table',{border:'0',cellSpacing:'0',cellPadding:'0',
			className:'dom-tabs '+(this.className?this.className:'dom-tabs_default')},[
				_dom('tbody',{},[
					_dom('tr',{},[
						_dom('td',{align:'left',height:'1'},[doms.head])
					]),
					_dom('tr',{},[
						_dom('td',{align:'left',vAlign:'top'},[doms.body])
					])
				])
			]);
		}
		initIO(){
				
			[	'byId',
				'byAny',
				'select',
				'add',
				'remove'
			].forEach(k=>{
				this.doms.root[k]=(...args)=>this[k](...args);
			});
			Object.defineProperty(this.doms.root,'familly',{get:function(){return this.familly;}});
			Object.defineProperty(this.doms.root,'doms',{get:function(){return this.doms;}});
			Object.defineProperty(this.doms.root,'length',{get:function(){return this.list.length;}});
		}		
		byId(id){
			for(var i=0;i<this.list.length;i++){
				if(this.list[i].id===id){
					return i;
				}
			}
			return -1;
		}
		byAny(any){
			if(typeof(any)==='number'){
				return this.byId(any);
			}else if(any instanceof Unit){
				return this.byId(any.id);
			}else if(typeof(any)==='function'){
				var res=this.list.filter((d,i)=>this.any(d));
				if(res.length){
					return this.byId(res.shift().id);
				}
			}
			return -1;
		}
		select(index){
			if(typeof(index)==='number'){
				this.list.map((d,i)=>{
					d.doms.label.className=
					d.doms.content.className=(i===index?'selected':'');
				});
			}else{
				this.select(this.byAny(index));
			}
		}
		add(label,content,index){
			let unit;
			let doms=this.doms;
			if(label instanceof Unit){
				unit=label;
				if(unit.tabs){
					unit.remove();
				}
				unit.tabs=this;
			}else{
				unit = new Unit(label,content,this);
			}
			if(typeof(index)==='number'&&index<this.list.length){
				doms.head.insertBefore(unit.doms.label,this.list[index].doms.label);
				doms.body.appendChild(unit.doms.content);
				this.list.splice(index,0,unit);
			}else{
				this.list.push(unit);
				doms.head.appendChild(unit.doms.label);
				doms.body.appendChild(unit.doms.content);
			}
			this.select(this.byId(unit.id));
			return unit;
		}
		remove(id){
			let doms=this.doms;
			var rid = this.byId((id instanceof Unit)?id.id:id);
			if(rid>-1){
				var unit=this.list.splice(rid,1)[0];
				doms.head.removeChild(unit.doms.label);
				doms.body.removeChild(unit.doms.content);
				unit.tabs=0;
				if(unit.selected()&&this.list.length){
					this.select(this.list.length-1);
				}
				return unit;
			}
			return false;
		}
	};

	_dom['dom-tab-drag-data']=null;// sharable with other components

	let idcnt=1;
	class Unit{
		constructor(label,content,tabs){
			this.tabs=tabs;
			this.id=idcnt++;
			this.label=label;
			this.content=content;
			this.doms={};

			this._init();
		}
		_init(){
			this.doms.label=_dom('span',{
				onclick:()=>{
					this.tabs.select(this.tabs.byId(this.id));
				}
			},[this.label]);

			// drag & drop
			if(this.tabs.familly){
				DragPipe.registerDrag(this.doms.label,()=>({unit:this}),this.tabs.familly);
				DragPipe.registerDrop(this.doms.label,data=>{
					if(data&&data.unit instanceof Unit){

						let unit=data.unit;
						if(unit.tabs.list.length>1){
							var id_to=this.byId();
							if(this.tabs===unit.tabs){
								var id_from=unit.byId();
								unit.remove();
								this.tabs.add(unit,0,id_to>id_from?id_to:id_to);
							}else{
								unit.remove();
								this.tabs.add(unit,0,id_to);
							}
						}
					}
				},this.tabs.familly);
			}

			this.doms.content=_dom('div',{},[this.content]);
		}
		remove(){
			this.tabs.remove(this.id);
		}
		byId(){
			return this.tabs.byId(this.id);
		}
		selected(){
			return this.doms.label.className.indexOf('selected')>-1;
		}
	}
	
})(function(global){
	try{global._dom=_dom;}catch(e){};
	if(!global._dom)try{global._dom=require('dom-for-node');}catch(e){};
	if(!global._dom)throw('\n_dom model "dom-splitter" declaration Error:\n_dom is not defined.')
	return global._dom;
}(this));
