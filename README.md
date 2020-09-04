

# _dom

#### A light but powerful javascript library for html apps.</br>

**_dom.js** is exclusively focused on html and css creation.

+ Ultra light : < 10k uncompiled, ~ 6k compiled.
+ Easy creation of [html](#tg_html) elements and [css](#tg_css) rules.
+ Use sass like syntax to optimise your css [rules](#_dom.rules).
+ Interacts exclusively with native browser methods.
	+ No time comsuming proxies.
	+ No code compilation.
	+ No intrusive attributes in base elements.
+ Full html [templating](#tg_temlating).
	+ Low template architecture constraints.
	+ Low dom intrusion (Attribute **_dom** added for controller when using templates, see [_dom.model](#_dom.model)).
	+ Handles [shadow dom](#).


The purposes of **_dom.js** are:
+ Create easily dynamic apps.
+ Stay simple and minimal.
+ Work on the lower level possible.
+ Being integrable with any kind of web architecture.

<hr/>

## <a name="tg_menu"></a> Menu

+ [Use in web page](#tg_webjs)
+ [Use with nodejs](#tg_nodejs)
+ [Html](#tg_html)
	+ [_dom](#_dom)
+ [Css](#tg_css)
	+ [_dom.rule](#_dom.rule)
	+ [_dom.rules](#_dom.rules)
+ [Templating](#tg_temlating)
	+ [_dom.model](#_dom.model)
	+ [Instanciates and interact with model](#tg_instanciate)
	+ [Shadow dom](#tg_shadow_dom) / [_dom.modelShadow](#tg__dom.modelShadow)
	+ [Model creator](#tg_model_creator)
+ [Exemples](#tg_exemples)

<hr/>

## <a name="tg_webjs"></a> Use in web page
```
<script src="./path/to/_dom.js"></script>
```



## <a name="tg_nodejs"></a> Use with nodejs
For web translators like **webpack**.

 Install :

 ```
 npm install dom-for-node
 ```

Import :

```javascript
const _dom=require('dom-for-node');
```

<hr/>

## <a name="tg_html"></a> html

<hr/>

#### <a name="_dom"></a> Instanciate html elements or structure


`_dom(tagName,datas,childs,nameSpace)`
+ `string` **tagName** : element tagname
+ `object` **datas** [optional] : element attributes.
+ `Array` **childs** [optional] : element childs. can contain strings and html elements.
+ `string` **nameSpace** [optional] : element namesapace if any.
+ **returns** `HTMLElement`

<br/>

<u>Exemple:</u>
```javascript
var inpt=_dom('input',{type:'text',value:'hello'});
document.body.appendChild(inpt);

var div=_dom('div',{style:{border:'solid 1px #0f0'}},[
	'aaa',
	_dom('u',['bbb']}),
	'ccc'
]);
document.body.appendChild(div);
```
<br/>
<hr/>

## <a name="tg_css"></a> css

<hr/>

#### <a name="_dom.rule"></a> create dynamics css rules.

`_dom.rule(selector, datas)`
+ `string` **selector** : the new rule rule query selector.
+ `object` **datas** [optional] : style datas if any.
+ **returns** `CSSStyleRule`

<br/>

<u>Exemple :</u>

```javascript
var tableRule=_dom.rule('table',{border:'solid 1px #0f0'});

setTimeout(function(){
	tableRule.style.borderColor='#00f';
},2000);

```
<br/>
<hr/>

#### <a name="_dom.rules"></a> Create rules collection with sass like structures


`_dom.rules(datas)`
+ *object* `datas` : sass like structured object.
+ **returns** collection of `CSSStyleRule` by selector and **alias**.

<br/>

<u>Exemple :</u>
```javascript
var rules =_dom.rules({
	'$color1':'#0f0',
	'$color2':'#f00',
	'table':{
		border:'solid 1px $color1',
		'& td':{
			'&>div':{
				alias:'subdiv',
				border:'solid 1px $color2',
				display:'block'
			}
		}
	}
});

setTimeout(function(){
	rules.table.style.borderColor='#00f';
	rules.subdiv.style.color='#d06';
},2000);

```

<br/>
<hr/>

## <a name="tg_temlating"></a> Templating

<hr/>

#### <a name="_dom.model"></a> Add custom structures to *_dom*

`_dom.model(tagName,constructor,cssRules,shadowed)`
+ `string` **tagName** : the custom element name.
Must contain at least one "-" to avoid conflict with natives HTMLElements.
+ `function` **constructor** : Must return an HTMLElement.<br/>
Receive the **arguments** from [_dom](#) but the dont have to respect the classical nomenclature excepted **tagName** (the first).<br/>
<u>/!\\</u> **constructor** Must be a function and <u>NOT a lambda expression</u> because it is scoped to its interface.
+ `object|function` **cssRules** [optional] : is or returns an object describing rules like [_dom.rules](#_dom.rules),
but the created collection will be insancied only once and shared among interfaces.<br/>
+ `boolean` **shadowed** [optional] : if true, your model uses [shadow dom](#tg_shadow_dom).<br/>


NB : You can use the [Model creator](#tg_model_creator) to help generate model code.

<u>Exemple :</u>


```javascript
/**
 * creates an Table of 1 line.
 * @param {string} tagName must be 'table-line'
 * @param {Array} wlist columns widths
 * @param {Array} childlist columns contents.
 * @returns {HTMLElement}
 */
_dom.model('table-line',function(tagName,wlist,childlist){
	var tdlist=[],dom_tr,dom;
	var build=function(){
		for(var i=0;i<childlist.length;i++){
			tdlist.push(_dom('td',{width:(wlist[i]?wlist[i]:'*')},[childlist[i]]));
		}
		dom_tr=_dom('tr',{},tdlist);
		dom= _dom('table',{border:'0',cellPadding:'0',cellSpacing:'0'},[
			_dom('tbody',{},[dom_tr])
		]);
	};
	/**
	 * (interfacing exemple) add a column.
	 * @param {string|HTMLElement} width  column content (when content is not set) or width
	 * @param {string|HTMLElement} content  column content
	 */
	this.push=function(width,content){
		if(!content){
			content=width;
			width='*';
		}
		if(!(content instanceof HTMLElement)){
			content=document.createTextNode(content+'');
		}
		var nutd=_dom('td',{width:width},[content]);
		dom_tr.appendChild(nutd);
	};
	build();
	return dom;
});

```

<br/>
<hr/>

#### <a name="tg_instanciate"></a> Instanciates and interact with model interface

The **__dom** attribute is added to the element to permit access to the component instance.

<u>Exemple :</u>

```javascript
var tl=_dom('table-line',['1','*'],['000',_dom('div',{},['abc'])]);
// append element.
document.body.appendChild(tl);

setTimeout(function(){
	// calls component 'push' method.
	tl.__dom.push('def');
},2000);

```
The **__dom** attribute is configurable. You can hide the controller by removing the instance reference.

<u>Exemple :</u>

```javascript
var tl=_dom('table-line',['1','*'],['000',_dom('div',{},['abc'])]);
var controller=tl.__dom;
delete tl['__dom'];
```



<br/>
<hr/>

#### <a name="tg_shadow_dom"></a> Shadow dom.

Though **_dom** is more designed for javascript, by using **shadow dom** with your [models](#_dom.model), you make them instanciables via Html. <br/>[About shadow dom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).


There are two ways to implement **shadow dom** with **_dom** models :
+ **On declaration** :<br/>Set the [_dom.model](#tg__dom.model)  **shadowed** argument to **true** when you declare your model.
+ **When the model exists** but he may not implement **shadow dom** :<br/> call [_dom.modelShadow](#tg__dom.modelShadow).


<a name="tg__dom.modelShadow"></a>`_dom.modelShadow(tagName)`
+ `string` **tagName** : the [model](#_dom.model) name.



<u>Exemple :</u>
+ in js

```javascript
_dom.modelShadow('table-line');
```
+ in html

```html
<table-line wlist='["1","*"]' childlist='["abc"]'></table-line>
```



<br/>
<hr/>

#### <a name="tg_model_creator"></a> Model creator.

To create fast and easy the backbone of your component, you can use the [model creator](https://github.com/yorgsite/_dom-model-creator).

<br/>
<hr/>

## <a name="tg_exemples"></a> Exemples

A digest of the preceeding exemples can be found in **[exemple.html](exemples/exemple.html)**.

+ An exemple of simple tabs conponent : **[exemple_tabs.html](exemples/exemple_tabs.html)**.
+ An exemple of a richer tabs conponent : **[exemple_tabs2.html](exemples/exemple_tabs2.html)**.
