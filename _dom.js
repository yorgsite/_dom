
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
	 * creates an HTMLElement
	 * @param {string} tagName the element tagname
	 * @param {object} [datas] element attributes.
	 * @param {Array} [childs] element childs. can contain strings an html elements.
	 * @param {string} [nameSpace] element namesapace if any.
	 * @returns {HTMLElement}
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
	* add a custom element to _dom.
	* NB: the '__dom' property will be added to the element, pointing to it's interface (model instance).
	* interface['dom'] : dom element;
	* interface[tagName] : element tagName;
	* @param {string} tagName the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
	* @param {function} constructor receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'. Must return an HTMLElement.NB:constructor is scoped to its interface.
	* @param {object|function} [cssRules] is or returns an object describing rules like _dom.rules,
	but the created collection will be insancied only once and shared among interfaces.
	Adds the 'rules' property to the interface.
	*/
	_dom.model=function(tagName,constructor,cssRules){
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
	};
	/**
	Checks if a model have been declared.
	* @param {string} tagName : the name of the model
	* @return {boolean} true if tagName exists.
	*/
	_dom.has=function(tagName){
		return tagName in _models;
	};
	/**
	 * Instanciates a declared model;
	 * Useful if you dont want of the '__dom' property in your html element.
	 * If not, you should instead use _dom and refer to the result '__dom' attribute.
	 * @param {string} tagName
	 * @param {...} ___ whatever arguments the model constructor uses
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
	 * create a new js cssRule object;
	 * @param {string} selector the new rule css query.
	 * @param {object} [datas] style datas.
	 * @returns {CSSStyleRule}
	 */
	_dom.rule = function (selector, datas) {
		if(typeof(selector)!=='string'||!selector.length){
			console.error('----------_dom.rule Error');
			console.log('selector=',selector);
			throw('\n_dom.rule Error:\nselector is not a valid css query.');
		}
		if (document.styleSheets.length == 0) {
			var selem = document.createElement('style');
			selem.appendChild(document.createTextNode(""));
			document.documentElement.appendChild(selem);
		}
		var sheet = document.styleSheets[document.styleSheets.length - 1];
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
	 * create a colection of cssRule objects;
	 * @param {object} datas sass like structured object
	 * @returns {collection of CSSStyleRule}
	 */
	 _dom.rules	= function(data){
 		var rules={},rootVars={};
 		var collect=function(ldata,name,pile,vars){
 			var alias,level,names;
			if(name.charAt(0)==='$'){
				vars[name]=ldata+'';
			}else{
				level=collect.level(ldata,vars);
				if(level.alias){
	 				alias=level.alias;
	 				delete level['alias'];
	 			}
	 			names=name.split(',');
	 			for(var i=0;i<names.length;i++){
	 				var selector=pile.join('')+names[i];
					try{
						rules[selector]=_dom.rule(selector,level);
					}catch(e){
						console.warn('_dom.rules Error:\nInsertion of rule "'+selector+'" failed!');
					}
					if(rules[selector]){
						if(alias&&i===0){rules[alias]=rules[selector];}
		 				collect.childs(ldata,pile.concat([names[i]]),vars);
					}
	 			}
			}
		};
 		collect.level=function(ldata,vars){
 			var obj={},tmp;
 			for(var prop in ldata){
 				if(prop.charAt(0)!=='&'){
					tmp=ldata[prop]+'';
					Object.keys(vars).forEach(function(k){
						tmp=tmp.indexOf(k)>-1?tmp.split(k).join(vars[k]):tmp;
					})
 					obj[prop]=tmp;
 				}
 			}
 			return obj;
 		};
 		collect.childs=function(ldata,pile,vars){
 			var obj={};
 			for(var prop in ldata){
 				if(prop.charAt(0)==='&'){
 					collect(ldata[prop],prop.substr(1),pile,Object.assign({},vars));
 				}
 			}
 		};
 		for(var name in data){
 			collect(data[name],name,[],rootVars);
 		}
 		return rules;
 	};

	// -- css classes

	_dom.classNames = function (element) {
		if(element instanceof HTMLElement){
			if(element.className&&element.className.length){
				return element.className.split(/[ \t]+/i);
			}
			return [];
		}else{
			console.error('----------_dom.classNames Error');
			console.log('element=',element);
			throw('\n_dom.classNames Error:\nelement is not an HTMLElement.');
		}
	};
	_dom.hasClass = function (element,className) {
		try{return _dom.classNames(element).indexOf(className)>-1;
		}catch(e){throw('\n_dom.hasClass Error from:\n'+e);}
	};
	_dom.addClass = function (element,className) {
		var list;
		try{list = _dom.classNames(element);
		}catch(e){throw('\n_dom.addClass Error from:\n'+e);}
		if(typeof(className)==='string'&&className.length&&list.indexOf(className)===-1){
			list.push(className);
			element.className=list.join(' ');
			return true;
		}
	};
	_dom.removeClass = function (element,className) {
		var list,id;
		try{list = _dom.classNames(element);
		}catch(e){throw('\n_dom.removeClass Error from:\n'+e);}
		if((id=list.indexOf(className))>-1){
			list.splice(id,1);
			element.className=list.join(' ');
			return true;
		}
	};
	_dom.swapClass = function (element,classIn,classOut) {
		_dom.removeClass(element,classOut);
		_dom.addClass(element,classIn);
	};

	return _dom;
})();
