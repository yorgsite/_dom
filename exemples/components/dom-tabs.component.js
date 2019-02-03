


		(function(){
			/**
			Component 'dom-tabs'.
			ctreate a tab element
			@param {string} tagName : must be 'dom-tabs'.
			@param {string} className : appearance className.
			@param {string} familly : same familly share the same drag and drop context.
			*/
			_dom.model('dom-tabs',function(tagName,className,familly){
				var scope=this;
				var list=[];
				var doms={};
				var build=function(){
					doms.head=_dom('div',{});
					doms.body=_dom('div',{});
					doms.table=_dom('table',{border:'0',cellSpacing:'0',cellPadding:'0',
					className:'dom-tabs'+(className?' '+className:'')},[
						_dom('tbody',{},[
							_dom('tr',{},[
								_dom('td',{align:'left',height:'1'},[doms.head])
							]),
							_dom('tr',{},[
								_dom('td',{align:'left',vAlign:'top'},[doms.body])
							])
						])
					]);
				};
				Object.defineProperty(this,'familly',{get:function(){return familly;}});
				Object.defineProperty(this,'doms',{get:function(){return doms;}});
				Object.defineProperty(this,'length',{get:function(){return list.length;}});
				console.log('dom-tabs scope.familly',scope.familly,' familly',familly);
				var byId=function(id){
					for(var i=0;i<list.length;i++){
						if(list[i].id===id){
							return i;
						}
					}
					return -1;
				};
				var byAny=function(any){
					if(typeof(any)==='number'){
						return byId(any);
					}else if(any instanceof Unit){
						return byId(any.id);
					}else if(typeof(any)==='function'){
						var res=list.filter(function(d,i){return any(d)});
						if(res.length){
							return byId(res.shift().id);
						}
					}
					return -1;
				};
				var select=function(index){
					if(typeof(index)==='number'){
						list.map(function(d,i){
							d.doms.label.className=
							d.doms.content.className=(i===index?'selected':'');
						});
					}else{
						select(byAny(index));
					}
				};
				this.byId=byId;
				this.byAny=byAny;
				this.select=select;


				/**
				adds a tab unit
				@param {Unit|HTMLElement|string} label : the label of the tab unit.
				@returns {Unit} the removed unit if found.
				*/
				this.add=function(label,content,index){
					var unit,index;
					if(label instanceof Unit){
						unit=label;
						if(unit.tabs){
							unit.remove();
						}
						unit.tabs=scope;
					}else{
						unit = new Unit(label,content,scope);
					}
					if(typeof(index)==='number'&&index<list.length){
						doms.head.insertBefore(unit.doms.label,list[index].doms.label);
						doms.body.appendChild(unit.doms.content);
						list.splice(index,0,unit);
					}else{
						list.push(unit);
						doms.head.appendChild(unit.doms.label);
						doms.body.appendChild(unit.doms.content);
					}
					select(byId(unit.id));
					return unit;
				};
				/**
				removes a tab unit
				@param {Unit|string} id : unit or unit id.
				@returns {Unit|false} the removed unit if found.
				*/
				this.remove=function(id){
					var rid = byId((id instanceof Unit)?id.id:id);
					if(rid>-1){
						var unit=list.splice(rid,1)[0];
						doms.head.removeChild(unit.doms.label);
						doms.body.removeChild(unit.doms.content);
						unit.tabs=0;
						if(unit.selected()&&list.length){
							select(list.length-1);
						}
						return unit;
					}
					return false;
				};

				build();
				return doms.table;
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

			var idcnt=1;
			var Unit=function(label,content,tabs){
				var unit=this;
				this.tabs=tabs;
				this.id=idcnt++;
				this.label=label;
				this.content=content;
				this.doms={};
				this.doms.label=_dom('span',{
					onclick:function(){
						unit.tabs.select(unit.tabs.byId(unit.id));
					}
				},[label]);
				if(unit.tabs.familly && DragPipe){
					DragPipe.registerDrag(this.doms.label,function(){
						return {
							unit:unit
						};
					});
					DragPipe.registerDrop(this.doms.label,function(data){
						if(data.unit instanceof Unit){
							// if(data.unit.tabs.length===1)return;
							if(data.unit.tabs.length>1&&data.unit.tabs.familly===unit.tabs.familly){
								var id_to=unit.byId();
								if(unit.tabs===data.unit.tabs){
									var id_from=data.unit.byId();
									data.unit.remove();
									unit.tabs.add(data.unit,0,id_to>id_from?id_to:id_to);
								}else{
									data.unit.remove();
									unit.tabs.add(data.unit,0,id_to);
								}
							}
						}
					});
				}

				this.doms.content=_dom('div',{},[content]);

				this.remove=function(){
					unit.tabs.remove(unit.id);
				};
				this.byId=function(){
					return unit.tabs.byId(unit.id);
				};
				this.selected=function(){
					return unit.doms.label.className.indexOf('selected')>-1;
				};
			};
		})();
