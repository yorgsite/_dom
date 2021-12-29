
const _dom=(function(){

	if(window._dom)return window._dom;// keep old models when global _dom found
	// ------------- PRIVATE ---------------
	// custom elements handling
	let _modelref='__dom';
	const _models={};

	class _Model{
		constructor(tagName,constructor,cssRules){
			let rules;
			this.tagName	= tagName;
			this.constructor= constructor;
			this.cssRules	= typeof(cssRules)==='function'?cssRules:(typeof(cssRules)==='object'?function(){return cssRules;}:0);
			this.getRules	= function(args){
				if(this.cssRules&&!rules){
					rules=_dom.rules(this.cssRules());
				}
				return rules;
			};
	
		}
		build(args){
			var inst=this.instance(args);
			Object.defineProperty(inst.dom,_modelref,{get:function(){return inst;},configurable:true});
			return inst.dom;
		}
		instance(args){
			return new _ModelInstance(this,args);
		}
	}
	
	class _ModelInstance{
		constructor(model,args){
			Object.defineProperty(this,'tagName',{get:function(){return model.tagName;}});
			if(model.cssRules){
				var rules=model.getRules();
				Object.defineProperty(this,'rules',{get:function(){return rules;}});
			}
			var dom=model.constructor.apply(this,args);
			if(!(dom instanceof HTMLElement)){
				console.error('-----------------------');
				console.log('tagName=',model.tagName);
				console.log('constructor=',model.constructor);
				console.log('this.dom=',dom);
				throw('\n_dom.model Error:\nconstructor must return an HTMLElement.');
			}
			if(dom[_modelref]){
				this._super=dom[_modelref];
			}
			if(!('dom' in this)){
				Object.defineProperty(this,'dom',{get:function(){return dom;}});
			}	
		}
	}

	// ------------- PUBLIC ---------------

	/**
	 * Create an HTMLElement
	 * @parameter {string} tagName the element tagname
	 * @parameter {object} [datas] element attributes.
	 * @parameter {Array} [childs] element childs. can contain strings an html elements.
	 * @parameter {string} [nameSpace] element namesapace if any.
	 * @returns {HTMLElement} a new html element
	 */
	const _dom=function(tagName,datas,childs,nameSpace){
		let args=arguments;
		if(tagName in _models){
			return _models[tagName].build(args);
		}
		try{
			let node = typeof(nameSpace)==="string"?
				document.createElementNS(nameSpace,tagName):
				document.createElement(tagName);
			if(!childs && (datas instanceof Array)){
				childs=datas;
				datas={};
			}
			let dataAssign=function(tgt,src,dataname){
				if(typeof(tgt)==="undefined")throw("property '"+dataname+"' doesn't exist.");
				for(let i in src){
					if(typeof(src[i])==="object")
					dataAssign(tgt[i],src[i],dataname+"."+i)
					else tgt[i] = src[i];
				}
			 };
			dataAssign(node,datas,(""+tagName).toUpperCase());
			_dom.append(node,childs);
	   }catch(err){
		   console.error('----------_dom Error');
		   console.log('arguments=',args);
		   console.log('error=',err);
		   throw("_dom Error:\n"+err+"");
	   }
	   return node;
	};
	_dom.append=function(target,childs){
		if(!(target instanceof HTMLElement)){
			throw("_dom.append Error:\nparameter dom must be a dom element.");
		}
		if(childs && typeof(childs.length)==='number'){
			if(typeof(childs)==='string')target.innerHTML+=childs;
			else for(let i=0;i<childs.length;i++){
				if(typeof(childs[i])==="string")target.appendChild(document.createTextNode(childs[i]));
				else try{target.appendChild(childs[i]);}catch(e){
					console.error('-----------------------');
					console.log('childs['+i+']=',childs[i]);
					console.log('error=',e);
					throw("_dom.append Error:\nparameter childs["+i+"] must be string or dom element.");}
			}
		}
	};
	/**
	* Add a custom element to _dom.
	* NB: the **__dom** property will be added to the element, pointing to it's interface (model instance).
	* interface['dom'] : dom element;
	* interface[tagName] : element tagName;
	* @parameter {string} tagName the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
	* @parameter {function} constructor receive the arguments of <b>_dom(...args)</b> but the dont have to respect the nomenclature excepted 'tagName'.
	Must return an HTMLElement.
	<b>NB</b> : constructor Must be a function and <b>NOT a lambda expression</b> because it is scoped to its interface.
	* @parameter {object|function} [cssRules] is or returns an object describing rules like _dom.rules,
	but the created collection will be instancied only once and shared among interfaces.
	Adds the 'rules' property to the interface.
	* @parameter {boolean|object} [shadowed] If true or object, your model is instanciable via html.
	*	See _dom.modelShadow.
	*	if object, shadowed is the arguments types by their name.
	*/
	_dom.model=function(tagName,constructor,cssRules,shadowed){
		// console.log('add model',arguments);
		if(tagName.indexOf('-')===-1){
			console.warn('_dom.model suspect tagName "'+tagName+'" should contain at least one "-" to avoid conflict with natives HTMLElements.');
		}
		if(tagName in _models){
			throw('\n_dom.model Error:\ntagName "'+tagName+'" allready exists.');
		}
		if(typeof(constructor)!=='function'){
			console.error('----------_dom.model Error');
			console.log('tagName=',tagName);
			console.log('constructor=',constructor);
			throw('\n_dom.model Error:\nconstructor must be a function.');
		}
		_models[tagName]=new _Model(tagName,constructor,cssRules);
		if(shadowed)_dom.modelShadow(tagName,shadowed);
	};
	/**
	Checks if a model have been declared.
	* @parameter {string} tagName : the name of the model
	* @return {boolean} true if tagName exists.
	*/
	_dom.has=function(tagName){
		return tagName in _models;
	};
	/**
	 * Instanciates a declared model.
	 * Useful if you dont want of the **__dom** property in your html element.
	 * If not, you should instead use _dom and refer to the result **__dom** attribute.
	 * @parameter {string} tagName
	 * @parameter {...} ___ whatever arguments the model constructor uses
	 * @returns {ModelInstance} an object with the 'dom' property as the root HTMLElement.
	 */
	_dom.instance=function(tagName,whatever__){
		if(!(tagName in _models)){
			console.error('----------_dom.instance Error');
			console.log('arguments=',arguments);
			throw('\n_dom.instance Error:\ntagName "'+tagName+'" not found in models.');
		}
		return _models[tagName].instance(arguments);
	};

	
	_dom.findParent=function(dom,condition,maxDeep=10){
		let errs=[];
		if(!(dom instanceof HTMLElement))errs.push('arg[0] "dom" is not an HTMLElement.');
		if(typeof(condition)!=='function')errs.push('arg[1] "condition" is not a function.');
		if(typeof(maxDeep)!=='number'||maxDeep<2)errs.push('arg[2] "maxDeep" is not a number with a value > 1 ."');
		if(errs.length){
			console.error('----------_dom.findParent Error');
			console.log('arguments=',arguments);
			throw('\n_dom.findParent Error:\n'+errs.map(e=>'	- '+e).join('\n'));
		}
		for(let i=0;i<maxDeep&&dom.parentNode;i++){
			if(condition(dom))return dom;
			dom=dom.parentNode;
		}
	}

	_dom.events=function(dom,events){
		(events instanceof Array?events:[events])
		.forEach(evt=>{
			(evt.type instanceof Array?evt.type:[evt.type])
			.forEach(t=>dom.addEventListener(evt.type,evt.callback));
		});

	};

	Object.defineProperty(_dom,'models',{get:function(){return Object.keys(_models)}});

	// -------------- css -----------
	let _propRef={};
	/**
	* Get browser native element default css values.
	* @parameter {string} tagName : tag name of the native element to test
	* @returns {Map} the default css values.
	*/
	_dom.defaultCss=function(tagName){
		let tgt,r,map;
		if(tagName instanceof HTMLElement)tgt=tagName;
		if(tgt||!_propRef.hasOwnProperty(tagName)){
			let dom,body=document.documentElement;
			try {
				dom=document.createElement(tagName);
				body.appendChild(dom);
				let cs=window.getComputedStyle(dom);
				map=new Map();
				Object.keys(cs)
				.map(id=>cs[id])
				.filter(k=>k.charAt(0)!=='-'&&cs[k]!=='')
				.forEach(k=>map.set(k,cs[k]));
				if(!tgt)_propRef[tagName]=map;
				body.removeChild(dom);
			}catch(e){//in case of other catch
				if(dom&&dom.parentNode)body.removeChild(dom);
				throw('\n_dom.properties Error:\n'+e);
			}
		}else {
			map=_propRef[tagName];
		}
		return map;
	};

	Object.defineProperty(_dom,'uid',{
		get:()=>Date.now().toString(16)+'-'+Math.floor(Math.random()*1E12).toString(16)
	});


	/**
	*
	* @property {CSSStyleSheet} _dom.sheet The last available CSSStyleSheet.
	*/
	Object.defineProperty(_dom,'sheet',{
		get:function(){
			if (document.styleSheets.length == 0) {
	 			document.documentElement.appendChild(_dom('style',[""]));
	 		}
			return document.styleSheets[document.styleSheets.length - 1];
		}
	});

	const _rule = function (selector, datas, sheet,rootRules,aliases) {
		if(typeof(selector)!=='string'||!selector.length){
			console.error('----------_dom.rule Error');
			console.log('selector=',selector);
			throw('\n_dom.rule Error:\nselector is not a valid css query.');
		}
		if(!(sheet instanceof CSSStyleSheet))sheet = _dom.sheet;
		if(debug)console.log('insert rule %c'+selector,'color:#086');
		sheet.insertRule(selector + "{\n\n}", sheet.cssRules.length);
		let rule = sheet.cssRules[sheet.cssRules.length - 1];
		if (datas) {
			let iterRules=(dat,tgt)=>{
				for (let name in dat) {
					if(debug)console.log('add style',name,dat[name]);
					if(typeof(dat[name])==='object'){
						rule.appendRule(name+'{\n\n}');
						iterRules(dat[name],rule.cssRules[rule.cssRules.length-1]);
					}else{
						tgt.style[name] = dat[name];
					}
					if(rootRules&&name in aliases)rootRules[aliases[name]]=rootRules[name];
				}
			};
			iterRules(datas,rule);
		}
		return rule;
	};
	/**
	 * Create a new js cssRule object;
	 * @parameter {string} selector the new rule css query.
	 * @parameter {object} [datas] style datas.
	 * @returns {CSSStyleRule}
	 */
	_dom.rule = function (selector, datas, sheet) {
		return _rule(selector, datas, sheet);
	};

	/**
	 * Create a collection of cssRule objects;
	 * @parameter {object} datas sass like structured object
	 * @parameter {CSSStyleSheet} [sheet] target stylesheet
	 * @parameter {string} [uniquePrefix] if set, will encapsulate datas with a unique className.
	 * an object {className:string,rules:object([ruleName]:CSSStyleRule} will be returned.
	 * @returns {object([ruleName]:CSSStyleRule)}
	 */
	_dom.rules	= function(data,sheet,uniquePrefix=''){
		let className='';
		if(uniquePrefix){
			className=uniquePrefix+'-'+_dom.uid;
			data={['.'+className]:data};
		}
		let rules={},rdata=_dom.getRulesData(data);
		if(!(sheet instanceof CSSStyleSheet))sheet = _dom.sheet;
		for(let k in rdata.rules){
			try{rules[k]=_rule(k,rdata.rules[k],sheet,rules,rdata.alias);}catch(e){
				console.warn('_dom.rules Warning:\nInsertion of rule "'+k+'" failed!\n\n'+e);
			}
			if(k in rdata.alias)rules[rdata.alias[k]]=rules[k];
		}
		return className?{className,rules}:rules;
 	};

	/**
	 * Transform sass like data to css like data.
	 * @parameter {object} datas sass like structured object
	 * @returns {object(rules:object,alias:object)} data with css rules and aliases.
	 */
	_dom.getRulesData=function(data){
		let res={rules:{},alias:{}};
		let collect=function(dat,vars,pile,qres){
			let obj={},rname;
			if(pile.length)rname=pile.join('');
			for(let prop in dat){
				let c=prop.charAt(0);
				if(c==='$'){// vars
					vars[prop.substr(1)]=dat[prop];
				}else if(c==='@'){// media query,animation,fonts etc..
					let sres={rules:{}};
					collect(dat[prop],Object.assign({},vars),[],sres);
					qres.rules[prop]=sres.rules;
				}else if(!pile.length||c==='&'){// sub queries
					(pile.length?prop.substr(1):prop).split(',').forEach(name=>{
						collect(dat[prop],Object.assign({},vars),pile.concat([name]));
					});
				}else if(prop==='alias'){
					res.alias[rname]=dat[prop];
				}else{
					let tmp=dat[prop]+'';
					Object.keys(vars).forEach(k=>{
						tmp=tmp.indexOf(k)>-1?tmp.split(k).join(vars[k]):tmp;
					});
					obj[prop]=tmp;
				}
			}
			if(rname){
				if(qres.rules[rname])Object.assign(res.rules[rname],obj);
				else qres.rules[rname]=obj;
			}
		};
		collect(data,{},[]);
		return res;
	};
	
	_dom.modelRules=function(modelNames,sheet=0){
		let robj={};
		(modelNames.constructor.name==='Array'?modelNames:[modelNames])
		.forEach(mn=>{
			if(_models[mn]){
				let rulz=_models[mn].getRules();
				for(let k in rulz)robj[k]=rulz[k];
			}
		});
		if(sheet)for(let k in robj)sheet.insertRule(robj[k].cssText);
		return robj;
	};

	//	---- shadow dom

	let shadowConstructor=function(scope,tagName,args,argTypes){
		let shadow = scope.attachShadow({mode: 'open'});
		let und,wrapper;
		argTypes=argTypes||[];
		let values = args.slice(1)
		.map((a,si)=>{
			let attr,i=si+1;
			if(scope.hasAttribute(a)){
				attr=scope.getAttribute(a);
				if(typeof(argTypes[i])==='function'){
					attr=argTypes[i](attr);
				}else if(argTypes[i]==='boolean'){
					attr=['false','0','off'].indexOf(attr)>-1?false:!!attr.length;
				}else if(argTypes[i]==='int'){
					attr=parseInt(attr);
				}else if(argTypes[i]==='number'){
					attr=parseFloat(attr);
				}else if(argTypes[i]==='function'){
					attr=new Function(''+attr).bind(scope);
				}else if(argTypes[i]!=='string'){
					try {attr=JSON.parse(attr);} catch (e) {}
				}

			}
			return attr;
		});

		args=[tagName]
		.concat(values);
		wrapper=_dom.apply(null,args);
		shadow.appendChild(wrapper);

		let rhtml=[],rules=wrapper.__dom.rules;
		for(let r in rules)rhtml.push(rules[r].cssText);
		shadow.appendChild(_dom('style',{type:'text/css',textContent:rhtml.join('\n')}));
	};

	/**
	check if a model has allready been shadowed.
	* @parameter {string} tagName the model name.
	* @returns {boolean}
	*/
	_dom.modelShadowed = function (tagName) {
		return !!_models[tagName].shadow;
	};
	/**
	renders your model intanciable via html by using dom shadow
	* @parameter {string} tagName the model name.
	* @parameter {object} [argTypes] argument types by their name.
	*/
	_dom.modelShadow = function (tagName,argTypes) {
		if(_models[tagName]){
			if(_dom.modelShadowed(tagName))return;
			argTypes=typeof(argTypes)==='object'?argTypes:{};
			let name=tagName.split('-').map(v=>v.charAt(0).toUpperCase()+v.substr(1)).join('');
			let args=(_models[tagName].constructor+'').split(')',2)[0].split('(')[1].split(',');
			let atl=args.map(a=>argTypes.hasOwnProperty(a)?argTypes[a]:0);
			class _class_ extends HTMLElement {
				constructor() {
					super();
					shadowConstructor(this,tagName,args,atl);
				}
			}
			_models[tagName].shadow={
				name:name,
				[name]:class extends _class_ {}
			};
			customElements.define(tagName, _models[tagName].shadow[name]);
		}else {
			throw(['',
				'_dom.modelShadow Error:',
				'argument[0] "tagName"="'+tagName+'" has no model declared.'
			].join('\n'))
		}
	};

	return _dom;
})();
