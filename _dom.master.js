
var _dom=(function(){

	if(window._dom)return window._dom;// keep old models when global _dom found
	// ------------- PRIVATE ---------------
	// custom elements handling
	var _modelref='__dom';
	var _models={};
	var _Model=function(tagName,constructor,cssRules){
		var rules;
		this.tagName	= tagName;
		this.constructor= constructor;
		this.cssRules	= typeof(cssRules)==='function'?cssRules:(typeof(cssRules)==='object'?function(){return cssRules;}:0);
		this.getRules	= function(args){
			if(this.cssRules&&!rules){
				rules=_dom.rules(this.cssRules());
			}
			return rules;
		};
	};
	_Model.prototype.build=function(args){
		var inst=this.instance(args);
		// keeps reference to constructor scope
		Object.defineProperty(inst.dom,_modelref,{get:function(){return inst;},configurable:true});
		return inst.dom;
	};
	_Model.prototype.instance=function(args){
		return new _Model.Instance(this,args);
	};

	_Model.Instance=function(model,args){
		var dom=model.constructor.apply(this,args);
		if(!(dom instanceof HTMLElement)){
			console.error('-----------------------');
			console.log('tagName=',model.tagName);
			console.log('constructor=',model.constructor);
			console.log('this.dom=',dom);
			throw('\n_dom.model Error:\nconstructor must return an HTMLElement.');
		}

		// keeps reference to inherited instance
		if(dom[_modelref]){
			this._super=dom[_modelref];
		}
		Object.defineProperty(this,'tagName',{get:function(){return model.tagName;}});
		if(!('dom' in this)){
			Object.defineProperty(this,'dom',{get:function(){return dom;}});
		}
		if(model.cssRules){
			var rules=model.getRules();
			Object.defineProperty(this,'rules',{get:function(){return rules;}});
		}
	};

	// ------------- PUBLIC ---------------

	/**
	 * Create an HTMLElement
	 * @parameter {string} tagName the element tagname
	 * @parameter {object} [datas] element attributes.
	 * @parameter {Array} [childs] element childs. can contain strings an html elements.
	 * @parameter {string} [nameSpace] element namesapace if any.
	 * @returns {HTMLElement} a new html element
	 */
	var _dom=function(tagName,datas,childs,nameSpace){
		var args=arguments;
		if(tagName in _models){
			return _models[tagName].build(args);
		}
		try{
			var node = typeof(nameSpace)==="string"?
				document.createElementNS(nameSpace,tagName):
				document.createElement(tagName);
			if(!childs && (datas instanceof Array)){
				childs=datas;
				datas={};
			}
			var dataAssign=function(tgt,src,dataname){
				if(typeof(tgt)==="undefined")throw("property '"+dataname+"' doesn't exist.");
				for(var i in src){
					if(typeof(src[i])==="object")
					dataAssign(tgt[i],src[i],dataname+"."+i)
					else tgt[i] = src[i];
				}
			 };
			dataAssign(node,datas,(""+tagName).toUpperCase());
			if(childs && typeof(childs.length)==='number'){
				for(var i=0;i<childs.length;i++){
					if(typeof(childs[i])==="string")node.appendChild(document.createTextNode(childs[i]));
					else try{node.appendChild(childs[i]);}catch(e){
						console.error('-----------------------');
						console.log('childs['+i+']=',childs[i]);
						console.log('error=',e);
						throw("parameter childs["+i+"] must be string or dom element.");}
				}
			}
	   }catch(err){
		   console.error('----------_dom Error');
		   console.log('arguments=',args);
		   console.log('error=',err);
		   throw("_dom Error:\n"+err+"");
	   }
	   return node;
	};
	/**
	* Add a custom element to _dom.
	* NB: the **__dom** property will be added to the element, pointing to it's interface (model instance).
	* interface['dom'] : dom element;
	* interface[tagName] : element tagName;
	* @parameter {string} tagName the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
	* @parameter {function} constructor receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'. Must return an HTMLElement.NB:constructor Must be a function and NOT a lambda expression because it is scoped to its interface.
	* @parameter {object|function} [cssRules] is or returns an object describing rules like _dom.rules,
	but the created collection will be insancied only once and shared among interfaces.
	Adds the 'rules' property to the interface.
	* @parameter {boolean} [shadowed] If true, your model is instanciable via html. See _dom.modelShadow.
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

	// -------------- css -----------
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

	/**
	 * Create a new js cssRule object;
	 * @parameter {string} selector the new rule css query.
	 * @parameter {object} [datas] style datas.
	 * @returns {CSSStyleRule}
	 */
	_dom.rule = function (selector, datas, sheet) {
		if(typeof(selector)!=='string'||!selector.length){
			console.error('----------_dom.rule Error');
			console.log('selector=',selector);
			throw('\n_dom.rule Error:\nselector is not a valid css query.');
		}
		if(!(sheet instanceof CSSStyleSheet))sheet = _dom.sheet;
		sheet.insertRule(selector + "{\n\n}", sheet.cssRules.length);
		var rule = sheet.cssRules[sheet.cssRules.length - 1];
		if (datas) {
			for (var name in datas) {
				rule.style[name] = datas[name];
			}
		}
		return rule;
	};

	/**
	 * Create a collection of cssRule objects;
	 * @parameter {object} datas sass like structured object
	 * @returns {object([ruleName]:CSSStyleRule)}
	 */
	_dom.rules	= function(data,sheet){
		let rules={},rdata=_dom.getRulesData(data);
		if(!(sheet instanceof CSSStyleSheet))sheet = _dom.sheet;
		for(let k in rdata.rules){
			try{rules[k]=_dom.rule(k,rdata.rules[k],sheet);}catch(e){
				console.warn('_dom.rules Warning:\nInsertion of rule "'+k+'" failed!\n\n'+e);
			}
			if(k in rdata.alias)rules[rdata.alias[k]]=rules[k];
		}
		return rules;
 	};

	/**
	 * Transform sass like data to css like data.
	 * @parameter {object} datas sass like structured object
	 * @returns {object(rules:object,alias:object)} data with css rules and aliases.
	 */
	_dom.getRulesData=function(data){
		let res={rules:{},alias:{}};
		let collect=function(dat,vars,pile){
			let obj={},rname;
			if(pile.length)rname=pile.join('');
			for(let prop in dat){
				let c=prop.charAt(0);
				if(c==='$'){
					vars[prop.substr(1)]=dat[prop];
				}else if(c==='@'){// todo : media query,animation,fonts etc..
					// if(prop.indexOf('@media')===0){}
				}else if(!pile.length||c==='&'){
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
			if(rname)res.rules[rname]=obj;
		};
		collect(data,{},[]);
		return res;
	};

	// -- css classes

	// legacy --- may completly desepear in further version
	_dom.hasClass = function (element,className) {element.classList.contains(className);};
	_dom.addClass = function (element,className) {element.classList.add(className);};
	_dom.removeClass = function (element,className) {element.classList.remove(className);};
	_dom.swapClass = function (element,classIn,classOut) {
		_dom.removeClass(element,classOut);
		_dom.addClass(element,classIn);
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
