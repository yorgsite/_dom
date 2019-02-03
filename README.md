

# _dom

#### A light but powerful javascript library for html apps.</br>

The purpose of **_dom.js** is to work on the lower level possible, with confort, to keep open the integration architecture used by the developper.<br/>
It is exclusively focused on html and css creation.

+ Easy creation of [html](#tg_html) elements and [css](#tg_css) rules.
+ Use sass like syntax to optimise your css [rules](#_dom.rules).
+ Interacts exclusively with native browser methods.<br/>
No time comsuming proxies.<br/>
No code compilation.<br/>
No intrusive attributes (except for templates, see [_dom.model](#_dom.model)).
+ Full html [templating](#tg_temlating).<br/>
Low template architecture constraints.

<hr/>

## <a name="tg_menu"></a> Menu

+ [Html](#tg_html)
	+ [_dom](#_dom)
+ [Css](#tg_css)
	+ [_dom.rule](#_dom.rule)
	+ [_dom.rules](#_dom.rules)
+ [Templating](#tg_temlating)
	+ [_dom.model](#_dom.model)
	+ [Instanciates and interact with model](#tg_instanciate)
+ [Exemples](#tg_exemples)
<hr/>

## <a name="tg_html"></a> html

<hr/>

#### <a name="_dom"></a> Instanciate html elements or structure


`_dom(tagName,datas,childs,nameSpace)`
+ `string` **tagName** : element tagname
+ `object` **datas** [optional] : element attributes.
+ `Array` **childs** [optional] : element childs. can contain strings an html elements.
+ `string` **nameSpace** [optional] : element namesapace if any.
**returns** `HTMLElement`

<br/>

<u>Exemple:</u>
```javascript
var inpt=_dom('input',{type:'text',value:'hello'});
document.body.appendChild(inpt);

var div=_dom('div',{style:{border:'solid 1px #0f0'}},[
	'aaa',
	_dom('u',{},[bbb]}),
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
**returns** `CSSStyleRule`

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
**returns** collection of `CSSStyleRule` by selector.

<br/>

<u>Exemple :</u>
```javascript
var rules =_dom.rules({
	'table':{
		border:'solid 1px #0f0',
		'& td':{
			'&>div':{
				alias:'subdiv',
				border:'solid 1px #f00',
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

`_dom.model(tagName,constructor,cssRules)`
+ `string` **tagName** : the custom element name.
Should contain at least one "-" to avoid conflict with natives HTMLElements.
+ `function` **constructor** : Must return an HTMLElement.<br/>
Receive the arguments of _dom but the dont have to respect the nomenclature excepted 'tagName'.<br/>
NB:constructor is scoped to its interface.
+ `object|function` **cssRules** [optional] : is or returns an object describing rules like _dom.rules,
but the created collection will be insancied only once and shared among interfaces.<br/>
Adds the 'rules' property to the interface.
<br/>

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
			content=document.createTextNode(content);
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

<u>Exemple :</u>

Instanciates and interact with model interface :

```javascript
var tl=_dom('table-line',['1','*'],['000',_dom('div',{},['abc'])]);

document.body.appendChild(tl);
setTimeout(function(){
	tl.__dom.push('def');
},2000);

```

<br/>
<hr/>

## <a name="tg_exemples"></a> Exemples

A digest of the preceeding exemples can be found in **[exemple.html](exemples/exemple.html)**.

+ An exemple of simple tabs conponent : **[exemple_tabs.html](exemples/exemple_tabs.html)**.
+ An exemple of a richer tabs conponent : **[exemple_tabs2.html](exemples/exemple_tabs2.html)**.
