

		var DragPipe=new function(){
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
		}();

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
				var byId=function(id){
					for(var i=0;i<list.length;i++){
						if(list[i].id===id){
							return i;
						}
					}
					return -1;
				};
				var select=function(id){
					list.map(function(d,i){
						d.label.className=
						d.content.className=(i===id?'selected':'');
					});
				};
				this.byId=byId;
				this.select=select;


				/**
				adds a tab unit
				@param {Unit|HTMLElement|string} label : the label of the tab unit.
				@returns {Unit} the removed unit if found.
				*/
				this.add=function(label,content){
					if(label instanceof Unit){
						var unit=label;
						if(unit.tabs){
							unit.remove();
						}
						unit.tabs=scope;
						if(typeof(content)==='number'&&content<list.length){
							// console.log(content,list,list[content],unit);
							doms.head.insertBefore(unit.label,list[content].label);
							doms.body.appendChild(unit.content);
							list.splice(content,0,unit);
							select(content);
						}else{
							list.push(unit);
							doms.head.appendChild(unit.label);
							doms.body.appendChild(unit.content);
							select(list.length-1);
						}
					}else{
						list.push(new Unit(label,content,scope));
						select(list.length-1);
					}

					return list[list.length-1];
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
						doms.head.removeChild(unit.label);
						doms.body.removeChild(unit.content);
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
				var dd_id;
				this.label=_dom('span',{
					draggable:1,
					ondragstart:function(evt){
						dd_id=DragPipe.drag(evt,{
							unit:unit
						});
					},
					ondragover:function(evt){evt.preventDefault();},
					ondrop:function(evt){
						var data = DragPipe.drop(evt);
						// console.log(data);
						if(data.unit instanceof Unit){
							if(data.unit.tabs.familly===unit.tabs.familly){
								var id_to=unit.byId();
								if(unit.tabs===data.unit.tabs){
									var id_from=data.unit.byId();
									data.unit.remove();
									unit.tabs.add(data.unit,id_to>id_from?id_to:id_to);
								}else{
									data.unit.remove();
									unit.tabs.add(data.unit,id_to);
								}
							}
						}
					 },
					onclick:function(){
						unit.tabs.select(unit.tabs.byId(unit.id));
					}
				},[label]);
				this.content=_dom('div',{},[content]);
				unit.tabs.doms.head.appendChild(this.label);
				unit.tabs.doms.body.appendChild(this.content);
				this.remove=function(){
					unit.tabs.remove(unit.id);
				};
				this.byId=function(){
					return unit.tabs.byId(unit.id);
				};
				this.selected=function(){
					return unit.label.className.indexOf('selected')>-1;
				};
			};
		})();
