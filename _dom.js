
var _dom=(function(){

	// ------------- PRIVATE ---------------
	// custom elements handling
	var _modelref='__dom';
	var _models={};
	var _Model=function(tagName,constructor){
		this.tagName	= tagName;
		this.constructor= constructor;
	};
	_Model.prototype.build=function(args){
		var inst=this.instance(args);
		// keeps reference to constructor scope
		Object.defineProperty(inst.dom,_modelref,{get:function(){return inst;}});
		return inst.dom;
	};
	_Model.prototype.instance=function(args){
		return new _Model.Instance(this,args);
	};

	_Model.Instance=function(model,args){
		this.dom=model.constructor.apply(this,args);
		if(!(this.dom instanceof HTMLElement)){
			console.log('tagName=',model.tagName);
			console.log('constructor=',model.constructor);
			console.log('this.dom=',this.dom);
			throw('\n_dom.model Error:\nconstructor must return an HTMLElement.');
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
	_dom=function(tagName,datas,childs,nameSpace){
		if(tagName in _models){
			return _models[tagName].build(arguments);
		}
	    try{
	        var node = typeof(nameSpace)==="string"?
	            document.createElementNS(nameSpace,tagName):
	            document.createElement(tagName);
	        var dataAssign=function(tgt,src,dataname){
	            if(typeof(tgt)==="undefined")throw("property '"+dataname+"' doesn't exist.");
	            for(var i in src){
	                if(typeof(src[i])==="object")	dataAssign(tgt[i],src[i],dataname+"."+i);
	                else				tgt[i] = src[i];
	            }
	         };
	        dataAssign(node,datas,(""+tagName).toUpperCase());
	        if(childs && typeof(childs.length)==='number'){
	            for(var i=0;i<childs.length;i++){
	                if(typeof(childs[i])==="string")node.appendChild(document.createTextNode(childs[i]));
	                else try{node.appendChild(childs[i]);}catch(e){console.log(childs[i],e);throw("parameter childs["+i+"]="+childs[i]+" must be string or dom element.");}
	            }
	        }
	   }catch(err){
	       throw("_dom Error:\n"+err+"");
	   }
	    return node;
	};
	/**
	* add a custom element to _dom.
	* NB: the '__dom' property will be added to the element, pointing to it's interface (model instance).
	* @param {string} tagName the custom element name. Should contain at least one "-" to avoid conflict with natives HTMLElements.
	* @param {function} constructor receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'. Must return an HTMLElement.NB:constructor is scoped to its interface.
	*/
	_dom.model=function(tagName,constructor){

		if(tagName.indexOf('-')===-1){
			console.warn('_dom.model suspect tagName "'+tagName+'" should contain at least one "-" to avoid conflict with natives HTMLElements.');
		}
		if(tagName in _models){
			throw('\n_dom.model Error:\ntagName "'+tagName+'" allready exists.');
		}
		if(typeof(constructor)!=='function'){
			console.log('tagName=',tagName);
			console.log('constructor=',constructor);
			throw('\n_dom.model Error:\nconstructor must be a function.');
		}
		_models[tagName]=new _Model(tagName,constructor);
	};
	/**
	 * Instanciates a declared model;
	 * You should instead use _dom and refer to the result '__dom' attribute.
	 * @param {string} tagName
	 * @param {...} ___ whatever arguments the model constructor uses
	 * @returns {ModelInstance} an object with the 'dom' property as the root HTMLElement.
	 */
	_dom.instance=function(tagName,whatever__){
		if(!(tagName in _models)){
			throw('\n_dom.instance Error:\ntagName "'+tagName+'" not found in models.');
		}
		return _models[tagName].instance(arguments);
	};

	// -------------- css -----------
	/**
	 * create a new js cssRule object;
	 * @param {string} selector the new rule rule query selector.
	 * @param {object} [datas] style datas.
	 * @returns {CSSStyleRule}
	 */
	_dom.rule = function (selector, datas) {
		if (document.styleSheets.length == 0) {
			var selem = document.createElement('style');
			selem.appendChild(document.createTextNode(""));
			document.body.appendChild(selem);
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
		var rules={},names,selector;
		var collect=function(ldata,name,pile){
			selector=pile.join('')+name;
			rules[selector]=_dom.rule(selector,collect.level(ldata));
			names=name.split(',');
			for(var i=0;i<names.length;i++){
				collect.childs(ldata,names[i],pile.concat([names[i]]));
			}
		};
		collect.level=function(ldata){
			var obj={};
			for(var prop in ldata){
				if(prop.charAt(0)!=='&'){
					obj[prop]=ldata[prop];
				}
			}
			return obj;
		};
		collect.childs=function(ldata,name,pile){
			var obj={};
			for(var prop in ldata){
				if(prop.charAt(0)==='&'){
					collect(ldata[prop],prop.substr(1),pile);
				}
			}
		};
		for(var name in data){
			collect(data[name],name,[]);
		}
		return rules;
	};

	return _dom;
})();
